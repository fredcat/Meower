const express = require("express");
const router = express.Router();
const passport = require("passport");
const uuidv4 = require("uuid/v4");
const aws = require("aws-sdk");

// Post model
const Post = require("../../models/Post");
// Follow model
const Follow = require("../../models/Follow");

// Validation
const validatePostInput = require("../../validation/post");
const validateCommentInput = require("../../validation/comment");

// S3 Config
const S3_BUCKET = require("../../config/keys").s3Bucket;

// augment a post with liked information (whether current user has liked the post)
const augmentPost = (post, currentUser) => ({
  liked: post.likes.map(userid => userid.toString()).indexOf(currentUser) >= 0,
  ...post
});

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route   GET api/posts/sign-s3
// @desc    Get a signed request for uploading file to AWS S3
// @access  Private
router.get(
  "/sign-s3",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const s3 = new aws.S3({ region: "us-west-1" });
    const extName = req.query["ext-name"];
    const fileType = req.query["file-type"];

    const newFilename = `${uuidv4()}${extName}`;

    const s3Params = {
      Bucket: S3_BUCKET,
      Key: `postimages/${newFilename}`,
      Expires: 60,
      ContentType: fileType,
      ACL: "public-read"
    };

    s3.getSignedUrl("putObject", s3Params, (err, data) => {
      if (err) {
        return res.status(400).json(err);
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/postimages/${newFilename}`
      };
      res.json(returnData);
    });
  }
);

// @route   GET api/posts
// @desc    Get posts
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find()
      .sort({ date: -1 })
      .lean()
      .then(posts => {
        const augmentedPosts = posts.map(post =>
          augmentPost(post, req.user.id)
        );
        res.json(augmentedPosts);
      })
      .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
  }
);

// @route   GET api/posts/subscribed
// @desc    Get posts from followed users
// @access  Private
router.get(
  "/subscribed",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Follow.findOne({ user: req.user.id }).then(follow => {
      // find posts from all the following users and the user himself
      Post.find({
        $or: [{ user: { $in: follow.followings } }, { user: req.user.id }]
      })
        .sort({ date: -1 })
        .lean()
        .then(posts => {
          const augmentedPosts = posts.map(post =>
            augmentPost(post, req.user.id)
          );
          res.json(augmentedPosts);
        })
        .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
    });
  }
);

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .lean()
      .then(post => {
        const augmentedPost = augmentPost(post, req.user.id);
        res.json(augmentedPost);
      })
      .catch(err =>
        res.status(404).json({ nopostfound: "No post found with that ID" })
      );
  }
);

// @route   GET api/posts/user/:user_id
// @desc    Get all the posts of a user
// @access  Private
router.get(
  "/user/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ user: req.params.user_id })
      .sort({ date: -1 })
      .lean()
      .then(posts => {
        const augmentedPosts = posts.map(post =>
          augmentPost(post, req.user.id)
        );
        res.json(augmentedPosts);
      })
      .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
  }
);

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      ...req.body,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }

        // Delete
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.map(userid => userid.toString()).indexOf(req.user.id) >= 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "User already liked this post" });
        }

        // Add user id to likes array
        post.likes.push(req.user.id);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Get remove index
        const removeIndex = post.likes
          .map(userid => userid.toString())
          .indexOf(req.user.id);

        if (removeIndex < 0) {
          return res
            .status(400)
            .json({ notliked: "You have not yet liked this post" });
        }

        // Splice out of array
        post.likes.splice(removeIndex, 1);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.params.id, req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          username: req.body.username,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Get remove index
        const removeIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);

        if (removeIndex < 0) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");

// Follow model
const Follow = require("../../models/Follow");

// @route   GET api/follow/test
// @desc    Tests follow route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route   GET api/follow/following
// @desc    Get current user's following list
// @access  Private
router.get(
  "/following",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Follow.findOne({ user: req.user.id })
      .then(follow => {
        if (!follow) {
          errors.nofollow = "There is no follow info for this user";
          return res.status(404).json(errors);
        }
        res.json(follow.followings);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/follow/follow/:id
// @desc    Follow User
// @access  Private
router.post(
  "/follow/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Follow.findOne({ user: req.user.id })
      .then(follow => {
        if (
          follow.followings.map(id => id.toString()).indexOf(req.params.id) >= 0
        ) {
          return res
            .status(400)
            .json({ alreadyfollowed: "Already followed this user" });
        }

        // Add the followee to current user's following list
        follow.followings.push(req.params.id);

        // Add current user to the followee's follower list
        follow.save().then(follow => {
          res.json({ user: req.params.id });
          Follow.findOneAndUpdate(
            { user: req.params.id },
            { $push: { followers: req.user.id } },
            { new: true }
          ).then(follow => follow);
        });
      })
      .catch(err =>
        res.status(404).json({ follownotfound: "No follow info found" })
      );
  }
);

// @route   POST api/follow/unfollow/:id
// @desc    Unfollow User
// @access  Private
router.post(
  "/unfollow/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Follow.findOne({ user: req.user.id })
      .then(follow => {
        // Get remove index
        const removeIndex = follow.followings
          .map(id => id.toString())
          .indexOf(req.params.id);

        if (removeIndex < 0) {
          return res
            .status(400)
            .json({ alreadyfollowed: "Have not yet followed this user" });
        }

        // Splice out of array, remove from current user's following list
        follow.followings.splice(removeIndex, 1);

        // Remove from the followee's follower list
        follow.save().then(follow => {
          res.json({ user: req.params.id });
          Follow.findOneAndUpdate(
            { user: req.params.id },
            { $pull: { followers: req.user.id } },
            { new: true }
          ).then(follow => follow);
        });
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;

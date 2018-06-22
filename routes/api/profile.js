const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Validation
const validateProfileInput = require("../../validation/profile");

// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");
// Follow model
const Follow = require("../../models/Follow");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["username", "name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Follow.findOne({ user: req.user.id }).then(follow => {
      Profile.find()
        .populate("user", ["username", "name", "avatar"])
        .lean()
        .then(profiles => {
          if (!profiles) {
            errors.noprofile = "There are no profiles";
            return res.status(404).json(errors);
          }

          const augmentedProfiles = profiles.map(profile => ({
            followed:
              follow.followings.findIndex(user =>
                user.equals(profile.user._id)
              ) >= 0,
            ...profile
          }));
          res.json(augmentedProfiles);
        })
        .catch(err =>
          res.status(404).json({ profile: "There are no profiles" })
        );
    });
  }
);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Private
router.get(
  "/handle/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Follow.findOne({ user: req.user.id }).then(follow => {
      Profile.findOne({ handle: req.params.handle })
        .populate("user", ["username", "name", "avatar"])
        .lean()
        .then(profile => {
          if (!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
          }
          const augmentedProfile = {
            followed:
              follow.followings.findIndex(user =>
                user.equals(profile.user._id)
              ) >= 0,
            ...profile
          };
          res.json(augmentedProfile);
        })
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Private
router.get(
  "/user/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user_id })
      .populate("user", ["username", "name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err =>
        res.status(404).json({ profile: "There is no profile for this user" })
      );
  }
);

// @route   GET api/profile/followings/:user_id
// @desc    Get profiles of followings
// @access  Private
router.get(
  "/followings/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Follow.findOne({ user: req.user.id }).then(myfollow => {
      Follow.findOne({ user: req.params.user_id }).then(hisfollow => {
        Profile.find({ user: { $in: hisfollow.followings } })
          .populate("user", ["username", "name", "avatar"])
          .lean()
          .then(profiles => {
            if (!profiles) {
              errors.noprofile = "There are no profiles";
              return res.status(404).json(errors);
            }

            const augmentedProfiles = profiles.map(profile => ({
              followed:
                myfollow.followings.findIndex(user =>
                  user.equals(profile.user._id)
                ) >= 0,
              ...profile
            }));
            res.json(augmentedProfiles);
          })
          .catch(err =>
            res.status(404).json({ profile: "There are no profiles" })
          );
      });
    });
  }
);

// @route   GET api/profile/followers/:user_id
// @desc    Get profiles of followers
// @access  Private
router.get(
  "/followers/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Follow.findOne({ user: req.user.id }).then(myfollow => {
      Follow.findOne({ user: req.params.user_id }).then(hisfollow => {
        Profile.find({ user: { $in: hisfollow.followers } })
          .populate("user", ["username", "name", "avatar"])
          .lean()
          .then(profiles => {
            if (!profiles) {
              errors.noprofile = "There are no profiles";
              return res.status(404).json(errors);
            }

            const augmentedProfiles = profiles.map(profile => ({
              followed:
                myfollow.followings.findIndex(user =>
                  user.equals(profile.user._id)
                ) >= 0,
              ...profile
            }));
            res.json(augmentedProfiles);
          })
          .catch(err =>
            res.status(404).json({ profile: "There are no profiles" })
          );
      });
    });
  }
);

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.handle = req.user.username;

    profileFields.gender = req.body.gender;
    profileFields.birthday = req.body.birthday;
    profileFields.location = req.body.location;
    profileFields.website = req.body.website;
    profileFields.bio = req.body.bio;

    // Social
    profileFields.social = {};
    profileFields.social.youtube = req.body.youtube;
    profileFields.social.twitter = req.body.twitter;
    profileFields.social.facebook = req.body.facebook;
    profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create and save Profile (Normally created while registration. Won't reach this part.)
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        Follow.findOneAndRemove({ user: req.user.id }).then(() =>
          res.json({ success: true })
        );
      });
    });
  }
);

module.exports = router;

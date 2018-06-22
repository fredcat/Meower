const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const multer = require("multer");
const uuidv4 = require("uuid/v4");
const path = require("path");
const isEmpty = require("../../validation/is-empty");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
// Load Profile Model
const Profile = require("../../models/Profile");
// Follow model
const Follow = require("../../models/Follow");

// Configure File Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars");
  },
  filename: (req, file, cb) => {
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});

// File Uploader
const uploadAvatar = multer({ storage });

const roleList = ["NEW_USER", "ORDINARY_USER"];

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user_email => {
    if (user_email) {
      errors.email = "Email already exists";
    }
    User.findOne({ username: req.body.username }).then(user_name => {
      if (user_name) {
        errors.username = "Username already exists";
      }
      if (!isEmpty(errors)) {
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", // Size
          r: "pg", // Rating
          d: "mm" // Default
        });

        const newUser = new User({
          username: req.body.username,
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
          role: "NEW_USER"
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.json(user);
                new Profile({
                  user: user.id,
                  handle: user.username
                })
                  .save()
                  .then(profile => profile);
                new Follow({ user: user.id }).save().then(follow => follow);
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );

        // Change user role from NEW_USER to ORDINARY_USER
        if (user.role === "NEW_USER" || user.role === "NO_PROFILE_USER") {
          User.findByIdAndUpdate(
            user.id,
            { $set: { role: "ORDINARY_USER" } },
            { new: true }
          ).then(user => user);
        }
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email
    });
  }
);

// @route   GET api/users/avatar
// @desc    Get current avatar url
// @access  Private
router.get(
  "/avatar",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id).then(user => {
      res.json(user.avatar);
    });
  }
);

// @route   POST api/users/avatar
// @desc    Upload and change avatar
// @access  Private
router.post(
  "/avatar",
  passport.authenticate("jwt", { session: false }),
  uploadAvatar.single("avatar"),
  (req, res) => {
    if (req.file) {
      User.findByIdAndUpdate(
        req.user.id,
        { $set: { avatar: req.file.path } },
        { new: true }
      ).then(user => res.json(user.avatar));
    }
  }
);

// @route   POST api/users/role
// @desc    Change user role (authority)
// @access  Private
router.post(
  "/role",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (roleList.indexOf(req.body.role) >= 0) {
      User.findByIdAndUpdate(
        req.user.id,
        { $set: { role: req.body.role } },
        { new: true }
      ).then(user => res.json(user));
    }
  }
);

module.exports = router;

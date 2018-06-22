const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FollowSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  followings: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ]
});

module.exports = Follow = mongoose.model("follow", FollowSchema);

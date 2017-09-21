/*eslint-disable*/
"use strict";
// Simulates the kind of delay we see with network or filesystem operations

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeUserDataHelpers(db) {
  return {

    // Saves a user to `db`
    registerUser: function(newUser, callback) {
      db.collection("users").insertOne(newUser, function(err, userInserted){
        callback(null, userInserted.ops[0]);
    });
    },

    checkUser: function(userToCheck, callback) {
      db.collection("users").findOne({ handle: "user2"}, function(err, userFound){
        callback(null, userFound);
    });
    },

    // Get all tweets in `db`, sorted by newest first
    // getTweets: function(callback) {
    //   db.collection("tweets").find().toArray((err, tweets) => {
    //     if (err) throw err;
    //     callback(null, tweets);
    //   });
    // },

    // updateTweet: function(callback, id, liked) {
    //   const change = liked ? -1 : 1;
    //   const mongoID = require('mongodb').ObjectID(id);
    //   db.collection("tweets").updateOne({'_id': mongoID }, {$inc: { likes: change }} , (err, tweet) => {
    //     if (err) throw err;
    //     callback(null, tweet);
    //   });
    // }

  };
}

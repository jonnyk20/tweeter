"use strict";
/*eslint-disable*/
// Simulates the kind of delay we see with network or filesystem operations

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) throw err;
        callback(null, tweets);
      });
    },

    updateTweet: function(callback, id, liked) {
      const change = liked ? -1 : 1;
      const mongoID = require('mongodb').ObjectID(id);
      db.collection("tweets").updateOne({'_id': mongoID }, {$inc: { likes: change }} , (err, tweet) => {
        if (err) throw err;
        callback(null, tweet);
      });
    }




  };
}

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
      db.collection("users").findOne({ handle: userToCheck.handle}, function(err, userFound){
        callback(null, userFound);
    });
    },

  };
}

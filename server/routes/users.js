// const userHelper = require('../lib/util/user-helper');

const express = require('express');

const usersRoutes = express.Router();

/* eslint-disable */
module.exports = function (userDataHelpers) {

  usersRoutes.get('/', (req, res) => {
    res.end("got")
  });

  usersRoutes.post('/register', ({body}, res) => {
    if (body.name === "" || body.handle === "" || body.password === "" ){
      res.status(400).send('Please fill in all fields!')
    }

    userDataHelpers.registerUser(body, (err, newUserReturn) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        console.log("new user is: ");
        console.log(newUserReturn);
        res.status(201).send(newUserReturn);
      }
    });

  });

  usersRoutes.post('/', (req, res) => {
   // res.json([{key: "value"}, {message: "text"}]);
   res.end("posted to user");
  });

  return usersRoutes;
};

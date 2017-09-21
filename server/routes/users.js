// const userHelper = require('../lib/util/user-helper');

const express = require('express');

const usersRoutes = express.Router();

/* eslint-disable */
module.exports = function (userDataHelpers) {

  usersRoutes.get('/', (req, res) => {
    console.log(req.session);
    res.send(req.session);
  });

  usersRoutes.post('/', (req, res) => {
   // res.json([{key: "value"}, {message: "text"}]);
   res.end("posted to user");
  });

  usersRoutes.post('/register', (req , res) => {
    if (req.body.name === "" || req.body.handle === "" || req.body.password === "" ){
      res.status(400).send('Please fill in all fields!')
    }
    userDataHelpers.registerUser(req.body, (err, newUserReturn) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        console.log("new user is: ");
        console.log(newUserReturn);
        req.session.uid = newUserReturn._id;
        req.session.handle = newUserReturn.handle;
        req.session.name = newUserReturn.name;
        res.status(201).send(req.session.uid);
      }
    });
  });

  usersRoutes.post('/logout', (req, res) => {
    req.session = null;
    res.send(null);
   });



  return usersRoutes;
};

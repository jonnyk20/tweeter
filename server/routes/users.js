const express = require('express');
const bcrypt = require('bcrypt');

const usersRoutes = express.Router();


module.exports = function (userDataHelpers) {

  // return info about logged-in user
  usersRoutes.get('/', (req, res) => {
    res.send(req.session);
  });

  usersRoutes.post('/register', (req , res) => {
    // check for blank fields
    if (req.body.name === '' || req.body.handle === '' || req.body.password === '' ){
      res.status(400).send('Please fill in all fields!')
    }
    // hash password
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    // save password to database
    userDataHelpers.registerUser(req.body, (err, newUserReturn) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        // save user info to cookies
        req.session.uid = newUserReturn._id;
        req.session.handle = newUserReturn.handle;
        req.session.name = newUserReturn.name;
        req.session.avatar = newUserReturn.avatar;
        res.status(201).send(req.session);
      }
    });
  });


  usersRoutes.post('/login', (req, res) => {
    // check if user exists
    userDataHelpers.checkUser(req.body, (err, userFound) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        // check if password matches
        if ( !userFound.password ||
          !bcrypt.compareSync(req.body.password, userFound.password)){
          res.status(400).send('wrong username or password');
        } else {
          // save user info to cookies
          req.session.uid = userFound._id;
          req.session.handle = userFound.handle;
          req.session.name = userFound.name;
          req.session.avatar = userFound.avatar;
          res.status(201).send(req.session);
        }
      }
    });
   });


  usersRoutes.post('/logout', (req, res) => {
    req.session = null;
    res.send(null);
   });

  return usersRoutes;
};

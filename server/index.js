// basic express setup:
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const { MongoClient } = require('mongodb');

const { MONGODB_URI } = process.env;
const cookieSession = require('cookie-session');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

const sassMiddleware = require('node-sass-middleware');
  console.log(path.resolve(__dirname, '../public/css'));
app.use(sassMiddleware({
  /* Options */
  src: path.resolve(__dirname, '../sass'),
  dest: path.resolve(__dirname, '../public'),
  outputStyle: 'compressed',
}));


// local variables
app.use((req, res, next) => {
  const userID = req.session.user_id;
  res.locals = {
    user: userID,
  };
  next();
});

// static files, including home page
app.use(express.static('public'));

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  const DataHelpers = require('./lib/data-helpers.js')(db);
  const UserDataHelpers = require('./lib/user-data-helpers.js')(db);
  const tweetsRoutes = require('./routes/tweets')(DataHelpers);
  const usersRoutes = require('./routes/users')(UserDataHelpers);

  app.use('/tweets', tweetsRoutes);
  app.use('/users', usersRoutes);
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
});


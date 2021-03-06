const express = require('express');

const tweetsRoutes = express.Router();

/* eslint-disable */
module.exports = function (DataHelpers) {
  tweetsRoutes.get('/', (req, res) => {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post('/', (req, res) => {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;
    }

    res.end();
    const user = req.body.user;
    const tweet = {
      user,
      content: {
        text: req.body.text,
      },
      created_at: Date.now(),
      likes: 0,
      likedBy: []
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  tweetsRoutes.put('/:id', (req, res) => {
    const alreadyLiked = JSON.parse(req.body.alreadyLiked);
    const liker =  req.body.liker;
    const { id } = req.params;
    DataHelpers.updateTweet((err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).send();
      }
    }, id, alreadyLiked, liker);
    res.end("put successful");
  });
  return tweetsRoutes;
};

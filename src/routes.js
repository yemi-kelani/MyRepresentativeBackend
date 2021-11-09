"use strict";

const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const Twit = require('twit');
require('dotenv').config()

router.route("/tweets")
  .post((req, res) => {

    const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
    const CONSUMER_KEY = process.env.CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
    const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    try {
      var T = new Twit({
          consumer_key: CONSUMER_KEY,
          consumer_secret: CONSUMER_SECRET,
          access_token: ACCESS_TOKEN,
          access_token_secret: ACCESS_TOKEN_SECRET,
      });
  
      T.get('search/tweets', req.body, gotData)

      function gotData(err, data, response) {

          const tweets = data.statuses;
          const ids = [];
          for (var i = 0; i < tweets.length; i++) {
              ids[i] = tweets[i].id_str;
          }
          return res.status(200).send(ids);
      }
    } catch (err) {
        return res.status(400).send('Bad Request');
    }

  });

router.route("/reps")
  .post(async (req, res) => {
    try {
      const G_APIKEY = process.env.G_APIKEY;

      let url = `https://www.googleapis.com/civicinfo/v2/representatives?key=${G_APIKEY}&address=${req.body.zipCode}`;
      const response = await fetch(url);
      const data = await response.json();

      return res.status(200).send(data);
    } catch (err) {
      return res.status(400).send('Bad Request');
    }
  });

  router.route("/")
  .get((req, res) => { 
    return res.status(200).send("Server is Awake.");
  });

module.exports = router;
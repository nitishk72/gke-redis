const redis = require('redis');
const express = require("express");
const bodyParser = require("body-parser");

// ports
const REDISHOST = process.env.REDISHOST || 'localhost';
const REDISPORT = process.env.REDISPORT || 6379;
const PORT = process.env.PORT || 8080;

const redis_client = redis.createClient(REDISPORT, REDISHOST);
redis_client.on('error', (err) => console.error('ERR:REDIS:', err));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req,res){
  res.send("ROOT of app");
})

app.get('/api', function(req,res){
  res.send("API is working");
})

app.get('/api/env', function(req,res){
  res.send({
    REDISHOST,
    REDISPORT,
    PORT
  });
})

app.get('/api/user/:uid', function (req, res) {
  const { uid } = req.params;
  return redis_client.get(uid, function (err, val) {
    let value = val;
    let isNew = false;
    if (!value) {
      isNew = true;
      value = Math.floor(Math.random() * 100);
      redis_client.setex(uid, 60, value);
    }
    return res.send({ value, isNew })
  });
});

app.listen(PORT);

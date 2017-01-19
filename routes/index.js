var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var aws = require('../config/aws');


var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/crudapp';

router.post('/files/:key/delete', function(req, res){
  var key = req.body.key;
  aws.delete(key);
  mongo.connect(url, (err, db) => {
    db.collection('files').deleteOne({key: key}, function(res){
        db.close();
      });
    res.json({status: 200});
  });
});

router.post('/files/:key/update', function(req, res){
  var key = req.body.key;
  var description = req.body.description;
  mongo.connect(url, (err, db) => {
    db.collection('files').update({key: key}, {$set: {description: description}});
    db.close();
  });
  res.json({status: 200});
});

function parseTags(tags){
  tags.shift();
  var tagsArr = tags[0].split(' ');
  tagsArr.pop();
  console.log(tagsArr);
  return tagsArr;
}

router.post('/upload', aws.upload.array('upl',1), function (req, res, next) {
  var tags = req.body.tags;
  // var hidden = req.body.hidden;
  // console.log(hidden);
  console.log(req.files);
  var file = {
    user: req.body.name,
    name: req.files[0].originalname,
    location: req.files[0].location,
    description: req.body.description,
    tags: parseTags(tags),
    key: req.files[0].key
  }
  mongo.connect(url, function(err, db){
    db.collection('files').insertOne(file, function(err, result){
      db.close();
      res.redirect('/');
    })
  })
});

// https://github.com/zishon89us/node-cheat/blob/master/aws/express_multer_s3/app.js

router.get('/tag/:tag', function(req, res){
  var tag = '#' + req.params.tag;
  mongo.connect(url, function(err, db){
    db.collection('files').find({tags: tag}).toArray(function(err, docs){
      db.close();
      res.render('tagfilter', {files: docs, tag: tag});
    })
  })
});

router.get('/users/:user', function(req, res){
  var user = req.params.user;
  mongo.connect(url, function(err, db){
    db.collection('files').find({user: user}).toArray(function(err, docs){
      db.close();
      res.render('userfilter', {files: docs});
    })
  })
});

router.get('/form', function(req, res){
  res.render('form');
});


router.get('/', function(req, res){
  mongo.connect(url, function(err, db){
    db.collection('files').find().toArray(function(err, docs){
      db.close();
      console.log(docs);
      res.render('index', {files: docs});
    });
  });
});


module.exports = router;

var path = require('path');
//var transformer = require('transformer'); //converts unix time to js date
const sqlite3 = require('sqlite3').verbose();
var dpe = require('default-passive-events');
var formidable = require('formidable');
var fs = require('fs');
var express = require('express');
upload = require('express-fileupload');
var app = express();
app.use('/', express.static('webpages', { extensions: ['html'] }));

app.use(upload());


http = require("http").Server(app).listen(8080);

//Initialising the database
let db = new sqlite3.Database('videoResponses');
db.run("create table if not exists videoResponses (id INTEGER PRIMARY KEY AUTOINCREMENT, videoPath STRING, username STRING, trickNum INTEGER, upVotes INTEGER, downVotes INTEGER, uploadTime INTEGER)");
db.run("create table if not exists userDB (id INTEGER PRIMARY KEY AUTOINCREMENT, username STRING, password STRING, email STRING)");
db.run("create table if not exists comments (id INTEGER PRIMARY KEY AUTOINCREMENT,videoID INT ,username STRING, content STRING, upVotes INT, downVotes INT)");
db.run("create table if not exists completedTricks (id INTEGER PRIMARY KEY AUTOINCREMENT, username STRING, trickNum INTEGER)");

app.post("/signUp", signUp);
app.post('/videos/vote/:vote', updateVotes);
app.get('/videos/:trickNum', sendVideos);
app.get('/login/:username', login);
app.get('/videos/comments/:videoID',sendComments);
app.post('/videos/postComment/:params',postComment);
app.post('/comment/vote/:vote',commentVote);
app.get('/completed/:username',returnCompleted);

function commentVote(req,res) {
  var params = req.params.vote.split(",");
  var vote = params[0].replace("vote=","");
  var id = params[1].replace("id=","");
  if (vote ==1 ) {
  db.run('UPDATE comments SET upVotes = upVotes +1 WHERE id ='+id);
  }
  else if (vote == -1) {
    db.run('UPDATE comments SET downVotes = downVotes +1 WHERE id='+id);
  }
}

function postComment(req,res) {
  var parameters = req.params.params.split("&");
  var username = parameters[0];
  var comment = parameters[1];
  var videoID = parameters[2];
  var datetime = new Date();

  //console.log(username + comment+videoID);
  db.run("INSERT INTO comments(videoID,username,content,upvotes,downvotes) VALUES (?,?,?,?,?)", [videoID,username,comment,0,0],function(err) {
     if (err) {
       return console.log(err.message);
       res.sendStatus(404);
     }
     else {
       res.sendStatus(200);
     }
   });
}

function sendComments(req,res) {
  var videoID = req.params.videoID;
  var comments = []
//  console.log("Function called with video ID "+videoID+". So should return all comments with that ID");
  db.each("SELECT * from comments WHERE videoID=?", videoID, function (err,row) {
    comments.push(row.id, row.username, row.content,row.upVotes, row.downVotes);
  }, function () {
    res.send(comments);
  });
}


function signUp(req,res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var match = []

db.each("SELECT * from userDB WHERE username =?",username, function (err, row) {
    match.push(row.username);
}, function () {
    if (match.length == 0) {
      addUsertoDB(username,password,email);
      res.redirect('/login');
    }
    else {
      //console.log(match);
      res.send("error, username taken");
    }
});

}

function login(req,res) {

  var params = req.params.username;
  var splitParams = params.split("&")
  var username = splitParams[0];
  var password = splitParams[1];
  username = username.replace("username=","");
  password = password.replace("password=","");
  console.log("looking for accounts with username:"+username+" and a password of:"+password);
  var usernameFound = []

    db.each("SELECT * FROM userDB WHERE username =?",username ,function (err,row) {
      var username1 = row.username;
      var password1 = row.password;
      console.log(username1 + password1+"found");
      usernameFound.push(row.username,row.password);
      //console.log(usernameFound.length);

  }, function () {
    if (usernameFound[1] == password) {

    var username = usernameFound[0];
    res.send(username);
    //console.log(usernameFound[0]);
  }
  else {
    res.send("err")
  }
  })
};



app.post("/",function(req,res) {
  if (req.files.filename) {
    var file = req.files.filename;
    var username = req.body.username;
    if (username == null) {
      res.send(500, {error: 'You must login to use this feature'});
    }
    else {
      var trick = req.body.trick;
      //console.log(username);
      var filename = file.name;
      if (file.mimetype != 'video/mp4') {
        res.send("Please upload an MP4 file");
      }
      else {

        file.mv("./webpages/videosFolder/"+trick+filename,function(err){
          if(err){
            console.log(err);
            res.send("error");
          }
          else{
            addVideotoDB(filename,username,trick);
            res.redirect('/trick1')
          }
        })}}}})




function updateVotes(req, res) {
  var params = req.params.vote.split(",");
  var vote = params[0].replace("vote=","");
  var id = params[1].replace("id=","");
  if (vote ==1 ) {
  db.run('UPDATE videoResponses SET upVotes = upVotes +1 WHERE id ='+id);
  }
  else if (vote == -1) {
    db.run('UPDATE videoResponses SET downVotes = downVotes +1 WHERE id='+id);
  }
}


function sendVideos(req, res) {
  var videoExtensions = []
  if (req.params.trickNum.includes("username=")) {
    var username = req.params.trickNum.replace("username=","");
    db.each("SELECT id, trickNum, videoPath,username,upVotes,downVotes from videoResponses WHERE username=?",username, function(err,row) {
      videoExtensions.push(row.id,row.trickNum+row.videoPath,row.username,row.upVotes,row.downVotes,row.trickNum);

    }, function () {
      res.send(videoExtensions);
    });
  }
  else {
  var trickNumber = req.params.trickNum.replace("trickNum=", "");
  db.each("SELECT id,videoPath,username,upVotes,downVotes from videoResponses WHERE trickNum="+trickNumber, function (err, row) {
      videoExtensions.push(row.id,trickNumber+row.videoPath,row.username,row.upVotes,row.downVotes,row.trickNum);
  }, function () {
      res.send(videoExtensions);

  });
}
}




function addUsertoDB(username, password, email) {
  db.run('INSERT INTO userDB(username,password,email) VALUES(?,?,?)',[username, password, email], function(err) {
     if (err) {
       return console.log(err.message);
     }
     var data = []
     //console.log(`A row has been inserted with rowid ${this.lastID}`);
     db.each("SELECT id,username,password,email from userDB", function (err,row) {
       data.push(row.id,row.username,row.password,row.email);
     }, function () {
     console.log(data);
   });
 });
}


function addVideotoDB(filename, username, trickNumber) {
  var datetime = Math.round((new Date()).getTime()/1000);
  console.log(datetime);

  db.run(`INSERT INTO videoResponses(videoPath,username,trickNum,upVotes,downVotes,uploadTime) VALUES(?,?,?,?,?,?)`, [filename,username,trickNumber,0,0,datetime], function(err) {
     if (err) {
       return console.log(err.message);
     }
     var data = []
     //console.log(`A row has been inserted with rowid ${this.lastID}`);
     db.each("SELECT id,videoPath,username,trickNum,uploadTime from videoResponses", function (err,row) {
       data.push(row.id,row.videoPath,row.username,row.trickNum,row.uploadTime);
     }, function () {
    // console.log(data+" Added to DB");
   });

   });
}
//var intervalID = setInterval(removeOverdue,3000);
var intervalID = setInterval(function() {
  console.log("We looked for overdue videos");
  db.each("SELECT id,videoPath,username,trickNum,upVotes,downVotes,uploadTime from videoResponses", function (err,row) {
    var currentTime = Math.round((new Date()).getTime()/1000);
    //console.log(currentTime - row.uploadTime);
    //console.log(row.uploadTime)
    if (currentTime - row.uploadTime > 30) {
      console.log("THINK WE DELETING A VIDEO")
      fs.unlink("./webpages/videosFolder/"+row.trickNum+row.videoPath, (err) => {
        if (err) {
          console.log(err);

        }
        else {

          if (row.downVotes == 0 && row.upVotes > 0) {
            db.run("INSERT INTO completedTricks(username,trickNum) VALUES(?,?)", [row.username,row.trickNum], function(err) {
              if (err) {
                return console.log(err.message+"error is here");
              }
              console.log("inserted into completedTricks username:"+row.username+" and trickNum:"+row.trickNum);
            })
          }
          else if (row.upVotes/row.downVotes >3) {
            console.log("tried to insert into new db");
            db.run("INSERT INTO completedTricks (username,trickNum) VALUES(?,?)", [row.username,row.trickNum], function(err) {
              if (err) {
                return console.log(err.message+"we got an error here");
              }
              console.log("inserted into completedTricks username:"+row.username+" and trickNum:"+row.trickNum);
            })
          }

          db.run("DELETE FROM videoResponses WHERE id="+row.id);

          console.log("Deleted video from videoResponses with id of "+row.id+" and deleted path of "+row.videoPath);
        }
      }
    )}
    //data.push(row.id,row.videoPath,row.username,row.trickNum,row.upVotes,row.downVotes,row.uploadTime);
  });
},3000);


function returnCompleted(req,res) {
  var completedTricksSet = []
  var username = req.params.username.replace("username=","");
  console.log(username);
  db.each("SELECT DISTINCT trickNum from completedTricks WHERE username=?",username, function(err,row) {
    if (err) {
      console.log(err);
    }
    completedTricksSet.push(row.trickNum);


  }, function() {
    res.send(completedTricksSet);
  });
}

const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');

//Singleton initializations
var db = new sqlite3.Database('mydb.db');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var fs = require('fs');
const fileUpload = require('express-fileupload');
var busboy = require('connect-busboy'); //middleware for form/file upload
app.use(busboy());

var path = require('path');
// app.use(express.static('public'))

// var __dirname = 'public';

//Setting up the static contents of a directory
app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/public/css'));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/register', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/profiles', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/profileDetails', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


/* Trying file upload mechanism */
app.post('/upload', function (req, res) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    //Path where image will be uploaded
    fstream = fs.createWriteStream(__dirname + '/files/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      console.log("Upload Finished of " + filename);
      // res.redirect('back');           //where to go next
      res.send({});
    });
  });
});


app.post('/registerAdmin', function (req, res) {
  var user_name = req.body.name;
  var email = req.body.email;
  // email = email.substring(0,6);
  var password = req.body.password;
  console.log("User name = " + user_name + ", password is " + password);

  var check;
  db.serialize(function () {
    // db.run("DROP TABLE db.admin_info");
    db.run("CREATE TABLE if not exists admin_info (emailId TEXT, uName TEXT, pWord TEXT, timestamp NUMBER, status NUMBER default 0, PRIMARY KEY(emailId))");
    // var stmt = db.prepare("INSERT INTO admin_info (uName,pWord) VALUES (" + user_name + "," + password + ")");
    // var stmt = db.prepare("INSERT INTO admin_info (uName,pWord) VALUES (?,?)");
    // stmt.run(user_name, email, password);
    var userTime = new Date().getTime();
    db.run("INSERT INTO admin_info (emailId,uName,pWord,timestamp) VALUES ($emailId,$userId,$password,$timestamp)", {
      $emailId: email,
      $userId: user_name,
      $password: password,
      $timestamp: userTime
    }, function (error) {
      if (error) {
        console.log(error);
        res.status(500).send("Fail");
      }
      else {
        // db.each("SELECT * FROM admin_info", function (err, row) {
        //   console.log(row);
        // });

        /*var transporter = nodemailer.createTransport({
          service: 'gmail',
          port: 465,
          auth: {
            user: 'dd.natu@gmail.com',
            pass: 'dd1209425877151'
          },
          secure: true
        });

        var mailOptions = {
          from: 'dd.natu@gmail.com',
          to: email,
          subject: 'Sending Email using Node.js, Please click on this link to complete your registration',
          html: `<a href="http://localhost:3000/register?time=${userTime}">Please click this link to finish registration!`
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });*/
        res.send({ msg: "Success" }); // pu this inside the Email sent success.
      }
    });
    // stmt.finalize();
  });
});

app.post('/verifyRegistration', function (req, res) {
  var timestamp = req.body.timestamp;
  var query = `SELECT * FROM admin_info where timestamp=${timestamp}`;

  db.serialize(function () {
    db.all(query, function (err, rows) {
      if (err) {
        res.status(500).send({ "error": "Error while querying" });
      }
      else {
        if (rows.length == 0) {
          res.status(500).send({ "msg": "Registration not available for this user." });
        }
        else if (rows.length == 1) {
          var query = `UPDATE admin_info SET status=1 where timestamp=${timestamp}`;
          db.run(query, function(error){
            if (err) {
              res.status(500).send({ "msg": "Error while verifying the registration." });    
            } else {
              res.send({msg: "Registration successful"});
            }
          });
        } else {
          res.status(500).send({ "msg": "Error in registring the email." });
        }
      }
    });
  });
});

app.post('/loginAdmin', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  console.log("email address = " + email + ", password is " + password);
  var query = "SELECT * FROM admin_info where emailId='" + email + "' AND pWord='" + password +"'";
  db.serialize(function () {
    db.all(query, function (err, rows) {
      console.log('Query', query);
      if (err) {
        res.status(500).send({ "error": "Error while querying" });
      }
      else {
        if (rows.length == 0) {
          res.send({ "msg": "User does not exist" });
        }
        else {
          res.send({ "msg": "User exists" });
        }
      }
    });
  });
});

app.post('/saveUserForm', function (req, res) {
  console.log('req', req.body.name, req.body.email);
  var name = req.body.name;
  var email = req.body.email;
  var url = req.body.url;
  var coverLetter = req.body.coverLetter;
  var likeWorking = req.body.likeWorking;


  var check;
  db.serialize(function () {
    // db.run("DROP TABLE db.admin_info");
    db.run("CREATE TABLE if not exists user_info (email TEXT, name TEXT, url TEXT, coverLetter TEXT, likeWorking TEXT, rating NUMBER, PRIMARY KEY(email))");
    db.run("INSERT INTO user_info (email,name,url,coverLetter,likeWorking) VALUES ($email,$name,$url,$coverLetter,$likeWorking)", {
      $email: email,
      $name: name,
      $url: url,
      $coverLetter: coverLetter,
      $likeWorking: likeWorking
    });
    db.each("SELECT * FROM user_info", function (err, row) {
      console.log(row);
    });
  });
  res.end("yes");
});

app.post('/checkIfDuplicate', function (req, res) {
  console.log('req', req.body);
  var testEmail = req.body.emailId;

  var check;
  var query = "SELECT * FROM user_info where email='" + testEmail + "'";
  db.serialize(function () {
    db.all(query, function (err, rows) {
      console.log('Query', query);
      if (err) {
        res.status(500).send({ "error": "Error while querying" });
      }
      else {
        if (rows.length == 0) {
          res.send({ "msg": "User does not exist" });
        }
        else {
          res.send({ "msg": "User exists" });
        }
      }
    });
  });
  // res.end("no");
});
 
/* Fetching Profiles and Gettting Details and Getting Rating */

app.get('/getProfiles', function (req, res) {
  var check;
  var query = "SELECT * FROM user_info";
  db.serialize(function () {
    db.all(query, function (err, rows) {
      console.log('Query', query);
      if (err) {
        res.status(500).send({ "error": "Error while querying" });
      }
      else {
        if (rows.length == 0) {
          res.send({ "msg": "User does not exist" });
        }
        else {
          res.send({rows});
          // res.send({ "msg": "User exists" });
        }
      }
    });
  });
  // res.end("no");
});

app.post('/getProfileDetails', function (req, res) {
  var email = req.body.emailId;
  var query = "SELECT * FROM user_info where email='" + email + "'";
  db.serialize(function () {
    db.all(query, function (err, rows) {
      console.log('Query', query);
      if (err) {
        res.status(500).send({ "error": "Error while querying" });
      }
      else {
        if (rows.length == 0) {
          res.send({ "msg": "User does not exist" });
        }
        else {
          res.send({rows});
          // res.send({ "msg": "User exists" });
        }
      }
    });
  });
  // res.end("no");
});

app.post('/submitRating', function(req, res){
  var email = req.body.emailId;
  var rating = req.body.rating;
  console.log('email', email);
  console.log('rating', rating);

  var query = `UPDATE user_info SET rating=${rating} where email='${email}'`;
  db.serialize(function () {
    db.all(query, function (err, rows) {
      if (err) {
        res.status(500).send({ "error": "Error while querying" });
        console.log(err);
      }
      else {
        if (rows.length == 0) {
          res.status(500).send({ "msg": "Registration not available for this user." });
        }
        else if (rows.length == 1) {
          db.run(query, function(error){
            if (err) {
              res.status(500).send({ "msg": "Error while submitting the rating." });    
            } else {
              res.send({msg: "Rating submitted successfully"});
            }
          });
        } else {
          res.status(500).send({ "msg": "Error in submitting the ratings." });
        }
      }
    });
  });
})

/* Starting express node server */
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
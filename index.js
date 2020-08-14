
const MongoClient = require('mongodb').MongoClient;

const env = require('./env.js');

const url = env.url;

const bcrypt = require('bcrypt');
const saltRounds = 10;

console.log('attempting to set new password ...');
console.log(process.argv);
var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

let user;
let password;

if(myArgs.length) {
    if(myArgs.length===2) {
        user=myArgs[0];
        password=myArgs[1];
    } else {
        console.log('user and password required as args');
        process.exit();
    }
}

bcrypt.hash(password, saltRounds, (err, hash) => {
        console.log("hash: ",hash);

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("tt0");
            var myquery = { user: user };
            var newvalues = { $set: {user: user, password:hash } };
            dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
            });
          });







});

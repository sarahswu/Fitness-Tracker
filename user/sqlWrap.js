'use strict'

const sql = require('sqlite3');
const util = require('util');

const db = new sql.Database("activities.db");



// Fitness 3 code
const dbP = new sql.Database("profiles.db");


let cmdP = " SELECT name FROM sqlite_master WHERE type='table' AND name='ProfileTable' ";


dbP.get(cmdP, function (err, val) {
  if (val == undefined) {
    console.log("No profile database file - creating one");
    createProfileTable();
  } else {
    console.log("Profile database file found");
  }
});

function createProfileTable() {
  const cmdP = 'CREATE TABLE ProfileTable (userID TEXT, name TEXT)';
  dbP.run(cmdP, function(err, val) {
    if (err) {
      console.log("Profile database creation failure",err.message);
    } else {
      console.log("Created profile database");
    }
  });
}

dbP.run = util.promisify(dbP.run);
dbP.get = util.promisify(dbP.get);
dbP.all = util.promisify(dbP.all);

// // empty all data from db
dbP.deleteEverything = async function() {
  await dbP.run("delete from ProfileTable");
  dbP.run("vacuum");
}
//module.exports = dbP;
// // allow code in index.js to use the db object




// old-fashioned database creation code 

// creates a new database object, not a 
// new database. 



// check if database exists
let cmd = "SELECT name FROM sqlite_master WHERE type='table' AND name='ActivityTable'";


db.get(cmd, function (err, val) {
  if (val == undefined) {
        console.log("No database file - creating one");
        createActivityTable();
  } else {
        console.log("Database file found");
  }
});

// called to create table if needed
function createActivityTable() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  const cmd = 'CREATE TABLE ActivityTable (rowIdNum INTEGER PRIMARY KEY, activity TEXT, date INTEGER, amount FLOAT, userId TEXT)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

// wrap all database commands in promises
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

// empty all data from db
db.deleteEverything = async function() {
  await db.run("delete from ActivityTable");
  db.run("vacuum");
}

// allow code in index.js to use the db object
module.exports.db = db;
module.exports.dbP = dbP;



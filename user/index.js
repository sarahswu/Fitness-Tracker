// 'use strict'

// // A server that uses a database.

// // express provides basic server functions
// const express = require("express");


// // using a Promises-wrapped version of sqlite3
// const db = require('./sqlWrap');

// // SQL commands for ActivityTable
// const deleteAllDB = "delete from ActivityTable";
// const insertDB = "insert into ActivityTable (activity, date, amount) values (?,?,?)"
// const getOneDB = "select * from ActivityTable where activity = ? and date = ? and amount = ?";
// const allDB = "select * from ActivityTable";
// const getFutureDB = "select * from ActivityTable where amount = -1";
// const deletePastPlannedDB = "delete from ActivityTable where amount = -1 and date < ?";
// const getLatestDB = "select * from ActivityTable where rowIdNum = (select max(rowIdNum) from ActivityTable)";
// const getWeekDB = "select * from ActivityTable where activity = ? and date >= ? and date <= ?";

// // object that provides interface for express
// const app = express();

// // use this instead of the older body-parser
// app.use(express.json());

// // make all the files in 'public' available on the Web
// app.use(express.static('public'))

// // when there is nothing following the slash in the url, return the main page of the app.
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/public/index.html");
// });



// // This is where the server recieves and responds to POST requests
// app.post('/store', async function(request, response, next) {
  
//   let [date, activity, time = -1, units] = request.body;
//   await db.run(insertDB,[activity,date,time]);
//   console.log("Server recieved a post request at", request.url, "with body: ", request.body);
//   // console.log("body",request.body);
//   response.send({message: "I got your POST request."});
// });

// app.get("/reminder", async (request, response) => {
//   // await db.run(deleteAllDB);
//   let result = await db.all(getFutureDB);

//   if (result.length < 1 ) {
//     response.send({message: "no reminder"});
//   }

//   let today = new Date();
//   today.setHours(7,0,0,0)
//   today = today.getTime();
//   let reminder;
//   for (let i=0; i < result.length; i++) {
//     if (reminder == undefined) {
//       reminder = result[i]
//     } else if (result[i].date > reminder.date && result[i].date < today) {
//       reminder = result[i];
//     }
//   }
//   console.log('reminder: ', reminder);
//   await db.run(deletePastPlannedDB, [today]);
//   response.send(reminder);
//   let database = await db.all(allDB);
//   console.log("database: ", database);
// });

// app.get("/week", async (request, response) => {
//   const date = request.query.date;
//   let activity = request.query.activity;
  
//   let today = new Date();
//   today.setHours(7,0,0,0);

//   if (date >= today.getTime()) {
//     response.send({message: "Date is too late."});
//   }

//   if (activity == undefined || activity == "") {
//     let latestEntry = await db.all(getLatestDB);
//     console.log("latest entry:", latestEntry);
//     activity = latestEntry[0].activity;
//   }

//   let firstdate = date-604800000;

//   let result = await db.all(getWeekDB, [activity, firstdate, date]);
  
//   if (result.length < 1) {
//     result = [{}];
//     result[0].activity = activity;
//   }

//   console.log("week result: ", result);

//   response.send(result);

// });

// // listen for requests :)
// const listener = app.listen(3000, () => {
//   console.log("The static server is listening on port " + listener.address().port);
// });
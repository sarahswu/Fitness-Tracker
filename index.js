const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');

const GoogleStrategy = require('passport-google-oauth20');



// Google login credentials, used when the user contacts
// Google, to tell them where he is trying to login to, and show
// that this domain is registered for this service. 
// Google will respond with a key we can use to retrieve profile
// information, packed into a redirect response that redirects to
// server162.site:[port]/auth/redirect
const hiddenClientID = process.env['ClientID'];
const hiddenClientSecret = process.env['ClientSecret'];
let usrProfile;

// An object giving Passport the data Google wants for login.  This is 
// the server's "note" to Google.
const googleLoginData = {
    clientID: hiddenClientID,
    clientSecret: hiddenClientSecret,
    callbackURL: '/auth/accepted',
    proxy: true
};


// Tell passport we will be using login with Google, and
// give it our data for registering us with Google.
// The gotProfile callback is for the server's HTTPS request
// to Google for the user's profile information.
// It will get used much later in the pipeline. 
passport.use(new GoogleStrategy(googleLoginData, gotProfile) );


// Let's build a server pipeline!

// app is the object that implements the express server
const app = express();

// pipeline stage that just echos url, for debugging
app.use('/', printURL);

// Check validity of cookies at the beginning of pipeline
// Will get cookies out of request object, decrypt and check if 
// session is still going on. 
app.use(cookieSession({
    maxAge: 6 * 60 * 60 * 1000, // Six hours in milliseconds
    // after this user is logged out.
    // meaningless random string used by encryption
    keys: ['hanger waldo mercy dance']  
}));

// Initializes passport by adding data to the request object
app.use(passport.initialize()); 

// If there is a valid cookie, this stage will ultimately call deserializeUser(),
// which we can use to check for a profile in the database
app.use(passport.session()); 

// Public static files - /public should just contain the splash page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/splash.html");
});

app.get('/*',express.static('public'));

// next, handler for url that starts login with Google.
// The app (in public/login.html) redirects to here 
// (it's a new page, not an AJAX request!)
// Kicks off login process by telling Browser to redirect to
// Google. The object { scope: ['profile'] } says to ask Google
// for their user profile information.
app.get('/auth/google',
	passport.authenticate('google',{ scope: ['profile'] }) );
// passport.authenticate sends off the 302 (redirect) response
// with fancy redirect URL containing request for profile, and
// client ID string to identify this app. 
// The redirect response goes to the browser, as usual, but the browser sends it to Google.  
// Google puts up the login page! 

// Google redirects here after user successfully logs in
// This route has three middleware functions. It runs them one after another.
app.get('/auth/accepted',
	// for educational purposes
	function (req, res, next) {
	    console.log("at auth/accepted");
	    next();
	},
	// This will issue Server's own HTTPS request to Google
	// to access the user's profile information with the 
	// temporary key we got in the request. 
	passport.authenticate('google'),
	// then it will run the "gotProfile" callback function,
	// set up the cookie, call serialize, whose "done" 
	// will come back here to send back the response
	// ...with a cookie in it for the Browser! 
	function (req, res) {
	    console.log("Inside auth profile has arrived: ",usrProfile);
	    console.log('Logged in and using cookies!')
      // tell browser to get the hidden main page of the app
   
      console.log("Request Body: "+JSON.stringify(req.body));
	    res.redirect(`/public/index.html?userName=${usrProfile.displayName}`);
	});

// static files in /user are only available after login
app.get('/*',
	isAuthenticated, // only pass on to following function if
	// user is logged in 
	// serving files that start with /user from here gets them from ./
	express.static('user') 
       ); 



// next, put all queries (like store or reminder ... notice the isAuthenticated 
// middleware function; queries are only handled if the user is logged in
app.get('/query', isAuthenticated,
    function (req, res) { 
      console.log("saw query");
      res.send('HTTP query!') });


// new Fitness 3 code below

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});




// below is from Fitness 2


// A server that uses a database.


// using a Promises-wrapped version of sqlite3
const dbb = require('./user/sqlWrap');
const db = dbb.db;

// SQL commands for ActivityTable
const deleteAllDB = "delete from ActivityTable";
const insertDB = "insert into ActivityTable (activity, date, amount, userId) values (?,?,?,?)"
const getOneDB = "select * from ActivityTable where activity = ? and date = ? and amount = ? and userId = ?";
const allDB = "select * from ActivityTable";
const allUserDB = "select * from ActivityTable where userId = ?"
const getFutureDB = "select * from ActivityTable where amount = -1 and userId = ?";
const deletePastPlannedDB = "delete from ActivityTable where amount = -1 and date < ? and userId = ?";
const getLatestDB = "select * from ActivityTable where rowIdNum = (select max(rowIdNum) from ActivityTable) and userId = ?";
const getWeekDB = "select * from ActivityTable where activity = ? and date >= ? and date <= ? and userId = ?";


// use this instead of the older body-parser
app.use(express.json());

// make all the files in 'public' available on the Web
app.use(express.static('public'))

// when there is nothing following the slash in the url, return the main page of the app.
app.get("/", isAuthenticated, (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});


// This is where the server recieves and responds to POST requests
app.post('/store', isAuthenticated, async function(request, response, next) {
  
  let [date, activity, time = -1, units] = request.body;
  await db.run(insertDB,[activity,date,time,request.user.userID]);
  console.log("Server recieved a post request at", request.url, "with body: ", request.body, "and userID: ", request.user.userID);
  // console.log("body",request.body);
  response.send({message: "I got your POST request."});
});

app.get("/reminder", isAuthenticated, async (request, response) => {
  // await db.run(deleteAllDB);
  let result = await db.all(getFutureDB, request.user.userID);
  console.log('reminder result: ', result);

  if (result.length < 1 || result == undefined) {
    response.send({message: "no reminder"});
  } else {
    let today = new Date();
    // today.setHours(7,0,0,0)
    today = today.getTime();
    let reminder;
    for (let i=0; i < result.length; i++) {
      if (reminder == undefined) {
        reminder = result[i]
      } else if (result[i].date > reminder.date && result[i].date < today) {
        reminder = result[i];
      }
    }
    await db.run(deletePastPlannedDB, [today,request.user.userID]);
    response.send(reminder);
  }

  
  let database = await db.all(allDB);
  console.log("activities database: ", database);

  let profiles = await dbP.all(allDBP);
  console.log("profiles database: ", profiles);

});

app.get("/week", isAuthenticated, async (request, response) => {
  const date = request.query.date;
  let activity = request.query.activity;
  
  let today = new Date();
  // today.setHours(7,0,0,0);

  if (date >= today.getTime()) {
    response.send({message: "Date is too late."});
  } else {

    let userEntries = await db.all(allUserDB, request.user.userID);
    console.log('userEntries: ', userEntries);
    let latestEntry;

    if (userEntries.length < 1) {
      response.send({message: "no activities"});
    } else {

      for (let i=(userEntries.length-1); i >= 0; i--) {
        // console.log('are you here');
        if (userEntries[i].userId == request.user.userID) {
          // console.log('or here');
          latestEntry = userEntries[i];
          break;
        }
      }

      if (activity == undefined || activity == "") {
        console.log("latest entry:", latestEntry);
        activity = latestEntry.activity;
      }

      let firstdate = date-604800000;

      let result = await db.all(getWeekDB, [activity, firstdate, date,request.user.userID]);
      
      if (result.length < 1) {
        result = [{}];
        result[0].activity = activity;
      }

      console.log("week result: ", result);

      response.send(result);

    }
  }
});
    


  //   let latestEntry = await db.all(getLatestDB,request.user.userID);
  //   if (latestEntry.length < 1) {
  //     // console.log('you working?');
  //     response.send({message: "no activities"});
  //   } else {
  //     if (activity == undefined || activity == "") {
  //       console.log("latest entry:", latestEntry);
  //       activity = latestEntry[0].activity;
  //     }

  //     let firstdate = date-604800000;

  //     let result = await db.all(getWeekDB, [activity, firstdate, date,request.user.userID]);
      
  //     if (result.length < 1) {
  //       result = [{}];
  //       result[0].activity = activity;
  //     }

  //     console.log("week result: ", result);

  //     response.send(result);
  //   }
    
  // }

  






// below continue with fitness 3 code

// SQL commands for profiles table
const dbPP = require('./user/sqlWrap');
const dbP = dbPP.dbP;
const allDBP = "select * from ProfileTable";
const getOneDBP = "select * from ProfileTable where userID = ?";
const insertDBP = "insert into ProfileTable (userID, name) values (?,?)";
const deleteAllDBP = "delete from ProfileTable";

app.get("/name", isAuthenticated, async (request, response) => {
  console.log('request.user stuff: ', request.user);
  let result = await dbP.all(getOneDBP, request.user.userID);
  console.log('name result: ', result);
  response.send(result);
});


// finally, file not found, if we cannot handle otherwise.
app.use( fileNotFound );

// Pipeline is ready. Start listening!  
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});


// middleware functions called by some of the functions above. 

// print the url of incoming HTTP request
function printURL (req, res, next) {
    console.log(req.url);
    next();
}

// function for end of server pipeline
function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
    }


// function to check whether user is logged when trying to access
// personal data
function isAuthenticated(req, res, next) {
    if (req.user) {
      // user field is filled in in request object
      // so user must be logged in! 
	    console.log("user",req.user,"is logged in");
	    next();
    } else {
	res.redirect('/splash.html');  // send response telling
	// Browser to go to login page
    }
}

// Some functions Passport calls, that we can use to specialize.
// This is where we get to write our own code, not just boilerplate. 
// The callback "done" at the end of each one resumes Passport's
// internal process.  It is kind of like "next" for Express. 


// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google. 
async function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile has arrived",profile);
    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there. 

    //await dbP.run(deleteAllDBP);

    let userID = profile.id;
    let name = profile.name.givenName;

    let profiles = await dbP.all(allDBP);
    // console.log("profiles database: ", profiles);
    let newUser = 1;

    console.log('length: ', profiles.length);



    if (profiles.length < 1) {
      await dbP.run(insertDBP,[userID, name]);
    } else {
      for (let i=0; i < profiles.length; i++) {
        if (profiles[i].userID == userID) {
          newUser = 0;
        }
      }
      if (newUser == 1) {
        await dbP.run(insertDBP,[userID, name]);
      }
    }
    

    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.
    usrProfile = profile;
    console.log("userId: ", userID);
    console.log("name: ", name);

    done(null, userID); 
}

// Part of Server's sesssion set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
passport.serializeUser((userid, done) => {
    console.log("SerializeUser. Input is",userid);
    done(null, userid);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie. 
// Where we should lookup user database info. 
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser((userid, done) => {
    console.log("deserializeUser. Input is:", userid);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    let userData = {
      userID: userid,
      userData: "data from user's db row goes here"};
    done(null, userData);
});





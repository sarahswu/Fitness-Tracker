import barchart from './barchart.js'

barchart.init('chart-anchor', 500, 300);


const pastbtn = document.getElementById('past-btn');
const pastform = document.getElementById('past-form');

const futurebtn = document.getElementById('future-btn');
const futureform = document.getElementById('future-form');

const pastsubmit = document.getElementById('past-submit');
const futuresubmit = document.getElementById('future-submit');

const pastactsubmit = document.getElementById('past-act-submit');
const futureactsubmit = document.getElementById('future-act-submit');

const pastmessagediv = document.getElementById('past-message-div');
const futuremessagediv = document.getElementById('future-message-div');

const pastbold = document.getElementById('past-bold');
const futurebold = document.getElementById('future-bold');

const pastdate = document.getElementById('past-date');
pastdate.max = new Date().toISOString().split("T")[0];

const futuredate = document.getElementById('future-date');
futuredate.min = new Date().toISOString().split("T")[0];

const progressbtn = document.getElementById('progress-btn');
const closebtn = document.getElementById('close');
const go = document.getElementById('go');

const yesbtn = document.getElementById('yes-btn');
const nobtn = document.getElementById('no-btn');

let datadate;
let dataactivity;


const data = [
    {
        'date': 1617624000000,
        'value': 0,
    },
    {
        'date': 1617710400000,
        'value': 0,
    },
    {
        'date': 1617796800000,
        'value': 0,
    },
    {
        'date': 1617883200000,
        'value': 0,
    },
    {
        'date': 1617969600000,
        'value': 0,
    },
    {
        'date': 1618056000000,
        'value': 0,
    },
    {
        'date': 1618142400000,
        'value': 0,
    },
]

fetchReminder();

// fetch reminder
function fetchReminder () {
  fetch('/reminder')
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      console.log("Reminder: ", data);
      let today = new Date();
      today.setHours(0,0,0,0);
      
      datadate = new Date(data.date);
      datadate.setHours(0,0,0,0);
      datadate = datadate.getTime();
      
      if (datadate > today-604800000) {
        let day = "";
        if (datadate == today-86400000) {
          day = "yesterday"
        } else {
          switch (new Date(datadate).getDay()) {
            case 0:
              day = "on Sunday";
              break;
            case 1:
              day = "on Monday";
              break;
            case 2:
              day = "on Tuesday";
              break;
            case 3:
              day = "on Wednesday";
              break;
            case 4:
              day = "on Thursday";
              break;
            case 5:
              day = "on Friday";
              break;
            case  6:
              day = "on Saturday";
          } 
        }
        dataactivity = data.activity;
        let verb = "";
        if (dataactivity == 'Yoga') {
          verb = "do";
        } else if (dataactivity == 'Soccer' || dataactivity == 'Basketball') {
          verb = "play";
        }
        document.getElementById('didyou').textContent = `Did you ${verb} ${dataactivity} ${day}?`;
        document.getElementById('reminder-box').style.display = 'flex';
      }
    })
    .catch(function(error) {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// yes btn onclick
yesbtn.addEventListener("click", function() {
  document.getElementById('reminder-box').style.display = 'none';

  pastbtn.style.display = 'none';
  pastform.style.display = 'flex';
  pastsubmit.style.display = 'block'
  pastactsubmit.style.display = 'none'
  pastmessagediv.style.width = 'auto';

  let date = new Date(datadate);
  pastdate.valueAsDate = date;
  pastact.value = dataactivity;

  if (pastact.value == 'Swim') {
        units.value = 'laps';
    } else if (pastact.value == 'Yoga' || pastact.value == 'Soccer' || pastact.value == 'Basketball') {
        units.value = 'minutes';
    } else {
        units.value = 'km';
    }
});

// no btn onlick
nobtn.addEventListener("click", function() {
  document.getElementById('reminder-box').style.display = 'none';
});

// function to reset data
function resetData() {
  for (let i=data.length-1; i >= 0; i--) {
    data[i].value = 0;
  }
};

// data format functions
function formatData (DBdata, sundayDate) {


  // sets date values of 'data' to correct dates
  for (let i=data.length-1; i >= 0; i--) {
    data[i].date = sundayDate;
    sundayDate = sundayDate-86400000;
  }
  // sets date values from database to 0 hours
  for (let i=0; i < DBdata.length; i++) {
    let reformat = new Date(DBdata[i].date);
    reformat = reformat.setHours(0,0,0,0);
    DBdata[i].date = reformat;
  }
  // adds database amounts into 'data' values
  for (let i=0; i < data.length; i++) {
    for (let j = 0; j < DBdata.length; j++) {
      if (data[i].date == DBdata[j].date) {
        data[i].value = data[i].value + DBdata[j].amount;
      }
    }
  }

  console.log('formatted data: ', data);

};

// function to get correct units for barchart
function getUnits(activity) {
  let units = '';
  switch (activity) {
    case 'Walk':
      units = 'Kilometers Walked'
      break;
    case 'Run':
      units = 'Kilometers Run';
      break;
    case 'Swim':
      units = 'Laps Swam';
      break;
    case 'Bike':
      units = 'Kilometers Biked';
      break;
    case 'Yoga':
      units = 'Minutes of Yoga';
      break;
    case 'Soccer':
      units = 'Minutes of Soccer';
      break;
    case 'Basketball':
      units = 'Minutes of Basketball';
      break;
  }

  return units;

}

// view progress button
progressbtn.addEventListener("click", function() {
  document.getElementById('overlay').style.display = 'block';
  let today = new Date();
  today.setHours(0,0,0,0);
  // gets most recent sunday to use as last date
  let sunday = today.setDate(today.getDate() - today.getDay());
  fetch('/week?date=' + sunday + '&activity=')
  .then(function(response){
    return response.json();
  })
  .then(function(response){
    console.log('last week: ', response);
    // console.log('type of response: ', typeof response);
    if (response[0] != undefined) {
      // console.log('did you go here?')
      formatData(response,sunday);
      let units = getUnits(response[0].activity);
      barchart.render(data, units, 'Day of the Week');
      resetData();
    }
    // console.log("or where you're supposed to go");
  })
  .catch(function(error) {
    console.error('There has been a problem with your fetch operation:', error);
  });

});

// close button
closebtn.addEventListener("click", function() {
  document.getElementById('overlay').style.display = 'none';
});

// barchart go button
go.addEventListener("click", function() {
  let progressdate = document.getElementById('progress-date');

  let progressact = document.getElementById('progress-act');

  let today = new Date();
  today.setHours(0,0,0,0);
  let lastdate = new Date(progressdate.value).setHours(0,0,0,0);
  lastdate = lastdate + 86400000;

  fetch('/week?date=' + lastdate + '&activity=' + progressact.value)
  .then(function(response){
    return response.json();
  })
  .then(function(response){
    formatData(response, lastdate);
    let units = getUnits(response[0].activity);
    barchart.render(data, units, 'Day of the Week');
    resetData();
  })
  .catch(function(error) {
    console.error('There has been a problem with your fetch operation:', error);
  });

});

// add new activity button functions
pastbtn.addEventListener("click", function() {
    pastbtn.style.display = 'none';
    pastform.style.display = 'flex';
    pastsubmit.style.display = 'block'
    pastactsubmit.style.display = 'none'
    pastmessagediv.style.width = 'auto';
});

futurebtn.addEventListener("click", function() {
    futurebtn.style.display = 'none';
    futureform.style.display = 'flex';
    futuresubmit.style.display = 'block'
    futureactsubmit.style.display = 'none'
    futuremessagediv.style.width = 'auto';
});

// event listener that changed units according to activity selected for past activity
const pastact = document.getElementById('past-act');
pastact.addEventListener('change', (event) => {
    const units = document.getElementById('units');
    if (pastact.value == 'Swim') {
        units.value = 'laps';
    } else if (pastact.value == 'Yoga' || pastact.value == 'Soccer' || pastact.value == 'Basketball') {
        units.value = 'minutes';
    } else {
        units.value = 'km';
    }
});

// functions that POST request
function pastpost(data) {
    console.log(`Data input: ${data}`);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };

    fetch('/store', options)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      console.log("Data received: ", data);
    })
    .catch(function(error) {
      console.error('There has been a problem with your fetch operation:', error);
    });
};

function futurepost(data) {
    console.log(`Data input: ${data}`);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };

    fetch('/store', options)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      console.log("Data received: ", data); 
    })
    .catch(function(error) {
      console.error('There has been a problem with your fetch operation:', error);
    });
};

// functions when forms are submitted
pastsubmit.addEventListener("click", function() {
    let pastdate = document.getElementById('past-date');

    let pastact = document.getElementById('past-act');

    let time = document.getElementById('time');

    let units = document.getElementById('units');

    // error messages for invalid post input
    if (pastdate.value === '' || pastdate.value == null || pastact.value === '' || pastact.value == null || time.value === '' || time.value == null || units.value === '' || units.value == null) {
        window.alert('Invalid Post Activity. Please fill in the entire form.');
        return;
    } else if (pastdate.value > new Date().toISOString().split("T")[0]) {
        window.alert('Invalid Post Activity. Please fill in a past date.');
        return;
    }

    // writes input in bold for message
    pastbold.textContent = `${pastact.value} for ${time.value} ${units.value}.`;

    // arr to send POST request
    let arr = [];
    let date = new Date(pastdate.value).getTime();
    date = date + 25200000;
    arr.push(date);
    arr.push(pastact.value);
    arr.push(time.value);
    arr.push(units.value);
    console.log(arr);

    pastpost(arr);

    // hides form and displays message and new activity button
    pastform.style.display = 'none';
    pastsubmit.style.display = 'none';
    pastmessagediv.style.width = '90%';
    pastactsubmit.style.display = 'flex';
    pastbtn.style.display = 'block';
    
    // reset form
    pastdate.value = '';
    pastact.value = 'Walk';
    time.value = '';
    units.value = 'km';
});

futuresubmit.addEventListener("click", function() {
    let futuredate = document.getElementById('future-date');

    let futureact = document.getElementById('future-act');

    if (futuredate.value === '' || futuredate.value == null || futureact.value === '' || futureact.value == null) {
        window.alert('Invalid Post Activity. Please fill in the entire form.')
        return;
    } else if (futuredate.value < new Date().toISOString().split("T")[0]) {
      window.alert('Invalid Post Activity. Please fill in a future date.');
      return;
    }

    futurebold.textContent = `${futureact.value} on ${futuredate.value}`;

    let arr = [];
    let date = new Date(futuredate.value).getTime();
    date = date + 25200000;
    arr.push(date);
    arr.push(futureact.value);
    console.log(arr);

    futurepost(arr);

    futureform.style.display = 'none';
    futuresubmit.style.display = 'none';
    futuremessagediv.style.width = '90%';
    futureactsubmit.style.display = 'flex';
    futurebtn.style.display = 'block';

});

export default data;

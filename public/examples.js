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

const pastdate = document.getElementById('past-date')
pastdate.max = new Date().toISOString().split("T")[0];

const futuredate = document.getElementById('future-date')
futuredate.min = new Date().toISOString().split("T")[0];

pastbtn.onclick = function(){
    pastbtn.style.display = 'none';
    pastform.style.display = 'flex';
    pastsubmit.style.display = 'block'
    pastactsubmit.style.display = 'none'
    pastmessagediv.style.width = 'auto';
};

futurebtn.onclick = function(){
    futurebtn.style.display = 'none';
    futureform.style.display = 'flex';
    futuresubmit.style.display = 'block'
    futureactsubmit.style.display = 'none'
    futuremessagediv.style.width = 'auto';
};

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

function pastpost(pastinput) {
    console.log(`Data input: ${pastinput}`);

    const data = { pastinput };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };

    fetch('/pastactivity', options)
    .then(function(response){
      return response.text()
    })
    .then(function(data){
      console.log("Data received: "+data); 
      ;
    })
    .catch(function(error) {
    console.error('There has been a problem with your fetch operation:', error);
     displayOutput(null,error);
    });
};

function futurepost(futureinput) {
    console.log(`Data input: ${futureinput}`);

    const data = { futureinput };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };

    fetch('/futureactivity', options)
    .then(function(response){
      return response.text()
    })
    .then(function(data){
      console.log("Data received: "+data); 
      ;
    })
    .catch(function(error) {
    console.error('There has been a problem with your fetch operation:', error);
     displayOutput(null,error);
    });
};

pastsubmit.onclick = function(){
    let pastdate = document.getElementById('past-date');

    let pastact = document.getElementById('past-act');

    let time = document.getElementById('time');

    let units = document.getElementById('units');

    if (pastdate.value === '' || pastdate.value == null || pastact.value === '' || pastact.value == null || time.value === '' || time.value == null || units.value === '' || units.value == null) {
        window.alert('Invalid Post Activity. Please fill in the entire form.');
        return;
    } else if (pastdate.value > new Date().toISOString().split("T")[0]) {
        window.alert('Invalid Post Activity. Please fill in a past date.');
        return;
    }

    pastbold.textContent = `${pastact.value} for ${time.value} ${units.value}.`;

    let arr = [];
    arr.push(pastdate.value);
    arr.push(pastact.value);
    arr.push(time.value);
    arr.push(units.value);
    console.log(arr);

    pastpost(arr);

    pastform.style.display = 'none';
    pastsubmit.style.display = 'none';
    pastmessagediv.style.width = '90%';
    pastactsubmit.style.display = 'flex';
    pastbtn.style.display = 'block';
    
    pastdate.value = '';
    pastact.value = 'Walk';
    time.value = '';
    units.value = 'km';
}

futuresubmit.onclick = function(){
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
    arr.push(futuredate.value);
    arr.push(futureact.value);
    console.log(arr);

    futurepost(arr);

    futureform.style.display = 'none';
    futuresubmit.style.display = 'none';
    futuremessagediv.style.width = '90%';
    futureactsubmit.style.display = 'flex';
    futurebtn.style.display = 'block';
    
    futuredate.value = '';
    futureact.value = 'Walk';
}


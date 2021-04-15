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

pastsubmit.onclick = function(){
    let pastdate = document.getElementById('past-date');

    let pastact = document.getElementById('past-act');

    let time = document.getElementById('time');

    let units = document.getElementById('units');

    if (pastdate.value === '' || pastdate.value == null || pastact.value === '' || pastact.value == null || time.value === '' || time.value == null || units.value === '' || units.value == null) {
        window.alert('Invalid Post Activity. Please fill in the entire form.')
        return;
    }

    pastbold.textContent = `${pastact.value} for ${time.value} ${units.value}.`;

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
    }

    futurebold.textContent = `${futureact.value} on ${futuredate.value}`;

    futureform.style.display = 'none';
    futuresubmit.style.display = 'none';
    futuremessagediv.style.width = '90%';
    futureactsubmit.style.display = 'flex';
    futurebtn.style.display = 'block';
    
    futuredate.value = '';
    futureact.value = 'Walk';
}


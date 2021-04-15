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
    pastdate = pastdate.value;

    let pastact = document.getElementById('past-act');
    pastact = pastact.value;

    let time = document.getElementById('time');
    time = time.value;

    let units = document.getElementById('units');
    units = units.value;

    if (pastdate === '' || pastdate == null || pastact === '' || pastact == null || time === '' || time == null || units === '' || units == null) {
        window.alert('Invalid Post Activity. Please fill in the entire form.')
        return;
    }

    pastbold.textContent = `${pastact} for ${time} ${units}.`;

    pastform.style.display = 'none';
    pastsubmit.style.display = 'none';
    pastmessagediv.style.width = '90%';
    pastactsubmit.style.display = 'flex';
    pastbtn.style.display = 'block';
    pastform.reset();
}

futuresubmit.onclick = function(){
    let futuredate = document.getElementById('future-date');
    futuredate = futuredate.value;

    let futureact = document.getElementById('future-act');
    futureact = futureact.value;

    if (futuredate === '' || futuredate == null || futureact === '' || futureact == null) {
        window.alert('Invalid Post Activity. Please fill in the entire form.')
        return;
    }

    futurebold.textContent = `${futureact} on ${futuredate}`;

    futureform.style.display = 'none';
    futuresubmit.style.display = 'none';
    futuremessagediv.style.width = '90%';
    futureactsubmit.style.display = 'flex';
    futurebtn.style.display = 'block';
    futureform.reset();
}


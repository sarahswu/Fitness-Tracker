const pastbtn = document.getElementById('past-btn');
const pastform = document.getElementById('past-form');

const futurebtn = document.getElementById('future-btn');
const futureform = document.getElementById('future-form');

const pastsubmit = document.getElementById('past-submit');
const futuresubmit = document.getElementById('future-submit');

const pastactsubmit = document.getElementById('past-act-submit');
const futureactsubmit = document.getElementById('future-act-submit');

pastbtn.onclick = function(){
    pastbtn.style.display = 'none';
    pastform.style.display = 'flex';
    pastsubmit.style.display = 'block'
    pastactsubmit.style.display = 'none'
};

futurebtn.onclick = function(){
    futurebtn.style.display = 'none';
    futureform.style.display = 'flex';
    futuresubmit.style.display = 'block'
    futureactsubmit.style.display = 'none'
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
    console.log(pastdate);

    let pastact = document.getElementById('past-act');
    pastact = pastact.value;
    console.log(pastact);

    let time = document.getElementById('time');
    time = time.value;
    console.log(time);

    let units = document.getElementById('units');
    units = units.value;
    console.log(units);

    if (pastdate === '' || pastdate == null || pastact === '' || pastact == null || time === '' || time == null || units === '' || units == null) {
        window.alert('Invalid Post Activity. Please fill in the entire form.')
        return;
    }

    pastactsubmit.textContent = `Got it! ${pastact} for ${time} ${units}. Keep it up!`;

    pastform.style.display = 'none';
    pastsubmit.style.display = 'none';
    pastactsubmit.style.display = 'block';
    pastbtn.style.display = 'block';
    pastform.reset();
}

futuresubmit.onclick = function(){
    futureform.style.display = 'none';
    futuresubmit.style.display = 'none';
    futureactsubmit.textContent = "hello!\n";
    futureactsubmit.style.display = 'block';
    futurebtn.style.display = 'block';
}


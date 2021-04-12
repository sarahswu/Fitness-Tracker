let pastbtn = document.getElementById('past-btn');
let pastform = document.getElementById('past-form');

pastbtn.onclick = function(){
    pastbtn.style.display = 'none';
    pastform.style.display = 'block';
};

let futurebtn = document.getElementById('future-btn');
let futureform = document.getElementById('future-form');

futurebtn.onclick = function(){
    futurebtn.style.display = 'none';
    futureform.style.display = 'block';
};

let pastsubmit = document.getElementById('past-submit');
let futuresubmit = document.getElementById('future-submit');

pastsubmit.onclick = function(){
    pastform.style.display = 'none';
    pastsubmit.style.display = 'none';
    let pastactsubmit = document.getElementById('past-act-submit');
    pastactsubmit.textContent = "hello!";
    pastactsubmit.style.display = 'block';
    pastbtn.style.display = 'block';
}


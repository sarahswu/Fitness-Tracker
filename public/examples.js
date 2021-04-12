let pastbtn = document.getElementById('past-btn');
let pastform = document.getElementById('past-form');
let pastactsubmit = document.getElementById('past-act-submit');

let futurebtn = document.getElementById('future-btn');
let futureform = document.getElementById('future-form');
let pastsubmit = document.getElementById('past-submit');
let futuresubmit = document.getElementById('future-submit');

pastbtn.onclick = function(){
    pastbtn.style.display = 'none';
    pastform.style.display = 'flex';
    pastsubmit.style.display = 'block'
    pastactsubmit.style.display = 'none'
};

futurebtn.onclick = function(){
    futurebtn.style.display = 'none';
    futureform.style.display = 'block';
};

pastsubmit.onclick = function(){
    pastform.style.display = 'none';
    pastsubmit.style.display = 'none';
    pastactsubmit.textContent = "hello!\n";
    pastactsubmit.style.display = 'block';
    pastbtn.style.display = 'block';
}


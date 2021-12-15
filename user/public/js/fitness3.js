const name = document.getElementById('name');


fetchName();

function fetchName() {
  fetch('/name')
  .then (function(response) {
    return response.json();
  })
  .then (function(data) {
    console.log('result: ', data);
    name.textContent = data[0].name;
  })
  .catch(function(error) {
    console.error('There has been a problem with your fetch operation:', error);
  });
}

// Start of the script section
let api = "https://script.google.com/macros/s/AKfycbyzN-fBN-x0918rgirP1nVr5Tk0NPDCAWeBmzW0jNzjDOnZr3W3FAyeYw1n_4354Wd7dQ/exec";
// Set the API URL as a variable
let form = document.querySelector("form");
// Find the form element and set it as a variable
let add = document.querySelector(".add");
// Find the element with the "add" class and set it as a variable
let update = document.querySelector(".update");
// Find the element with the "update" class and set it as a variable

let uid= null;

// Find the table body element and set it as a variable
function createData(uniqueId) {
  // Change the text content of the add button to indicate that data is being added
  add.textContent = "Adding.."
  // Create an object with the todo value obtained from the form
  let obj = {
    data: uniqueId
  }
  // Use fetch to make a POST request to the API endpoint with the JSON stringified obj as the request body
  fetch(api, {
    method: "POST",
    body: JSON.stringify(obj)
  })
    // Parse the response text from the server and call readData() function to update the UI with the new data
    .then(res => res.text())
    .then(data => {
      $('#user-no').text(parseInt(data) - 1);
      // readData()
      // Show an console.log with the response message from the server
      console.log(parseInt(data) - 1)
    });
}

function readData(uniqueId) {
  $("#qr-scan-error").hide();
  if (uniqueId) {
    // Use fetch to make a GET request to the API endpoint and parse the JSON response
    fetch(api)
      .then(res => res.json())
      .then(data => {
        // Extract the todo data from the response
        showInUI(data.data, uniqueId);
      })
  }
}

function showInUI(data, uniqueId) {
  let userfound = false;
        
  for (let each of data) {
    if (parseInt(uniqueId) === each[1]) {

    const html = `
    <div class="game-container"> 
      <div class="title">Tech Wizz</div>
      <button class="edit  ${each[2] === "P" ? 'success' : ''}" onclick="updateData(${each[0]}, ${each[1]}, 3, 'P')">P</button>    
      <button class="edit  ${each[2] === "F" ? 'fail' : ''}" onclick="updateData(${each[0]}, ${each[1]}, 3, 'F')">F</button> 
    </div>
    <div  class="game-container">  
      <div class="title">Match N Time</div>
      <button class="edit  ${each[3] === "P" ? 'success' : ''}" onclick="updateData(${each[0]}, ${each[1]}, 4, 'P')">P</button>    
      <button class="edit  ${each[3] === "F" ? 'fail' : ''}" onclick="updateData(${each[0]}, ${each[1]}, 4, 'F')">F</button>    
    </div>
    <div  class="game-container">
      <div class="title">Brain Teaser</div>
      <button class="edit ${each[4] === "P" ? 'success' : ''}" onclick="updateData(${each[0]}, ${each[1]}, 5, 'P')">P</button>    
      <button class="edit ${each[4] === "F" ? 'fail' : ''}" onclick="updateData(${each[0]}, ${each[1]}, 5, 'F')">F</button>          
    </div>
    <div  class="game-container">
      <div class="title">Cups N Balls</div>
      <button class="edit  ${each[5] === "P" ? 'success' : ''}" onclick="updateData(${each[0]}, ${each[1]}, 6, 'P')">P</button>    
      <button class="edit  ${each[5] === "F" ? 'fail' : ''}" onclick="updateData(${each[0]}, ${each[1]}, 6, 'F')">F</button>    
    </div>
    `;

    
      // <div class="delete"onclick="delData(${each[0]}, ${each[1]})">Delete</div>
      $("#games-list").html(html)
      $('#show-all-data').show();
      $("#update").show();
      userfound = true;
      break;
    }
  }
  if(!userfound) {
    $("#update").show();
    $("#qr-scan-error").show();
  }
}
function delData(id, uid) {
  // Use fetch to make a GET request to the API endpoint to delete the todo item with the given id
  fetch(api + `?del=true&id=${id}&uid=${uid}`)
    .then(res => res.text())
    .then(data => {
      // Update the UI by calling readData() function and show an console.log with the response message from the server
      readData(uid)
      console.log(data)
    })
}

function updateData(id, uid, col, val) {
  // send a fetch request to update the todo data
  fetch(api + `?update=true&id=${id}&uid=${uid}&col=${col}&data=${val}`)
    .then(res => res.json())
    .then(data => {
      // read the updated data
      console.log(data.data)
      showInUI(data.data, uid)
    })
}
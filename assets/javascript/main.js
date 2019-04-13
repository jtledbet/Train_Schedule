// Initialize Firebase
var config = {
  apiKey: "AIzaSyB9ZSgQbqxtm7oX_A0-L46kwiPqf43bAZ4",
  authDomain: "train-scheduler-01.firebaseapp.com",
  databaseURL: "https://train-scheduler-01.firebaseio.com",
  projectId: "train-scheduler-01",
  storageBucket: "train-scheduler-01.appspot.com",
  messagingSenderId: "523255753153"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();
var trainName = "";
var trainDest = "";
var trainFirst = "";
var trainFreq = "";
var minsAway = "";

window.onload = function () {
  event.preventDefault();
};

// Submit button:
$("#submitButton").on("click", function (event) {
  // Don't refresh the page!
  event.preventDefault();

  // Get inputs
  trainName = $("#train-name").val().trim();
  trainDest = $("#train-destination").val().trim();
  trainFirst = $("#train-first").val().trim();
  trainFreq = $("#train-frequency").val().trim();

  var newTrain = {
    "name": trainName,
    "dest": trainDest,
    "first": trainFirst,
    "freq": trainFreq
  }
  
  console.log("newTrain: " + newTrain)

  // Change what is saved in firebase
  database.ref().push({
    name: trainName,
    destination: trainDest,
    first: trainFirst,
    frequency: trainFreq
  });
});

database.ref().on("child_added", function (snapshot) {

      // Print the initial data to the console.
    var sv = snapshot.val();
    console.log(snapshot.val());

    // Log the value of the various properties
    console.log(sv.name);
    console.log(sv.destination);
    console.log(sv.first);
    console.log(sv.frequency);

    var newTrain = {
      "name": sv.name,
      "dest": sv.destination,
      "first": sv.first,
      "freq": sv.frequency,
    }

    createNewTrain(newTrain)

   // Error handling:
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

function createNewTrain(train) {

  
      // First arrival time
      var trainFirstConverted = moment(train.first, "HH:mm").subtract(1, "years");
      console.log(trainFirstConverted);
  
      // Current Time
      var currentTime = moment();
      console.log("Current time: " + moment(currentTime).format("hh:mm"));
  
      // Difference between the times
      var diffTime = moment().diff(moment(trainFirstConverted), "minutes");
      console.log("Difference in time:" + diffTime);
  
      // Time apart (remainder)
      var timeApart = diffTime % train.freq;
      console.log("Time apart: " + timeApart);
  
      // Minutes Until Train
      var minsAway = train.freq - timeApart;
      console.log("Minutes 'til train: " + minsAway);
  
      // Next Train
      var nextTrain = moment().add(minsAway, "minutes");
      console.log("Arrival: " + moment(nextTrain).format("hh:mm"));

  const newRow = $("<tr>");
  const newName = $("<th>" + train.name + "</th>");
  const newDest = $("<td>" + train.dest + "</td>");
  const newFirst = $("<td>" + train.first + "</td>");
  const newFreq = $("<td>" + train.freq + "</td>");
  const newMinsAway = $("<td>" + minsAway + "</td></tr>");
  
  newRow.append(newName)
  newRow.append(newDest)
  newRow.append(newFirst)
  newRow.append(newFreq)
  newRow.append(newMinsAway)
  $("#timeTable").append(newRow)
}
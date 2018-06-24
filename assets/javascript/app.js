//Masking for 24 hour time inout field
$(function(){
    $('input[id$="endTime"]').inputmask(
      "hh:mm", {
      placeholder: "HH:MM:SS", 
      insertMode: false, 
      showMaskOnHover: false,
    }
    );
});



// Initialize Firebase
var config = {
    apiKey: "AIzaSyDD0dREa_7ZdcKj875p5Z8G_lpkDDzOf5I",
    authDomain: "train-time-5f9ac.firebaseapp.com",
    databaseURL: "https://train-time-5f9ac.firebaseio.com",
    projectId: "train-time-5f9ac",
    storageBucket: "train-time-5f9ac.appspot.com",
    messagingSenderId: "540530607970"
};

firebase.initializeApp(config);

//Set database equal to the firebase database 
var database = firebase.database();

//Declare Variables to be used
var trainName = "";
var trainDestination = "";
var firstArrival = "";
var frequency = "";

//Click Event For adding a new train
$("#add-train").on("click", function(event) {
    event.preventDefault();
    //Set the variables equal to the inputs
    trainName = $("#train-input").val().trim();
    trainDestination = $("#destination-input").val().trim();
    firstArrival = $("#endTime").val().trim();
    frequency = $("#frequency-input").val().trim();

    //Creates local "temporary" object for holding train data
    var newTrainAdd = {
	    trainName: trainName,
        trainDestination: trainDestination,
        firstArrival: firstArrival,
        frequency: frequency
    };

    //Pushes our local temporary object into the databse
    database.ref().push(newTrainAdd);

    //Clears all of the input fields
    $("#train-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");

});

//Creates a Firebase event for adding a new train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());
  //sets vairable equal to values from database
  trainName = childSnapshot.val().trainName;
  trainDestination = childSnapshot.val().trainDestination
  firstArrival = childSnapshot.val().firstArrival;
  frequency = childSnapshot.val().frequency;

  //Declares a variable for the time of arrival and formats using moment
  var firstArrivalMoment = moment(firstArrival, "HH:mm");
  //Declares a variable and sets it equal to the current time custing moment
  var currenttime = moment();
  //Declares a variable and sets it equal to the difference in time between current time and the time of first arrival
  var minuteArrival = currenttime.diff(firstArrivalMoment, 'minutes');
  //Declares a variable and sets equl to the remainder of the difference in time diveded by how often the train arrives
  var minuteLast = minuteArrival % frequency;
  //Declares a variable equal to the minutes remaining until the next arrival
  var awayTrain = frequency - minuteLast;
  //Declares a variable and sets equal to the current time + the minutes until the next arrival
  var nextArrival = currenttime.add(awayTrain, 'minutes');
  //Formats the the time until the next arrival 
  var arrivaltime = nextArrival.format("hh:mm A");

//Appends all the data to HTML
$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + frequency + "</td><td>" + arrivaltime + "</td><td>" + awayTrain + "</td>");
});




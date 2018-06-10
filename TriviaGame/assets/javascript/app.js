// Global variables
var intervalId;
var clockRunning = false;

// Start game object
var game = {

    //game object variables
    correct: 0,
    incorrect: 0,
    outoftime: 0,
    currentQuestion: 0,
    nextQuestion: 0,
    currentAnswer: "",
    userAnswr: "",
    questionTimer: 20,
    answerTimer: 15,

    slidearr: [
        // Array Config:  Question string, Answer 1 string, Answer 2 string, Answer 3 string, Answwer 4 string, correct answer index number, gif link
        ["What is Kyudo?", "A book by Stephen King", "The way of the bow", "Greek for praise", "A Japanese sports festival", 2, "assets/images/kyudo0.gif"],
        ["What are the three supreme goals of Kyudo?", "Discipline, A Warrior Spirit, Health", "Cleanliness, Respect, Service", "Truth, Goodness, Beauty", "Zen, Maintenance, Readiness", 3, "https://j.gifs.com/L8pZBA.gif"],
        ["What is yugake?", "A shooting glove", "Kyudo uniform", "Archery target", "The eight steps for correct shooting", 1, "assets/images/kyudo2.gif"],
        ["What is the Japanese term for a bow?", "Kyu", "Kikyo", "Yomi", "Yumi", 4, "https://j.gifs.com/rRG2V4.gif"],
        ["What is the Japanese term for an arrow?", "Dozo", "Nigiri", "Ya", "Itatsuki 4", 3, "assets/images/kyudo4.gif"],
        ["What is tsurune?", "The swell of pride upon hitting the target", "The process for nocking an arrow", "The top of the bow which connects the string", "The sound made by the bowstring on release", 4, "https://j.gifs.com/2vp8D1.gif"],
        ["What should the bow do after the arrow is released?", "The bow should remain firm and unmoving in the left hand", "The bow should spin naturaly in the left hand", "The bow should angle to the floor at a 45 degree angle", "The bow should move slightly upwards to give the arrow greater range", 2, "assets/images/kyudo6.gif"],
        ["To achieve maximum force on releasing the arrow you should", "Use the longest, curviest bow you can hold", "Pull the string back as far as your strength allows", "Equally push the bow and pull the string along a straight line", "Use a carbon fiber bow", 3, "assets/images/kyudo7.gif"],
        ["The term Hikiwaki refers to the...", "Ceremonial process for approaching the target", "Beauty of shooting", "Truth in the arrow finding its target", "Drawing apart the bow", 4, "assets/images/kyudo8.gif"],
        ["How many arrows are held on the first shot?", "Two", "Always one", "None, the first shot is practice", "Three", 1, "assets/images/kyudo9.gif"],
        ["Select the correct order of the Hassetsu", "Ashibumi, Dozukuri, Yugamae, Uchiokoshi, Hikiwake, Kai, Hanare, Zanshin", "Ashibumi, Dozukuri, Uchiokoshi, Yugamae, Hikiwake, Kai, Hanare, Zanshin", "Dozukuri, Uchiokoshi, Yugamae, Kai, Hikiwake, Ashibumi, Zanshin, Hanare", "Hikiwake, Ashibumi, Dozukuri, Uchiokoshi, Yugamae, Kai, Hanare, Zanshin", 1, "assets/images/kyudo10.gif"],
        ["Yabusame refers to which type of Kyudo?", "Ceremonial", "Combat", "Demonstration", "Mounted", 4, "assets/images/kyudo11.gif"],
        ["Which of the following is NOT a piece of Kyudogi?", "Tabi", "Hakama", "Hana", "Yugake", 3, "assets/images/kyudo12.gif"],
        ["Kyudoka aim the arrow by...", "Adjusting the angle of the left arm", "They don't aim the arrow, they focus on the Hassetsu", "Adjusting the angle of the right arm", "Adjusting both arms", 2, "assets/images/kyudo13.gif"],
        ["The Japanese term for the target is", "Mato", "Buru", "Taiyo", "Doro", 1, "https://j.gifs.com/rRG2B4.gif"],
    ],

newQuestion: function () {
    // Hide previous answer id's and classes
    game.currentQuestion =  game.nextQuestion;
    var questionIndex = game.currentQuestion;
    game.nextQuestion = questionIndex +1;
    $("#results").css("display", "none");
    $("#gifanswer").html("");
    $(".answers").css("display", "inline-block");
    $("label").css("display", "inline-block");
    $("#nextButton").css("display", "none");
    $("#questionAndResponse").text(game.slidearr[questionIndex][0]);

// Grab current Question in slidearr and insert question and answers into buttonBox
    for (i = 1; i < game.slidearr.length - 1; i++) {
        var nextAnswer = "#label" + i;
        $(nextAnswer).text(game.slidearr[questionIndex][i]);
    }

// update global variables currentQuestion and current Answer
    game.currentAnswer = game.slidearr[questionIndex][5];
    answerClock.clockType = "Question";
    answerClock.start(game.questionTimer);
},

showAnswer: function () {
    var userAnswer = game.userAnswr;
    //console.log ("user " + userAnswer + " current " + game.currentAnswer);
    if (userAnswer == game.currentAnswer) {
        game.correct ++;
        //console.log("correct");
        $("#questionAndResponse").text("Correct!");
    } else if (userAnswer == "") {
        game.outoftime ++;
        //console.log("out of time");
        $("#questionAndResponse").text("Out of Time!");
    } else {
        game.incorrect ++;
        //console.log("incorrect");
        $("#questionAndResponse").text("Incorrect!");
    }
    $("#correctAnswer").text("Correct Answer: " + game.slidearr[game.currentQuestion][game.currentAnswer]);
    $("#results").css("display", "inline-block");
    game.userAnswr = "";

// then clear id buttonBox of question and display answers for 10 seconds
    $('input[name=quizAnswer]').prop('checked', false);
    $(".answers").css("display", "inline-block");
    $(".answers").css("display", "none");
    $("#submitButton").css("display", "none");
    $("#gifAnswer").attr("src", game.slidearr[game.currentQuestion][6]);
    $("#gifAnswer").css("display", "inline-block");
    answerClock.clockType = "Answer";
    $("#timerText").text("Next question in " + game.answerTimer + " seconds");
    answerClock.start(game.answerTimer);
},

showResults: function () {

    var updateResults = $("#results");
    var correctPara = $("<p class ='newResults'>");
    var incorrectPara = $("<p class ='newResults'>");
    var outOfTimePara = $("<p class ='newResults'>");

    // clear question id and classes
    $("#timerText").css("display", "none");
    $("#questionAndResponse").css("display", "none");
    $("#correctAnswer").css("display", "none");
    $("#gifAnswer").css("display", "none");
    $("#learnMore").css("display", "block");

    // show results in article results id
    correctPara.text("Questions correct: " + game.correct);
    incorrectPara.text("Questions incorrect: " + game.incorrect);
    outOfTimePara.text("Questions not answered: " + game.outoftime);
    $(updateResults).css("display", "block");
    $(updateResults).append(correctPara);
    $(updateResults).append(incorrectPara);
    $(updateResults).append(outOfTimePara);

    // show startButton and change value attribute to "Try again?"
    $(".startButton").css("display", "inline-block").attr("value","Try again?");
},

}; 
// End of game object

// Start timer object
var answerClock = {

    // timer object variables
    time: "",
    clockType: "",

    start: function (newTime) {
        if (!clockRunning) {
            answerClock.time = newTime;
            intervalId = setInterval(answerClock.count, 1000);
            clockRunning = true;
            if (answerClock.clockType === "Answer") { 
                $("#timerText").text("Next question in " + newTime + " seconds");
            } else if (answerClock.clockType === "Question") {
                $("#timerText").text("There are " + newTime + " seconds left!");
            }
          }
    },

    stop: function() {
        clearInterval(intervalId);
        clockRunning= false;
        $("#timerText").text("");

        if (answerClock.clockType === "Answer") { 
            if (game.currentQuestion < game.slidearr.length-1) {
                game.newQuestion();
            } else {
                game.showResults();
            }
        } else if (answerClock.clockType === "Question") {
            game.showAnswer();
        }
      }, 

    count: function() {
        answerClock.time--;
        var startString;
        var endString;
        var currentTime = answerClock.time;

        if (answerClock.clockType == "Answer") {
            startString = "Next question in "
            if (currentTime > 1) {
                endString = " seconds!";
            } else if (currentTime == 1) {
                endString = " second!";
            } else {
                startString = "There are "
                currentTime = game.questionTimer;
                endString = " seconds left!";
                answerClock.stop();
            }
        } else if (answerClock.clockType == "Question") {         
            if (currentTime > 1) {
                startString = "There are "
                endString = " seconds left!";
            } else if (currentTime == 1) {
                startString = "There is "
                endString = " second left!";
            } else {
                startString = "There is "
                currentTime = "no";
                endString = " time left!";
                answerClock.stop();
            }
        }      
        $("#timerText").text(startString + currentTime + endString);
    },
};
// End timer object

$(document).ready(function() {

    //On startButton click
    $(".startButton").click(function() {
        game.correct = 0;
        game.incorrect = 0;
        game.outoftime = 0;
        game.currentQuestion = 0;
        game.nextQuestion = 0;
        game.currentAnswer = "";
        game.newQuestion();
        $("#bottomBanner").css("display", "none");
        $("#startMessage").css("display", "none");
        $(".startButton").css("display", "none");
        $("#timerText").css("display", "inline-block");
        $(".newResults").text("");
        $("#questionAndResponse").css("display", "block");
        $("#correctAnswer").css("display", "inline-block");
    });

    // Display submit button after a radio button is clicked
    $(".answers").click(function() {
        $("#submitButton").css("display", "inline-block");
    });

    // On submitButton click, grab the select radio value and pass it to showAnswer function
    $("#submitButton").click(function() {
        $("#submitButton").css("display", "none");
        game.userAnswr = $('input[name=quizAnswer]:checked').val();
        answerClock.stop();
    });
});
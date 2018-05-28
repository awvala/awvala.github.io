$(document).ready(function() {
// global variables
var unguessedWordLibrary = ["yggdrasil", 
    "valkyrie", 
    "baldr", 
    "freyr", 
    "mimir", 
    "odin", 
    "aesir", 
    "vanir", 
    "alfheim", 
    "midgard", 
    "asgard", 
    "jotunheim", 
    "muspelheim", 
    "svartalfheim", 
    "niflheim", 
    "vanaheim", 
    "helheim", 
    "brock",
    "sindri",
    "frigg",
    "heimdall",
    "tyrr",
    "idun",
    "bragi",
    "vili",
    "jormungand",
    "fenrir"];
var unguessedLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var wins = 0;
var losses = 0;
const maxAttempts = 9;
var resetGame = true;
var newGame = true;

var word = {
    name: "",
    guessedLetters: [],
    guessedLettersCorrect: 0,
    attempts: 0,
    currentWordIndex: "",
    answerLength: "",
    placeholderLetters: [],
    answerLetters: "",
    attemptsColor: [["white","100s"],["#ffd5d5","80s"],["#ffaaa","70s"],["#ff8080","60s"],["#ff555","50s"],["#ff2a2a","40s"],["#ff0000","30s"],["#d40000","20s"],["#800000","10s"],["#800000","10s"],["#800000","10s"]],
    winSound: function () {
        var audioWin = document.getElementById('winAudio');
        winAudio.play();
    },
    lossSound: function () {
        var audioWin = document.getElementById('lossAudio');
        lossAudio.play();
    },
}

// keyup event

$(document).keyup(function(event) {
    var userGuess = event.key;
    var spacedLetter = ((event.key.toLowerCase()) + " ");
    
        if (resetGame === true) {
            initialize();
        } else {
          //Is this a valid key?
            if (event.keyCode >= 65 && event.keyCode <= 90) {
                //check to see if the letter has already been guessed
                var letterExist = word.guessedLetters.includes(userGuess);
                //alert(letterExist);
                if (letterExist === true) {
                    alert("You already guessed " + event.key);
                } else {
                    makeGuess(event.key.toLowerCase());
                }
            }
        }
    });

// game functions

function initialize() {
    //reset game board variables
    $("#newgame").css("display","none");
    $("#gamecontainer").css("display","block");
    word.guessedLetters = [];
    word.guessedLettersCorrect = 0;
    word.placeholderLetters= [];
    word.attempts = 0;
    word.answerLetters = [];
    var newWordIndex = Math.floor(Math.random() * unguessedWordLibrary.length);
    var newWord = unguessedWordLibrary[newWordIndex];
    word.name = newWord;
    word.currentWordIndex = newWordIndex;
    word.answerLength = newWord.length;

    var main = $("body");
    var LttrP = main.find("#guessedLetters");

    //create guessed letters divs
    if (newGame === true) {
    for (i= 0; i < unguessedLetters.length; i++) {
        var letterP = $("<p>");
        var lowerLetter = unguessedLetters[i].toLowerCase();
        letterP.addClass("unguessedLetter");
        letterP.attr("data-letter", lowerLetter);
        letterP.text(lowerLetter);
        LttrP.append(letterP);
    }
    } else {
        //clear blue formatting of previously guessed letters
        for (j= 0; j < unguessedLetters.length; j++) {
            $("p").removeClass("guessedLetter");
        }
    }
    //reset attempts
    $("#attempts").html(word.attempts).css("color","white");
    $("#rotateImg").css("animation-duration","100s");

    //create placeholder _'s with a space
    for (j = 0; j < newWord.length; j++) {
        word.answerLetters.push(newWord[j]);
        word.placeholderLetters[j] = "_ ";
        $("#answerbox").html(word.placeholderLetters);
    }
    
    //Check if a brand new game and autoplay sound at 30%
    if (newGame === true) {
        var bgMusic = document.getElementById('backgroundmusic');
        bgMusic.play();
        bgMusic.volume = 0.3;
        newGame = false;
    }
    resetGame = false;
    console.log(word)
};

// Update gameboard with succesful keystroke
function makeGuess (keyGuess) {
    var letterSelector = 'p[data-letter="'+keyGuess+'"]';
    var newAttempts = $("#attempts");
    var currentCorrect = word.guessedLettersCorrect;
    var newCorrect = 0;

    //Check if the current word contains the keystroke
        for (i = 0; i < word.answerLength; i++) {
            if (word.answerLetters[i] === keyGuess) {
                word.placeholderLetters[i] = (keyGuess + " ");        
                $("#answerbox").html(word.placeholderLetters);
                word.guessedLettersCorrect++;
                newCorrect++;
            } else if (word.answerLetters[i] !== keyGuess) {
                $("#answerbox").html(word.placeholderLetters);
            }
        }
        word.guessedLetters.push(keyGuess);
        $(letterSelector).addClass("guessedLetter");

        //Determine if keypress is a correct guess
        if (newCorrect > 0 ) {
            word.guessedLettersCorrect = currentCorrect + newCorrect;
            //Win condition and reset gameboard
            if (word.guessedLettersCorrect === word.answerLength) {
                wins++;
                $("#win").html(wins);
                word.winSound();
                resetGame = true;
                alert("You win! You guessed " + word.name + "!");
                initialize();
            }
        } else { 
            word.attempts++;
            newAttempts.text(word.attempts);
            var newColor = word.attemptsColor[word.attempts][0];
            var newSpeed = word.attemptsColor[word.attempts][1];
            newAttempts.css("color", newColor);
            $("#rotateImg").css("animation-duration",newSpeed);

            // if attemps is greater than max allowed guesses reset gameboard
            if (word.attempts > maxAttempts) {
                losses++;
                $("#loss").html(losses);
                word.lossSound();
                resetGame = true;
                initialize();
            }
        }
    };
});
 // Initialize Firebase
var config = {
  apiKey: "AIzaSyCKkIO5_I2-GwJ3-4w9UH4Jsvi5jGFq9-0",
  authDomain: "rps-go.firebaseapp.com",
  databaseURL: "https://rps-go.firebaseio.com",
  projectId: "rps-go",
  storageBucket: "rps-go.appspot.com",
  messagingSenderId: "872766657792"
};
firebase.initializeApp(config);

var database = firebase.database();

// Initially hide the gamePad
$("#gamePad").addClass("hidden");
 
 //Current Player object
 var playerOne = {
    name: "",
    wins: 0,
    losses: 0,
    choice: "",
    result:"",
 }

 // Oppent Player object
 var playerTwo = {
    name: "",
    wins: 0,
    losses: 0,
    choice: "",
    result:"",
}

// Global variables
var playerTurn = database.ref();
var currentTurn = 0;
var users = database.ref("/users");
var player1 = database.ref("/users/player1");
var player2 = database.ref("/users/player2");
var localPlayer1;
var localPlayer2;
var localP1Snapshot;
var localP2Snapshot;
var player;
var playerNum = 0;

// Update user related elements from Firebase
player1.on("value", function(snapshot) {
	if (snapshot.val() !== null) {
    localPlayer1 = snapshot.val().name;
    playerOne.name = snapshot.val().name;
		playerOne.wins = snapshot.val().wins;
    playerOne.losses = snapshot.val().losses;
    playerOne.choice = snapshot.val().choice;
    $("#player1Name").html(playerOne.name);
    //$("#player1Choice").text("?");
		$("#player1WinBox").html("<p>W: " + playerOne.wins + "/L: " + playerOne.losses + "</p>");
	} else {
    $("#gameMessage").html("Waiting for another player!");
    $("#player1Name").html("Waiting for new player");
    //$("#player1Choice").text("?");
    $("#player1WinBox").empty();
	};
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});

// Update user related elements from Firebase
player2.on("value", function(snapshot) {
	if (snapshot.val() !== null) {
    localPlayer2 = snapshot.val().name;
    playerTwo.name = snapshot.val().name;
		playerTwo.wins = snapshot.val().wins;
    playerTwo.losses = snapshot.val().losses;
    playerTwo.choice = snapshot.val().choice;
    $("#player2Name").text(playerTwo.name);
		$("#player2WinBox").html("<p>W: " + playerTwo.wins + "/L: " + playerTwo.losses + "</p>");
	} else {
    $("#gameMessage").html("Waiting for another player!");
    $("#player2Name").html("Waiting for new player");
    //$("#player2Choice").text("?");
		$("#player2WinBox").empty();
	};
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});


// Add newPlayer to Firebase on newPlayer click
  $("#newPlayer").on("click", function() {
    event.preventDefault();

    player = $("#inputName").val().trim();
	  player1.once("value", function(snapshot) {
      localP1Snapshot = snapshot;
	  }, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
    });
    
    player2.once("value", function(snapshot) {
      localP2Snapshot = snapshot;
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // If playerOne doesn't exist in firebase
    if (!localP1Snapshot.exists()) {
		playerNum = 1;
		player1.onDisconnect().remove();
		// sets a new player 1
		player1.set({
			name: player,
			wins: 0,
			losses: 0
    });
    $("#gamePad").removeClass("hidden");
    $("#player-one").removeClass("hidden");
    $("#player1Name").text(playerOne.name);
    $("#nameSection").addClass("hidden");
		// If there is no player 2 after play 1 joins
    if (!localP2Snapshot.exists()) {
      $("#gameMessage").html("Waiting for another player!");
    };

      // else if there is no player 2, create a player 2 in firebase
    } else if (!localP2Snapshot.exists()) {
		playerNum = 2;
		player2.onDisconnect().remove();
		player2.set({
			name: player,
			wins: 0,
			losses: 0
    });

		// Start Game
		playerTurn.update({
			turn: 1
    });
    $("#gamePad").removeClass("hidden");
    $("#player2Name").text(playerTwo.name);
    $("#player2Choice").text("?");
    $("#nameSection").addClass("hidden");
	// Allow only two local players
	  } else {
      $("#nameInputGroup").addClass("hidden");
      $("#playerGreeting").text("This room is full.  Please try again later.");
      $("#gameMessage").html("");
      $("#gamePad").removeClass("hidden");
	  };
  });

users.on("value", function(snapshot) {
	// If both players leave, everything is deleted from database to reset for next game
	if (snapshot.val() == null) {
    $("#nameSection").removeClass("hidden");
    $("#gamePad").addClass("hidden");
		playerTurn.set({});
	};
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});

// Display player turn
playerTurn.on("value", function(snapshot) {
	if (snapshot.val() !== null) {
    
    currentTurn = snapshot.val().turn;

		// Update player turn message
		if (snapshot.val().turn == 2 && playerNum == 1) {
      $("#gameMessage").text("Waiting for " + playerTwo.name + " to choose.");
      $(".weapon").prop("disabled", true);
      $("#weaponText").removeClass("turnIndicator");
		} else if (snapshot.val().turn == 1 && playerNum == 2) {
      $("#gameMessage").html("Waiting for " + playerOne.name + " to choose.");
      $(".weapon").prop("disabled", true);
      $("#weaponText").removeClass("turnIndicator");
    }
    
		// Show RPS buttons on Player 1's page on their turn
		if (snapshot.val().turn == 1 && playerNum == 1) {
      $("#gameMessage").text("It's your turn!");
      $("#player1Choice").text("?");
      $(".weapon").prop("disabled", false);
      $("#weaponText").addClass("turnIndicator");

		// Show RPS buttons on Player 2's page on their turn
		} else if (snapshot.val().turn == 2 && playerNum == 2) {
      $("#gameMessage").text("It's your turn!");
      //$("#player2Choice").text("?");
      $(".weapon").prop("disabled", false);
      $("#weaponText").addClass("turnIndicator");
			
		// After both turns, call rpsResults
		} else if (snapshot.val().turn === 3) {
      $("#gameMessage").text("Who won?");
      $(".weapon").prop("disabled", true);
			gameResults();
		};
	};
});

// Show Player choice while waiting
$("#weaponRow").on("click", "button", function() {
  var weapon = $(this).attr("data-weapon");
  if (currentTurn === 1) {
    var choice = "#player1Choice";
    var nextTurn = 2;
    currentPlayer = player1;
  } else {
    var choice = "#player2Choice";
    var nextTurn = 3;
    currentPlayer = player2;
  }
	$(choice).html("<i class='fas fa-hand-"+ weapon +" fa-2x' id='"+ weapon + "Icon'></i>");
	setTimeout(function() {
		playerTurn.update({
			turn: nextTurn
		});
		currentPlayer.update({
			choice: weapon
		}); 
	}, 500);
});

// Determine who won
var gameResults = function() {
player1.once("value", function(snapshot) {
  playerOne.result = snapshot;
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

player2.once("value", function(snapshot) {
  playerTwo.result = snapshot;
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

if (playerOne.result.val() !== null && playerTwo.result.val() !== null) {
  // If p1 and p2 selected the same button
  if (playerOne.result.val().choice == playerTwo.result.val().choice) {
    $("#player1Choice").html("<i class='fas fa-hand-"+ playerOne.result.val().choice +" fa-2x' id='"+ playerOne.result.val().choice + "Icon'></i>");
    $("#player2Choice").html("<i class='fas fa-hand-"+ playerTwo.result.val().choice +" fa-2x' id='"+ playerTwo.result.val().choice + "Icon'></i>");
    $("#gameMessage").html("Tie Game!");
  // Player one beats scissors with rock
  } else if (playerOne.result.val().choice == "rock" && playerTwo.result.val().choice == "scissors") {
    $("#player1Choice").html("<i class='fas fa-hand-"+ playerOne.result.val().choice +" fa-2x' id='"+ playerOne.result.val().choice + "Icon'></i>");
    $("#player2Choice").html("<i class='fas fa-hand-"+ playerTwo.result.val().choice +" fa-2x' id='"+ playerTwo.result.val().choice + "Icon'></i>");
    $("#gameMessage").text(playerOne.name + " wins!");
    playerOne.wins++;
    playerTwo.losses++;
  // Player two beats scissors with rock
  } else if (playerOne.result.val().choice == "rock" && playerTwo.result.val().choice == "paper") {
    $("#player1Choice").html("<i class='fas fa-hand-"+ playerOne.result.val().choice +" fa-2x' id='"+ playerOne.result.val().choice + "Icon'></i>");
    $("#player2Choice").html("<i class='fas fa-hand-"+ playerTwo.result.val().choice +" fa-2x' id='"+ playerTwo.result.val().choice + "Icon'></i>");
    $("#gameMessage").text(playerTwo.name + " wins!");
    playerTwo.wins++;
    playerOne.losses++;
  // Player two beats paper with scissors
  } else if (playerOne.result.val().choice == "paper" && playerTwo.result.val().choice == "scissors") {
    $("#player1Choice").html("<i class='fas fa-hand-"+ playerOne.result.val().choice +" fa-2x' id='"+ playerOne.result.val().choice + "Icon'></i>");
    $("#player2Choice").html("<i class='fas fa-hand-"+ playerTwo.result.val().choice +" fa-2x' id='"+ playerTwo.result.val().choice + "Icon'></i>");
    $("#gameMessage").text(playerTwo.name + " wins!");
    playerTwo.wins++;
    playerOne.losses++;
  // Player one beats paper with rock
  } else if (playerOne.result.val().choice == "paper" && playerTwo.result.val().choice == "rock") {
    $("#player1Choice").html("<i class='fas fa-hand-"+ playerOne.result.val().choice +" fa-2x' id='"+ playerOne.result.val().choice + "Icon'></i>");
    $("#player2Choice").html("<i class='fas fa-hand-"+ playerTwo.result.val().choice +" fa-2x' id='"+ playerTwo.result.val().choice + "Icon'></i>");
    $("#gameMessage").text(playerOne.name + " wins!");
    playerOne.wins++;
    playerTwo.losses++;
  // Player one beats paper with scissors
  } else if (playerOne.result.val().choice == "scissors" && playerTwo.result.val().choice == "paper") {
    $("#player1Choice").html("<i class='fas fa-hand-"+ playerOne.result.val().choice +" fa-2x' id='"+ playerOne.result.val().choice + "Icon'></i>");
    $("#player2Choice").html("<i class='fas fa-hand-"+ playerTwo.result.val().choice +" fa-2x' id='"+ playerTwo.result.val().choice + "Icon'></i>");
    $("#gameMessage").text(playerOne.name + " wins!");
    playerOne.wins++;
    playerTwo.losses++;
  // Player two beats scissors with rock
  } else if (playerOne.result.val().choice == "scissors" && playerTwo.result.val().choice == "rock") {
    $("#player1Choice").html("<i class='fas fa-hand-"+ playerOne.result.val().choice +" fa-2x' id='"+ playerOne.result.val().choice + "Icon'></i>");
    $("#player2Choice").html("<i class='fas fa-hand-"+ playerTwo.result.val().choice +" fa-2x' id='"+ playerTwo.result.val().choice + "Icon'></i>");
    $("#gameMessage").text(playerTwo.name + " wins!");
    playerTwo.wins++;
    playerOne.losses++;
  };

  // Reset the game
  setTimeout(function() {
    playerTurn.update({
      turn: 1
    });
    player1.once("value", function(snapshot) {
      playerOne.result = snapshot;
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    if (playerOne.result.val() !== null) {
      player1.update({
        wins: playerOne.wins,
        losses: playerOne.losses,
        choice: null,
      });
    };

    player2.once("value", function(snapshot) {
      playerTwo.result = snapshot;
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    if (playerTwo.result.val() !== null) {
      player2.update({
        wins: playerTwo.wins,
        losses: playerTwo.losses,
        choice: null,
      });
    };

    $("#player1Choice").text("?");
    $("#player2Choice").text("?");
    }, 3000);
};
};
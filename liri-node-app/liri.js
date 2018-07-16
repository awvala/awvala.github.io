// Require the following NPM modules
require("dotenv").config();
const keys = require("./keys.js");
const inquirer = require('inquirer');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs-extra')
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

// Global Variables
var command = process.argv;
var liriCommand = command[2];
var liriArgument = command[3];
var spacer = "\n==============";

// Node functions
function getTweets() {
    var Tparams = {
        screen_name: 'LiriTest7181',
        count: 20,
    }

    // Twitter requests
    client.get('statuses/user_timeline', Tparams , function (err, tweet, result) {
        if (err) {
            console.log(err);
        } else {
            for (var i = 0; i <tweet.length; i ++) {
                var tweetData = ("\n" + "Created: " + tweet[i].created_at + "\n" + "Brilliant Observation:  " + tweet[i].text + "\n" + spacer);
                console.log(tweetData);
                appendLog(tweetData);
            }
        }
    });
}

// Spotify requests
function getMusic(songRequest) {
    spotify.search({type: 'track', query: songRequest}, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            var spotifyData = data.tracks.items;
            for (var i = 0; i < spotifyData.length; i ++) {
                var musicData = (spacer + "\nArtist: " + spotifyData[i].artists[0].name + "\nSong: " + spotifyData[i].name + "\nPreview URL: " + spotifyData[i].preview_url + "\nAlbum: " + spotifyData[i].album.name + spacer);
                console.log(musicData);
                appendLog(musicData);
            }
        }  
    })
};

// OMDB requests
function getMovie() {
    var movieTitle = process.argv[3];
    if (!movieTitle) {
        movieTitle = "Firefly";
        appendLog(movieTitle);
    }

    // Removing spaces of movie/tv Show search to return correctly formatted requests for API call
    movieTitle = movieTitle.split(' ').join('+');
    var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieTitle + "&y=&plot=short&tomatoes=true&r=json";
    request(queryURL, function(error, response, body) {
        if (error) {
            return console.log('Error occurred: ' + error);
        } else {
            var movieData = JSON.parse(body);
            var mTitle = ("\nTitle:  " + movieData.Title);
            var mDirector = ("\nDirector:  " + movieData.Director);
            var mWriter = ("\nWriter:  " + movieData.Writer);
            var mYear = ("\nYear:  " + movieData.Year);
            var mPlot = ("\nPlot:  " + movieData.Plot);
            var mActors = ("\nActors:  " + movieData.Actors);
            var mIMDBRating = ("\nIMDB Rating:  " + movieData.imdbRating);
            var mTomatometer = ("\nTomatometer:  " + movieData.tomatoMeter);
            var mCountry = ("\nCountry of origin:  " + movieData.Country);
            var mLanguage = ("\nLanguage:  " + movieData.Language);
            var mData = ("\n" +spacer + mTitle + mDirector + mWriter + mYear + mPlot + mActors + mIMDBRating + mTomatometer + mCountry + mLanguage + spacer);
            console.log(mData);
            appendLog(mData);
        }
    })
};

// Random.text LIRI Command
function dothething() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        } else {
            var randArray = data.split(",");
            liriArgument = randArray[1];
            getMusic(liriArgument);
            appendLog(liriArgument);
        }
    })
};

// Append data to log.txt file
function appendLog (dataLog) {
    fs.appendFile("log.txt", dataLog, function (error) {
        if (error) {
            throw err;
            return console.log('Error occurred: ' + error)
        } 
      });
};

// Determine which function to run
switch (liriCommand) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        var songRequest = liriArgument;
        if (songRequest === undefined) {
            songRequest = "The Sign";
        }
        getMusic(songRequest);
        break;
    case "movie-this":
        getMovie();
        break;
    case "ju-lee":
        dothething();
        break;
};
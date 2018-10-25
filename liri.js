
// Read and set environment variables
require("dotenv").config();


var Spotify = require("node-spotify-api");

var keys = require("./keys");

var request = require("request");

var fs = require("fs");

var spotify = new Spotify(keys.spotify);

// FUNCTIONS
var readData = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    
    if (error) {
      return console.log(error);
  }
    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

var pick = function(caseData, functionData) {
  switch (caseData) {
  
    case "spotify-this-song":
    searchSpotify(functionData);
      break;
    case "movie-this":
    searchMovie(functionData);
      break;
    case "do-what-it-says":
      readData();
      break;
    default:
    console.log('Please enter a valid command.');
  }
};



// Writes to the log.txt file
var getArtistNames = function(artist) {
  return artist.name;
};

// Function for running a Spotify search
var searchSpotify = function(songName) {
  if (songName === undefined) {
    songName = "Time Bomb";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};


// Function for running a Movie Search
var searchMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Rotton Tomatoes Rating: " + jsonData.Ratings[1].Value);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      
    }
  });
};


var runAPP = function(argOne, argTwo) {
  pick(argOne, argTwo);
};


runAPP(process.argv[2], process.argv[3]);

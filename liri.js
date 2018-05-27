var keys = require('./keys.js');
var fs = require('fs');
var Twitter = require('twitter');
var client = new Twitter(keys.twitterKeys);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotifyKeys);
var request = require('request');
var x = process.argv[2];
var y = process.argv[3];

require('dotenv').config()

var getTweets = function(){
 
var params = {screen_name: 'boomer_hapley'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
	for (var i = 0; i < tweets.length; i++){
		console.log(tweets[i].created_at);
		console.log(" ");
		console.log(tweets[i].text);
	}
  }
});
}

var getMovie = function(movie){

request('http://www.omdbapi.com/?t='+ movie + '&y=&plot=short&r=json&apikey=8683b407', function (error, response, body) {
  if (!error && response.statusCode === 200){
	  var jsonData = JSON.parse(body);

	  console.log('Title: '+jsonData.Title);
	  console.log('Year: '+ jsonData.Year);
	  console.log('Rated: '+ jsonData.Rated);
	  console.log('Rotten Tomatoes rating: ' + jsonData.Ratings[1].Value);
	  console.log('IMDB Rating: '+ jsonData.imdbRating);
	  console.log('Country: '+ jsonData.Country);
	  console.log('Language: '+ jsonData.Language);
	  console.log('Plot: '+ jsonData.Plot);
	  console.log('Actors: '+ jsonData.Actors);
	  console.log('---------------------------------');
  }  
});
}

var getArtistNames = function(artist){
	return artist.name;
}
var getSpotify = function(song) {

spotify.search({ type: 'track', query: song }, function(err, data) {
    if ( err ) {
        console.log('Error happened: ' + err);
        return;
    }
 
	var songData = data.tracks.items;
	for (var i = 0; i < songData.length; i++){
		console.log(i);
		console.log('artist: ' + songData[i].artists.map(
			getArtistNames));
			console.log('song name: ' + songData[i].name);
			console.log('preview song: ' + songData[i].preview_url);
			console.log('album: ' + songData[i].album.name);
			console.log('----------------------------------------');
	}
});
}
var randomText = function(){
	fs.readFile("random.txt", "utf8", function(err, data) {

		if (err) throw err;

		var dataArr = data.split(',');

		var randomOne = dataArr[0];
		var randomTwo = dataArr[1];
		
		if (randomOne == "my-tweets"){
			getTweets();
		}
		else if (randomOne == "spotify-this-song"){
			getSpotify(randomTwo);
		}
		else if (randomOne == "movie-this"){
			getMovie(randomTwo);
		}
		else {
			console.log("Use the search terms 'my-tweets' 'spotify-this-song' or 'movie-this'");
		}

	});
}
if (x === "my-tweets"){
	getTweets();
}
else if (x==="spotify-this-song"){
	getSpotify(y);
}
else if (x === "movie-this"){
	getMovie(y);
}
else if (x === "do-what-it-says"){
	randomText();
}
else {
	console.log("Use the search terms 'my-tweets' 'spotify-this-song' or 'movie-this'");
}

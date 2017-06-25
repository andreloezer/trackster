var Trackster = {};
// const API_KEY = '86eb9d030d23409b7b148615386b8918';
var API_KEY = '86eb9d030d23409b7b148615386b8918';

$(document).ready(function() {
  $('.btn').click(function() {
    Trackster.searchTracksByTitle($('input').val());
  });
  document.onkeypress = function (e) {
    switch (e.code) {
      case "NumpadEnter":
      case "Enter":
        Trackster.searchTracksByTitle($('input').val());
        break;
      }
}});

/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks.
*/
Trackster.renderTracks = function(tracks) {
  $('#song-section').empty();
  for (var i = 0; i < tracks.length; i++) {
    var mediumAlbumArt = tracks[i].image[1]["#text"];
    console.log('Name: ' + tracks[i].name);
    console.log('Artist: ' + tracks[i].artist);
    console.log('Listeners: ' + tracks[i].listeners);
    console.log('URL: ' + tracks[i].url);
    console.log(mediumAlbumArt);
    console.log('**********************');


    var songRow =
      '<div class="row">' +
        '<ul class="container" id="song-info">' +
          '<li class="col-xs-1"><a target="_blank" href=' + tracks[i].url + '><i class="fa fa-play-circle-o fa-2x"></i></a></li>' +
          '<li class="col-xs-5">' + (i + 1) + '. ' + tracks[i].name + '</li>' +
          '<li class="col-xs-2">' + tracks[i].artist + '</li>' +
          '<li class="col-xs-2"><img src=' + mediumAlbumArt + ' /></li>' +
          '<li class="col-xs-2">' + tracks[i].listeners + '</li>' +
        '</ul>' +
      '</div>';

    $('#song-section').append(songRow);
  }
};

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title) {
  $.ajax({
    url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + title + "&api_key=" + API_KEY + "&format=json",
    success: function(response) {
      Trackster.renderTracks(response.results.trackmatches.track);
    }
  });
};

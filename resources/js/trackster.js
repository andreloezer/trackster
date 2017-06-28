// Variables

var Trackster = {}; // object for the methods
var responseTrack = {}; // stores the json
var API_KEY = '86eb9d030d23409b7b148615386b8918'; // personal key to access 'last.fm' API
var sortCount = { // keep track of sorting
  name: 1,
  artist: 1,
  listeners: 1
};

$(document).ready(function() {

  $('.btn').click(function() {
    Trackster.searchTracksByTitle($('input').val());
  });

  $('.track-header').click(function() {
    Trackster.searchTracksByTitle($('input').val(), 'name')
  })

  $('.artist-header').click(function() {
    Trackster.searchTracksByTitle($('input').val(), 'artist')
  })

  $('.album-art').click(function() {
    Trackster.searchTracksByTitle($('input').val(), 'artist')
  })

  $('.listeners-header').click(function() {
    Trackster.searchTracksByTitle($('input').val(), 'listeners')
  })

  $(document).keydown(function(e) {
    if (e.which == 13) {
      Trackster.searchTracksByTitle($('input').val());
    }
  });
});

/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks.
*/
Trackster.renderTracks = function(tracks) {
  $('#tracklist-section').empty();
  $('#tracklist-head').css('display', 'block');

  for (var i = 0; i < tracks.length; i++) {
    var mediumAlbumArt = tracks[i].image[1]["#text"];
    if (mediumAlbumArt.length > 2) { // album art received
      mediumAlbumArt = '<img src=' + mediumAlbumArt + ' />';
    } else { // album art is missing
      mediumAlbumArt = '';
    }

    var listenersNumber = numeral(tracks[i].listeners).format('0,0'); // format listeners numbers with commas every three decimal places from the left
    var trackList =
      '<div class="row">' +
        '<ul class="container" id="track-info">' +
          '<li class="col-xs-1"><a target="_blank" href=' + tracks[i].url + '><i class="fa fa-play-circle-o fa-2x"></i></a></li>' +
          '<li class="col-xs-5">' + (i + 1) + '. ' + tracks[i].name + '</li>' +
          '<li class="col-xs-2 artist">' + tracks[i].artist + '</li>' +
          '<li class="col-xs-2">' + mediumAlbumArt + '</li>' +
          '<li class="col-xs-2">' + listenersNumber + '</li>' +
        '</ul>' +
      '</div>';

    $('#tracklist-section').append(trackList); // append 'trackList' elements to the HTML
  }
};

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title, sort) {
  if (sort != undefined) { // call sorting
    Trackster.sortTracks(sort);
  } else if (title == '') { // empty input
    Trackster.renderMessage();
  } else {
    if (title) { // input isn't empty
      sortCount = {
        name: 1,
        artist: 1,
        listeners: 1
      };
      $('h1').addClass('app-title'); // animate page title
      $.ajax({
        url: "https://ws.audioscrobbler.com/2.0/?method=track.search&track=" + title + "&api_key=" + API_KEY + "&format=json",
        success: function(response) {
          responseTrack = response.results.trackmatches.track;
          Trackster.renderTracks(responseTrack);
          $('h1').removeClass('app-title'); // remove animation after the list is rendered
        }
      });

    } else { // empty input
      Trackster.renderMessage();
    }
  }
};

Trackster.renderMessage = function() {
  $('#tracklist-head').css('display', 'none');
  $('#tracklist-section').empty();
  var emptyQuery = '<p>Type something in the search query</p>'
  $('#tracklist-section').append(emptyQuery);
}

/*
  Sort the data stored in the object 'responseTrack' and call the 'renderTracks' function to render the sorted list
*/
Trackster.sortTracks = function(sort) {
  responseTrack = responseTrack.sort(function(x, y) {
    if (isNaN(x[sort])) { // sorting for #Song or Artist
      if (x[sort].toUpperCase() > y[sort].toUpperCase()) {
        return 1;
      }
      if (x[sort].toUpperCase() < y[sort].toUpperCase()) {
        return -1;
      }
      return 0;
    } else { // sorting for Listeners
      return y[sort] - x[sort];
    }
  })

  sortCount[sort] = 1 - sortCount[sort]; // toggles between 0 and 1
  if (sortCount[sort] == 1) { // reverse sorting order
    responseTrack = responseTrack.reverse();
  }
  Trackster.renderTracks(responseTrack);
}

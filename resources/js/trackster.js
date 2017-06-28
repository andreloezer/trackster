// Variables

var Trackster = {}; // object for the methods
var responseTrack = {}; // stores the json
var API_KEY = '86eb9d030d23409b7b148615386b8918'; // personal key to access 'last.fm' API
var sortCount = { // keep track of sorting
  name: 1,
  artist: 1,
  listeners: 1,
};
var previousSorting = ''; // stores previous sorting

$(document).ready(function() {

  $('.btn').click(function() {
    Trackster.searchTracksByTitle($('input').val());
  });

  $('.track-header').click(function() {
    Trackster.sortTracks('name');
  })

  $('.artist-header').click(function() {
    Trackster.sortTracks('artist');
  })

  $('.album-art').click(function() {
    Trackster.sortTracks('artist');
  })

  $('.listeners-header').click(function() {
    Trackster.sortTracks('listeners');
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
}

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title) {
  $(previousSorting).css('display', 'none'); // hide FA from previous sorting
  if (title) { // input isn't empty
    $('h1').addClass('app-title'); // animate page title
    $.ajax({ // request API for 'title' string
      url: "https://ws.audioscrobbler.com/2.0/?method=track.search&track=" + title + "&api_key=" + API_KEY + "&format=json",
      success: function(response) {
        responseTrack = response.results.trackmatches.track;
        Trackster.renderTracks(responseTrack);
        $('h1').removeClass('app-title'); // remove animation after the list is rendered
      }
    });
    sortCount = {
      name: 1,
      artist: 1,
      listeners: 1,
    };
  } else { // empty input
    Trackster.warningMessage();
  }
}

/*
  Render Message if search input is empty
*/
Trackster.warningMessage = function() {
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
  var currentSorting = '.' + sort; // adjust the string for '$'
  $(previousSorting).css('display', 'none'); // hide previous FA
  $(currentSorting).css('display', 'inline'); // show currrent FA
  switch (sortCount[sort]) { // toggles FA
    case 0:
      $(currentSorting).removeClass( "fa-chevron-up" ).addClass( "fa-chevron-down" );
      break;
    case 1:
      $(currentSorting).removeClass( "fa-chevron-down" ).addClass( "fa-chevron-up" );
      break;
  }
  previousSorting = currentSorting; // stores previous sorting
  if (sortCount[sort] == 1) { // reverse sorting order
    responseTrack = responseTrack.reverse();
  }
  Trackster.renderTracks(responseTrack);
}

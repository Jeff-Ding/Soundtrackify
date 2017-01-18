Template.home.rendered = function () {
  // initializes all typeahead instances
  Session.set("ty", "typeahead");
  Meteor.typeahead.inject();
};

Template.home.helpers({
  searchMovie: function (query, sync, callback) {
    Meteor.call("searchMovie", query, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      callback(result);
    });
  },

  selected: function (event, suggestion, datasetName) {
    var movie = JSON.parse(JSON.stringify(suggestion));
    Session.set("title", movie.title);

    // get soundtrack and check if songs are on Spotify
    Session.set("loaded", false); // songs not retrieved yet
    getSoundtrack(movie.movieID);

    Router.go("playlist");
  }
});

// return list of song objects given movieID
function getSoundtrack(movieID) {
  Meteor.call('getSoundtrack', movieID, function (err, results) {
    if (err) {
      console.error(err);
      alert("Unable to find soundtrack information" + err);
    } else {
      checkSpotify(results);
    }
  });
}

// check if songs can be found on Spotify
function checkSpotify(songs) {
  Meteor.call('checkSpotify', songs, function (err, results) {
    if (err) {
      console.error(err);
      alert("Unable to reach Spotify" + err);
    } else {
      Session.set("soundtrack", JSON.parse(JSON.stringify(results)));
      Session.set("loaded", true);
    }
  });
}

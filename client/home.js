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

    // login with Spotify
    //var options =  {
    //  showDialog: false,
    //  requestPermissions: ['playlist-modify-private']
    //};
    //Meteor.loginWithSpotify(options);

    // check if songs available on spotify
    Session.set("loaded", false); // songs not retrieved yet
    findSongs(parseTracks(movie.soundtrack));

    Router.go("playlist");
  }
});

function findSongs(songs) {
  Meteor.wrapAsync(Meteor.call('checkSpotify', songs, function (err, results) {
    if (err) {
      console.error(err);
      alert("Unable to reach Spotify\n" + err);
    } else {
      console.log(results);
      Session.set("soundtrack", JSON.parse(JSON.stringify(results)));
      Session.set("loaded", true);
    }
  }));
}

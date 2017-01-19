var soundtrack;

Template.playlist.helpers({
  songs: function () {
    soundtrack = Session.get("soundtrack");
    return soundtrack;
  },

  movie: function () {
    return Session.get("title");
  },

  playlistURL: function () {
    return Session.get("playlistURL");
  }
});

Template.playlist.events({
  "click input": function () {
    this.checked = !this.checked;
  },

  "click #create": function () {
    // setup Spotify login
    var options =  {
      showDialog: true,
      requestPermissions: ['playlist-modify-private']
    };

    // login with Spotify, hold until complete
    Meteor.loginWithSpotify(options, function (err) {
      if (err) {
        alert("Unable to log in to Spotify\n" + err);
      } else {
	createPlaylist(soundtrack);
      }
    });
  },

  "click #restart": function () {
    Session.keys = {};
  }
});

function createPlaylist(soundtrack) {
  // list of Spotify URIs of found and checked songs
  var songList = soundtrack.filter(function (song) {
                   return (song.found && song.checked);
                 }).map(function (song) {
                   return song.found;
                 });

  var name = Session.get("title") + " Soundtrack";
  Meteor.call(
    'createPlaylist', name, songList, function (err, result) {
      if (err) {
        alert("Unable to create playlist\n" + err);
      } else {
        Session.set("playlistURL", result);
      }
    }
  );
}

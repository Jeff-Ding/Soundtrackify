var soundtrack;

Template.playlist.helpers({
  loaded: function () {
    return Session.equals("loaded", true);
  },

  songs: function () {
    soundtrack = Session.get("soundtrack");
    return soundtrack;
  },

  movie: function () {
    return Session.get("title");
  }
});

Template.playlist.events({
  "click input": function() {
    this.checked = !this.checked;
  },

  "click .btn": function () {
    console.log(soundtrack);

    //login with Spotify
    var options =  {
      showDialog: false,
      requestPermissions: ['playlist-modify-private']
    };
    Meteor.loginWithSpotify(options);

    // list of Spotify URIs of found and checked songs
    var songList = soundtrack.filter(function (song) {
                     return (song.found && song.checked);
                   }).map(function (song) {
                     return song.found;
                   });

    var name = Session.get("title") + " Soundtrack";
    console.log(songList)
    Meteor.call(
      'createPlaylist', name, songList, function (err, result) {
        if (err) {
          alert("Unable to create playlist\n" + err);
        } else {
          Session.set("playlistURL", result);
          Router.go("success");
        }
      }
    );
  }
});

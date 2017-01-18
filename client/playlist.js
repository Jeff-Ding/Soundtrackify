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
  "click input": function() {
    this.checked = !this.checked;
  },

  "click #create": function () {
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
        }
      }
    );
  }
});

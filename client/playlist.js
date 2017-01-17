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

  "click .create": function () {
    console.log(soundtrack);
//    // list of Spotify URIs of found songs
//    var foundSongs =
//      Session.get("soundtrack").
//        filter(function (song) {
//          return song.found;
//        }).
//        map(function (song) {
//          return song.found;
//        });
//
//    var name = Session.get("title") + " Soundtrack";
//    Meteor.call(
//      'createPlaylist', name, foundSongs, function (err, result) {
//        if (err) {
//          alert("Unable to create playlist\n" + err);
//        } else {
//          Session.set("playlistURL", result);
//          Router.go("success");
//        }
//      }
//    );
  }
});

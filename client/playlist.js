Template.playlist.helpers({
  songs: function () {
    return matchedId.reactive();
  },

  movie: function () {
    return Session.get("title");
  }
});

Template.playlist.events({
  "click .toggle-checked": function() {
    this.checked = !this.checked;
  },

  "click .create": function (event) {
    // prevent browser default button click
    event.preventDefault();

    var songlist = matchedId.filter(function(song) {
      if (song.checked) {
        return song;
      }
    });

    Meteor.call('findSongs', songlist, function (error, results) {
      if (error) {
        console.log(error);
        alert("Unable to reach Spotify: " + error.toString);
      } else {
        var len = results.length;
        var notFound = [];
        var playlist = [];
        for (var i = 0; i < len; i++) {
          if (results[i]) {
            playlist.push(results[i]);
          } else {
            notFound.push(songlist[i].title);
          }
        }

        if (notFound.length > 0) {
          alert("Unable to find on Spotify:\n" + notFound.join('\n'));
        }

        Meteor.call('createPlaylist', Session.get("title"), playlist, function (err, res) {
          if (err) {
            console.log(err);
            alert("Unable to create playlist: " + err.toString());
          } else {
            alert("Playlist created!");
          }
        });
      }
    });
  }
});

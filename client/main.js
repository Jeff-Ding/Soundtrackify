Template.home.events({
  "submit .search": function (event) {
    // prevent browser default form submit
    event.preventDefault();

    var input = event.target.text.value;
    matchedTitle.change(input);
    matchedSubstring.change(input);

    // redirect to songs page
    Router.go('disambiguation');
  }
});

Template.disambiguation.helpers({
  moviesExact: function () {
    return matchedTitle.reactive();
  },

  moviesInexact: function () {
    return matchedSubstring.reactive();
  }
});

Template.disambiguation.events({
  "click .selection": function (event) {
    // prevent default browser link redirection
    event.preventDefault();

    Session.set("title", this.title);
    matchedId.change(this.movie_id);

    Session.set("titles", []);

    Router.go('/created-playlist');
  }
});

Template.created.helpers({
  songs: function () {
    return matchedId.reactive();
  },

  movie: function () {
    return Session.get("title");
  }
});

Template.created.events({
  "click .toggle-checked": function() {
    this.checked = !this.checked;
  },

  "click .create": function (event) {
    // prevent browser default button click
    event.preventDefault();

    // login to Spotify
    var options = {
      showDialogue: true,
      requestPermissions: ['playlist-modify-private']
    };
    Meteor.loginWithSpotify(options);

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

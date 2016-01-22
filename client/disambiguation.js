Template.disambiguation.helpers({
  moviesExact: function () {
    // TODO
  },

  moviesInexact: function () {
    // TODO
  }
});

Template.disambiguation.events({
  "click .selection": function (event) {
    // prevent default browser link redirection
    event.preventDefault();

    Session.set("title", this.title);

    Session.set("titles", []);

    // login to Spotify
    // var options = {
    //   showDialogue: false,
    //   requestPermissions: ['playlist-modify-private']
    // };
    // Meteor.loginWithSpotify(options);

    Router.go('playlist');
  }
});

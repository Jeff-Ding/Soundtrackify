Template.disambiguation.helpers({
  results: function () {
    return Session.get("results");
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

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

    matchedId.change(this.movie_id);

    Router.go('/created-playlist');
  }
});

Template.created.helpers({
  songs: function () {
    return matchedId.reactive();
  },

  movie: "Movie Title"
});

Template.created.events({
  "click .toggle-checked": function() {
    this.checked = !this.checked;
  },

  "click .create": function (event) {
    // prevent browser default button click
    event.preventDefault();

    var options = {
      showDialogue: true,
      requestPermissions: ['user-read-email']
    };
    Meteor.loginWithSpotify(options);

    console.log(matchedId.reactive());
  }
});

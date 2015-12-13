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

    Router.go('playlist');
  }
});

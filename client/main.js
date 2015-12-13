Template.home.events({
  "submit .search": function (event) {
    // prevent browser default form submit
    event.preventDefault();

    // population session playlist
    Session.set('playlist', [
      { title: "Song 1", artist: "Art 1", checked: true },
      { title: "Song 2", artist: "Art 2", checked: true },
      { title: "Song 3", artist: "Art 3", checked: true },
      { title: "Song 4", artist: "Art 4", checked: true },
    ]);

    // redirect to songs page
    Router.go('created-playlist');
  }
});

Template.created.helpers({
  songs: function () {
    return Session.get('playlist');
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

    console.log("Button clicked!");
  }
});

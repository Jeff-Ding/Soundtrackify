Template.playlist.helpers({
  songs: function () {
    // TODO
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

    // TODO
  }
});

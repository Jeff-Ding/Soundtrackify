Template.home.events({
  "submit .search": function (event) {
    // prevent browser default form submit
    event.preventDefault();

    // redirect to songs page
    Router.go('created-playlist');
  }
});

Template.created.helpers({
  songs: [
    { title: "Song 1" },
    { title: "Song 2" },
    { title: "Song 3" },
    { title: "Song 4" }
  ],

  movie: "Movie Title"
});

Template.created.events({
  "click .create": function (event) {
    // prevent browser default button click
    event.preventDefault();

    console.log("Button clicked!");
  }
});

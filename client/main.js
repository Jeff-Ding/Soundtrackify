Template.home.events({
  "submit .search": function (event) {
    // prevent browser default form submit
    event.preventDefault();

    // redirect to songs page
    Router.go('songs');
  }
});

Template.songs.events({
  "click .create": function (event) {
    // prevent browser default button click
    event.preventDefault();

    console.log("Button clicked!");
  }
});

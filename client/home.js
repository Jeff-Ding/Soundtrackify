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

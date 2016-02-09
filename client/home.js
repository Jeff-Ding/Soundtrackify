Template.home.rendered = function () {
  // initializes all typeahead instances
  Meteor.typeahead.inject();
};

Template.home.helpers({
  searchMovie: function (query, sync, callback) {
    Meteor.call("searchMovie", query, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      callback(result);
    });
  },

  selected: function (event, suggestion, datasetName) {
    Session.set("movie", JSON.parse(JSON.stringify(suggestion)));
    Router.go("playlist");
  }
});

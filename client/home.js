Template.home.events({
  "submit .search": function (event) {
    // prevent browser default form submit
    event.preventDefault();

    Session.set("query", event.target.text.value);

    // list of matched movie objects
    var resultObj = [];

    // search for title matching query
    Meteor.call("searchMovie", Session.get("query"), function (err, result) {
      if (err) {
        console.log(err);
        alert("Failed to access movie database: " + err.toString());
      } else {
        // index into resultObj
        var index = 0;

        // convert list of titles and movieIDs strings into list of pair objects
        for (var i in result) {
          if (i % 2 === 0) {
            resultObj.push({title: null, movieID: null});
            resultObj[index].title = result[i];
          } else {
            resultObj[index].movieID = result[i];
            index++;
          }
        }

        Session.set("results", resultObj);
      }
    });

    console.log(Session.get("results"));

    // redirect to songs page
    Router.go("disambiguation");
  }
});

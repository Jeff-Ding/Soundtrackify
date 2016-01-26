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
          var mod = i % 4;
          var value = result[i];

          if (mod === 0) {
            resultObj.push({
              movieID: null,
              title: null,
              year: null,
              director: null});

            resultObj[index].movieID = value;
          } else if (mod === 1){
            resultObj[index].title = value;
          } else if (mod === 2){
            resultObj[index].year = value;
          } else if (mod === 3){
            resultObj[index].director = value;
            index++;
          }
        }

        Session.set("results", resultObj);
      }
    });

    // redirect to songs page
    Router.go("disambiguation");
  }
});

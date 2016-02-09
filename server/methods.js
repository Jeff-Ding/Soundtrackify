// Load future from fibers
var Future = Npm.require("fibers/future");
// Load exec
var exec = Npm.require("child_process").exec;

Meteor.methods({
  searchMovie: function (query) {
    this.unblock();
    var future = new Future();

    // call searchMovie python program to query movie database
    var command = '~/Projects/soundtrackify/IMDb/searchMovie "' + query + '"';

    exec(command, function(err, stdout, stderr) {
      if (err) {
        console.log(err);
        throw new Meteor.Error(500, command + "failed");
      }

      // parse program output into list of alternating titles and movieIDs
      var result = stdout.split("\n");
      result.pop();

      // list of matched movie objects
      var resultObj = [];
      
      // index into resultObj
      var index = 0;

      // convert list of titles and movieIDs strings into list of pair objects
      for (var i in result) {
        var mod = i % 6;
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
        } else if (mod === 4){
          resultObj[index].votes = parseInt(value);
        } else if (mod === 5){
          resultObj[index].soundtrack = value;
          index++;
        }
      }

      // sort by popularity
      resultObj.sort(function (a, b) {
        return b.votes - a.votes;
      });

      future.return(resultObj);
    });

    return future.wait();
  }
});

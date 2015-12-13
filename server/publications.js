// Connect to database
var liveDb = new LiveMysql({
  host: 'localhost',
  port: 3306, // default
  user: Meteor.settings.dbUser,
  password : Meteor.settings.dbPass,
  database: 'soundtrackify'
});

var closeAndExit = function () {
  liveDb.end();
  process.exit();
};

// close connections on hot code push
process.on('SIGTERM', closeAndExit);
// close connections on exit (ctrl + c)
process.on('SIGINT', closeAndExit);


Meteor.publish('title', function(input) {
  return liveDb.select(
    'SELECT * FROM movies WHERE title = "' +
    input + '" ORDER BY year DESC',
    [{ table: 'movies' }]
  );
});

Meteor.publish('substring', function(input) {
  return liveDb.select(
    'SELECT * FROM movies WHERE title <> "' + input + 
    '" AND (title LIKE "%' + input +
    '%") ORDER BY year DESC LIMIT 10',
    [{ table: 'movies' }]
  );
});

Meteor.publish('movieId', function(id) {
  return liveDb.select(
    'SELECT * FROM soundtracks WHERE movie_id = ' +
    id + ' ORDER BY title DESC',
    [{ table: 'soundtracks' }]
  );
});

// Connect to database
var liveDb = new LiveMysql({
  host: 'localhost',
  port: 3306, // default
  user: Meteor.settings.dbUser,
  password : Meteor.settings.dbPass
});


// Connect to Spotify web service
ServiceConfiguration.configurations.update (
  { "service": "spotify" },
  {
    $set: {
      "clientId": Meteor.settings.SpotifyID,
      "secret": Meteor.settings.SpotifyKey
    }
  },
  { upsert: true }
);

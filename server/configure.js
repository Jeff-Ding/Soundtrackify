// connect to Spotify web service
ServiceConfiguration.configurations.update(
  { "service": "spotify"},
  {
    $set: {
      "clientID": Meteor.settings.SpotifyID,
      "secret": Meteor.settings.SpotifyKey
    }
  },
  { upsert: true }
);

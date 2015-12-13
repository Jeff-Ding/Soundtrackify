// Connect to Spotify web service
ServiceConfiguration.configurations.update(
  { "service": "spotify" },
  {
    $set: {
      "clientId": Meteor.settings.SpotifyID,
      "secret": Meteor.settings.SpotifyKey
    }
  },
  { upsert: true }
);

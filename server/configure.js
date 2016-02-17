// configure Spotify login service
ServiceConfiguration.configurations.update(
  { "service": "spotify"},
  {
    $set: {
      "clientId": "ec03c13682af49eb90ed8d0ee5d41696",
      "secret": "8c2721b6c94545749d5f3613deffd926"
    }
  },
  { upsert: true}
);

ServiceConfiguration.configurations.update (
  { "service": "spotify" },
  {
    $set: {
      "clientId": "61874b61b08a4d96bf209da45b275bb0",
      "secret": "49585d31f073467d8c36adcecc6847fe"
    }
  },
  { upsert: true }
);

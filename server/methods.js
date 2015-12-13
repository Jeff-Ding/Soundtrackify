Meteor.methods({
  findSongs: function(songlist) {
    var spotifyApi = new SpotifyWebApi();
    var results = [];

    var listLen = songlist.length;

    for (var i = 0; i < listLen; i++) {
      var artist = '';
      if (songlist[i].performer) {
        artist = songlist[i].performer;
      } else if (songlist[i].writer) {
        artist = songlist[i].writer;
      }

      var query = songlist[i].title + ' ' + artist;

      var result = spotifyApi.searchTracks(query, { limit: 1 });

      if (checkTokenRefreshed(result, spotifyApi)) {
        result = spotifyApi.searchTracks(query, { limit: 1 });
      }

      if (result.data.body.tracks.items.length === 0) {
        query = songlist[i].title;

        result = spotifyApi.searchTracks(query, { limit: 1 });

        if (checkTokenRefreshed(result, spotifyApi)) {
          result = spotifyApi.searchTracks(query, { limit: 1 });
        }
      }

      if (result.data.body.tracks.items[0]) {
        results.push(result.data.body.tracks.items[0].uri);
      } else {
        results.push(null);
      }
    }

    return results;
  },

  createPlaylist: function (name, uriList) {
    var spotifyApi = new SpotifyWebApi();
    var result = spotifyApi.createPlaylist(Meteor.user().services.spotify.id, name, { public: false });

    if (checkTokenRefreshed(result, spotifyApi)) {
      result = spotifyApi.createPlaylist(Meteor.user().services.spotify.id, name, { public: false });
    }

    spotifyApi.addTracksToPlaylist(Meteor.user().services.spotify.id, result.data.body.id, uriList, {});

    return result.data.body;
  }
});

var checkTokenRefreshed = function(response, api) {
  if (response.error && response.error.statusCode === 401) {
    api.refreshAndUpdateAccessToken();
    return true;
  } else {
    return false;
  }
};

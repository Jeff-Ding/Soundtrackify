## Changes from master branch
* Reformatted front-end to incorporate basic UX/UI principles
  * Edited HTML and added stylesheets for visual appeal (Material Design guidelines)
  * Integrated Twitter's [typeahead.js package](http://twitter.github.io/typeahead.js/) to support auto-complete fuzzy searching on each user keystroke
  * Removed disambiguation page and replaced with live-updating drop-down field of movie titles that display auto-complete results
  * Results from server method calls are relayed between pages through session variables to persist across page navigation
  * Server method for querying Spotify API for songs is now called asynchronously upon movie selection (function findSongs in home.js) so that instead of hanging until songs are found, a loading message is displayed
* Added function parseTracks to home.js to offload raw text object parsing from server to client (replace crude SQL substring matching with precise regular expression matching in JavaScript)

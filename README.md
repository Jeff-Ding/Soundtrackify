## Changes from master branch
* Reformatted front-end to incorporate basic UX/UI principles
  * Edited HTML and added stylesheets for visual appeal (Material Design guidelines)
  * Integrated Twitter's [typeahead.js package](http://twitter.github.io/typeahead.js/) to support auto-complete fuzzy searching on each user keystroke
  * Removed disambiguation page and replaced with live-updating drop-down field of movie titles that display auto-complete results
  * Results from server method calls are relayed between pages through session variables to persist across page navigation
  * Server method for querying Spotify API for songs is now called asynchronously upon movie selection (function findSongs in home.js) so that instead of hanging until songs are found, a loading message is displayed
* Added function parseTracks to home.js to offload raw text object parsing from server to client (replace crude SQL substring matching with precise regular expression matching in JavaScript)
* Rewrote back-end to incorporate IMDbPY update
 * In addition to importing raw text dump to SQL database, IMDbPY provides interface to database with wrapper functions for querying movie info fields
 * Clunky SQL initializations and working from views (as described in the master branch) can now be done away with as querying can be done entirely through IMDbPY itself
 * Server now forks a process to run a Python script (IMDb/searchMovie) that passes client requests for movie/soundtrack info as input arguments to IMDbPY wrapper functions and returns the results from stdout.

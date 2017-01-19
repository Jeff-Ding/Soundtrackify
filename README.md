**[Video Demo](https://vimeo.com/200137386)**

## Changes from master branch
The app now takes advantage of IMDbPY's update which allows for fast HTTP fetching of credits directly from IMDb's servers, thus eliminating the need to store the entirety of IMDb in a local database. Not only does this makes the app much lighter, it also ensures that all information is up-to-date and new releases are included. More changes:

* Reformatted front end to incorporate basic UX/UI principles
  * Edited HTML and added stylesheets for visual appeal (Material Design guidelines)
  * Integrated Twitter's [typeahead.js package](http://twitter.github.io/typeahead.js/) to support auto-complete fuzzy searching on each user keystroke
  * Removed disambiguation page and replaced with live-updating drop-down field of movie titles that display auto-complete results
  * Results from server method calls are relayed between pages through session variables to persist across page navigation
  * App now waits on server method *checkSpotify()* to find songs on Spotify and displays a loading message instead of showing blank page
* Seperated IMDbPY call for soundtrack credits from main call for movieID, title, and year to make typeahead faster and more responsive. Soundtrack credits aren't queried until the user actually selects a movie
* Instead of parsing raw text returned from IMDbPY in SQL, replaced with more precise JavaScript regular expressions in server/methods.js

*The [redesign branch](https://github.com/Jeff-Ding/Soundtrackify/tree/redesign) features many stylistic and functional improvements and is currently a work in progress*.

# Soundtrackify
An app for creating Spotify playlists from movie soundtracks.
- [General](#general)
- [Implementation](#implementation)
	- [Overview](#overview)
	- [Server Side](#server-side)
		- [Scraping](#scraping)
	- [Database Design](#database-design)
- [Client Side](#client-side)
- [Further Work](#further-work)

## General
A movie’s released soundtrack may be very different from what audiences remember hearing in theaters. Often, the film studio only has rights to release original music composed specifically for the film and not music licensed from other artists. This means that a commercial soundtrack album is usually missing some of the most memorable songs from the movie. In cases where the movie only features licensed music, a soundtrack may not be available at all. This can be frustrating for those wanting to listen to their favorite movie soundtracks and relive their viewing experiences.

A solution can be found by noting that a film studio legally must attribute licensed music in the movie's credits. If someone were to sit through a movie and jot down these credits, they would be able to able to seek out the songs individually and reconstruct the full soundtrack for their listening pleasure.

Soundtrackify is a web application that automates this process. It sources the soundtrack information from the Internet Movie Database at IMDb.com, which includes full credits information from its vast library of over 3.5 million titles. Given a user search for movie, it locates the title in IMDb’s library and creates a list of all songs used in the movie. The user can exclude any songs they wish, and a Spotify playlist is instantly created from the selection.

## Implementation
### Overview
Soundtrackify is written primarily with Meteor, an open source web application framework based entirely around JavaScript. On the front-end it uses HTML, JavaScript, jQuery and Blaze (Meteor’s library for creating reactive user interfaces). On the back-end, it uses Node.js, which is normally integrated with MongoDB under Meteor’s defaults, but using the “Reactive MySQL for Meteor” package (https://github.com/numtel/meteor-mysql), has been modified to access a MySQL database in order to integrate with IMDbPY (more details below).

### Server Side
#### Scraping
Given the sheer number of movie and song titles, it would be inefficient to extract information by scraping IMDb’s website upon every client request. Instead, all information is extracted initially and dumped into a database for optimized access. IMDb’s conditions of use prohibit many scraping methods: “You may not use data mining, robots, screen scraping, or similar online data gathering and extraction tools on our website” (http://www.imdb.com/help/show_leaf?usedatasoftware). Rather, IMDb allows “limited non-commercial use” of its data in software, and only the data that is freely available to public via plain text file dumps (http://www.imdb.com/interfaces/). An open-source Python package for retrieving and manipulating IMDb data, IMDbPY (http://imdbpy.sourceforge.net/index.html) was used to parse the text files on ASCII delimeters into values and fields, which were then inserted into a MySQL database.

### Database Design
IMDbPY has no options for schema specification and instead creates one optimized for data insertion. The following diagram shows the schema generated:

![alt text](http://meolus.de/fileadmin/images/meolus/blog/imdb-erm.png)

It is clearly not in any normal form. The following were noted and performed (exact code and queries can be found in the “initialize.sql” script):

* The relation movie_info(id, movie_id, info_type_id, info, note) stores general information about each movie (identified by foreign key “movie_id”) in the 
“info” attribute. The primary key is “id”, identifying the specific information tidbit
* The desired soundtrack data for each movie resides in this “info” attribute, however, it is an undifferentiated text field that also contains information for runtimes, plots, budgets, languages, etc. Including soundtrack information, that are a total of 113 information categories in the “info" attribute.
* To differentiate the information category, another attribute “info_type_id” is used. It takes on an int between 1 and 113 to specify the information type. The actual names of the types that correspond to these numbers are in a relation info_type(id, info).
* A query was performed on info_type to find the id # associated with info = “soundtrack”. This was saved into a local variable soundtrack_id.
* The soundtrack information in the “info” attribute partially follows the form, as specified by IMDb’s submission guidelines (http://www.imdb.com/updates/guide/soundtracks):
	
	*"Title of Song" Written by person(s)/group Performed by person(s)/group*
* When a person/group has their own page on IMDb, their name shows up on the website as a hyperlink, which manifests in the “info” field as single quotes around the person/group name, followed by “(qv)”. E.g. “Performed by ‘Elvis Presley’ (qv)”. If Elvis didn’t have his own IMDb page, he would show as “Performed by Elvis Presley” in the “info” field.
* Generally, a person/group without a hyperlink would also not be prominent enough to appear on Spotify. Thus, to find if an entry has information for the performer of a song, we can only consider records LIKE “%Performed by ‘%’ (qv)%”. However, records LIKE “%Performed by ‘%’%’ (qv)%” should not be included because submitters often will not follow the guidelines completely and will wrap a name in single quotes that isn’t a hyperlink (not followed by “(qv)”). Normally, the first LIKE test will filter these out because it seeks to match “(qv)”, but it will recognize a false positive for cases such as “Performed by ‘person A’, lyrics by ‘person B’ (qv)”.
* A SQL function is then created: extractPerformer(info) which first tests if the info string matches the desired format to extract performer information based on the LIKE statements above. If it does not match, it returns null because there is no information to be extracted. If it matches, it extracts the string that is the name of the person/group by using substring operations and knowledge of the single quotes as delimiters.
* A similar function extractWriter(info) is created, which returns the extracted writer info. Submitters don’t adhere to the guidelines as closely as they do for performers and the desired writer(s) of a song can appear under any of the monikers: “Written by ‘name’ (qv)”, “Composed by ‘name’ (qv)”, and “Music by ‘name’ (qv)”. The function uses more logic branches to cover all these cases and similarly either returns a name string or null.
* A simpler function extractTitle(info) returns the extracted song title, which is the only string that appears between double quotes and thus can easily be extracted.
* With these three functions, a view soundtracks(movie_id, title, performer, writer) is created by selecting (movie_id, extractTitle(info), extractPerformer(info), extractWriter(info)) from movie_info for rows where info_id_type = soundtrack_id (= 14).
* Another view movies(movie_id, title, year) is created by selecting (id, title, production_year) from the “title” relation.
* For access performance, these views are materialized. Although MySQL does not support materialized views, it can be mimick them by creating new tables and inserting in all the rows from a view. In this manner, new tables were created from movies and soundtracks, with foreign key movie_id in soundtracks referencing primary key movie_id in movies. An index is created on title in movies, and an index is created on movie_id in soundtracks. 
* A user account was created for the application and granted select access on the movies and soundtracks tables.

After the database is set up, the application’s Node.js back-end creates a connection to it with its user account. It then publishes the following queries:
* moviesExact: a select of (movie_id, title, year) from movies given an exact title and ordered descending by year
* moviesInexact: a similar select, except with any results LIKE “%title%” (case-insensitive) and limited to 10 records
* songs: a select of (title, performer, writer) from soundtracks, given a movie_id

The server also configures the Spotify service to hand a user’s login request from the client. Once received, it exchanges an authorization ID and key (initially created when registering the application with Spotify) to Spotify for an access token so that the application can call Spotify’s Web API endpoint.

## Client Side
The client side subscribes to the moviesExact, moviesInexact, and songs queries. It then takes in user input from an HTML form as a string representing a movie title. A function passes the string to moviesExact and moviesInexact and returns an object containing the movie_id, title, and year of all the exact matches for title, as well as 10 similar matches that have the user input as a case-insensitive substring. These matches are rendered to the browser in the form “title (year)” on a disambiguation page and the user is allowed to select their intended movie. A function passes the associated movie_id to the songs query and returns an object containing the title, performer, and write of the songs in the movie’s soundtrack. These are rendered to the browser in the default form “Title - Performer”, falling back to “Title - Writer” and “Title - Unknown” if the performer and writer are null in the relation, respectively. The user is then allowed to deselect any undesired songs and then submit their song list. After submission, the application uses Spotify web API calls to prompt the user to either login or register with Spotify, iterate through the list of requested songs and search Spotify for each song by title and artist, and returns whether or not a song could be found. The application alerts the user of the songs that could not be found on Spotify and finally creates a playlist from the found songs and imports it into the user’s Spotify account.

## Further Work
Soundtrackify is currently a work in progress and operates in a testing environment.

The next step is to set up a server-side script to run IMDbPY every time IMDb updates its text files to insert new releases into the database. Triggers could be set to insert new records into the soundtracks table upon detecting insertion into the source tables to have it more fully mimic a true materialized view.

Finally, Soundtrackify is the creator’s first web application and was built with little knowledge about design and user experience. For this reason, the browser interface is rather plain, unappealing, and clunky. It could be made more aesthetically pleasing with some stylesheets and graphic design principles. Another user experience improvement would be to support fuzzy searching of movie titles to be more forgiving of misspellings, rather than expecting an exact substring match. With this in place, the application could show a drop down list from the input form that auto-updates with likely matches upon every user keystroke.

***Note:*** *These issues are being addressed and can be found in the [redesign branch](https://github.com/Jeff-Ding/Soundtrackify/tree/redesign) of this repository.*

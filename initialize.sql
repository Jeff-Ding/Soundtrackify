USE soundtrackify;

DELIMITER $$

DROP FUNCTION IF EXISTS extractTitle;
CREATE FUNCTION extractTitle(info text)

RETURNS varchar(255)
RETURN SUBSTRING(SUBSTRING_INDEX(info, '"', 2), 2);

DROP FUNCTION IF EXISTS extractPerformer;
CREATE FUNCTION extractPerformer(info text)
RETURNS varchar(255)
BEGIN
  DECLARE performer varchar(255);
  IF info LIKE "%Performed by '%' (qv)%" THEN
    IF info NOT LIKE "%Performed by '%'%' (qv)%" THEN
      -- everything after opening quote
      SET performer = SUBSTRING(info, INSTR(info, "Performed by '") + 14);
      -- everthing before terminating queote
      SET performer = SUBSTRING_INDEX(performer, "' (qv)", 1);
    END IF;
  ELSE
    SET performer = null;
  END IF;
  RETURN performer;
END;

DROP FUNCTION IF EXISTS extractWriter;
CREATE FUNCTION extractWriter(info text)
RETURNS varchar(255)
BEGIN
  DECLARE writer varchar(255);
  IF info LIKE "%Written by '%' (qv)" THEN
    IF info NOT LIKE "%Written by '%'%' (qv)%" THEN
      -- everthing after opening quote
      SET writer = SUBSTRING(info, INSTR(info, "Written by '") + 12);
      -- everthing before terminating queote
      SET writer = SUBSTRING_INDEX(writer, "' (qv)", 1);
    END IF;
  ELSEIF info LIKE "%Composed by '%' (qv)" THEN
    IF info NOT LIKE "%Composed by '%'%' (qv)%" THEN
      -- everthing after opening quote
      SET writer = SUBSTRING(info, INSTR(info, "Composed by '") + 13);
      -- everthing before terminating queote
      SET writer = SUBSTRING_INDEX(writer, "' (qv)", 1);
    END IF;
  ELSEIF info LIKE "%Music by '%' (qv)" THEN
    IF info NOT LIKE "%Music by '%'%' (qv)%" THEN
      -- everthing after opening quote
      SET writer = SUBSTRING(info, INSTR(info, "Music by '") + 10);
      -- everthing before terminating queote
      SET writer = SUBSTRING_INDEX(writer, "' (qv)", 1);
    END IF;
  ELSE
    SET writer = null;
  END IF;
  RETURN writer;
END;

-- create table for movies
DROP TABLE IF EXISTS movies;
CREATE TABLE movies(
  movie_id INT(11)      PRIMARY KEY,
  title    VARCHAR(500) NOT NULL,
  year     INT(4)
);

INSERT INTO movies(movie_id, title, year)
SELECT id, title, production_year
FROM title;

CREATE INDEX title on movies(title);

-- create table for soundtracks
SET @soundtrack_id = (SELECT id
                      FROM info_type
                      WHERE info = 'soundtrack');

DROP TABLE IF EXISTS soundtracks;
CREATE TABLE soundtracks(
  movie_id  INT(11)      NOT NULL,
  title     VARCHAR(500) NOT NULL,
  performer VARCHAR(500),
  writer    VARCHAR(500),
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

INSERT INTO soundtracks(movie_id, title, performer, writer)
SELECT movie_id, extractTitle(info), extractPerformer(info), extractWriter(info)
FROM movie_info
WHERE info_type_id = @soundtrack_id;

CREATE INDEX id on soundtracks(movie_id);


-- create user for soundtrackify app
CREATE USER 'soundtrackify'@'localhost' IDENTIFIED BY 'qwfpluy;arstneio'

GRANT SELECT ON soundtrackify.movies TO 'soundtrackify'@'localhost';
GRANT SELECT ON soundtrackify.soundtracks TO 'soundtrackify'@'localhost';

-- required for Meteor MySQL to work
GRANT REPLICATION SLAVE, REPLICATION CLIENT, SELECT ON *.* TO 'soundtrackify'@'localhost';

$$

DELIMITER ;

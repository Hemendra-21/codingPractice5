const express = require("express");
const app = express();
const { open } = require("sqlite");
app.use(express.json());
const sqlite3 = require("sqlite3");
const path = require("path");

const dbpath = path.join(__dirname, "moviesData.db");

let database = null;

const initializeServerAndDb = async () => {
  try {
    database = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server running successfully at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`Database error ${error.message}`);
    process.exit(1);
  }
};
initializeServerAndDb();

const DbObjToRespObj = (dbObj) => {
  return {
    movieId: databaseObject.movieId,
    directorId: databaseObject.directorId,
    movieName: databaseObject.movieName,
    leadActor: databaseObject.leadActor,
  };
};

//Get all movies
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT 
      movie_name
    FROM
      movie;`;

  const allMovies = await database.all(getMoviesQuery);
  response.send(allMovies);
});

//Create a new movie
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const addMovieQuery = `
    INSERT INTO 
      movie(director_id,movie_name,lead_actor)
    VALUES(
        ${directorId},
        '${movieName}',
        '${leadActor}'
    );`;

  await database.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

//Get movie details
app.get("/movies/:movieId/", async (request, response) => {
  const movieID = request.params;
  const movieDetailsQuery = `
    SELECT * FROM 
      movie
    WHERE
      movie_id = ${movieID};`;
  const dbResponse = await database.get(movieDetailsQuery);
  response.send(DbObjToRespObj(dbResponse));
});

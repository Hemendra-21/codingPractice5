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

//update movie details
app.put("/movies/:movieId/", async (request, response) => {
  const newMovieDetails = request.body;
  const { movieId } = request.params;

  const { directorId, movieName, leadActor } = newMovieDetails;

  const updateQuery = `
    UPDATE 
      movie 
    SET
      director_id = ${directorId},
      movie_name = '${movieName}',
      lead_actor = '${leadActor}'
    WHERE 
      movie_id = ${movieId};`;

  await database.run(updateQuery);
  response.send("Movie Details Updated");
});

//Delete Movie
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const deleteQuery = `
    DELETE FROM
      movie
    WHERE 
      movie_id = ${movieId};`;

  await database.run(deleteQuery);
  response.send("Movie Removed");
});

//Get all directors details
app.get("/directors/", async (request, response) => {
  const directorsDetailsQuery = `
    SELECT 
      * 
    FROM 
      director;`;
  const dbResponse = await database.all(directorsDetailsQuery);
  response.send(dbResponse);
});

//Get all movies of a director
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;

  const directorDetailsQuery = `
    SELECT 
      movie_name 
    FROM 
      movie
    WHERE 
      director_id = ${directorId};`;

  const dbResponse = await database.get(directorDetailsQuery);
  response.send(dbResponse);
});

module.exports = app;

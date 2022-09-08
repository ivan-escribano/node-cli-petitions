//!CONFIG
const https = require("https");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const API_KEY = process.env.API_KEY;
//!Import ora
const ora = require("ora");
//!Import chalk
const chalk = require("chalk");

//!POPULAR MOVIEWS
const moviePopular = (page) => {
  let spinner = ora("Starting the fetch").start();
  https
    .get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`,
      (resp) => {
        //Spinner Ora
        setTimeout(() => {
          spinner.color = "yellow";
          spinner.text = "Fetching the movies data...";
        }, 1000);
        //Data iremos poniendo/concatenando los atos que nos lleguen
        let data = "";
        //Coger pedazos de datos que nos llegan
        resp.on("data", (chunk) => {
          data += chunk;
        });
        //Cuando ya no hay mas datos que recoger
        resp.on("end", () => {
          const popularMovies = JSON.parse(data);
          popularMovies.results.map((movie) => {
            console.log(
              `
Movie:\n
ID: ${movie.id}\n
Title: ${chalk.bold.blue(movie.title)}\n
Release Date: ${movie.release_date}
            `
            );
          });

          //Ora succeed
          spinner.succeed("Popular movies data loaded");
          console.log("----------------------------------------");
          console.log(
            `Page: ${popularMovies.page} of: ${popularMovies.total_pages}`
          );
        });
      }
    )
    .on("error", (err) => {
      console.log(err);
      //Ora fail
      spinner.fail("The fetch petition failed");
    });
};

//!PLAYING NOW MOVIES
const moviePlayingNow = (page) => {
  let spinner = ora("Starting the fetch").start();
  https
    .get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`,
      (resp) => {
        //Spinner Ora
        setTimeout(() => {
          spinner.color = "yellow";
          spinner.text = "Fetching the movies data...";
        }, 1000);
        //Data iremos poniendo/concatenando los atos que nos lleguen
        let data = "";
        //Coger pedazos de datos que nos llegan
        resp.on("data", (chunk) => {
          data += chunk;
        });
        //Cuando ya no hay mas datos que recoger
        resp.on("end", () => {
          const nowPlayingMovies = JSON.parse(data);
          nowPlayingMovies.results.map((movie) => {
            console.log(
              `
Movie:\n
ID: ${movie.id}\n
Title: ${chalk.bold.blue(movie.title)}\n
Release Date: ${movie.release_date}
          `
            );
          });
          //Ora succeed
          spinner.succeed("Movies playing now data loaded");
          console.log("----------------------------------------");
          console.log(
            `Page: ${nowPlayingMovies.page} of: ${nowPlayingMovies.total_pages}`
          );
        });
      }
    )
    .on("error", (err) => {
      console.log(err);
      //Ora fail
      spinner.fail("The fetch petition failed");
    });
};

//!DETAILS MOVIES
const movieDetails = (id) => {
  let spinner = ora("Starting the fetch").start();
  https
    .get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`,
      (resp) => {
        //Spinner Ora
        setTimeout(() => {
          spinner.color = "yellow";
          spinner.text = "Fetching the movies data...";
        }, 1000);
        //Data iremos poniendo/concatenando los atos que nos lleguen
        let data = "";
        //Coger pedazos de datos que nos llegan
        resp.on("data", (chunk) => {
          data += chunk;
        });
        //Cuando ya no hay mas datos que recoger
        resp.on("end", () => {
          const movieDetail = JSON.parse(data);
          console.log(
            `
Movie:\n
ID: ${movieDetail.id}\n
Title: ${chalk.bold.blue(movieDetail.title)}\n
Release date: ${movieDetail.release_date}\n
Runtime: ${movieDetail.vote_count}\n
Overview: ${movieDetail.overview}\n\n
Genres :\n 
${
  movieDetail.genres.length > 0
    ? movieDetail.genres.map((data) => `${data.name}\n`)
    : chalk.yellow("The movie doesn’t have a declared genre")
}
            \n
  
Spoken Languages:\n
${
  movieDetail.spoken_languages.length > 0
    ? movieDetail.spoken_languages.map((data) => `${data.name}\n`)
    : chalk.yellow(
        `
The movie: ${movieDetail.id} doesn’t have any declared languages
`
      )
}
  
  
            `
          );
          //Ora succeed
          spinner.succeed("Movie data loaded");
        });
      }
    )
    .on("error", (err) => {
      console.log(err);
      //Ora fail
      spinner.fail("The fetch petition failed");
    });
};

//!REVIEWS MOVIES
const movieReviews = (id) => {
  let spinner = ora("Starting the fetch").start();
  https
    .get(
      `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`,
      (resp) => {
        //Spinner Ora
        setTimeout(() => {
          spinner.color = "yellow";
          spinner.text = "Fetching the movies data...";
        }, 1000);
        //Data iremos poniendo/concatenando los atos que nos lleguen
        let data = "";
        //Coger pedazos de datos que nos llegan
        resp.on("data", (chunk) => {
          data += chunk;
        });
        //Cuando ya no hay mas datos que recoger
        resp.on("end", () => {
          const movieReviews = JSON.parse(data);
          if (movieReviews.results.length > 0) {
            if (movieReviews.total_pages > movieReviews.page) {
              console.log("----------------------------------------");
              console.log(
                `Page: ${movieReviews.page} of: ${movieReviews.total_pages}`
              );
            }
            movieReviews.results.map((review) => {
              console.log(
                `
\nAuthor: ${chalk.bold.blue(review.author)}\n
Content: ${
                  review.content.length > 400
                    ? review.content.slice(0, 400).concat("...")
                    : review.content
                }
              `
              );
            });
          } else {
            console.log(
              `
The movie: ${movieReviews.id} doesn’t have any reviews
              `
            );
          }
          //Ora succeed
          spinner.succeed("Movie reviews data loaded");
        });
      }
    )
    .on("error", (err) => {
      console.log(err);
      //Ora fail
      spinner.fail("The fetch petition failed");
    });
};

module.exports = {
  moviePopular,
  moviePlayingNow,
  movieDetails,
  movieReviews,
};

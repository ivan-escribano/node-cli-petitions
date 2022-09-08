//TODO Import fetch functions
// const fetch = require("./fetchData");
// fetch.test();
// fetch.fetchPopular();
//!Import commander
const { program } = require("commander");
const https = require("https");

//!Import .env file and data API KEY
require("dotenv").config();
const API_KEY = process.env.API_KEY;

//!Import ora
const ora = require("ora");

//!Import chalk
const chalk = require("chalk");

//!GET PERSONS POPULAR
program
  .command("get-persons")
  .description("Make a network request to fetch the most popular persons")
  .requiredOption(
    "--page <number>",
    "The page of persons data results to fetch"
  )
  .requiredOption("-p , --popular")
  .action((options) => {
    let spinner = ora("Starting the fetch").start();
    https
      .get(
        `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=en-US&page=${options.page}`,
        (resp) => {
          //Spinner Ora
          setTimeout(() => {
            spinner.color = "yellow";
            spinner.text = "Fetching the popular person's data...";
          }, 1000);
          //Data iremos poniendo/concatenando los atos que nos lleguen
          let data = "";
          //Coger pedazos de datos que nos llegan
          resp.on("data", (chunk) => {
            data += chunk;
          });
          //Cuando ya no hay mas datos que recoger
          resp.on("end", () => {
            const popularPerson = JSON.parse(data);

            popularPerson.results.map((person) => {
              console.log("----------------------------------------\n");
              console.log(
                `Person:\n\n
                 ID: ${person.id}
                 Name: ${chalk.bold.blue(person.name)}
                 Department: ${
                   person.known_for_department === "Acting"
                     ? chalk.magenta(person.known_for_department)
                     : ""
                 }
                 \n
                 Appearing in movies:
                 \n
                 Movie:
                 ${
                   person.known_for.length > 0
                     ? person.known_for.map((movie) => {
                         return `
                  ID: ${movie.id}
                  Release Date:${movie.release_date ?? movie.first_air_date} 
                  Title:${movie.title ?? movie.original_name}
                  `;
                       })
                     : `${person.name} doesn’t appear in any movie\n`
                 }
              `
              );
            });
            //Ora succeed
            spinner.succeed("Data fetched correctly");
            //end pagination
            console.log(
              `----------------------------------------
Page: ${popularPerson.page} of: 500
              `
            );
          });
        }
      )
      .on("error", (err) => {
        console.log(err);
        //Ora fail
        spinner.fail("The fetch petition failed");
      });
  });

//!GET PERSONS DETAILS
program
  .command("get-person")
  .description("Make a network request to fetch the data of a single person")
  .requiredOption("-i , --id <id>", "The id of the person")
  .action((options) => {
    let spinner = ora("Starting the fetch").start();
    https
      .get(
        `https://api.themoviedb.org/3/person/${options.id}?api_key=${API_KEY}&language=en-US`,
        (resp) => {
          //Spinner Ora
          setTimeout(() => {
            spinner.color = "yellow";
            spinner.text = "Fetching the popular person's data...";
          }, 1000);
          //Data iremos poniendo/concatenando los atos que nos lleguen
          let data = "";
          //Coger pedazos de datos que nos llegan
          resp.on("data", (chunk) => {
            data += chunk;
          });
          //Cuando ya no hay mas datos que recoger
          resp.on("end", () => {
            const personDetail = JSON.parse(data);
            console.log(
              `
Person :\n\n

ID: ${personDetail.id}\n
Name: ${chalk.bold.blue(personDetail.name)}\n
Birthday: ${personDetail.birthday} ${chalk.gray("|")} ${
                personDetail.place_of_birth
              }
Department: ${
                personDetail.known_for_department === "Acting"
                  ? chalk.magenta(personDetail.known_for_department)
                  : ""
              }\n
Biography: ${chalk.bold.blue(personDetail.biography)}\n\n
              
Also Known as:\n
${
  personDetail.also_known_as.length > 0
    ? personDetail.also_known_as.map((names) => `${names}\n`)
    : `${personDetail.name} doesn’t have any alternate names\n`
}

              `
            );
            //Ora succeed
            spinner.succeed("Data fetched correctly");
          });
        }
      )
      .on("error", (err) => {
        console.log(err);
        //Ora fail
        spinner.fail("The fetch petition failed");
      });
  });

//!POPULAR MOVIES
program
  .command("get-movies")
  .description("Command to fetch  movies")
  .requiredOption("--page <number>", "The page of movies data results to fetch")
  .option("-p , --popular", "Fetch the popular movies")
  .option("-n , --now-playing", "Fetch the movies that are playing now")
  .action((options) => {
    if (options.popular) {
      fetchPopularMovies(options.page);
    } else if (options.nowPlaying) {
      fetchNowPlayingMovies(options.page);
    } else {
      fetchPopularMovies(options.page);
    }
  });

//!FETCH POPULAR MOVIES
const fetchPopularMovies = (page) => {
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
//!FETCH MOVIES NOW PLAYING
const fetchNowPlayingMovies = (page) => {
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

//!SINGLE MOVIE DETAILS
program
  .command("get-movie")
  .description("Make a network request to fetch the data of a single movie")
  .requiredOption("-i , --id <id>", "The id of the movie")
  .option("-r , --reviews", "Fetch the reviews of the movie")
  .action((options) => {
    options.reviews
      ? fetchMovieReviews(options.id)
      : fetchMovieDetail(options.id);
  });

//!FETCH MOVIES DETAIL

const fetchMovieDetail = (id) => {
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
          Genres :\n ${
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
                  `The movie: ${movieDetail.id} doesn’t have any declared languages`
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

//!FETCH MOVIE REVIEWS
const fetchMovieReviews = (id) => {
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
              Author: ${chalk.bold.blue(review.author)}\n
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
              `The movie: ${movieReviews.id} doesn’t have any reviews`
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
program.parse();

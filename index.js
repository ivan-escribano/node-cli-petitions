//!Import fetch functions
const { personPopular, personDetails } = require("./src/services/fetchPerson");
const {
  moviePopular,
  moviePlayingNow,
  movieDetails,
  movieReviews,
} = require("./src/services/fetchMovie");
//!Import commander
const { program } = require("commander");

//!GET PERSONS POPULAR
program
  .command("get-persons")
  .description("Make a network request to fetch the most popular persons")
  .requiredOption(
    "--page <number>",
    "The page of persons data results to fetch"
  )
  .requiredOption("-p , --popular")
  .option("--save", "store the contents in a json file inside a files folder.")
  .action((options) => {
    options.save
      ? personPopular(options.page, true)
      : personPopular(options.page, false);
  });

//!GET PERSONS DETAILS
program
  .command("get-person")
  .description("Make a network request to fetch the data of a single person")
  .requiredOption("-i , --id <id>", "The id of the person")
  .action((options) => {
    personDetails(options.id);
  });

//!GET POPULAR MOVIES
program
  .command("get-movies")
  .description("Command to fetch  movies")
  .requiredOption("--page <number>", "The page of movies data results to fetch")
  .option("-p , --popular", "Fetch the popular movies")
  .option("-n , --now-playing", "Fetch the movies that are playing now")
  .action((options) => {
    if (options.popular && !options.nowPlaying) {
      moviePopular(options.page);
    } else if (options.nowPlaying) {
      moviePlayingNow(options.page);
    } else {
      moviePopular(options.page);
    }
  });

//!GET SINGLE MOVIE DETAILS & REVIEWS
program
  .command("get-movie")
  .description("Make a network request to fetch the data of a single movie")
  .requiredOption("-i , --id <id>", "The id of the movie")
  .option("-r , --reviews", "Fetch the reviews of the movie")
  .action((options) => {
    options.reviews ? movieReviews(options.id) : movieDetails(options.id);
  });

program.parse();

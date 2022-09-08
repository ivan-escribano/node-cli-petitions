//!CONFIG
const https = require("https");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const API_KEY = process.env.API_KEY;
//!Import ora
const ora = require("ora");
//!Import chalk
const chalk = require("chalk");
//!import fileSystem function
const { writeFile } = require("../utils/fileSystem");
//!FETCH POPULAR PERSON
const personPopular = (page, save) => {
  let spinner = ora("Starting the fetch").start();
  https
    .get(
      `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=en-US&page=${page}`,
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
          if (save) {
            const data = JSON.stringify(popularPerson.results, null, 2);
            writeFile("./src/files/persons/persons.json", data);
            spinner.stop();
            return;
          }
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
};

//!FETCH PERSON DETAILS
const personDetails = (id) => {
  let spinner = ora("Starting the fetch").start();
  https
    .get(
      `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`,
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
\nPerson :\n

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
};

module.exports = {
  personPopular,
  personDetails,
};

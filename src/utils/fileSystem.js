("use strict");
//! Import the filesystem module
const fs = require("fs");
//!Import ora
const ora = require("ora");

//!Import notifier
const notifier = require("node-notifier");

//!Write data in file function
const writeFile = (path, data) => {
  let spinner = ora("\nStarting to write...\n").start();

  try {
    fs.writeFileSync(path, data);
    //Spinner Ora
    setTimeout(() => {
      spinner.color = "green";
      spinner.text = "Writing data...";
    }, 1000);
    // Object notify
    notifier.notify({
      title: "DATOS ESCRITOS CORRECTAMENTE ✅",
      message: "Que tengas un magnifico dia",
    });
    //Ora succeed
    spinner.succeed("Data fetched correctly");
  } catch (error) {
    spinner.fail("The fetch petition failed: " + error);
  }
};

//!Read file data
const readFile = (path) => {
  const data = fs.readFileSync("../files/movies/popular-movies.json", "utf8");
  console.log(data);
  return JSON.parse(data);
};
module.exports = {
  writeFile,
  readFile,
};

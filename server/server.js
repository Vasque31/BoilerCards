// Loads the configuration from config.env to process.env
require("dotenv").config({ path: "./config.env" });
const cookieParser = require('cookie-parser');
const express = require("express");
const cors = require("cors");
// get MongoDB driver connection
const dbo = require("./db/conn");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json({limit:'50mb'}))
app.use(require("./routes/record"));
app.use(cookieParser());
var bodyParser = require('body-parser');
var bodyParser = require('body-parser');
// Global error handling

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    
  });
});

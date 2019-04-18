var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

// Models 
var db = require("./models");

var PORT = 8080;

// Initialize Express
var app = express();

// Morgan for logger requests
app.use(logger("dev"));

// Parse bory as  Json
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Public as static folder
app.use(express.static("public"));

// Connection with Mongo DB
mongoose.connect("mongodb://localhost/newsDB", { useNewUrlParser: true});

// Connection starting
// db.User.create({ name: "News Keeper"})
//     .then(function(dbUser) {
//         console.log(dbUser);
//     })
//     .catch(function(err) {
//         console.log(err.message);
//     });

// Routes

// Route for retrieving all News from website
app.get("/scrape", function(req, res) {
    // The request for news is via axios from Time Magazine website
    axios.get("http://www.time.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        // Catch each element with "column-tout-metadata" class
        $("column-tout-metadata").each(function(i, element) {
            // Get references
            var title = $(element).children("headline").children("a").text();
            var summary = $(element).children("sumary").text();
            var URL = $(element).children("headline").children("a").attr("href");

            // Save refenreces
            var result = {};

            result.title = title;
            result.summary = summary;
            result.URL = URL;
        })
    })
});

// Route for saving a new news with user association
app.post("/submit", function(req, res) {
    db.News.create(req.body)
        .then(function(dbNews) {
            return db.User.find
        })
})
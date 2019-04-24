var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

// Models 
var db = require("./models");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Morgan for logger requests
app.use(logger("dev"));

// Parse body as  Json
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Public as static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/newsDb";

mongoose.connect(MONGODB_URI);

// Connection with Mongo DB
// mongoose.connect("mongodb://localhost:27017/newsDB", { useNewUrlParser: true});


// Routes

// Main route. Route for retrieving all News from website
app.get("/scrappe", function(req, res) {
    // The request for news is via axios from Time Magazine website
    axios.get("http://www.semana.com").then(function(response) {
        var $ = cheerio.load(response.data);

        // Catch each element with "column-tout-metadata" class
        $("h2.article-h").each(function(i, element) {
            // Get references and save refenreces
            var result = {};
            var rootURL = "http://www.semana.com";

            result.title = $(this).children("a").text().trim();
            result.URL = rootURL + $(this).children("a").attr("href");
            //Conditional for news without summary
            if($(this).parents().next("p").text().trim() == "") {
                result.summary = "---- There is not summary for this news  :(";
            } else{
                result.summary = $(this).parents().next("p").text().trim();
            };

            // Using the result object crates an database
            db.News.create(result)
                .then(function(dbNews) {
                    // Console.log result
                    console.log(dbNews);
                }).catch(function(err) {
                    // Check error
                    console.log(err);
                });
            res.send("News scrapped");
        });
    });
});

app.get("/news", function(req, res) {
    // Send result
    db.News.find({})
    .then(function(dbNews) {
        res.json(dbNews);
    }).catch(function(err) {
        res.json(err);
    });
});

app.get("/news/:id", function(req, res) {
    db.News.findOne({ _id: req.params.id })
    .populate("user", "note")
    .then(function(dbNews) {
        res.json(dbNews);
    }).catch(function(err) {
        res.json(err);
    });
});

app.post("/news/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.News.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    }).then(function(dbNews) {
        res.json(dbNews);
    }).catch(function(err) {
        res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port "+PORT);
});
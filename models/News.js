var mongoose = require("mongoose");

// Save the reference to the Schema constructor
var Schema = mongoose.Schema;

// Model to store our news references (title, summary and URL)
// Also create 'note' object as relation with note
var NewsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        require: true
    },
    URL: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Create News model with mongoose's model method 
var News = mongoose.model("News", NewsSchema);

// Export News model
module.exports = News;
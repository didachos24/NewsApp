var mongoose = require("mongoose");

// Save the reference to the Schema constructor
var Schema = mongoose.Schema;

// Model to store notes for News. This model belongs to News model
var NoteSchema = new Schema({
    user: String,
    note: String
});

// Create News model with mongoose's model method 
var Note = mongoose.model("Note", NoteSchema);

// Export News model
module.exports = Note;
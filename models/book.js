const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({id: mongoose.Schema.ObjectId,
	bookName: String,
	author: String,
	price: Number,
	bookDescription: String
});

module.exports = bookSchema;

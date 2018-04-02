const mongoose = require('mongoose')

const pollSchema = new mongoose.Schema({
    name: String,
    options: [{
        type: String
    }],
    votes: [{
        type: Number
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
})

module.exports = mongoose.model('Poll', pollSchema)
const mongoose = require('mongoose');
const slugify = require('slugify');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Adauga titlu']
    }, 
    description: {
        type: String,
        required: [true, 'Adauga descriere'],
    },
    images: {
        type: String,
        default: 'no-photo.jpg'
    },
    video: {
        type: String,
        default: ''
    },  
    url: {
        type: String, 
        required: [true, 'Adauga link github']
    },
    mean: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']  
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user', 
        required: true
    }
});


module.exports = mongoose.model('Project', ProjectSchema);
const mongoose = require('mongoose');

const modelName = 'LookbookIntro';

const lookbookIntroSchema = new mongoose.Schema({
    images: [{
        public_id: String,
        version: Number,
        signature: String,
        width: Number,
        height: Number,
        format: String,
        resource_type: String,
        url: String,
        secure_url: String,
    }],
});

const LookbookIntro = mongoose.model(modelName, lookbookIntroSchema);

module.exports = LookbookIntro;
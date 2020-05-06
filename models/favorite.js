var mongoose = require("mongoose");

var favoriteSchema = new mongoose.Schema({
    user:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Favorites","favoriteSchema");
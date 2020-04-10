var mongoose = require("mongoose");

var leaderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
      type: String,
      required: true
    },
    featured: {
        type: Boolean,
        default:false      
    }
  });

module.exports = mongoose.model("Leader",leaderSchema);

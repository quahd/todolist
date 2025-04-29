const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userInfo = new Schema({
    username: {
        type: String,
        required: true
    },
        // },
    // phone: {
    //     type: String,
    //     required: true 
    // },
    // email: {
    //     type: String,
    //     required: true 
    // },
    password: {
        type: String,
        required: true 
    }
})
const user = mongoose.model("user", userInfo)
module.exports = user
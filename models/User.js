const mongoose = require('mongoose'); /* plugin Mongoose enabling functions and schema */
const uniqueValidator = require('mongoose-unique-validator'); /* plugin to ensure unique user accounts*/

const  userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },/* email unique is true to ensure no user can have same email address as another*/
    password: { type: String, required: true }
}); 

userSchema.plugin(uniqueValidator); /* activation of the plugin for unique user accounts*/

module.exports = mongoose.model('User', userSchema);
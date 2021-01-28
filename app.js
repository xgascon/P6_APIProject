// Adding the framework Express to the project
const express = require('express');
const app = express();

const bodyParser = require('body-parser');/* package enabling to extract JSON objects from queries */
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');/* to reach the server's path in order to save images in the correct folder */

// Dealing with CORS issues
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');/* accessing to the API from every origin */
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());/* extracting JSON objects from queries */

// Connecting to MongoDB database
mongoose.connect('mongodb+srv://SoPekocko_oc:sopekocko@cluster0.e4c0v.mongodb.net/SoPekocko?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use('/images', express.static(path.join(__dirname, 'images')));/* 'images' folder static so GET query that reaches the image can work */
app.use('/api/sauces', sauceRoutes);/* managing the sauces in the API */
app.use('/api/auth', userRoutes);/* path to signup & login to the API*/

module.exports = app;
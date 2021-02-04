const bcrypt = require('bcrypt');/* package bcrypt to hash elements */
const jwt = require('jsonwebtoken');/* jsonwebtoken plugin enabling to generate tokens for autentication purposes */
var CryptoJS = require("crypto-js");/* plugin to crypt email */
const passwordValidator = require('password-validator');/* plugin for password validation */
const User = require('../models/User');/* import the user schema */

// Setting up the password validation
var schema = new passwordValidator();
schema
	.is().min(8) /* min 8 characters */
	.has().uppercase() /* at least one uppercase letter */
	.has().lowercase() /* at least one lowercase letter */
  .has().digits(1) /* at least one digit */
  .has().not().spaces() /* no space */
  .has().symbols() /* at least one symbole */

// Signing up controller
exports.signup = (req, res, next) => {
  if(!schema.validate(req.body.password)){/* if password is not fulfilling the schema setups */ 
    throw { error: 'Le mot de passe doit contenir au minimum 8 caratères sans espace au sein desquels au moins 1 majuscule, 1 minuscule, 1 chiffre et un symbole'} //error if password not secure enough
  } else {
    bcrypt.hash(req.body.password, 10)/* hashing the password for security purposes */
      .then(hash => {
        const user = new User({
          email: CryptoJS.HmacSHA1(req.body.email, "Key").toString(), /* email Encryption */
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error: 'Le mot de passe doit faire entre 6 et 20 caractères et contenir 1 majuscule, 1 minuscule et 1 chiffre minimum' }));
  }
};

// Logging in controller
exports.login = (req, res, next) => {
  var emailUserConnect = CryptoJS.HmacSHA1(req.body.email, "Key").toString(); /* email encryption to compare with email in DBase */
  console.log(emailUserConnect);

  User.findOne({ email: emailUserConnect })/* looking for an email in database that would match the email logged in */
    
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });          
      }
      bcrypt.compare(req.body.password, user.password)/* if email matches one in database, we compare the password looged in with the one linked to the user */
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(/* generating a token */
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
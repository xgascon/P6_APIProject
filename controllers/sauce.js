const Sauce = require('../models/Sauce');/* import the sauce schema */
const fs = require ('fs');/* package 'file system' to access, modify and delete files */

// Creating a sauce controller
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,/* Creating the image URL */
    likes: 0,/* Ensuring likes and dislikes are at 0 when sauce is created */
    dislikes: 0
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Accessing to one sauce controller
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Deleting a sauce controller
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {/* deleting the image file from the folder 'images' */
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Accessing to all sauces controller
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// Modifying one sauce controller
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?/* checking if a new image has to be uploaded */
    {
    ...JSON.parse(req.body.sauce),/* translating into a JS object */
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };/* if no image to upload, sauceObject corresponds to what has been fulfilled in the form */
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Liking/Disliking a sauce controller
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      switch (req.body.like) {/* depending on the different cases of the like situation */
        case 0 :/* the user presses button like/dislike he already pressed before */        
          if (sauce.usersLiked.includes(req.body.userId)) {/* If user already liked the sauce */  
            // We remove userId from the table and we decrease the like by 1            
            Sauce.updateOne({ _id: req.params.id }, { $pull: {usersLiked: req.body.userId}, $inc: {likes: -1} , _id: req.params.id })
              .then(() => res.status(201).json({ message: "Le like de la sauce a été retiré" }))
              .catch(error => res.status(400).json({ error }));
          }           
          else if (sauce.usersDisliked.includes(req.body.userId)) {/* If user already disliked the sauce */
            // We remove userId from the table and we decrease the dislike by 1
            Sauce.updateOne({ _id: req.params.id }, { $pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1} , _id: req.params.id })
            .then(() => res.status(201).json({ message: "Le dislike de la sauce a été retiré" }))
            .catch(error => res.status(400).json({ error }));
          } 
        break;

        case 1 :/* the user just liked */          
          if (!sauce.usersLiked.includes(req.body.userId)) {/* if user did not already liked the sauce */
            // We add userId in the table and we increase the like by 1
            Sauce.updateOne({ _id: req.params.id }, { $push: {usersLiked: req.body.userId}, $inc: {likes: 1} , _id: req.params.id })
              .then(() => res.status(201).json({ message: "La sauce a été likée" }))
              .catch(error => res.status(400).json({ error }));
          }
        break; 

        case -1 :/* the user just disliked */          
          if (!sauce.usersDisliked.includes(req.body.userId)) {// if user did not already disliked tthe sauce
            // We add userId in the table and we increase the dislike by 1
            Sauce.updateOne({ _id: req.params.id }, { $push: {usersDisliked: req.body.userId}, $inc: {dislikes: 1} , _id: req.params.id })
              .then(() => res.status(201).json({ message: "La sauce a été dislikée" }))
              .catch(error => res.status(400).json({ error }));
          }      
        break;

        default:
				  throw { error: "Un problème est survenu" };
      }
      
    })
    .catch(error => res.status(400).json({ error }));
};
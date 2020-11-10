const Sauce = require('../models/Sauce');
const fs = require ('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//Creating the image URL
    likes: 0,
    dislikes: 0
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
        .catch(error => res.status(400).json({ error }));
    });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      switch (req.body.like) {
        case 0 :
          // Si l'utilisateur a déjà liké la sauce
          if (sauce.usersLiked.includes(req.body.userId)) {
            // On retire l'userId du tableau et on diminue le like de 1            
            Sauce.updateOne({ _id: req.params.id }, { $pull: {usersLiked: req.body.userId}, $inc: {likes: -1} , _id: req.params.id })
              .then(() => res.status(201).json({ message: "La sauce a été likée" }))
              .catch(error => res.status(400).json({ error }));
          } 
          // Si l'utilisateur a déjà disliké la sauce
          else if (sauce.usersDisliked.includes(req.body.userId)) {
            // On retire l'userId du tableau et on diminue le dislike de 1
            Sauce.updateOne({ _id: req.params.id }, { $pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1} , _id: req.params.id })
            .then(() => res.status(201).json({ message: "La sauce a été dislikée" }))
            .catch(error => res.status(400).json({ error }));
          } 
        break;

        case 1 :
          // Si l'utilisateur n'a pas déjà liké la sauce
          if (!sauce.usersLiked.includes(req.body.userId)) {
            // On ajoute l'userId dans le tableau et augmente le like de 1
            Sauce.updateOne({ _id: req.params.id }, { $push: {usersLiked: req.body.userId}, $inc: {likes: 1} , _id: req.params.id })
              .then(() => res.status(201).json({ message: "Le like a été supprimé" }))
              .catch(error => res.status(400).json({ error }));
          }
        break; 

        case -1 :
          // Si l'utilisateur n'a pas déjà disliké la sauce
          if (!sauce.usersDisliked.includes(req.body.userId)) {
            // On ajoute l'userId dans le tableau et augmente le dislike de 1
            Sauce.updateOne({ _id: req.params.id }, { $push: {usersDisliked: req.body.userId}, $inc: {dislikes: 1} , _id: req.params.id })
              .then(() => res.status(201).json({ message: "Le dislike a été supprimé" }))
              .catch(error => res.status(400).json({ error }));
          }      
        break;

        default:
				  throw { error: "Un problème est survenu" };
      }
      
    })
    .catch(error => res.status(400).json({ error }));
};
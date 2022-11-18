import express from "express";
import Couleur from "../models/couleur.js";
const router = express.Router();

// affiche tous les utilisateurs, triés par noms de famille
router.get("/", (req, res) => {
  Couleur.find().sort('surname').exec(function (err, couleurs) {
    if (err) {
      return next(err);
    }
    res.send(couleurs);
  });
});

// affiche un utilisateur, selon son id
router.get("/:id", (req, res) => {
  Couleur.findById(req.params.id, function (err, couleur) {
    if (err) return res.sendStatus(404)
    return res.json(couleur)
  });
});

// ajouter une couleur
router.post('/', function (req, res, next) {
  const newCouleur = new Couleur(req.body);
  newCouleur.save(function (err, savedCouleur) {
    if (err) {
      return next(err);
    }
    res.send(savedCouleur);
  });
});

// modifier une couleur
router.put("/:id", (req, res) => {
  const modifiedCouleur = new Couleur(req.body);
  Couleur.findByIdAndUpdate(req.params.id, modifiedCouleur, function (err, couleur) {
    if (err) {
      console.log(err)
      res.sendStatus(400);
    } else {
      //res.sendStatus(200);
      res.send(modifiedCouleur);
    }
  });
});

// supprimer une couleur
router.delete("/:id", (req, res) => {
  Couleur.findByIdAndDelete(req.params.id, function (err, couleur) {
    if (err) {
      console.log(err)
      res.sendStatus(400)
    } else {
      console.log("Deleted : ", couleur);
      res.sendStatus(200)
    }
  });
});


export default router;
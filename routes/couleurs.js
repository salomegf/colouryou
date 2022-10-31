import express from "express";
import Couleur from "../models/couleur.js";
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Got a response from the couleurs route");
});

router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newCouleur = new Couleur(req.body);

  // Save that document
  newCouleur.save(function(err, savedCouleur) {
    if (err) {
      return next(err);
    }

    // Send the saved document in the response
    res.send(savedCouleur);
  });
});

export default router;
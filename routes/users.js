import express from "express";
import User from "../models/user.js";
const router = express.Router();

// ajouter authentification

// affiche tous les utilisateurs, triés par noms de famille
router.get("/", (req, res) => {
  User.find().sort('surname').exec(function (err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

// affiche un utilisateur, selon son id
router.get("/:id", (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.sendStatus(404)
    return res.json(user)
  });
});

// ajouter un utilisateur
router.post('/', function (req, res, next) {
  const newUser = new User(req.body);
  newUser.save(function (err, savedUser) {
    if (err) {
      return next(err);
    }
    res.send(savedUser);
  });
});

export default router;
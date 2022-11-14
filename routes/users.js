import bcrypt from "bcrypt";
import express from "express";
import User from "../models/user.js";
const router = express.Router();

// ajouter authentification

// affiche tous les utilisateurs, triés par noms de famille
router.get("/", (req, res) => {
  let query = User.find()

  // filtre par utilisateur
  if (req.query.username) {
    query = query.where('username').equals(req.query.username)
  }
  // filtre par prénom
  if (req.query.name) {
    query = query.where('name').equals(req.query.name)
  }
  // filtre par nom de famille
  if (req.query.surname) {
    query = query.where('surname').equals(req.query.surname)
  }

  query.sort('surname').exec(function (err, users) {
    res.send(users);
  })
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

  const plainPassword = req.body.password;
  const costFactor = 10;

  bcrypt.hash(plainPassword, costFactor, function (err, hashedPassword) {
    if (err) {
      return next(err);
    }

    const newUser = new User(req.body);
    newUser.password = hashedPassword;
    newUser.save(function (err, savedUser) {
      if (err) {
        return next(err);
      }
      res.send(savedUser);
    });
  });
});

export default router;
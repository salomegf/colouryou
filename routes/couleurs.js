import express from "express";
import Couleur from "../models/couleur.js";
import { broadcastMessage } from "../ws.js";

const router = express.Router();

// affiche toutes les couleurs
router.get("/", (req, res, next) => {
  Couleur.find().count(function (err, total) {
    if (err) {
      return next(err);
    }

    // Pagination pour les couleurs
    let query = Couleur.find();
    const maxPerPage = 10;

    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    let pageSize = parseInt(req.query.pageSize, 10);
    if (isNaN(pageSize) || pageSize < 0 || pageSize > maxPerPage) {
      pageSize = maxPerPage;
    }

    query = query.skip((page - 1) * pageSize).limit(pageSize);

    query.exec(function (err, colors) {
      if (err) {
        return next(err);
      }
      res.send({
        data: colors,
        page: page,
        pageSize: pageSize,
        total: total,
      });
    });
  });
});

// affiche un utilisateur, selon son id
router.get("/:id", (req, res) => {
  Couleur.findById(req.params.id, function (err, couleur) {
    if (err) return res.sendStatus(404);
    return res.json(couleur);
  });
});

// ajouter une couleur
router.post("/", function (req, res, next) {
  const newCouleur = new Couleur(req.body);
  newCouleur.save(function (err, savedCouleur) {
    if (err) {
      return next(err);
    }
    res.send(savedCouleur);

    broadcastMessage({
      event: "colorAdded",
      colors: savedCouleur.name
    });
  });
});

// modifier une couleur
router.put("/:id", (req, res) => {
  const modifiedCouleur = new Couleur(req.body);
  Couleur.findByIdAndUpdate(
    req.params.id,
    modifiedCouleur,
    function (err, couleur) {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        //res.sendStatus(200);
        res.send(modifiedCouleur);
      }
    }
  );
});

// supprimer une couleur
router.delete("/:id", (req, res) => {
  Couleur.findByIdAndDelete(req.params.id, function (err, couleur) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      console.log("Deleted : ", couleur);
      res.sendStatus(200);
    }
  });
});

export default router;

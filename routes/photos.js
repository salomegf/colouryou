import express from "express";
import Photo from "../models/photo.js";
import mongoose from 'mongoose'
import { broadcastMessage } from "../ws.js";

const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();

// affiche toutes les photos, triées par date et heure
/* router.get("/", (req, res) => {
  Photo.find().sort('date').exec(function (err, photos) {
    if (err) {
      return next(err);
    }
    res.send(photos);
  });
}); */

router.get("/", (req, res, next) => {
  Photo.find().count(function (err, total) {
    if (err) {
      return next(err);
    }

    let query = Photo.find();
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

    // filtre par utilisateur
    if (ObjectId.isValid(req.query.user)) {
      query = query.where("user").equals(req.query.user);
    }
    /* // filtre par couleur
  if (req.query.name) {
    query = query.where('name').equals(req.query.name)
  }
  // filtre par date
  if (req.query.surname) {
    query = query.where('surname').equals(req.query.surname)
  } */

    query.sort("date").exec(function (err, photos) {
      if (err) {
        return next(err);
      }
      res.send({
        data: photos,
        page: page,
        pageSize: pageSize,
        total: total,
      });
    });
  });
});

// affiche une photo, selon son id
router.get("/:id", (req, res) => {
  Photo.findById(req.params.id, function (err, photo) {
    if (err) return res.sendStatus(404);
    return res.json(photo);
  });
});

// ajouter une photo
router.post("/", function (req, res, next) {
  const newPhoto = new Photo(req.body);
  newPhoto.save(function (err, savedPhoto) {
    if (err) {
      return next(err);
    }
    res.send(savedPhoto);
    broadcastMessage({
      event: "photoPosted"
    });
  });
});

// supprimer une photo
router.delete("/:id", (req, res) => {
  Photo.findByIdAndDelete(req.params.id, function (err, photo) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      console.log("Deleted : ", photo);
      res.sendStatus(200);
    }
  });
});

export default router;

import express from "express";
import Photo from "../models/photo.js";
const router = express.Router();

// affiche toutes les photos, triées par date et heure
router.get("/", (req, res) => {
  Photo.find().sort('date').exec(function (err, photos) {
    if (err) {
      return next(err);
    }
    res.send(photos);
  });
});

// affiche une photo, selon son id
router.get("/:id", (req, res) => {
  Photo.findById(req.params.id, function (err, photo) {
    if (err) return res.sendStatus(404)
    return res.json(photo)
  });
});

// ajouter une photo
router.post('/', function (req, res, next) {
  const newPhoto = new Photo(req.body);
  newPhoto.save(function (err, savedPhoto) {
    if (err) {
      return next(err);
    }
    res.send(savedPhoto);
  });
});

// supprimer une photo
router.delete("/:id", (req, res) => {
  Photo.findByIdAndDelete(req.params.id, function (err, photo) {
    if (err) {
      console.log(err)
      res.sendStatus(400)
    } else {
      console.log("Deleted : ", photo);
      res.sendStatus(200)
    }
  });
});


export default router;
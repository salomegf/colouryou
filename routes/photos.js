import express from "express";
import Photo from "../models/photo.js";
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Got a response from the photos route");
});

router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newPhoto = new Photo(req.body);

  // Save that document
  newPhoto.save(function(err, savedPhoto) {
    if (err) {
      return next(err);
    }

    // Send the saved document in the response
    res.send(savedPhoto);
  });
});

export default router;
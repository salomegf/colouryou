import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
// possible qu'il faut importer dot.env --> Regarder slides
const secretKey = process.env.SECRET_KEY ||"change"

const router = express.Router();

//Login
router.post("/", function (req, res, next) {
    User.findOne({ username: req.body.username }).exec(function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return res.sendStatus(401);
        }
        //Validate the password with bcrypt
        bcrypt.compare(req.body.password, user.password, function (err, valid) {
            if (err) {
                return next(err);
            } else if (!valid) {
                return res.sendStatus(401);
            }
            //Generate a valid JWT that expires in 7 days
            const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600
            const payload = { sub: user._id.toString(), exp: exp }
            jwt.sign(payload, secretKey, function (err, token) {
                if (err) {
                    return next(err)
                }
                //res.send({ token: token })
                res.send("Bienvenue " + req.body.username)
            })
        });
    })
});

export function authenticate(req, res, next) {
    // Ensure the header is present.
    const authorization = req.get("Authorization");
    if (!authorization) {
      return res.status(401).send("Authorization header is missing");
    }
    // Check that the header has the correct format.
    const match = authorization.match(/^Bearer (.+)$/);
    if (!match) {
      return res.status(401).send("Authorization header is not a bearer token");
    }
    // Extract and verify the JWT.
    const token = match[1];
    jwt.verify(token, secretKey, function(err, payload) {
      if (err) {
        return res.status(401).send("Your token is invalid or has expired");
      } else {
        req.currentUserId = payload.sub;
        next(); // Pass the ID of the authenticated user to the next middleware.
      }
    });
  }

export default router;
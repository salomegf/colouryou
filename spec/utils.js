import User from "../models/user.js"
import Couleur from "../models/couleur.js"
import jwt from "jsonwebtoken"

export const cleanUpDatabase = async function () {
    await Promise.all([
        User.deleteMany(),
        Couleur.deleteMany()
    ]);
};

export function generateValidJwt(user) {
    // Generate a valid JWT which expires in 7 days.
    const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
    const claims = {
        sub: user._id.toString(),
        exp: exp
    };
    return new Promise((resolve, reject) => {
        jwt.sign(claims, process.env.SECRET_KEY, function (err, token) {
            if (err) {
                return reject(err);
            }
            resolve(token);
        });
    });
}
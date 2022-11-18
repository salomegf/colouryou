import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import {
    cleanUpDatabase,
    generateValidJwt
} from "./utils.js"
import Couleur from "../models/couleur.js"

beforeEach(cleanUpDatabase);

describe('PUT /couleurs', function () {
    let green;
    beforeEach(async function () {
        green = await Promise.all([
            Couleur.create({
                name: 'Green',
                hex: '4DFF00',
                datePosted: '02-12-2022'
            })
        ]);
    });
    test('should modify a color', async function () {
        const id = (await Couleur.findOne({
            hex: '4DFF00'
        }))._id;
        const res = await supertest(app)
            .put(`/couleurs/${id}`)
            .send({
                _id: id,
                name: 'Vert',
                hex: '4DFF00',
                datePosted: '02-12-2022'
            })
            .expect(200)
            .expect('Content-Type', /json/);
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.name).toEqual('Vert');
        expect(res.body.hex).toEqual('4DFF00');
        expect(res.body.datePosted).toEqual('2022-02-11T23:00:00.000Z');
        expect(res.body).toContainAllKeys(['name', 'hex', 'datePosted', '_id'])
    });
});

describe('DELETE /couleurs', function () {
    let red;
    beforeEach(async function () {
        red = await Promise.all([
            Couleur.create({
                name: 'Red',
                hex: 'FF0000',
                datePosted: '02-12-2022'
            })
        ]);
    });
    test('should delete a color', async function () {
        const id = (await Couleur.findOne({
            hex: 'FF0000'
        }))._id;
        const res = await supertest(app)
            .delete(`/couleurs/${id}`)
            .expect(200)
            /* .expect('Content-Type', /json/);
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.name).toEqual('Vert');
        expect(res.body.hex).toEqual('4DFF01');
        expect(res.body.datePosted).toEqual('2022-02-11T23:00:00.000Z');
        expect(res.body).toContainAllKeys(['name', 'hex', 'datePosted', '_id']) */
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});
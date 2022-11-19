import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import {
    cleanUpDatabase,
    generateValidJwt
} from "./utils.js"
import User from "../models/user.js"

beforeEach(cleanUpDatabase);

describe('POST /users', function () {
    it('should create a user', async function () {
        const res = await supertest(app)
            .post('/users')
            .send({
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: '12345678',
                username: 'johndoe',
                age: '30',
                admin: false
            })
            .expect(200)
            .expect('Content-Type', /json/);
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.name).toEqual('John');
        expect(res.body.surname).toEqual('Doe');
        expect(res.body.email).toEqual('john.doe@example.com');
        expect(res.body.username).toEqual('johndoe');
        expect(res.body.age).toEqual(30);
        expect(res.body.admin).toEqual(false);
        expect(res.body).toContainAllKeys(['name', 'surname', 'email', 'username', 'age', 'admin', '_id'])
    });
});

describe('GET /users', function () {
    let johnDoe;
    let janeDoe;
    beforeEach(async function () {
        [johnDoe, janeDoe] = await Promise.all([
            User.create({
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: '12345678',
                username: 'johndoe',
                age: '30',
                admin: false
            }),
            User.create({
                name: 'Jane',
                surname: 'Doe',
                email: 'jane.doe@example.com',
                password: '12345678',
                username: 'janedoe',
                age: '30',
                admin: false
            })
        ]);
    });
    test('should retrieve the list of users', async function () {
        //const token = await generateValidJwt(johnDoe);
        const res = await supertest(app)
            .get('/users')
            //.set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);
        expect(res.body.data).toBeArray();
        expect(res.body.data).toBeArrayOfSize(2);
        expect(res.body.data[0]).toBeObject();
        expect(res.body.data[0]._id).toEqual(johnDoe.id);
        expect(res.body.data[0].name).toEqual('John');
        expect(res.body.data[0].surname).toEqual('Doe');
        expect(res.body.data[0].email).toEqual('john.doe@example.com');
        expect(res.body.data[0].username).toEqual('johndoe');
        expect(res.body.data[0].age).toEqual(30);
        expect(res.body.data[0].admin).toEqual(false);
        expect(res.body.data[0]).toContainAllKeys(['name', 'surname', 'email', 'username', 'age', 'admin', '_id'])

        expect(res.body.data[1]).toBeObject();
        expect(res.body.data[1]._id).toEqual(janeDoe.id);
        expect(res.body.data[1].name).toEqual('Jane');
        expect(res.body.data[1].surname).toEqual('Doe');
        expect(res.body.data[1].email).toEqual('jane.doe@example.com');
        expect(res.body.data[1].username).toEqual('janedoe');
        expect(res.body.data[1].age).toEqual(30);
        expect(res.body.data[1].admin).toEqual(false);
        expect(res.body.data[1]).toContainAllKeys(['name', 'surname', 'email', 'username', 'admin', 'age', '_id'])
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});
// import request from 'supertest';
const request = require('supertest');
// import app from './app.js';
const app = require('../app.js');

// const db = require('../databse');

// const test = require('../tasks')

// jest.mock('../database');

describe("POST /apptest",  () => {

    describe("200", () => {
        test("hi", async () => {
             const response = await request(app).post('/apptest').send({
                username: "username",
                password: "password"
             });
            expect(response.statusCode).toBe(200);
        });


    });

});
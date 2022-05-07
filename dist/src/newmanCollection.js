"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const newman_collection_1 = require("newman-collection");
const pm = require('newman');
let oCollection = new newman_collection_1.Collection([
    // test GET
    new newman_collection_1.Item('Test GET request')
        .get('https://postman-echo.com/get?foo1=bar1&foo2=bar2')
        .pm.test('This is test A', () => {
        pm.response.to.be.ok;
    })
        .pm.test('This is test B', () => {
        pm.response.to.be.ok;
    }),
    // test POST
    new newman_collection_1.Item('Test POST request')
        .post('https://postman-echo.com/post')
        .headers({ 'Content-Type': 'text/plain' })
        .body('test')
        .pm.test('body should be same', () => {
        pm.response.to.have.jsonBody('data', 'test');
    }),
    // test auth
    new newman_collection_1.Item('Test basic auth')
        .get('https://postman-echo.com/basic-auth')
        .auth.basic({ username: 'postman', password: 'password' })
        // @ts-ignore
        .pm.test('Must be authenticated', () => {
        pm.response.to.have.jsonBody('authenticated', true);
    })
]);
pm.run({
    collection: oCollection.collection,
    reporters: ['cli']
});

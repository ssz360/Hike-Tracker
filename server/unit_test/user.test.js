"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const user = require("../dao/users");
const { expect } = require('chai');


describe('tests for coverage :)', () => {

    test('get all parkings', async () => {
        let res = await user.getType()
        expect(res.length).to.be.greaterThan(0);
    })


})
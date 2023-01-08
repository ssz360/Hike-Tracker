"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const hikes = require("../dao/hikes");
const { expect } = require('chai');


describe('tests for coverage :)', () => {

    test('get all parkings', async () => {
        let res = await hikes.getHike(1)
        expect(res).to.not.null;
    })


})
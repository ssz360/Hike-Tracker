"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const rfp = require("../dao/referencePoints");
const { expect } = require('chai');


describe('tests for coverage :)', () => {

    test('get all parkings', async () => {
        let res = await rfp.getHikeById(1)
        expect(res).to.not.null;
    })


})
'use strict';

const chai = require('chai');

let Server = require('../server')();
let config = require('../config');

let should = chai.should;
let expect = chai.expect;


describe('check server configurations', () => {
    it('server should initialise without error', (done) => {
        let server = Server.server; // uninitialised server
        serverShouldBeUninitialized(server);

        Server.create(config);

        serverShouldBeInitialized(server, config);

        done();
    });
});

let serverShouldBeInitialized = (server, config) => {
    expect(server.get('env'))
        .to.equal(config.env);
    expect(server.get('port'))
        .to.equal(config.port);
    expect(server.get('hostname'))
        .to.equal(config.hostname);
    expect(server.get('viewDir'))
        .to.equal(config.viewDir);
    expect(server.get('views'))
        .to.equal(config.viewDir);
    expect(server.get('view engine'))
        .to.equal('.hbs');
}

let serverShouldBeUninitialized = (server) => {
    shouldBeNull(server.get('env'));
    shouldBeNull(server.get('port'));
    shouldBeNull(server.get('hostname'));
    shouldBeNull(server.get('viewDir'));
    shouldBeNull(server.get('views'));
    shouldBeNull(server.get('view engine'));
};

let shouldBeNull = (object) => {
    it('object should be null', () => {
        should.not.exist(object);
    });
};
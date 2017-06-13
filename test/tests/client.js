"use strict";
global.log = require("../../src/log.js");

const Helper = require("../../src/helper");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const fs = require("fs");
const fsextra = require("fs-extra");
const path = require("path");
let colors = require("colors/safe");
const ClientManager = require("../../src/clientManager");
const tmp = require("tmp");
// make temp dir what will be cleaned up on exit
const tmpdir = tmp.dirSync().name;

Helper.setHome(tmpdir);
console.log(tmpdir);
fsextra.ensureDirSync(Helper.USERS_PATH);
let manager = new ClientManager();

describe("server client", () => {
	describe("add", () => {
		it("should create user Testuser", () => {
			let value =	manager.addUser({name: "Testuser", password: "password", enableLog: 1})
				.then(()=> JSON.parse(fs.readFileSync(path.join(Helper.USERS_PATH, "Testuser.json"), "utf8")));
			return expect(value).to.eventually.deep.equal({user: "Testuser", password: "password", log: 1, networks: []});
		});
		it("should not create user Testuser again", () => {
			let value =	manager.addUser({name: "Testuser", password: "password", enableLog: 1});
			return expect(value).to.be.rejectedWith(`Error creating user, user ${colors.bold("Testuser")} already exist.`);
		});

		it("should not create user ../Testuser", () => {
			let value =	manager.addUser({name: "../Testuser", password: "password", enableLog: 1});
			return expect(value).to.be.rejectedWith(`Error creating user, user ${colors.bold("../Testuser")} is an invalid username.`);
		});
	});
	describe("update", () => {
		it("should update user Testuser", () => {
			let value =	manager.updateUser({name: "Testuser", opts: {test: "test"}})
				.then(()=> JSON.parse(fs.readFileSync(path.join(Helper.USERS_PATH, "Testuser.json"), "utf8")));
			return expect(value).to.eventually.deep.equal({user: "Testuser", password: "password", log: 1, networks: [], test: "test"});
		});
		it("should fail to update Testuser with no opts", () => {
			let value =	manager.updateUser({name: "Testuser"});
			return expect(value).to.be.rejectedWith(`Error updating user, options for user ${colors.bold("Testuser")} are not set.`);
		});
		it("should fail to update ../Testuser", () => {
			let value =	manager.updateUser({name: "../Testuser", opts: {test: "test"}});
			return expect(value).to.be.rejectedWith(`Error updating user, user ${colors.bold("../Testuser")} does not exist.`);
		});
	});

	describe("remove", () => {
		it("should remove user Testuser", () => {
			let value =	manager.removeUser({name: "Testuser"})
				.then(()=> fs.existsSync(path.join(Helper.USERS_PATH, "Testuser.json")));
			return expect(value).to.eventually.deep.equal(false);
		});
		it("should fail to remove Testuser again", () => {
			let value =	manager.removeUser({name: "Testuser"});
			return expect(value).to.be.rejectedWith(`Error removing user, user ${colors.bold("Testuser")} does not exist.`);
		});
	});
});

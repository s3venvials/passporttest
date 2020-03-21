const chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var chaiHttp = require('chai-http');
chai.use(chaiAsPromised);
chai.use(chaiHttp)
const assert = chai.assert;
const utils = require("../utils");
const UserModel = require("../models/user").User;
const PORT = 5000;
require("../server");


describe('run', function () {

    after(function() {
        process.exit();
    })

    describe("user authentication", function () {

        describe("user registration", function () {

            it("should register a new user over GET", async () => {
                try {
                    let response = await utils.RequestGet(`http://localhost:${PORT}/api/user/register?username=${utils.makeDoc(7)}&password=test&firstName=Test&lastName=User&email=test_user@test.com`);
                    let user = JSON.parse(response.body);
                    assert.isObject(user);
                    assert.equal(user.Message, 'Registration successful!');
                    assert.hasAllKeys(user,
                        [
                            "Message",
                            "User",
                            "Error"
                        ]);
                    assert.isNotNull(user.User);
                    assert.isNull(user.Error);
                } catch (error) {
                    assert.fail(error);
                }
            });

            it("should prevent registering duplicate users", async () => {
                try {
                    let userName = utils.makeDoc(7);
                    await utils.RequestGet(`http://localhost:${PORT}/api/user/register?username=${userName}&password=test&firstName=Test&lastName=User&email=test_user@test.com`);
                    let response = await utils.RequestGet(`http://localhost:${PORT}/api/user/register?username=${userName}&password=test&firstName=Test&lastName=User&email=test_user@test.com`);
                    let user = JSON.parse(response.body);
                    assert.isObject(user);
                    assert.isNull(user.Message);
                    assert.isNull(user.User);
                    assert.equal(user.Error, 'The provided username has already been registered.');
                } catch (error) {
                    assert.fail(error);
                }
            });
        });

        describe("user sessions", function () {

            it("should log a user in over GET", async () => {
                try {
                    let userName = utils.makeDoc(7);
                    await utils.RequestGet(`http://localhost:${PORT}/api/user/register?username=${userName}&password=test&firstName=Test&lastName=User&email=test_user@test.com`);
                    let response = await utils.RequestGet(`http://localhost:${PORT}/api/user/login?username=${userName}&password=test`);
                    let user = JSON.parse(response.body);
                    assert.isObject(user);
                    assert.equal(user.status, "Signed In");
                    assert.equal(user.authenticated, true);
                } catch (error) {
                    assert.fail(error);
                }
            });

            it("should fetch the currently logged in user", async () => {
                try {
                    await utils.RequestGet(`http://localhost:${PORT}/api/user/register?username=${utils.makeDoc(7)}&password=test&firstName=Test&lastName=User&email=test_user@test.com`);
                    await utils.RequestGet(`http://localhost:${PORT}/api/user/login?username=${utils.makeDoc(7)}&password=test`);
                    let response = await utils.RequestGet(`http://localhost:${PORT}/api/user/current`);
                    utils.pretty(response.body, true);
                } catch (error) {
                    assert.fail(error);
                }

            });
        });
    });

});
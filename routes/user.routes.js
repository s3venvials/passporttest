const userModel = require("../models/user").User;
const bcrypt = require("bcryptjs");
let passport = require("passport");

module.exports = (app) => {

  //Example: 
  //http://localhost:5000/api/user/register?username=1234567&password=test1&firstName=Test&lastName=User&email=test_user@test.com
  app.get("/api/user/register", async (req, res) => {

    let response = { Error: null, Message: null, User: null };

    try {

        let { username, password } = req.query;

        let users = await userModel.find({});
        
        for (var i = 0; i < users.length; i++) {
            if (bcrypt.compareSync(username, users[i].username)) {
                response.Error = ("The provided username has already been registered.");
                return res.json(response);
            }
        }

        let newUser = new userModel(req.query);

        //Save user
        newUser.username = bcrypt.hashSync(username);
        await newUser.setPassword(password);
        await newUser.save();

        response.User = newUser;
        response.Message = "Registration successful!";

        res.json(response);

    } catch (error) {
      response.Error = error.toString();
      res.json(response);
    }
  });

  app.get("/api/user/login", passport.authenticate("local"), function (req, res) {
    req.session.save((err) => {
      if (err) {
        return res.json({ message: "Failed to sign in", err });
      }

      res.json({ status: "Signed In", authenticated: req.isAuthenticated(), user: req.user, session: req.session });
    });
  });


  app.get("/api/user/current", async (req, res) => {
    try {
      res.json({ user: req.user });
    } catch (error) {
      res.status(400).json(error);
    }
  });

};
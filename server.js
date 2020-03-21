const express = require("express"),
appEnv = ["prod", "dev", "debug"].includes(process.env.NODE_ENV) ? process.env.NODE_ENV : "debug",
mongoose = require("mongoose"),
mongooseOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
PORT = process.env.PORT || 5000,
HOST = process.env.HOST || "localhost";
cookieParser = require("cookie-parser"),
session = require("express-session"),
{ passportService } = require("./modules/passport.services");
let { MongoMemoryServer } = require("mongodb-memory-server");

let listen = (app, port = 9000, host = "localhost") => {
    return new Promise((resolve, reject) => {
      app.listen(port, host, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(`${host}:${port}`);
        }
      });
    });
  }


let Run = async () => {
    let report = { message: null, error: null, appURL: null, dbStatus: null };
    try {
        
        mongoServer = new MongoMemoryServer();
        mongoEnv = await mongoServer.getUri();
        await mongoose.connect(mongoEnv, mongooseOptions);
        
        const app = express();
        app.use(cookieParser('your secret here'));
        app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 180 * 60 * 1000
            }
        }));

        //Initialize Passport.js
        passportService(app);

        //ROUTES
        require("./routes/user.routes")(app);
      
        await listen(app, PORT, HOST);

        report = { 
            message: `The Run app started in ${appEnv} and is successfully running.`,
            error: null,
            appURL: `http://${HOST}:${PORT}`,
            dbStatus: "Connected to DB!",
            dbURL: mongoEnv
        }

        console.log(report);

    } catch (error) {
        try {
            if (!!mongoServer) await mongoServer.stop();
            await mongoose.disconnect();
        } catch { }
        report.error = error;
        console.log(report);
        process.exit(1);
    }
}
Run();
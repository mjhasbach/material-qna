"use strict";

let session = require('express-session'),
    SessionStore = require('express-mysql-session'),
    config = require('./server_config'),
    auth = module.exports = {
        passport: require('passport'),
        init: function(app, db) {
            let sessionStore = new SessionStore(
                {
                    host: config.db.host,
                    port: config.db.port,
                    database: config.db.name,
                    user: config.db.username,
                    password: config.db.password
                }
            );

            app.use(session({
                resave: false,
                store: sessionStore,
                saveUninitialized: false,
                secret: config.session.secret,
                cookie: {maxAge: config.session.maxAge}
            }));

            app.use(auth.passport.initialize());
            app.use(auth.passport.session());

            auth.passport.use(db.models.user.createStrategy());
            auth.passport.serializeUser(db.models.user.serializeUser());
            auth.passport.deserializeUser(db.models.user.deserializeUser());
        }
    };
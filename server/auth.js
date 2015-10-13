"use strict";

let session = require('express-session'),
    auth = module.exports = {
        passport: require('passport'),
        init: function(app, db) {
            app.use(session({
                secret: 'super-secret',
                resave: false,
                saveUninitialized: false
            }));

            app.use(auth.passport.initialize());
            app.use(auth.passport.session());

            auth.passport.use(db.models.user.createStrategy());
            auth.passport.serializeUser(db.models.user.serializeUser());
            auth.passport.deserializeUser(db.models.user.deserializeUser());
        }
    };
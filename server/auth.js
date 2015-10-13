"use strict";

let session = require('express-session'),
    passportLocalSequelize = require('passport-local-mysequelize');

let auth = module.exports = {
    passport: require('passport'),
    init: function(app, db) {
        app.use(session({ secret: 'super-secret' }));
        app.use(auth.passport.initialize());
        app.use(auth.passport.session());

        auth.passport.use(db.models.user.createStrategy());
        auth.passport.serializeUser(db.models.user.serializeUser());
        auth.passport.deserializeUser(db.models.user.deserializeUser());
    }
};
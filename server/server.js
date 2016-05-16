"use strict";

let express = require('express'),
    db = require('./db'),
    auth = require('./auth'),
    routes = require('./routes'),
    app = express();

auth.init(app, db);
routes.init(app, auth, db);
require('./cors');
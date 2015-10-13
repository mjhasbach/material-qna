"use strict";

let corsProxy = require('cors-anywhere'),
    config = require('./server_config');

corsProxy.createServer().listen(config.cors.port);
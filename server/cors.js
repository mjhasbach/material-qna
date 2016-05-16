"use strict";

let corsProxy = require('cors-anywhere'),
    config = require('./server_config');

var opt = config.https ? {httpsOptions: config.https} : {};

corsProxy.createServer(opt).listen(config.cors.port);
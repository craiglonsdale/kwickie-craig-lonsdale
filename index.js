const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const config = require(path.join(__dirname, argv.config));
const mongoose = require('mongoose');
require('./database')(config, mongoose);
const app = require('./app')(config);

app.listen(config.port, function () {
  console.log(`Kwickie - Craig Lonsdale - ${config.env}`);
});

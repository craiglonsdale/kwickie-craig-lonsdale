const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const config = require(path.join(__dirname, argv.config));
require('./database')(config);
const app = require('./app')(config);

app.listen(config.port, function () {
  console.log(`Kwickie - Craig Lonsdale - ${config.env}`);
});

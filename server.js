import express from 'express';
import http from 'http';
import config from 'dotenv/config';
import bodyParser from 'body-parser';
import actions from './routes/actions';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

const app = express();
app.use(express.static('documentation'));
// Cross Origin middleware
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*'), response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  ), response.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE'
  ), next();
});

/**
 * Initialize mongoose connection
 */
let options = process.env.MONGO_DB_OPTIONS
  ? JSON.parse(process.env.MONGO_DB_OPTIONS)
  : {};
mongoose.Promise = bluebird;

/*
* Keeps the test from running on the production DB
*/
if (process.env.NODE_ENV === 'test' && !process.env.MONGO_TEST_DB_URL) {
  console.error(
    'No MONGO_TEST_DB_URL\nPlease add a MONGO_TEST_DB_URL varible to the environment'
  );
  process.exit(1);
}

/*
* For running tests MONGO_TEST_DB_URL will be used, otherwise use MONGO_DB_URL.
*/
const mongoDBURL =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_TEST_DB_URL
    : process.env.MONGO_DB_URL;
mongoose.connect(mongoDBURL, options);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || 3007;
app.set('port', port);
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
/**
 * Create HTTP server.
 */
const server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function() {
  console.log(`API running on localhost: ${port}`);
});

app.use('/api/v1/actions', actions);

module.exports = app;

const express = require('express');
const sequelize = require('./models').sequelize;
const port = process.env.PORT || 3000;
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded( { extended: false }));

/** Serving static files */
app.use('/static', express.static('public'));

/** View engine setup */
app.set('view engine', 'pug');

const bookRoutes = require('./routes/books');

app.use('/books', bookRoutes);

/** Routes */
app.get('/', (req, res) => {
  res.redirect('/books');
});

/**
* Creating an error object and handing it off to the handler data the end of app and before error handler
*/
app.use((req, res, next) => {
  const err = new Error('Page not found');
  err.status = 404;
  next(err);
});

/**
* Error handler, renders an error template
*/
app.use((err, req, res, next) => {
  console.log(`An ${err.status} error occured`);
  res.locals.error = err;
  // res.sendStatus(err.status);//sets a status on a response
  res.render('error', err);//we're passing an err onbject here to give function access to an error object
});

/** Setting the server and sync with database with each server start*/
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Library manager app is running on localhost:${port}`);
  });
});

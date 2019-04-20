const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const url = require('url');

const Op = Sequelize.Op;

const Book = require('../models').Book;

/** Bookshelf GET route */
router.get('/', (req, res, next) => {
  Book.findAll({ order: [['title', 'ASC']] }).then(books => {
    res.render('index', { books, title: 'Bookshelf' });
  }).catch(err => res.sendStatus(500));
});

/** Search POST route */
router.post('/', (req, res, next) => {
  const { searchQuery, perPage } = req.body;
  /** Creating a query to pass to findAll() */
  let query = { order: [['title', 'ASC']] };

  /** Creating a query to pass to findAll() */
  if (searchQuery !== "") {
    query.where = {
      [Op.or]: [
        { title:
          { [Op.like] : `%${searchQuery}%` }
        },
        { author:
          { [Op.like] :  `%${searchQuery}%` },
        },
        { genre:
          { [Op.like] :  `%${searchQuery}%` },
        },
        { year:
          { [Op.like] :  `%${searchQuery}%` }
        }
      ]
    };
  }

  /** Redirect to paginated pages route in case of not "Show all" option has been chosen. See pages routes */
  if (perPage !== "all") {
    return res.redirect(url.format({
      pathname: "/pages/1",
      query: req.body
    }));
  }

  Book.findAll(query).then(books => {
    res.render('index', { books, title: 'Bookshelf' });
  }).catch(err => res.sendStatus(500));
});

/** Create new book GET route */
router.get('/new', (req, res, next) => {
  res.render('new-book', {book: Book.build(), title: "New book"});
});

/** Create new book POST route */
router.post('/new', (req, res, next) => {
  Book.create(req.body).then(() => {
    res.redirect('/books');
  }).catch(err => {
    if (err.name ==='SequelizeValidationError') {
      res.render('new-book', {
        book: Book.build(req.body),
        title: "New book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(err => res.sendStatus(500));
});

/** Individual book GET route */
router.get('/:id', (req, res, next) => {
  Book.findByPk(req.params.id)
  .then(book => {
    if (book) {
      res.render('book-detail', { book, title: book.title });
    } else {
      const err = new Error('Page not found');
      console.log('No such entry in the database');
      res.status(404).render('page-not-found', { error: err });
    }
  }).catch(err => res.sendStatus(500));
});

/** Edit or delete individual book POST route */
router.post('/:id/:action', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      if (book) {
        if (req.params.action === 'edit') {
          return book.update(req.body);
        } else if (req.params.action === 'delete') {
          return book.destroy();
        }
      } else {
        res.sendStatus(404);
      }
    })
    .then(() => res.redirect('/books'))
    .catch(err => res.sendStatus(500));
});

module.exports = router;

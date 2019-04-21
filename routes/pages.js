const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const url = require('url');

const Op = Sequelize.Op;

const Book = require('../models').Book;

/** Pages GET route */
router.get('/:pageNum', (req, res, next) => {
  const { searchQuery, perPage } = req.query;
  const { pageNum } = req.params;
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

  Book.findAndCountAll(query).then(result => {
    const { count, rows } = result;
    const numOfPages = Math.ceil(count / perPage);
    const firstOnPage = (pageNum - 1) * perPage;
    const booksOnPage = Math.min(count - (pageNum - 1) * perPage, perPage);
    const lastOnPage = firstOnPage + booksOnPage;
    let books = [];

    /** Creating books array for current page */
    for (let i = firstOnPage; i < lastOnPage; i++) {
      books.push(rows[i]);
    }

    res.render('index', { books, title: 'Bookshelf', numOfPages, searchQuery, perPage });
  }).catch(err => res.sendStatus(500));
});

/** Pages POST route */
router.post('/:pageNum', (req, res, next) => {
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

  console.log(searchQuery, perPage);
  console.dir(query);
  console.log(perPage !== "all");
  console.dir(req.body);

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

module.exports = router;

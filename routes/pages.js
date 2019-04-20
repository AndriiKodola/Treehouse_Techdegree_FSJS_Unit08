const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const Book = require('../models').Book;

/** Pages GET route */
router.get('/:pageNum', (req, res, next) => {
  const { searchQuery, perPage } = req.body;
  const { pageNum } = req.params;
  let query = { order: [['title', 'ASC']], limit: perPage };

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
    const numOfPages = count / perPage;
    const firstOnPage = (pageNum - 1) * perPage;
    const lastOnPage = firstOnPage + perPage;
    let books = [];

    for (let i = firstOnPage; i < lastOnPage; i++) {
      books.push(rows[i]);
    }

    res.render('index', { books, title: 'Bookshelf', numOfPages });
  }).catch(err => res.sendStatus(500));
});

module.exports = router;

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Title is required."
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Author is required."
        }
      }
    },
    genre: DataTypes.STRING,
    year: {
      type: DataTypes.STRING,
      validate: {
        // isInt: {
        //   msg: "Please enter a valid year."
        // }
        //Custom year validator
        isValidYear(value) {
          const validYearFOrmat = /^\d{4}$/;
          if (!validYearFOrmat.test(value)) {
            throw new Error('Please enter a year in format "yyyy".')
          }
        }
      }
    }
  }, { sequelize });

  return Book;
}

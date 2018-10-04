const Challenge = require('../../model/challenge');
const Book = require('../../model/book');

const getTrendingChallenges = async function getTrendingBooks(req, res) {
  const challenges = await Challenge
    .find({ isPublic: true }, '_id tags pictureUrl name achievementRate')
    .populate('author', 'name picture')
    .sort('-cheer');
  res.status(200).json(challenges);
};

const getTrendingBooks = async function getTrendingBooks(req, res) {
  const books = await Book.find({ isPublic: true }, '-content')
    .populate('author', 'name')
    .sort('-achievementRate');
  res.status(200).json(books);
};

exports.getTrendingChallenges = getTrendingChallenges;
exports.getTrendingBooks = getTrendingBooks;

const express = require('express');
const morgan = require('morgan');

const googleData = require('./googleData');

const app = express();
app.use(morgan('dev'));

const acceptedGenres = [
  'Action',
  'Puzzle',
  'Strategy',
  'Casual',
  'Arcade',
  'Card',
];

app.get('/apps', (req, res) => {
  const { sort, genre } = req.query;
  let results = googleData;

  if (sort && sort !== 'Rating' && sort !== 'App') {
    return res.status(400).send('Sort must be by "rating" or "app"');
  }

  if (genre && !acceptedGenres.includes(genre)) {
    return res.status(400).send('Filter must be an accepted Genre');
  }

  results = results.filter((app) => app.Genres.includes(genre));

  if (sort) {
    results.sort((curr, next) => {
      if (curr[sort] < next[sort]) {
        return -1;
      } else if (curr[sort] > next[sort]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  return res.send(results);
});

app.listen(8000, () => {
  console.log('your server is up on port 8000 jake');
});

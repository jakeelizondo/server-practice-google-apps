const app = require('../app');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Express App', () => {
  it('Should return 200 with JSON array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.include.all.keys(
          'App',
          'Category',
          'Rating',
          'Reviews',
          'Size',
          'Installs',
          'Type',
          'Price',
          'Genres'
        );
      });
  });

  const queries = ['sort', 'genre'];
  queries.forEach((query) => {
    it(`Should return 400 if not valid ${query} query`, () => {
      return supertest(app)
        .get('/apps')
        .query({ [query]: 'foo' })
        .expect(400);
    });
  });

  it('Should return filtered list with a search param', () => {
    return supertest(app)
      .get('/apps')
      .query({ genre: 'Action' })
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(6);
      });
  });

  const acceptedGenres = [
    'Action',
    'Puzzle',
    'Strategy',
    'Casual',
    'Arcade',
    'Card',
  ];
  acceptedGenres.forEach((genre) => {
    it(`Should filter apps to only include apps of genre ${genre} if provided ${genre} query`, () => {
      return supertest(app)
        .get('/apps')
        .query({ genre: [genre] })
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.be.an('object');
          let i = 0,
            filtered = true;

          while (i < res.body.length - 1 && filtered) {
            filtered = res.body[i].Genres.includes(genre);
            i++;
          }
          expect(filtered).to.be.true;
        });
    });
  });

  const acceptedSorts = ['Rating', 'App'];
  acceptedSorts.forEach((sort) => {
    it(`Should sort apps by ${sort}`, () => {
      return supertest(app)
        .get('/apps')
        .query({ sort: [sort] })
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.be.an('object');
          let i = 0,
            sorted = true;

          while (i < res.body.length - 1 && sorted) {
            let appAtI = res.body[i];
            let appAtIPlusOne = res.body[i + 1];

            sorted = appAtIPlusOne[sort] >= appAtI[sort];
            i++;
          }
          expect(sorted).to.be.true;
        });
    });
  });
});

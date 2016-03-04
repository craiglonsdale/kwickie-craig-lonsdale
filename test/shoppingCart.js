'use strict';
const should = require('should'); // eslint-disable-line
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
const utils = require('./util');
const request = require('supertest-as-promised');
describe('Routing', () => {
  describe('ShoppingCart', () => {
    describe('POST', () => {
      it('Should create a new entry on `post` on valid request', (done) => {
        const body = {
          name: 'Test Shopping Cart'
        };
        request('http://localhost:3000')
        .post('/shoppingcart')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.name.should.equal(body.name);
          return done();
        });
      });
      it('Should fail to create a new entry on `post` when `name` is empty', (done) => {
        const body = {
          name: ''
        };
        request('http://localhost:3000')
        .post('/shoppingcart')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(502)
        .end((err, res) => {
          res.body.error.message.should.equal('shoppingcart validation failed');
          res.body.error.errors.name.message.should.equal('Path `name` is required.');
          return done();
        });
      });
      it('Should fail to create a new entry on `post` when missing body', (done) => {
        request('http://localhost:3000')
        .post('/shoppingcart')
        .expect(502)
        .end((err, res) => {
          res.body.error.message.should.equal('shoppingcart validation failed');
          res.body.error.errors.name.message.should.equal('Path `name` is required.');
          return done();
        });
      });
    });
    describe('GET', () => {
      let testCartId = null;
      let testCartWithItems = null;
      before((done) => {
        mockgoose.reset();
        Promise.all([
          utils.createShoppingCart('Test Cart One'),
          utils.createShoppingCart('Test Cart Two'),
          utils.createShoppingCart('Test Cart Three')])
          .then((values) => {
            testCartId = values[0].body._id;
            testCartWithItems = values[1].body._id;
            Promise.all([
              utils.createShoppingItem('Item One', testCartWithItems),
              utils.createShoppingItem('Item Two', testCartWithItems),
              utils.createShoppingItem('Item Three', testCartWithItems)])
            .then(() => {
              return done();
            });
          });
      });
      it('Should `get` all available shopping carts when no id given on parameters', (done) => {
        request('http://localhost:3000')
        .get('/shoppingcart')
        .expect(200)
        .then(res => {
          res.body.length.should.equal(3);
          return done();
        });
      });
      it('Should `get` a specific shopping cart when an id is given in parameters', (done) => {
        request('http://localhost:3000')
        .get(`/shoppingcart/${testCartId}`)
        .expect(200)
        .then(res => {
          res.body._id.should.equal(testCartId);
          res.body.name.should.equal('Test Cart One');
          return done();
        });
      });
      it('Should fail to `get` a specific shopping cart when a bad id is given in parameters', (done) => {
        const fakeId = 'OhHellNo';
        request('http://localhost:3000')
        .get(`/shoppingcart/${fakeId}`)
        .expect(502)
        .then(res => {
          res.body.error.message.should.equal(`Cast to ObjectId failed for value "${fakeId}" at path "_id"`);
          return done();
        });
      });
      it('Should `get` a specific shopping cart`s items when an id is given in parameters', (done) => {
        request('http://localhost:3000')
        .get(`/shoppingcart/${testCartWithItems}/items`)
        .expect(200)
        .then(res => {
          res.body.length.should.equal(3);
          return done();
        });
      });
      it('Should `get` an empty shopping cart`s items when an id is given in parameters', (done) => {
        request('http://localhost:3000')
        .get(`/shoppingcart/${testCartId}/items`)
        .expect(200)
        .then(res => {
          res.body.length.should.equal(0);
          return done();
        });
      });
      it('Should fail to `get` a shopping cart`s items when a bad id is given in parameters', (done) => {
        const fakeId = 'NopeNopeNope';
        request(`http://localhost:3000`)
        .get(`/shoppingcart/${fakeId}/items`)
        .expect(502)
        .then(res => {
          res.body.error.message.should.equal(`Cast to ObjectId failed for value "${fakeId}" at path "shoppingCart"`);
          return done();
        });
      });
    });
    describe('DELETE', () => {
      let testCartId = null;
      before((done) => {
        mockgoose.reset();
        utils.createShoppingCart('Test Cart One')
          .then((value) => {
            testCartId = value.body._id;
            Promise.all([
              utils.createShoppingItem('Item One', testCartId),
              utils.createShoppingItem('Item Two', testCartId),
              utils.createShoppingItem('Item Three', testCartId)])
            .then(() => {
              return done();
            });
          });
      });
      it('Should fail to `delete` a shopping cart when a bad id is given in parameters', (done) => {
        const fakeId = 'WrongID';
        request('http://localhost:3000')
        .delete(`/shoppingcart/${fakeId}`)
        .expect(502)
        .then(res => {
          res.body.error.message.should.equal(`Cast to ObjectId failed for value "${fakeId}" at path "_id"`);
          return done();
        });
      });
      it('Should `delete` a shopping cart and it`s items when an id is given in parameters', (done) => {
        const ShoppingCart = mongoose.model('shoppingcart');
        const ShoppingItem = mongoose.model('shoppingitem');
        request('http://localhost:3000')
        .delete(`/shoppingcart/${testCartId}`)
        .expect(200)
        .then(res => {
          // Check the return value from the delete is the right object
          res.body._id.should.equal(testCartId);
          // Check the object is no longer on the server
          return Promise.all([ShoppingCart.find(), ShoppingItem.find()])
            .then(results => {
              results[0].length.should.equal(0);
              results[1].length.should.equal(0);
              return done();
            });
        });
      });
    });
    describe('UPDATE', () => {
      let testCartId = null;
      before((done) => {
        mockgoose.reset();
        utils.createShoppingCart('Test Cart One')
          .then((value) => {
            testCartId = value.body._id;
            return done();
          });
      });
      it('Should to `update` a shopping cart when an and json id are given', (done) => {
        const ShoppingCart = mongoose.model('shoppingcart');
        request('http://localhost:3000')
        .put(`/shoppingcart/${testCartId}`)
        .send({name: 'new Name'})
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          // What comes back is the old value
          res.body.name.should.equal('Test Cart One');
          // But querying the DB will show us the new details
          return ShoppingCart.find()
            .then(carts => {
              carts.length.should.equal(1);
              carts[0].name.should.equal('new Name');
              return done();
            });
        });
      });
      it('Should fail to `update` a shopping cart when a bad id is given in parameters', (done) => {
        const fakeId = 'CartsNotHereMan';
        request('http://localhost:3000')
        .put(`/shoppingcart/${fakeId}`)
        .send({name: 'new Name'})
        .expect('Content-Type', /json/)
        .expect(502)
        .then(res => {
          res.body.error.message.should.equal(`Cast to ObjectId failed for value "[object Object]" at path "_id"`);
          res.body.error.value._id.should.equal(fakeId);
          return done();
        });
      });
    });
  });
});

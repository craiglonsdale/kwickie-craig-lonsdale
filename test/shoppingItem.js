'use strict';
const should = require('should'); // eslint-disable-line
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
const utils = require('./util');
const request = require('supertest-as-promised');
describe('Routing', () => {
  describe('ShoppingItem', () => {
    describe('POST', () => {
      let testCartId = null;
      before((done) => {
        mockgoose.reset();
        utils.createShoppingCart('Test Cart One')
        .then((value) => {
          testCartId = value.body._id;
          return done();
        });
      });
      it('Should create a new entry on `post` on valid request', (done) => {
        const body = {
          shoppingCart: testCartId,
          description: 'Item description'
        };
        request('http://localhost:3000')
        .post('/shoppingitem')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.description.should.equal(body.description);
          res.body.shoppingCart.should.equal(body.shoppingCart);
          return done();
        });
      });
      it('Should fail to create a new entry on `post` when missing `description`', (done) => {
        const body = {
          shoppingCart: testCartId
        };
        request('http://localhost:3000')
        .post('/shoppingitem')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(502)
        .end((err, res) => {
          res.body.error.message.should.equal('shoppingitem validation failed');
          res.body.error.errors.description.message.should.equal('Path `description` is required.');
          return done();
        });
      });
      it('Should fail to create a new entry on `post` when missing `shoppingCart`', (done) => {
        const body = {
          description: 'Item Description'
        };
        request('http://localhost:3000')
        .post('/shoppingitem')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(502)
        .end((err, res) => {
          res.body.error.message.should.equal('shoppingitem validation failed');
          res.body.error.errors.shoppingCart.message.should.equal('Path `shoppingCart` is required.');
          return done();
        });
      });
      it('Should fail to create a new entry on `post` when missing body', (done) => {
        request('http://localhost:3000')
        .post('/shoppingitem')
        .expect(502)
        .end((err, res) => {
          res.body.error.message.should.equal('shoppingitem validation failed');
          res.body.error.errors.shoppingCart.message.should.equal('Path `shoppingCart` is required.');
          res.body.error.errors.description.message.should.equal('Path `description` is required.');
          return done();
        });
      });
    });
    describe('GET', () => {
      let testCartId = null;
      let testItemId = null;
      before((done) => {
        mockgoose.reset();
        utils.createShoppingCart('Test Cart One')
          .then(cart => {
            testCartId = cart.body._id;
            Promise.all([
              utils.createShoppingItem('Item One', testCartId),
              utils.createShoppingItem('Item Two', testCartId),
              utils.createShoppingItem('Item Three', testCartId)])
            .then((items) => {
              testItemId = items[0].body._id;
              return done();
            });
          });
      });
      it('Should `get` all available shopping items when no id given on parameters', (done) => {
        request('http://localhost:3000')
        .get('/shoppingitem')
        .expect(200)
        .then(res => {
          res.body.length.should.equal(3);
          return done();
        });
      });
      it('Should `get` a specific shopping item when an id is given in parameters', (done) => {
        request('http://localhost:3000')
        .get(`/shoppingitem/${testItemId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          res.body._id.should.equal(testItemId);
          res.body.description.should.equal('Item One');
          res.body.shoppingCart._id.should.equal(testCartId);
          res.body.shoppingCart.name.should.equal('Test Cart One');
          return done();
        });
      });
      it('Should fail to `get` a specific shopping item when a bad id is given in parameters', (done) => {
        const fakeId = 'OhHellNo';
        request('http://localhost:3000')
        .get(`/shoppingitem/${fakeId}`)
        .expect(502)
        .then(res => {
          res.body.error.message.should.equal(`Cast to ObjectId failed for value "${fakeId}" at path "_id"`);
          return done();
        });
      });
    });
    describe('DELETE', () => {
      let testCartId = null;
      let testItemId = null;
      before((done) => {
        mockgoose.reset();
        utils.createShoppingCart('Test Cart One')
          .then((value) => {
            testCartId = value.body._id;
            Promise.all([
              utils.createShoppingItem('Item One', testCartId),
              utils.createShoppingItem('Item Two', testCartId),
              utils.createShoppingItem('Item Three', testCartId)])
            .then((items) => {
              testItemId = items[0].body._id;
              return done();
            });
          });
      });
      it('Should `delete` a shopping item when an id is given in parameters', (done) => {
        request('http://localhost:3000')
        .delete(`/shoppingitem/${testItemId}`)
        .expect(200)
        .then(res => {
          res.body.ok.should.equal(1);
          res.body.n.should.equal(1);
          return done();
        });
      });
      it('Should fail to `delete` a shopping item when a bad id is given in parameters', (done) => {
        const fakeId = 'WrongID';
        request('http://localhost:3000')
        .delete(`/shoppingitem/${fakeId}`)
        .expect(502)
        .then(res => {
          res.body.error.message.should.equal(`Cast to ObjectId failed for value "${fakeId}" at path "_id"`);
          return done();
        });
      });
    });
    describe('UPDATE', () => {
      let testItemId = null;
      before((done) => {
        mockgoose.reset();
        utils.createShoppingCart('Test Cart One')
          .then((cart) => {
            return cart;
          })
          .then((cart) => {
            return utils.createShoppingItem('Item One', cart.body._id);
          })
          .then((item) => {
            testItemId = item.body._id;
            return done();
          });
      });
      it('Should to `update` a shopping items description', (done) => {
        const ShoppingItem = mongoose.model('shoppingitem');
        request('http://localhost:3000')
        .put(`/shoppingitem/${testItemId}`)
        .send({description: 'new description'})
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          // What comes back is the old value
          res.body.description.should.equal('Item One');
          // But querying the DB will show us the new details
          return ShoppingItem.find()
            .then(items => {
              items.length.should.equal(1);
              items[0].description.should.equal('new description');
              return done();
            });
        });
      });
      it('Should `update` a shopping item`s shopping cart', (done) => {
        const ShoppingItem = mongoose.model('shoppingitem');
        utils.createShoppingCart('New Cart')
          .then((cart) => {
            request('http://localhost:3000')
            .put(`/shoppingitem/${testItemId}`)
            .send({shoppingCart: cart.body._id})
            .expect('Content-Type', /json/)
            .expect(200)
            .then(() => {
              return ShoppingItem.findById(testItemId)
              .populate('shoppingCart')
              .then(item => {
                item.shoppingCart.name.should.equal('New Cart');
                return done();
              });
            });
          });
      });
      it('Should fail to `update` a shopping cart when a bad id is given in parameters', (done) => {
        const fakeId = 'ItemsNotHereMan';
        request('http://localhost:3000')
        .put(`/shoppingitem/${fakeId}`)
        .send({description: 'new Description'})
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

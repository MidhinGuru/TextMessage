import expect from 'expect';
import chai from 'chai';
import chaihttp from 'chai-http';
import http from 'http';
import server from '../server';
import Action from '../models/assignedAction';

chai.use(chaihttp);

let action = {
  action: {
    name: 'TestAction',
    description: 'Test action',
    needsCompletionConfirmation: false,
    expiresInMinutes: 1,
    actors: ['FrontDesk', 'HouseKeeping'],
    offerLimit: null,
    textMessage: null,
    scriptSample: '',
    directives: [null],
    isTriggerEvent: false,
  },
  actionID: '596f00691f93b45ea0ed2670',
  profileID: '597979063d74e442d278cd72',
  expirationDate: '2014-12-04T18:30:00.000Z',
};

let updatedAction = {
  action: {
    description: 'Test updated description',
  },
  profileID: '121212',
  finishedDate: '2018-12-04T18:30:00.000Z',
};

let assignedActionID = null;

describe('Paths', () => {
  describe('/', function() {
    describe('[GET]', function() {
      it('should return 200', function(done) {
        http.get('http://localhost:' + process.env.PORT, function(response) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });
    });
  });

  describe('/api/v1/actions', () => {
    describe('[POST]', () => {
      it('It should create assigned action with status 201', done => {
        chai
          .request(server)
          .post('/api/v1/actions')
          .send(action)
          .end((error, response) => {
            expect(response.body.action.name).toEqual(action.action.name);
            expect(response.body.profileID).toEqual(action.profileID);
            expect(response.body.finishedDate).toEqual(null);
            assignedActionID = response.body._id;
            done();
          });
      });
    });

    describe('[GET]', () => {
      it('it return list of assigned actions with status 200', done => {
        chai.request(server).get('/api/v1/actions/').end((error, response) => {
          expect(response.status).toEqual(200);
          expect(response.body.length).toBeGreaterThan(0);
          expect(response.body[0].action.name).toEqual(action.action.name);
          done();
        });
      });
    });
  });

  describe('/api/v1/actions?isCompleted=false&action.name=TestAction', () => {
    describe('[GET]', () => {
      it('it return list of assigned actions which is not completed with status 200', done => {
        chai
          .request(server)
          .get('/api/v1/actions?isCompleted=false&action.name=TestAction')
          .end((error, response) => {
            expect(response.status).toEqual(200);
            expect(response.body[0].isCompleted).toEqual(false);
            done();
          });
      });
    });
  });

  describe('/api/v1/actions/{id}', () => {
    describe('[GET]', () => {
      it('it should get assigned action with status 200', done => {
        chai
          .request(server)
          .get('/api/v1/actions/' + assignedActionID)
          .end((error, response) => {
            expect(response.status).toEqual(200);
            expect(response.body.action.name).toEqual(action.action.name);
            done();
          });
      });
    });

    describe('[PUT]', () => {
      it('it should update assigned action with status 201', done => {
        chai
          .request(server)
          .put('/api/v1/actions/' + assignedActionID)
          .send(updatedAction)
          .end((error, response) => {
            expect(response.status).toEqual(201);
            expect(response.body.finishedDate).toNotEqual(null);
            expect(response.body.profileID).toEqual(updatedAction.profileID);
            expect(response.body.action.description).toEqual(
              updatedAction.action.description
            );
            done();
          });
      });
    });

    describe('[GET]', () => {
      it('it return list of assigned actions which is completed with status 200', done => {
        chai
          .request(server)
          .get(
            '/api/v1/actions?isCompleted=true&action.description=' +
              updatedAction.action.description
          )
          .end((error, response) => {
            expect(response.status).toEqual(200);
            expect(response.body[0].isCompleted).toEqual(true);
            done();
          });
      });
    });

    describe('[GET]', () => {
      it('it return list of assigned actions for UserType filter with status 200', done => {
        chai
          .request(server)
          .get(
            '/api/v1/actions?userType=' +
              action.action.actors[0] +
              '&action.description=' +
              updatedAction.action.description
          )
          .end((error, response) => {
            expect(response.status).toEqual(200);
            expect(response.body[0].action.actors[0]).toEqual(
              action.action.actors[0]
            );
            done();
          });
      });
    });

    describe('[DELETE]', () => {
      it('It should delete assigned action with status 200', done => {
        chai
          .request(server)
          .delete('/api/v1/actions/' + assignedActionID)
          .end((error, response) => {
            expect(response.status).toEqual(200);
            done();
          });
      });
    });
  });
});

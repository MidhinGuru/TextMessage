import express, { Router } from 'express';
import actionAPI from '../api/actionApi';
import MongoQS from 'mongo-querystring';
import Nexmo from 'nexmo';
//import nex from './nex';
import request from 'request';

const router = Router();

module.exports = router;

const urlQuery = new MongoQS({
  custom: {
    bbox: 'geojson',
    near: 'geojson',
  },
});

/**
* @api {get} /api/v1/actions Get all Assigned actions
* @apiName Get all Assigned actions
* @apiGroup Assigned actions
* @apiVersion 1.0.0
*
* @apiParam query Searchable fields which can be used in the URL query.
* 
* @apiSuccessExample Success-Response
*   HTTP/1.1 200 OK
* 
*{
*    "actionID": "596f00691f93b45ea0ed2670", 
*    "action": {
*    "name": "Enters Lobby",
*    "description": "Guest enters the lobby",
*    "needsCompletionConfirmation": false,
*    "expiresInMinutes": 2,
*    "actors": [
*        "bellhop",
*        "frontDesk"
*    ],
*    "offerLimit": 2,
*    "textMessage": "",
*    "scriptSample": "Welcome to the hotel",
*    "directives": [
*        "Welcome the guest",
*        "Direct guest to front desk"
*    ],
*    "isTriggerEvent": true,
*    },
*    "profileID": "597979063d74e442d278cd72",
*    "expirationDate": "2018-07-27T09:30:42.213Z",
*    "startedDate": "2017-07-27T09:29:42.214Z",
*    "finishedDate": null,
*    "isCompleted": false,
*    "isExpired": false,
*    "_id": "5979b286a591a9455c2846c4"
*}
*
* @apiErrorExample Error-Response
*   HTTP/1.1 404 Not Found
*{
*    "success": false,
*    "message": "Action not found "
*}
*
*/

router.get('/', (req, response) => {
  let mongofilter = {};
  if (req.query) {
    mongofilter = urlQuery.parse(req.query);
    //As userType does not exist in database, cannot be queried using userType column.
    //So mongodb filter replaced with action.actors for getting data
    if (mongofilter.userType) {
      Object.assign(mongofilter, {
        'action.actors': { $in: [mongofilter.userType] },
      });
      delete mongofilter.userType;
    }
    //As isCompleted is a virtual column, cannot be queried using isCompleted column.
    //So mongodb filter replaced with finishedDate for getting data
    if (typeof mongofilter.isCompleted == 'boolean') {
      let currentDate = new Date();
      if (mongofilter.isCompleted) {
        Object.assign(mongofilter, {
          $and: [
            { finishedDate: { $exists: true } },
            { finishedDate: { $ne: null } },
          ],
        });
      } else {
        Object.assign(mongofilter, {
          $or: [
            { finishedDate: { $exists: false } },
            { finishedDate: { $eq: null } },
          ],
        });
      }
      delete mongofilter.isCompleted;
    }
    if (typeof mongofilter.isExpired == 'boolean') {
      let currentDate = new Date();
      if (mongofilter.isExpired) {
        Object.assign(mongofilter, {
          expirationDate: { $lt: currentDate.getTime() },
        });
      } else {
        Object.assign(mongofilter, {
          expirationDate: { $gte: currentDate.getTime() },
        });
      }
      delete mongofilter.isExpired;
    }
  }
  actionAPI.getActions(mongofilter, (error, action) => {
    if (error) {
      return response.status(404).json({
        success: false,
        message: 'Action not found',
      });
    } else {
      if (action != null) {
        return response.status(200).json(action);
      }
      return response.status(404).json({
        success: false,
        message: 'Action not found ',
      });
    }
  });
});

/**
* @api {get} /api/v1/actions/{id} Get Assigned action
* @apiName Get Assigned action by Id
* @apiGroup Assigned actions
* @apiVersion 1.0.0
*
*  @apiParam {String} id id of Assigned action
*
* @apiSuccessExample Success-Response
*   HTTP/1.1 200 OK
*{
*    "actionID": "596f00691f93b45ea0ed2670", 
*    "action": {
*    "name": "Enters Lobby",
*    "description": "Guest enters the lobby",
*    "needsCompletionConfirmation": false,
*    "expiresInMinutes": 2,
*    "actors": [
*        "bellhop",
*        "frontDesk"
*    ],
*    "offerLimit": 2,
*    "textMessage": "",
*    "scriptSample": "Welcome to the hotel",
*    "directives": [
*        "Welcome the guest",
*        "Direct guest to front desk"
*    ],
*    "isTriggerEvent": true,
*    },
*    "profileID": "597979063d74e442d278cd72",
*    "expirationDate": "2017-07-27T09:30:42.213Z",
*    "startedDate": "2017-07-27T09:29:42.214Z",
*    "finishedDate": "2017-12-04T18:30:00.000Z",
*    "isCompleted": true,
*    "isExpired": true,
*    "_id": "5979b286a591a9455c2846c4"
*}
*
* @apiErrorExample Error-Response
*   HTTP/1.1 404 Not Found
*{
*    "success": false,
*    "message": "Action not found "
*}
*
*/

router.get('/:id', (req, response) => {
  const id = req.params.id;
  actionAPI.getAction(id, (error, action) => {
    if (error) {
      return response.status(404).json({
        success: false,
        message: 'Action not found ',
      });
    } else {
      if (action != null) {
        return response.status(200).json(action);
      }
      return response.status(404).json({
        success: false,
        message: 'Action not found ',
      });
    }
  });
});

/**
* @api {post} /api/v1/actions Create Assigned action
* @apiName  Create Assigned action
* @apiGroup Assigned actions
* @apiVersion 1.0.0
*
* @apiParam (action) {String} name Name of Action
* @apiParam (action) {String} [description]  description of Action
* @apiParam (action) {String} [needsCompletionConfirmation]  CompletionConfirmation of Action
* @apiParam (action) {Number} expiresInMinutes Expires InMinutes of Action
* @apiParam (action) {Array} actors Array of actors
* @apiParam (action) {String} [offerLimit] Offer Limit of Action
* @apiParam (action) {String} [textMessage] Message  of Action
* @apiParam (action) {String} [scriptSample] script of Action
* @apiParam (action) {Array} [directives] Array of directives
* @apiParam (action) {Boolean} [isTriggerEvent] TriggerEvent of Action 
* @apiParam {String} actionID _id of action
* @apiParam {String} profileID _id of profile
*
* @apiSuccessExample Success-Response
*   HTTP/1.1 201 OK
*{
*    "actionID": "596f00691f93b45ea0ed2670", 
*    "action": {
*    "name": "Enters Lobby",
*    "description": "Guest enters the lobby",
*    "needsCompletionConfirmation": false,
*    "expiresInMinutes": 2,
*    "actors": [
*        "bellhop",
*        "frontDesk"
*    ],
*    "offerLimit": 2,
*    "textMessage": "",
*    "scriptSample": "Welcome to the hotel",
*    "directives": [
*        "Welcome the guest",
*        "Direct guest to front desk"
*    ],
*    "isTriggerEvent": true,
*    },
*    "profileID": "597979063d74e442d278cd72",
*    "expirationDate": "2018-07-27T09:30:42.213Z",
*    "startedDate": null,
*    "finishedDate": null,
*    "isCompleted": false,
*    "isExpired": false,
*    "_id": "5979b286a591a9455c2846c4"
*}
*
* @apiErrorExample Error-Response
*   HTTP/1.1 404 Not Found
*   {
*     "success": false,
*     "message": "Action not saved."
*   }
*
*/

router.post('/', (req, response) => {
  const newAction = req.body;
  actionAPI.addAction(newAction, (error, action) => {
    if (error) {
      return response.status(404).json({
        success: false,
        message: 'Action not saved',
      });
    } else {
      if (action.action.actors.indexOf('text') > -1) {
        let textMessage = action.action.textMessage;
        let expiresInMinutes = action.action.expiresInMinutes;
        let actionID = action.action._id;

        actionAPI.getProfile(newAction.profileID, (error, profile) => {
          if (!error) {
            console.log('profileeeeeeeeeeeeeeeeeeeeeeeee:');
            console.log('textmsgggggggggg:' + textMessage);
            let phoneNumber = profile.phoneNumber;
            let validate = validatePhoneNumber(phoneNumber);
            if (validate) {
              //Validate phone number
              var nexmo = new Nexmo(
                {
                  apiKey: '067908e3',
                  apiSecret: '2c0080ec581afde4',
                },
                { debug: true }
              );
              var from = 'Nexmo';
              // var to = '919995727516';
              var to = phoneNumber;
              var text = textMessage;
              nexmo.message.sendSms(
                from,
                to,
                text,
                { type: 'unicode' },
                (err, responseData) => {
                  if (responseData) {
                    return response.status(200).json({ s: 1 });
                  }
                  if (err) {
                    return response.status(404).json(err);
                  }
                }
              );
            }
            // if (expiresInMinutes && textMessage) {//Expiration check
            //   let newtext = 'Action expired';
            //   setTimeout(function () {
            //     nexmo.message.sendSms(
            //       from,
            //       to,
            //       newtext,
            //       { type: 'unicode' },
            //       (err, response) => {
            //         if (response) {
            //           const updatedAction = {};
            //           updatedAction.finishedDate = '2019-08-10T22:41:52.510Z';
            //           actionAPI.updateAction(
            //             updatedAction,
            //             actionID,
            //             (error, action) => {
            //               if (error) {
            //                 return response.status(404).json(error);
            //               } else {
            //                 return response.status(200).json({ s: 1 });
            //               }
            //             }
            //           );
            //           // return response.status(200).json({ s: 1 });
            //         }
            //         if (err) {
            //           return response.status(404).json(err);
            //         }
            //       }
            //     );
            //   }, 60000);
            // }
          }
          if (error) {
            console.log('profile errorrrrrrrrrrrrrrrrrr');
          }
        });
      }
    }
  });

  function validatePhoneNumber(phoneNumber) {
    var expression = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    console.log('Phonenumber : ' + phoneNumber);
    if (phoneNumber.match(expression)) {
      console.log('phone number validdddddddddddddddddddddddddddddddddd');
      return true;
    } else {
      console.log(
        'phone number INNNNNNNNNNNvaliddddddddddddddddddddddddddddddddddd'
      );
      return false;
    }
  }

  // const newAction = req.body;
  // actionAPI.addAction(newAction, (error, action) => {
  //   if (error) {
  //     return response.status(404).json({
  //       success: false,
  //       message: 'Action not saved',
  //     });
  //   } else {
  //     if (action.action.actors.indexOf('text') > -1) {
  //       let textMessage = action.action.actors.textMessage;
  //       let expiresInMinutes = action.action.expiresInMinutes;
  //       let actionID = action.action._id;
  //       console.log('idddddddddddddddddddddddddddddd: ' + id);
  //       actionAPI.getProfile(newAction.profileID, (error, profile) => {
  //         if (!error) {
  //           let phoneNumber = profile.phoneNumber;
  //           console.log('phoneNumberrrrrrrrrrrrrrrrrrrr: ' + phoneNumber);

  //           var nexmo = new Nexmo(
  //             {
  //               apiKey: '067908e3',
  //               apiSecret: '2c0080ec581afde4',
  //             },
  //             { debug: true }
  //           );
  //           //console.log(nexmo);
  //           var from = 'Nexmo';
  //           var to = '919995727516';
  //           var text = 'A text message sent using the Nexmo SMS API';

  //           nexmo.message.sendSms(from, to, text,
  //             { type: 'unicode' },
  //             (err, responseData) => {
  //               if (responseData) {
  //                 console.log('responseeeeeeeeeeeeeee');
  //                 // const updatedAction = {};
  //                 // updatedAction.finishedDate = new Date();
  //                 // actionAPI.updateAction(updatedAction, actionID, (error, action) => {
  //                 //   if(error){

  //                 //   }
  //                 // });
  //               }
  //               if (err) {
  //                 console.log('errorrrrrrrrrrrrrrrr');
  //                 console.log(err);
  //                 return response.status(404).json(err);
  //               }
  //             }
  //           );

  //           console.log('nexmo1111111111111111');
  //           if (expiresInMinutes) {
  //             setTimeout(function () {
  //               console.log('Expiredddddddddddddddddddddddddddddd');
  //             }, 60000);
  //           }

  //           // nexmo.message.sendSms(from, to, text, (error, response) => {
  //           //   console.log('enteredddddddddddddd');
  //           //   //console.log(response);
  //           //   console.log(error);
  //           // });
  //           // let messageBody = {
  //           //   from: 'Nexmo',
  //           //   test: 'welcome to nexmo',
  //           //   to: '919995727516',
  //           //   api_key: '067908e3',
  //           //   api_secret: '2c0080ec581afde4',
  //           // };
  //           // request(
  //           //   {
  //           //     url: 'http://rest.nexmo.com/sms/json',
  //           //     body: messageBody,
  //           //     json: true,
  //           //     method: 'POST',
  //           //     proxy: 'http://594299:Success123++@proxy.cognizant.com:6050/'
  //           //   },
  //           //   (error, response, body) => {
  //           //     console.log('enteredddddddddddddd');
  //           //     console.log(error);
  //           //     console.log(body);
  //           //   }
  //           // );
  //           console.log('nexmo2222222222222222');

  //           // const messenger = TextMessenger();
  //           // messenger.sendSMS(phoneNumber, message);
  //         }
  //       });
  //     }
  //     //return response.status(201).json(action);
  //   }
  // });
});

/**
* @api {put} /api/v1/actions/{id} Update Assigned action
* @apiName  Update Assigned action
* @apiGroup Assigned actions
* @apiVersion 1.0.0
*
*  @apiParam {String} id id of Assigned action
* @apiParam (action) {String} name Name of Action
* @apiParam (action) {String} [description]  description of Action
* @apiParam (action) {String} [needsCompletionConfirmation]  CompletionConfirmation of Action
* @apiParam (action) {Number} expiresInMinutes Expires InMinutes of Action
* @apiParam (action) {Array} actors Array of actors
* @apiParam (action) {String} [offerLimit] Offer Limit of Action
* @apiParam (action) {String} [textMessage] Message  of Action
* @apiParam (action) {String} [scriptSample] script of Action
* @apiParam (action) {Array} [directives] Array of directives
* @apiParam (action) {Boolean} [isTriggerEvent] TriggerEvent of Action 
* @apiParam {String} actionID _id of action
* @apiParam {String} profileID _id of profile
* @apiParam {Date} finishedDate finished date of assigned action
*
* @apiSuccessExample Success-Response
*   HTTP/1.1 201 OK
*{
*    "actionID": "596f00691f93b45ea0ed2670", 
*    "action": {
*    "name": "Enters Lobby",
*    "description": "Guest enters the lobby",
*    "needsCompletionConfirmation": false,
*    "expiresInMinutes": 2,
*    "actors": [
*        "bellhop",
*        "frontDesk"
*    ],
*    "offerLimit": 2,
*    "textMessage": "",
*    "scriptSample": "Welcome to the hotel",
*    "directives": [
*        "Welcome the guest",
*        "Direct guest to front desk"
*    ],
*    "isTriggerEvent": true,
*    },
*    "profileID": "597979063d74e442d278cd72",
*    "expirationDate": "2018-07-27T09:30:42.213Z",
*    "startedDate": "2017-07-27T09:29:42.214Z",
*    "finishedDate": "2017-12-04T18:30:00.000Z",
*    "isCompleted": true,
*    "isExpired": false,
*    "_id": "5979b286a591a9455c2846c4"
*}
*
* @apiErrorExample Error-Response
*   HTTP/1.1 404 Not Found
*   {
*     "success": false,
*     "message": "Action not saved."
*   }
*
*/

router.put('/:id', (req, response) => {
  const updatedAction = req.body;
  const id = req.params.id;
  actionAPI.updateAction(updatedAction, id, (error, action) => {
    if (error) {
      return response.status(404).json({
        success: false,
        message: 'Action did not update',
      });
    } else {
      return response.status(201).json(action);
    }
  });
});

/**
* @api {delete} /api/v1/actions/{id} Delete Assigned action
* @apiName  Delete Assigned action
* @apiGroup Assigned actions
* @apiVersion 1.0.0
*
*  @apiParam {String} id id of Assigned action
*
* @apiSuccessExample Success-Response
*   HTTP/1.1 200 OK
*   {
*     "message": "Action deleted successfully"
*   }
*
* @apiErrorExample Error-Response
*   HTTP/1.1 404 Not Found
*   {
*     "success": false,
*     "message": "Action not Found"
*   }
*
*/

router.delete('/:id', (req, response) => {
  const id = req.params.id;
  actionAPI.deleteAction(id, (error, message) => {
    if (error) {
      return response.status(404).json({
        success: false,
        message: 'Action not found',
      });
    } else {
      return response
        .status(200)
        .json({ message: 'Action deleted successfully' });
    }
  });
});

import AssignedAction from '../models/assignedAction';
import mongoose from 'mongoose';
import request from 'request';
import Nexmo from 'nexmo';

const getAction = (id, callback) => {
  return AssignedAction.findOne({ _id: id }, callback);
};

const getProfile = (id, callback) => {
  console.log('33333333333333');
  console.log(process.env.PROFILE_API_URL + id);
  request(
    {
      url: process.env.PROFILE_API_URL + id,
      json: true,
      method: 'GET',
    },
    (error, response, body) => {
      console.log('4444444444444444444');
      callback(error, body);
    }
  );
};

const getActions = (filter, callback) => {
  return AssignedAction.find(filter, callback);
};

const addAction = (newAction, callback) => {
  console.log('aaaaaaaaaaaaa111111111111111111111');
  console.log(newAction);
  let assignedAction = {};
  let currentDate = new Date();
  assignedAction.actionID = newAction.actionID;
  assignedAction.action = newAction.action;
  assignedAction.profileID = newAction.profileID;
  assignedAction.expirationDate = currentDate.setMinutes(
    currentDate.getMinutes() + newAction.action.expiresInMinutes
  );
  assignedAction.startedDate = null;
  if (newAction.action.actors.indexOf('text') <= -1) {
    assignedAction.finishedDate = null;
  } else {
    assignedAction.finishedDate = newAction.finishedDate;
  }
  const action = new AssignedAction(assignedAction);
  return action.save(callback);
};

const updateAction = (updatedAction, id, callback) => {
  console.log('updatedActionnnnnnnnnnnnnnnnnnnnnn');
  console.log(updatedAction);
  return AssignedAction.findOne({ _id: id }, (error, assignedAction) => {
    if (updatedAction.action) {
      let modifiedAction = updatedAction.action;
      let originalAction = assignedAction.action;
      if (!originalAction) {
        originalAction = {};
      }
      Object.assign(originalAction, modifiedAction);
      assignedAction.action = originalAction;
      delete updatedAction.action;
    }
    Object.assign(assignedAction, updatedAction);
    console.log('AssignedActionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
    console.log(AssignedAction);
    AssignedAction.findOneAndUpdate(
      { _id: id },
      assignedAction,
      { new: true },
      callback
    );
  }).lean();
};

const deleteAction = (id, callback) => {
  AssignedAction.findOneAndRemove({ _id: id }, callback);
};

const TextMessenger = (filter, callback) => {
  console.log('11111111111111111');
  var nexmo = new Nexmo(
    {
      apiKey: '067908e3',
      apiSecret: '2c0080ec581afde4',
    },
    { debug: true }
  );

  nexmo.message.sendSms(
    filter.from,
    filter.to,
    filter.text,
    { type: 'unicode' },
    (err, response) => {
      if (response) {
        console.log('responseeeeeeeeeeeeeee');
        //return response.status(200).json({ s: 1 });
        response.write('called');
      }
      if (err) {
        console.log('errorrrrrrrrrrrrrrrr');
        console.log(err);
      }
    }
  );
};

module.exports = {
  addAction: addAction,
  getAction: getAction,
  getActions: getActions,
  updateAction: updateAction,
  deleteAction: deleteAction,
  getProfile: getProfile,
  TextMessenger: TextMessenger,
};

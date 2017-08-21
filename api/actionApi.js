import AssignedAction from '../models/assignedAction';
import mongoose from 'mongoose';
import request from 'request';

const getAction = (id, callback) => {
  return AssignedAction.findOne({ _id: id }, callback);
};

const getProfile = (id, callback) => {
  request(
    {
      url: process.env.PROFILE_API_URL + id,
      json: true,
      method: 'GET',
    },
    (error, response, body) => {
      callback(error, body);
    }
  );
};

const getActions = (filter, callback) => {
  return AssignedAction.find(filter, callback);
};

const addAction = (newAction, callback) => {
  let assignedAction = {};
  let currentDate = new Date();
  assignedAction.actionID = newAction.actionID;
  assignedAction.action = newAction.action;
  assignedAction.profileID = newAction.profileID;
  assignedAction.expirationDate = currentDate.setMinutes(
    currentDate.getMinutes() + newAction.action.expiresInMinutes
  );
  assignedAction.startedDate = null;
  assignedAction.finishedDate = null;
  // if (newAction.action.actors.indexOf('text') <= -1) {
  //   assignedAction.finishedDate = null;
  // } else {
  //   assignedAction.finishedDate = newAction.finishedDate;
  // }
  assignedAction.createdDate = currentDate;
  const action = new AssignedAction(assignedAction);
  return action.save(callback);
};

const updateAction = (updatedAction, id, callback) => {
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

module.exports = {
  addAction: addAction,
  getAction: getAction,
  getActions: getActions,
  updateAction: updateAction,
  deleteAction: deleteAction,
  getProfile: getProfile,
};

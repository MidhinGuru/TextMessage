import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const assignedActionSchema = mongoose.Schema(
  {
    action: {
      type: Object,
    },
    actionID: {
      type: Schema.Types.ObjectId,
      ref: 'Action',
    },
    profileID: {
      type: String,
    },
    expirationDate: {
      type: Date,
    },
    startedDate: {
      type: Date,
    },
    finishedDate: {
      type: Date,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

assignedActionSchema.virtual('isCompleted').get(function() {
  return this.finishedDate && this.finishedDate != null ? true : false;
});

assignedActionSchema.virtual('isExpired').get(function() {
  let currentDate = new Date();
  return this.expirationDate &&
  this.expirationDate.getTime() < currentDate.getTime()
    ? true
    : false;
});

module.exports = mongoose.model('AssignedAction', assignedActionSchema);

import Nexmo from 'nexmo';

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
});

const sendSMS = (to, textMessage) => {
  let from = 'Nexmo';
  nexmo.message.sendSms(from, to, textMessage, (error, responseData) => {
    if (error) {
      console.error('Failed to send SMS');
      console.log(error);
    } else {
      console.log('Message sent to ' + to);
    }
  });
};

const validatePhoneNumber = phoneNumber => {
  var expression = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  if (phoneNumber) {
    if (phoneNumber.match(expression)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

module.exports = {
  sendSMS: sendSMS,
  validatePhoneNumber: validatePhoneNumber,
};

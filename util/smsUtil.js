const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
});

const sendSms = (from, to, textMessage) => {
  nexmo.message.sendSms(from, to, textMessage, (err, responseData) => {
    if (err) {
      console.error('Failed to send SMS');
      console.log(err);
    } else {
      console.log('Message send to ' + mobilenumber);
    }
  });
};

module.exports = {
  sendSms: sendSms,
};

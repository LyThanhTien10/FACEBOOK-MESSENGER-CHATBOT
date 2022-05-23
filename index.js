require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const {verifyWebhook} = require('./services/verify-webhook');
const {handleMessage} = require('./services/handle-message');
const {handlePostback} = require('./services/handle-postback');

const PORT = process.env.PORT || 5000;

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render("index.ejs");
});

app.get('/webhook', (req, res) => verifyWebhook(req,res));

app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;

      /* Check if the event is a message or postback and
       pass the event to the appropriate handler function */
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      }
      
      if (webhook_event.postback){
        handlePostback(sender_psid, webhook_event.postback);
      }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

app.listen(PORT, function() {
  console.log("Chat bot server listening at %s:%d ");
});
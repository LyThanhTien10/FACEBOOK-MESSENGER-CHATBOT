require('dotenv').config();
const request = require('request');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const CONFIG_DATA = require('./config');

function handlePostback(sender_psid, received_postback) {
    var reply = CONFIG_DATA.RECEIVE_MESSAGE[received_postback.title];

    replyPostback(sender_psid, reply["type"], reply["message"]);
}

function replyPostback(sender_psid, TYPE_OF_REPLY, replyMessage){
    let request_body = {
        "recipient":{
            "id": sender_psid
        },
        "message": {}
    }
    request_body["message"][TYPE_OF_REPLY] = replyMessage;

    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": request_body
        }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

module.exports = {handlePostback};
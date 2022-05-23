require('dotenv').config();
const request = require('request');
const PAGE_ID = process.env.PAGE_ID;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const CONFIG_DATA = require('./config');
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const {findRank, findPredict} = require('./feature');
const {find, update, insert} = require('./database');

async function handleMessage(sender_psid, received_message) {
    // Check if the message contains text
    if (received_message.text && sender_psid != PAGE_ID) {
        /* Normalize message from user with Unikey character */
        received_message.text = received_message.text.normalize();

        // Send result message if user message match regex of feature
        var rank_regex = new RegExp(CONFIG_DATA.REGEX_RANK_PATTERN, 'g');
        var predict_regex = new RegExp(CONFIG_DATA.REGEX_PREDICT_PATTERN, 'g');

        if (rank_regex.test(received_message.text)){
            console.log("Rank feature match");
            replyMessage(sender_psid, "text", "Hiện tại tính năng này chưa khả dụng. Hẹn bạn sau khi hoàn thành kì thi THPTQG 2022 nhé");
            replyMessage(sender_psid, CONFIG_DATA.RECEIVE_MESSAGE['Thêm nguyện vọng']['type'], CONFIG_DATA.RECEIVE_MESSAGE['Thêm nguyện vọng']['message'])
            // const [, mark, grade, targetRange] = received_message.text.split(' ');
            // var result = findRank(received_message.text);
            // replyMessage(sender_psid, "text", `Tổng số thí sinh có thi khối (hoặc môn) ${grade} trong phạm vi ${CONFIG_DATA.CITY_MAP[targetRange]} là ${result['sum']}, trong đó có ${result['equal']} thí sinh có điểm số là ${mark} và ${result['bigger']} thí sinh có điểm cao hơn ${mark}`);
            // replyMessage(sender_psid, "text", 'Lưu ý hệ thống đếm tất cả số lượng các thí sinh có thi cả 3 môn (đối với các khối thi), số lượng này có thể sẽ cao hơn số lượng thực sự dùng khối thi này để xét tuyển');
            return;
        }

        if (predict_regex.test(received_message.text)){
            console.log("Predict feature match");
            replyMessage(sender_psid, "text", "Hiện tại tính năng này chưa khả dụng. Hẹn bạn sau khi hoàn thành kì thi THPTQG 2022 nhé");
            replyMessage(sender_psid, CONFIG_DATA.RECEIVE_MESSAGE['Thêm nguyện vọng']['type'], CONFIG_DATA.RECEIVE_MESSAGE['Thêm nguyện vọng']['message'])
            // const [, university, branch] = received_message.text.split(' ');
            // var result = findPredict(received_message.text);
            // if (result == -1){
            //     replyMessage(sender_psid, "text", `Hiện tại chúng tôi chưa cung cấp dự đoán cho ngành có mã ${branch} của trường ${university}. Xem thêm các trường và ngành được dự đoán tại đây: `);
            //     return;
            // };

            // replyMessage(sender_psid, "text", `Điểm chuẩn dự đoán của ngành có mã ${branch} của trường ${university} là ${result}. Xem thêm các trường và ngành được dự đoán tại đây: `);
            return;
        }

        /* Check and send auto reply guide doc for user who messages to page */
        if (CONFIG_DATA.RECEIVE_MESSAGE[received_message.text] == undefined){
            console.log("Default message match");
            var result = await find(COLLECTION_NAME, sender_psid);

            /* If this user wasn't message to page in the past, add this user to database, 
            reply guide doc for this user and lock auto reply guide doc in 10 minute */
            if (result.length == 0){
                insert(COLLECTION_NAME, sender_psid);
                replyMessage(sender_psid, CONFIG_DATA.RECEIVE_MESSAGE["default"]["type"], CONFIG_DATA.RECEIVE_MESSAGE["default"]["message"]);
                return;
            }
            /* If this user exist in database, check if the last message of him more than 10 minute from now
             if true reply guide doc and lock auto reply guide doc in 10 next minute */
            if (result.length && result[0]["state"]){
                update(COLLECTION_NAME, sender_psid);
                replyMessage(sender_psid, CONFIG_DATA.RECEIVE_MESSAGE["default"]["type"], CONFIG_DATA.RECEIVE_MESSAGE["default"]["message"]);
                return;
            }
            return;
        };

        // Send guide doc if user click 1 of 3 postback: ranking, prediction, contact admin
        replyMessage(sender_psid, CONFIG_DATA.RECEIVE_MESSAGE[received_message.text]["type"], CONFIG_DATA.RECEIVE_MESSAGE[received_message.text]["message"]);    
    }  
}

function replyMessage(sender_psid, TYPE_OF_REPLY, replyMessage){
    let request_body = {
        "recipient":{
            "id": sender_psid
        },
        "message": {}
    }
    request_body["message"][TYPE_OF_REPLY] = replyMessage;

    // Send the HTTP request to the Messenger Platform
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

module.exports = {handleMessage};
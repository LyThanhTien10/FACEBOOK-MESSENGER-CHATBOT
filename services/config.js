/* Process config data for Ranking Feature */
const RANK_INPUT_DATA = {
    "subject": ["A", "A1", "B", "C", "D1", "Toán", "Lý", "Hóa", "Sinh", "Văn", "Sử", "Địa", "GDCD"],
    "city": [
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,
        22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,
        39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,
        56,57,58,59,60,61,62,63,64,"MB","MT","MN","CN"
    ],
}
const cityIdString = RANK_INPUT_DATA.city.join("|");
const subjectString = RANK_INPUT_DATA.subject.join("|");

const REGEX_RANK_PATTERN = `XH [0-9]+(\.[0-9]{1,2})? (${subjectString}) (${cityIdString})`;
const REGEX_PREDICT_PATTERN = `DD [a-zA-Z]+ [a-zA-Z0-9]+`;

/* Process config data for messages receive from user input */

const RECEIVE_MESSAGE = {
    "Xếp hạng điểm thi": {
        "type": "text",
        "message": `Bạn nhắn tin với bot theo cú pháp "XH_Điểm_Môn(tổ hợp môn)_Mã-tỉnh(mã khu vực)" trong đó "_" là khoảng trống \n\nMôn là một trong các tên sau: A, A1, B, C, D1, Toán, Lý, Hóa, Sinh, Văn, Sử, Địa, GDCD \n\nĐiểm là điểm thi của bạn tương ứng với môn(tổ hợp môn) và viết dấu thập là phân là dấu "." \n\nMã tỉnh là các số từ 1 đên 64 ứng với tỉnh bạn cần và là CN, MB, MT, MN tương ứng với xếp hạng cả nước, miền bắc, miền trung và miền nam\n\nVí dụ: XH 25.5 A1 55 \nđể tìm xếp hạng khối A1 của bạn với số điểm 25.5 trong thành phố Cần Thơ`
    },
    "Dự đoán điểm chuẩn": {
        "type": "text",
        "message": `Bạn nhắn tin với bot theo cú pháp "DD_Mã-trường_Mã-ngành" trong đó "_" là khoảng trống \n\nVí dụ: DD HCMUT 106 \n để xem dự đoán điểm chuẩn ngành khoa học máy tính của Trường đại học Bách Khoa TP. HCM`
    },
    "Chat với admin": {
        "type": "text",
        "message": `Cảm ơn bạn đã quan tâm và nhắn tin đến page. Admin sẽ phản hồi lại bạn trong giây lát`
    },
    // "Tài liệu ôn thi": {
    //     "type": "text",
    //     "message": "Tất cả tài liệu ôn thi THPTQG sẽ được cập nhật tại đây: https://drive.google.com/drive/u/6/folders/1107TT3DEcu-m1YTNhG-nG0ElbRXBIhf1"
    // },
    "Thêm nguyện vọng": {
        "type": "text",
        "message": "Bạn có thể xem danh sách các trường hiện tại được hỗ trợ phân tích và dự đoán tại đây: https://bitly.com.vn/g77zt8 \nBạn có thể thêm mã xét tuyển của trường và ngành của bạn để chúng tôi tìm hiểu và thêm vào danh sách phân tích, dự đoán tại đây: https://bitly.com.vn/a3vr0a"
    },
    "default": {
        "type": "attachment",
        "message": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Chúng tôi có thể giúp gì cho bạn?",                    
                        "buttons": [ 
                            {
                                "type": "postback",
                                "title": "Xếp hạng điểm thi",
                                "payload": "option 1",
                            },
                            {
                                "type": "postback",
                                "title": "Dự đoán điểm chuẩn",
                                "payload": "option 2",
                            }
                        ]
                    },
                    {
                        "title": "Chúng tôi có thể giúp gì cho bạn?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thêm nguyện vọng",
                                "payload": "option 3",
                            },
                            {
                                "type": "postback",
                                "title": "Chat với admin",
                                "payload": "option 4",
                            }
                        ]
                    }
                ]
            }
        }
    }
}

/* City ID map with City Name */

const CITY_MAP = {
    "1": "Hà Nội", "2": "TP. Hồ Chí Minh", "3": "Hải Phòng", "4": "Đà Nẵng", "5": "Hà Giang",
    "6": "Cao Bằng", "7": "Lai Châu", "8": "Lào Cai", "9": "Tuyên Quang", "10": "Lạng Sơn",
    "11": "Bắc Kạn", "12": "Thái Nguyên", "13": "Yên Bái", "14": "Sơn La", "15": "Phú Thọ",
    "16": "Vĩnh Phúc", "17": "Quảng Ninh", "18": "Bắc Giang", "19": "Bắc Ninh", "21": "Hải Dương",
    "22": "Hưng Yên", "23": "Hòa Bình", "24": "Hà Nam", "25": "Nam Định", "26": "Thái Bình",
    "27": "Ninh Bình", "28": "Thanh Hóa", "29": "Nghệ An", "30": "Hà Tĩnh", "31": "Quảng Bình",
    "32": "Quảng Trị", "33": "Thừa Thiên Huế", "34": "Quảng Nam", "35": "Quảng Ngãi", "36": "Kon Tum",
    "37": "Bình Định", "38": "Gia Lai", "39": "Phú Yên", "40": "Đắk Lắk", "41": "Khánh Hòa", 
    "42": "Lâm Đồng", "43": "Bình Phước", "44": "Bình Dương", "45": "Ninh Thuận", "46": "Tây Ninh",
    "47": "Bình Thuận", "48": "Đồng Nai", "49": "Long An", "50": "Đồng Tháp", "51": "An Giang",
    "52": "Bà Rịa - Vũng Tàu", "53": "Tiền Giang", "54": "Kiên Giang", "55": "Cần Thơ", "56": "Bến Tre",
    "57": "Vĩnh Long", "58": "Trà Vinh", "59": "Sóc Trăng", "60": "Bạc Liêu", "61": "Cà Mau",
    "62": "Điện Biên", "63": "Đắk Nông", "64": "Hậu Giang", "MB": "Miền Bắc", "MT": "Miền Trung", 
    "MN": "Miền Nam", "CN": "Cả nước"
}


module.exports = {REGEX_RANK_PATTERN, REGEX_PREDICT_PATTERN, RECEIVE_MESSAGE, CITY_MAP};
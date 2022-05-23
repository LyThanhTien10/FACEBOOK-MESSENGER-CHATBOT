const path = require('path');
const fs = require('fs');


function readJSON(path){
    var data = fs.readFileSync(path, 'utf8');
    data = JSON.parse(data);
    return data;
}

function findRank(queryStr){
    const [, markQuery, gradeQuery, targetRange] = queryStr.split(' ');
    var data = readJSON(`${path.join(__dirname, '../')}data/rank/${targetRange}.json`);
    const GRADE_DATA = data[gradeQuery];
    var markArray = Object.keys(GRADE_DATA);

    var response = {"sum":0, "bigger": 0, "equal": 0}
    markArray.forEach(mark =>{
        response["sum"] += GRADE_DATA[mark];
        if (parseFloat(mark) == parseFloat(markQuery)){
            response["equal"] += GRADE_DATA[mark];
        }
        if (parseFloat(mark) > parseFloat(markQuery)){
            response["bigger"] += GRADE_DATA[mark];
        }
    });

    return response;
}

function findPredict(queryStr){
    var response;
    const [, university, branch] = queryStr.split(' ');
    var data = readJSON(`${path.join(__dirname, '../')}data/predict/2021.json`);
    if (data[university] == undefined){
        response = -1;
        return response;
    };

    if (data[university][branch] == undefined){
        response = -1;
        return response;
    }

    response = data[university][branch]["PREDICT"];
    return response;
}

module.exports = {
    findRank,
    findPredict
};
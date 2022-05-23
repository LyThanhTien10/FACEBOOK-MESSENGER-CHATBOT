const {read, write} = require('./modules/database');
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const MILISECOND_PER_MINUTE = 60*1000;

// Reset state is true for user who carrying state is false more than 10 minute
// State: true mean if user send message to page, we must auto reply guide for them
async function main(){
    var userStates = await read(COLLECTION_NAME);

    var currentTime = new Date().getTime();

    userStates.forEach(userState =>{
        if (currentTime - userState['updateTime'] >= MILISECOND_PER_MINUTE*10){
            userState['state'] = true;
        }
    });

    write(userStates, COLLECTION_NAME);
}

main();
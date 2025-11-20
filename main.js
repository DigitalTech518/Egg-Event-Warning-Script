const config = require("./config.json"); // Import config data
const cron = require('node-cron'); // Import lib to run script every x time, easier to set and forget
const moment = require('moment');  // Import moment lib
const event_task = require('./scheduled-tasks/event_check');

function main() {

    console.log(moment().format('MMMM Do YYYY, h:mm:ssa'), "Running task before scheduling..."); 

    event_task(config.API, config.EID).catch(error => console.error("Error running fetch:", error)); //Run the fucker before scheduling

    console.log(moment().format('MMMM Do YYYY, h:mm:ssa'), "Scheduling task to run every minute...");

    cron.schedule('*/1 * * * *', () => { // Run at every minute
    
        event_task(config.API, config.EID).catch(error => console.error("Error running fetch:", error)); //Run the fucker every minute

    });
    
}

main();
const config = require("../config.json"); // Import config data
const moment = require('moment');  // Import moment lib
const axios = require('axios'); // Import axios package since I don't want to mess with node version
const mongoose = require('mongoose'); // Mongoose shit


async function event_check(url, eid, Events) {
    /* Get data from egg API */
    const data = await axios.get(url+eid).then(r => r.data).catch(error => console.error("Error getting egg API data:", error)); 

    /* Get already sent events from database */
    const SentEvents = await Events.find().then((r) => r.map((ev) => ev.identifier));
    console.log(SentEvents);

    /* Map through current events */
    await data.events.eventsList.map(async event => {


        if (!(SentEvents.includes(event.identifier))) {


            let urgency = ""; // Initilize urgency variable

            /* Set urgency of event notification depending on set config */
            if (config.urgentTypes.includes(event.type)) {
                urgency = "urgent";
            } else if (config.urgentNames.includes(event.subtitle)) {
                urgency = "urgent";
            } else if (config.importantTypes.includes(event.type)) {
                urgency = "high";
            } else if (config.importantNames.includes(event.subtitle)) {
                urgency = "high";
            } else {
                urgency = "default";
            }


            /* Convert auth from config to base64 strings */
            const Authorization = Buffer.from(config.ntfyUser + ":" + config.ntfyPass).toString('base64');

            /* Post event data to ntfy */
            axios.post(`${config.ntfyURL}/${config.ntfyThread}`, `New Event Type: \`${event.type}\``, {

                headers: {
                    "Authorization": `Basic ${Authorization}`,
                    "Title": event.subtitle,
                    "Priority": urgency,
                    //"Tags": "warning,skull",
                    "Markdown": "yes",
                }

            }).then(() => {
                console.log(`${event.subtitle} - Sucessfully posted to ntfy`); // Log that event notification was successfully posted.
            }).catch(error => console.error(moment().format('MMMM Do YYYY, h:mm:ssa'), "Error posting to ntfy:", error)); //Give error details if failed

            /* Save sent event to database */
            let Event = new Events({

                identifier: event.identifier,
                subtitle: event.subtitle,
                startTime: event.startTime,
                Ultra: event.ccOnly,

            });
            await Event.save().catch((error) => console.error("Error saving to mongodb", error));


        } else console.log(moment().format('MMMM Do YYYY, h:mm:ssa'), event.subtitle, "started more than a minute ago"); // Log when event detected was too long ago

    });

}

module.exports = event_check;
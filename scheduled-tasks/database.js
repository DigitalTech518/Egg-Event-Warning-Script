const mongoose = require('mongoose'); // Using mongoose to interact with MongoDB
const config = require("../config.json"); // Config shit

async function intilizeDatabase() {

    const uri = `mongodb://${config.dbUser}:${config.dbPass}@192.168.1.146:27017/EggTesting`; // String to connect to DB using local IP

    await mongoose.connect(uri).then(console.log("Connected")).catch((error) => console.error("Mongoose no worky", error)); // Connect

    /* Create a Schema for events */
    const eventSchema = new mongoose.Schema({ 

        identifier: String,
        subtitle: String,
        startTime: Number,
        Ultra: Boolean,

    });

    const Events = mongoose.model("Event", eventSchema); // Insert event schema into mongoose model

    return Events; // Return event model
}

module.exports = intilizeDatabase;

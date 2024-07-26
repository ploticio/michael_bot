// const cron = require("node-cron")
// const { Client, GatewayIntentBits } = require("discord.js")
const { TOKEN, CHANNEL_ID, EVENT_LIST } = require("../config.json")

// const client = new Client({intents: [GatewayIntentBits.Guilds]})

// client.on("ready", (c) => {
//     console.log("Bot is Ready");
//     const channel = client.channels.cache.get(CHANNEL_ID)
//     // cron.schedule("*/10 * * * * *", () => {
//     //     let loc_time = new Date().toLocaleTimeString([], {timeStyle: "short", timeZone: "America/Chicago"})
//     //     channel.send("michael time: " + loc_time)
//     // })
// })

// client.login(TOKEN)

const fetch = require('node-fetch');

const getData = async () => {
  try {
    const response = await fetch(EVENT_LIST)
    const json = await response.json()
    const dataArray = json.records.map(rawData => rawData._source)
    return dataArray
  } catch (error) {
    console.log(error.response.body);
  }
}

const getResults = async () => {
    const dataArray = await getData()
    const openEvents = dataArray.filter(event => event.tickets_available > 0)
    if (openEvents.length > 0) {
        printEntry(openEvents[0])
    }
}

const printAll = async() => {
    const dataArray = await getData()
    for(const entry of dataArray) {
        printEntry(entry)
    }
}

const printEntry = (entry) => {
    console.log(`${getDay(entry.start_day)} @ ${getTime(entry.start_hour)} for ${Number(entry.event_cost) === 0 ? "Free" : `$${Number(entry.event_cost)}`} | Tickets Available: ${entry.tickets_available}` )
}

const getDay = (day) => {
    switch(day) {
        case 1:
            return "Thursday"
        case 2:
            return "Friday"
        case 3:
            return "Saturday"
        case 4:
            return "Sunday"
    }
}

const getTime = (time) => {
    if (time > 12)
        return (time - 12) + " PM"
    else
        return (time) + " AM"
}

getResults()
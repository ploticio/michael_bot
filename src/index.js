const cron = require("node-cron")
const fetch = require('node-fetch');
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js")
const { TOKEN, CHANNEL_ID, EVENT_LIST, BOT_ID, SERVER_ID, USER_ID, LINK } = require("../config.json")

const client = new Client({intents: [GatewayIntentBits.Guilds]})

const commands = [
    {
        name: "query",
        description: "Checks all entries"
    }
]

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log("Registering Commands");
        await rest.put(Routes.applicationGuildCommands(BOT_ID, SERVER_ID), {body: commands})
        console.log("Commands Registered");
    } catch (e) {
        console.log(e);
    }
})()

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName === "query")
        interaction.reply(await printAll())
})

client.on("ready", (c) => {
    console.log("Bot is Ready");
    // const channel = client.channels.cache.get(CHANNEL_ID)
    let cronjob = cron.schedule("*/5 * * * * *", async () => {
        let found = await getResults()
        if (found) {
            // channel.send(`<@${USER_ID}> ` + found + `\n${LINK}`)
            client.users.send(USER_ID, found + `\n${LINK}`)
            cronjob.stop()
        }
    })
})

const getResults = async () => {
    const dataArray = await getData()
    const openEvents = dataArray.filter(event => event.tickets_available > 0)
    if (openEvents.length > 0)
        return "Discovered " + getMichaelTime() + "\n" + printEntry(openEvents[0])
    return false
}

const printAll = async() => {
    const dataArray = await getData()
    let result = ""
    result += "checked at " + getMichaelTime()
    result += "\n--------------------------"
    for(const entry of dataArray) {
        result += "\n" + printEntry(entry)
    }
    return result
}

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

const printEntry = (entry) => {
    return (`${getDay(entry.start_day)} @ ${getTime(entry.start_hour)} for ${Number(entry.event_cost) === 0 ? "Free" : `$${Number(entry.event_cost)}`} | Tickets Available: ${entry.tickets_available}` )
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
        return (time - 12) + " PM EDT"
    else
        return (time) + " AM EDT"
}

const getMichaelTime = () => {
    const localTime = new Date().toLocaleTimeString([], {timeStyle: "medium", timeZone: "America/Chicago"}).toString()
    return "" + localTime
}


client.login(TOKEN)
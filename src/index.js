const cron = require("node-cron")
const { Client, GatewayIntentBits } = require("discord.js")
const { token, channel_id } = require("../config.json")

const client = new Client({intents: [GatewayIntentBits.Guilds]})

client.on("ready", (c) => {
    console.log("Bot is Ready");
    const channel = client.channels.cache.get(channel_id)
    cron.schedule("*/2 * * * * *", () => {
        let loc_time = new Date().toLocaleTimeString([], {timeStyle: "short", timeZone: "America/Chicago"})
        channel.send("michael time: " + loc_time)
    })
})

client.login(token)
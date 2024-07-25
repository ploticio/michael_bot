const { Client, GatewayIntentBits } = require("discord.js")
const { token } = require("../config.json")

const client = new Client({intents: [GatewayIntentBits.Guilds]})

client.once("ready", (c) => {
    console.log("Bot is Ready");
})

client.login(token)
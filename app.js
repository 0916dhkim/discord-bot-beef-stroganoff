const fs = require('fs')
const Discord = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()
const colors = require('colors')
const { TOKEN, PREFIX } = require('./config.js')

let client = new Discord.Client()

client.commands = new Discord.Collection()
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)

  client.commands.set(command.name, command)
}

client.on('ready', () => {
  console.log(`Bot <${client.user.tag}> is now active`.green.inverse)
  client.user.setActivity('Warframe | type !help', { type: 'PLAYING' })
})

client.on('message', async (message) => {
  const {
    content,
    author: { bot },
  } = message

  if (!content.startsWith(PREFIX) || bot) return

  const args = content.slice(PREFIX.length).trim().split(/ +/)
  const command = args.shift().toLowerCase()

  if (!client.commands.has(command)) return

  try {
    await client.commands.get(command).execute(message, args)
  } catch (error) {
    console.log('ERROR'.red.inverse)
    console.log(error)
    console.log('End of error message'.red.inverse)
    message.reply(`\nThere was an error trying to execute that command!`)
  }
})

client.login(TOKEN)

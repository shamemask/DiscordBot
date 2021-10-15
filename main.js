const Discord = require('discord.js');
// const Levels = require("discord.js-leveling");
const Levels = require('discord-xp')
// var xpRequired = Levels.xpFor(30);
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});

Levels.setURL("mongodb+srv://shamemask:GjN-9hV-dhQ-7K8@cluster0.xngtn.mongodb.net/test", {useNewUrlParser: true, useUnifiedTopology: true});
const fs = require('fs');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
        require(`./handlers/${handler}`)(client, Discord);
        const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);

            client.commands.set(command.name, command);
        }
    })
    
    let guildArray = client.guilds.array;


    //joined a server
    client.on("guildCreate", guild => {
        console.log("Joined a new guild: " + guild.name);
        //Your other stuff like adding to guildArray
    })
    
    //removed from a server
    client.on("guildDelete", guild => {
        console.log("Left a guild: " + guild.name);
        //remove from guildArray
    })


    client.on('guildMemberAdd', async newMember => {
        //newMember.guild.roles.cache.find(roles => console.log(roles.name, roles.id))
        //newMember.guild.channels.cache.find(channel => console.log(channel.name, channel.id))
        const welcomeChannel = newMember.guild.channels.cache.find(channel => channel.name === 'основной')
       //welcomeChannel.send(`connected to the ${newbieRole.name} channel!!!`)
   
   
        if (newMember.bot) return; 
       const newbieRole = newMember.guild.roles.cache.find(role => role.id === '896060803847966751')
        welcomeChannel.send(`You are in ${newbieRole.name} group`)
       newMember.roles.add(newbieRole.id) // this will add the role to that member!
       welcomeChannel.send(`${newMember} connected to the channel`)
       const user = await Levels.fetch(newMember.id, welcomeChannel.id); // Selects the target from the database.
       if (!user) 
        Levels.createUser(newMember.id, welcomeChannel.id);
   })
   client.on("guildMemberRemove", member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'основной')
    welcomeChannel.send (`${member} left channel`)
})

   client.on("message", async message => {
    if (!message.guild) return;
    if (message.author.bot) return;

    const prefix = '?';

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const randomXp = Math.floor(Math.random() * 9) + 1; //Random amont of XP until the number you want + 
    
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
    if (hasLeveledUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id);
        message.channel.send(`You leveled up to ${user.level}! Keep it going!`);
    }
    message.channel.send(`${message.author} +${randomXp}Xp! `);
    //Rank
    if(command === "rank") {
        const user = await Levels.fetch(message.author.id, message.guild.id);
        message.channel.send(`You are currently level **${user.level}**!`)
    }
    
    //Leaderboard
    if(command === "leaderboard" || command === "lb") {
        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 5);
        if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

        const leaderboard = Levels.computeLeaderboard(client, rawLeaderboard); 

        const lb = leaderboard.map((e) => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);

        message.channel.send(`${lb.join("\n\n")}}`)
    }
})


client.login(process.env.BOT_TOKEN)
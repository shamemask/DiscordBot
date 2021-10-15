const fs = require('fs');
module.exports = {
    name: 'help',
    description: "this is a help command!",
    execute(client, message, args){
        message.channel.send('Привет! Я Дискорд Бот!\n Я умею:');
        const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));


    for (const file of command_files) {
        const command = require(`../commands/${file}`);
        if (command.name != 'help') {
            message.channel.send(`- .${command.name}`);
        } else {
            continue;
        }
    }
    }
}
module.exports = {
    name: 'ban',
    description: "this is a ban command!",
    execute(client, message, args){
    const member = message.mentions.users.first();
    if(member){
    	const memberTarger = message.guild.members.cache.get(member.id);
    	memberTarger.ban();
    	message.channel.send('User has been banned');
    	} else{
        message.channel.send('You couldt ban that member');
        }
    }
}

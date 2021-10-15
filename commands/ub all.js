module.exports = {    
	name: 'ub all',
    description: "this is a unban all command!",
    execute(client, message, args){
			message.guild.bans.fetch().then(bans => {
				if (bans.size == 0) {message.reply("There are no banned users."); throw "No members to unban."};
				bans.forEach(ban => {
					message.guild.members.unban(ban.user.id);
				});
			}).then(() => message.reply("Unbanned all users.")).catch(e => console.log(e))
	}
}


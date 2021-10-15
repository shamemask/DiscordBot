module.exports = {
   
	name: 'unban',
    description: "this is a unban command!",
    execute(client,  message, args){
		if (!args[0]) return message.channel.send('please enter a users id to unban!')

		let member = (args[0].replace(/[^0-9]/g,""));

		return message.guild.bans.fetch().then((bans) => {
			const user = bans.find((ban) => ban.user.id === member);

			if (user) {
				
				message.guild.members.unban(user.user.id)
				.then(() => message.channel.send(`User ${args[0]} is unbanned!`));
			} else {
				message.channel.send(`User ${args[0]} isn't banned!`);
			}
		}).catch((e) => {
			console.log(e);
			message.channel.send('An error has occurred!');
		});
	}
}


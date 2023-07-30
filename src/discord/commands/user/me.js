const { SlashCommandBuilder } = require('discord.js');

const eleves = require('../../../databases/eleves');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('me')
		.setDescription('Provides information about the user\'s fossnote account.'),
	async execute(interaction) {
		var fullUsername = interaction.user.tag;
		var userId = interaction.user.id;
		const user = await eleves.getUserByDiscordId(userId);
		if(!user) {
			await interaction.reply("Vous n'avez pas de compte fossnote. Utilisez `/register` pour créer un compte.")
		} else {
			user.ids.password = "*******";
			await interaction.reply(JSON.stringify(user));
		}
		
	},
};
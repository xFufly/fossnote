const { SlashCommandBuilder } = require('discord.js');

const eleves = require('../../../databases/eleves');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register yourself on fossnote.'),
	async execute(interaction) {
		var fullUsername = interaction.user.tag;
		var userId = interaction.user.id;
		const user = await eleves.getUserByDiscordId(userId);
		if(user) {
			await interaction.reply("Vous avez déjà un compte fossnote, faites `/me` pour le constater.");
		} else {
            const userTag = fullUsername.split("#")[1];
            fullUsername = fullUsername.split("#")[0];
            fullUsername = fullUsername.replace(/[^\w\s]/gi, "").replace("_", "").replace("-", "").replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
            fullUsername = fullUsername + userTag;
            const testUser = await eleves.getUser(fullUsername);
            if(testUser) {
                fullUsername += eleves.randomNumber(10, 999);
            }
            const finalUser = await eleves.createUserWithDiscord("DISCORD", capitalizeFirstLetter(fullUsername), fullUsername, userId);
            finalUser.ids.password = "*******";
            await interaction.reply(finalUser);
        }
		
	},
};
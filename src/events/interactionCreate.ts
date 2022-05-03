import { DiscordBot } from "../config/";

export default () =>
    DiscordBot.Client.get().on('interactionCreate', async (interaction) => {
        // if(interaction.isButton()){
        //     if(interaction.customId === 'yes' || interaction.customId === 'no')
        //         await interaction.reply('Done!');
        // }

        if (interaction.isCommand()) {
            console.log(interaction)
        }
    });
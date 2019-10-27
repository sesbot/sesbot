const Discord = require("discord.js");


module.exports.run = async(bot, message, args) => {
    const HelpEmbed = CreateEmbedAdvanced(`Hey **${message.author.username}** 👋,\nHere are some helpful commands for you!\n\nIf you require more help you can direct message ${bot.user.toString()} to open a support ticket! 🎟️\n`, `**Statewide Emergency Services Help**`,``,`From Statewide Emergency Services Admin Team.`)
    message.channel.send(HelpEmbed);
    message.delete(1000);
}

module.exports.help = {
    name: "help"
}

function CreateEmbedAdvanced(Description, Title, author, footer)
{
    const EmbedColor = 0x211e56;
    const newChannel = new Discord.RichEmbed()
    .setTitle(Title)
    .setColor(EmbedColor)
    .setDescription(Description)
    .setAuthor(author)
    .setFooter(footer)
    .addField('Member Commands', '**ses!help\nses!website\nses!rules\nses!report [@Member] [Reason]\nses!ts**', true)
    .addField('Staff Commands', '**ses!announce [message]\nses!vote [message]\nses!purge [number]**', true)

    return newChannel;
}

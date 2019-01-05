const Discord = require("discord.js");


module.exports.run = async(bot, message, args) => {
    const WebsiteEmbed = CreateEmbed(`Hey, **${message.author.username}** 👋\nHere is the **[Statewide Emergency Services Website](Under Development)**`, `**Statewide Emergency Services Website**`,`From Statewide Emergency Services Admin Team.`)
    message.channel.send(WebsiteEmbed);
    message.delete(1000);
}

module.exports.help = {
    name: "website"
}

function CreateEmbed(Description, author, footer)
{
    const EmbedColor = 0x80bfff;
    const newChannel = new Discord.RichEmbed()
    .setColor(EmbedColor)
    .setDescription(Description)
    .setAuthor(author)
    .setFooter(footer)

    return newChannel;
}
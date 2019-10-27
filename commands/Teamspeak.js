const Discord = require("discord.js");


module.exports.run = async(bot, message, args) => {
    const WebsiteEmbed = CreateEmbed(`Hey **${message.author.username}** 👋,\nHere is the Teamspeak IP : **45.63.67.150:8552**`, `Statewide Emergency Services Teamspeak`,`From Statewide Emergency Services Admin Team.`)
    message.channel.send(WebsiteEmbed);
    message.delete(1000);
}

module.exports.help = {
    name: "ts"
}

function CreateEmbed(Description, author, footer)
{
    const EmbedColor = 0x211e56;
    const newChannel = new Discord.RichEmbed()
    .setColor(EmbedColor)
    .setDescription(Description)
    .setAuthor(author)
    .setFooter(footer)

    return newChannel;
}

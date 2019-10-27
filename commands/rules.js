const Discord = require("discord.js");


module.exports.run = async(bot, message, args) => {
    const WebsiteEmbed = CreateEmbed(`Hey, **${message.author.username}** 👋\n\nHere is all the  **[Rules & Regulations](#discord-information)**\n\nPlease Follow **ALL** Statewide Emergency Services Rules. These rules are in place for a reason to help keep everyone happy and to keep up the fun! Any questions please contact ${bot.user.toString()}\n\nThank you`, `**Statewide Emergency Services Rules**`,`From Statewide Emergency Services Admin Team.`)
    message.channel.send(WebsiteEmbed);
    message.delete(1000);
}

module.exports.help = {
    name: "rules"
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

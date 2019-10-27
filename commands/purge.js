const Discord = require("discord.js");


module.exports.run = async(bot, message, args) => {
    let Admin = message.guild.roles.find("name", "Staff Official");
    

    if(message.member.roles.has(Admin.id))
    {
        message.delete(1000);
        if(isNaN(args[0])) return message.channel.send(`**Please supply a valid amount of messages to clear ${message.author.username}**`)

        if(isNaN(args[0] > 100)) return message.channel.send(`**Please supply a number less then 100 ${message.author.username}**`)

        message.channel.bulkDelete(args[0])
        var PurgeEmbed = CreateEmbed(`Removed **${args[0]}** messages :white_check_mark:`,`Statewide Emergency Services Purge`, `Purge by ${message.author.tag}`)
        message.channel.send(PurgeEmbed);

    } else {
        message.author.send(`${message.author.username} you do not have permission to use this command.`);
        message.delete(100);
    }

}

module.exports.help = {
    name: "purge"
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

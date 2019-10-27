const Discord = require("discord.js");


module.exports.run = async(bot, message, args) => {
    let NotifiyEveryone = message.guild.roles.find("name", "@everyone");
    let Admin = message.guild.roles.find("name", "Staff Official");
    

    if(message.member.roles.has(Admin.id))
    {
        message.delete(1000);
        var Anounce = CreateEmbed(`${message.content.slice(12)}`, `Statewide Emergency Services Announcement`, `Statewide Emergency Services | Announcement by ${message.author.username}`);     
        console.log(`${message.author.username} made an announcement`);

        message.channel.send(Anounce)
            .then(async function(message){
                message.react('👍');
                message.react('👎');
            })
    } else {
        message.author.send(`${message.author.username} you do not have permission to use this command.`);
        message.delete(100);
    }


}

module.exports.help = {
    name: "announce"
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

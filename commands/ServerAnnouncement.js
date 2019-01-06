const Discord = require("discord.js");


module.exports.run = async(bot, message, args) => {
    let NotifiyEveryone = message.guild.roles.find("name", "@everyone");
    let Admin = message.guild.roles.find("name", "Director");
    

    if(message.member.roles.has(Admin.id))
    {
        message.delete(1000);
        var Anounce = CreateEmbed(`${message.content.slice(12)}`, `STATEWIDE EMERGENCY SERVICES ALERT SYSTEM`, `Statewide Emergency Services | Announcement by **SES ALERT SYSTEM**`);     
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
    name: "alert"
}

function CreateEmbed(Description, author, footer)
{
    const EmbedColor = 0xff3e3e;
    const newChannel = new Discord.RichEmbed()
    .setColor(EmbedColor)
    .setDescription(Description)
    .setAuthor(author)
    .setFooter(footer)

    return newChannel;
}
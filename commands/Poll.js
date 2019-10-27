const Discord = require("discord.js");


module.exports.run = async(bot, message, args) => {
    let NotifiyEveryone = message.guild.roles.find("name", "@everyone");
    let Admin = message.guild.roles.find("name", "Staff Official");
    

    if(message.member.roles.has(Admin.id))
    {
        message.delete(1000);
        var Poll = CreateEmbed(`${NotifiyEveryone}\n${message.content.slice(8)}`, `Statewide Emergency Services Vote`, `Statewide Emergency Services | Vote by ${message.author.username}`);
        console.log(`${message.author.username} made a Vote`);

        message.channel.send(Poll)
            .then(async function(message){
                message.react('❎');
                message.react('✅');
            })
    } else {
        message.author.send(`${message.author.username} you do not have permission to use this command.`);
        message.delete(100);
    }
}

module.exports.help = {
    name: "vote"
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

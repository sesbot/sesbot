const Discord = require("discord.js");


module.exports.run = async(bot, message, args) => {
    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let reports = message.guild.channels.find("name", 'reports');
    let reason = args.slice(1).join(" ");
    const ErrorEmbed = CreateEmbed(`Hi ${message.author.username},\nReport useage : ses!report @MemberYouWishToReport Reason\n\nThank You`, `Statewide Emergency Services Reports`,`Statewide Emergency Services Admin Team.`)
    const DevErrorEmbed = CreateEmbed(`Hi ${message.author.username},\nIf you see this please contact a Statewide Emergency Services Developer ASAP. Thank you <3\nERROR: Report.js, LN 11 Was Not Found ;()`, `Statewide Emergency Services Reports`,`Statewide Emergency Services Development Team.`)
    
    if(!target) return message.author.send(ErrorEmbed);
    if(!reason) return message.author.send(ErrorEmbed);
    if(!reports) return message.author.send(DevErrorEmbed);

    const ReportCopy = CreateEmbed(`Hi **${message.author.username}**,\nThank you for your report, our staff team will get on this **ASAP** for you.\n\nIf you need help you can open a support ticket by replying back to this message.\nThank you`, `Statewide Emergency Services Reports`,`Statewide Emergency Services Admin Team.`)
    const ReportEmbed = CreateEmbedAdvanced(target,message,reason,`New Report by ${message.author.username}`, ``, `Statewide Emergency Services Report`, `Report Created`)
    message.delete(100);
    reports.send(ReportEmbed);
    message.author.send(ReportCopy);
}

module.exports.help = {
    name: "report"
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

function CreateEmbedAdvanced(Target, message,reason,Description, Title, author, footer)
{
    const EmbedColor = 0x211e56;
    const newChannel = new Discord.RichEmbed()
        .setThumbnail(Target.user.avatarURL)
        .setTitle(Title)
        .setColor(EmbedColor)
        .setDescription(Description)
        .setAuthor(author, 'https://cdn.discordapp.com/emojis/465245981613621259.png?v=1')
        .setFooter(footer)
        .addField('⚠ - Reported Member', `${Target.user.tag}\n${Target.user.id}`, true)
        .addField('⚠ - Reported By', `${message.author.tag}\n${message.author.id}`, true)
        .addField('⚙ - Channel', `${message.channel}`, true)
        .addField('🔨 - Reason', `${reason}`, true)
        .setTimestamp();
    return newChannel;
}

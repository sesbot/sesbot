const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');
const Enmap = require('enmap');

//CreateBot
const bot = new Discord.Client();
const queue = new Map();

// BOT SETUP
bot.commands = new Discord.Collection();
const TicketSystem = new Enmap();

const ServerID = '596925768009908224';
const ServerName = "Statewide Emergency Services";
const SupportChannelCatagory = '637716519882588165';
const EmbedColor = 0x211e56;

let status = ['ses!help', 'Follow ALL Server Rules', `ses!help`, 'DM for Support'];

bot.login(process.env.BOT_TOKEN);

// Grab all JS Commands from the command folder.
fs.readdir("./commands/", (ERROR, files) => {

    if (ERROR) console.log(ERROR);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0){
        console.log("Could not find any commands inside COMMANDS folder.")
        return;
    }

    jsfile.forEach((f, i) => {

        let props = require(`./commands/${f}`);
        console.log(`${ServerName} File : ${f} has been loaded.`);
        bot.commands.set(props.help.name, props);
    });
})

// When bot has logged into discord do this.
bot.on("ready", async() =>{
    console.log(`\n${bot.user.username} is now online!\nConnected to : ${bot.guilds.size} discord(s) servers.`)

    bot.guilds.forEach(guild =>{
        console.log(`Server Name : ${guild.name} | Server ID : ${guild.id} | Member Count : ${guild.memberCount}`);
    })

    setInterval(function(){
        RandomStatus()
    }, 30000);

});

// Manage Messages.
bot.on("message", async message => {
    let prefix = 'ses!';
    if(message.author.bot) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));

    if (commandfile) commandfile.run(bot, message, args);

    CheckTicket(message)
    MusicBot(prefix, message, args)

    if (!message.content.startsWith(prefix)) return

});

bot.on("guildMemberAdd", member => {
    console.log(`${member.user.username} has joined ${ServerName}.`)
    SendUserMessage(member);
})

async function MusicBot(prefix, msg, args){

    const serverQueue = queue.get(msg.guild.id);

    if(msg.content.startsWith(`${prefix}play`))
    {   
        const voiceChannel = msg.member.voiceChannel;
        if(!voiceChannel) return msg.author.send(`Sorry ${msg.author.username}, You need to be inside a voice channel to use this command.`);

        const songInfo = await ytdl.getInfo(args[0]);

        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
            thumbnail: songInfo.thumbnail_url,
            requester: msg.member.user.toString()
        };

        if(!serverQueue) {
            const queueConstruct = {
                textChannel: msg.channel,
                message: msg,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            
            queue.set(msg.guild.id, queueConstruct);

            queueConstruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                PlayMusic(msg.guild, queueConstruct.songs[0], msg);
            
                var MusicSessionStarted = CreateMusicEmbed(`${msg.member.user.toString()} has started a **Music Session** in **${msg.guild.channels.get(voiceChannel.id).toString()}** Voice Channel.`, `Session Started.`, `${ServerName}`, `http://icons.iconarchive.com/icons/dtafalonso/yosemite-flat/512/Music-icon.png`)
                msg.channel.send(MusicSessionStarted)
                    .then(async function(msg){
                        msg.react('🎵');
                    })
                msg.delete(100);
            } catch(error) {
                console.error(`I was unable to join voice channel: ${error}`);
                msg.delete(100);
                queue.delete(msg.guild.id);
                return msg.author.send(`Sorry ${msg.author.username}, I could not join the voice channel ${error}.\nPlease contact a Server Developer if you see this, Thank you!`);
            }
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            var SongEmbed = CreateMusicEmbed(`**[${song.title}](${song.url})**\nHas been added to the queue!\nBy: **${msg.member.user.toString()}**`, `New Song Added`, `${ServerName}`, `${song.thumbnail}`)
            msg.delete(100);
            return msg.channel.send(SongEmbed);
        }

        return undefined;

    } else if(msg.content.startsWith(`${prefix}skip`)){
        if(!msg.member.voiceChannel) return msg.author.send(`Sorry ${msg.author.username}, You are not inside a voice channel.`);
        if(!serverQueue) return msg.channel.send('There is no song playing to `skip`');
        serverQueue.connection.dispatcher.end();
        return undefined;
    } else if(msg.content.startsWith(`${prefix}stop`)){
        if(!msg.member.voiceChannel) return msg.author.send(`Sorry ${msg.author.username}, You are not inside a voice channel.`);
        if(!serverQueue) return msg.channel.send('There is no song playing to `stop`');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        return undefined;
    }
    return undefined;
}

function PlayMusic(guild, song, msg){
    const serverQueue = queue.get(guild.id);

    if(!song)
    {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }


    // Now Playing Embed
    var MusicSessionStarted = CreateMusicEmbed(`Now Playing : **[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**\nRequested By : ${serverQueue.songs[0].requester}`, `Now Playing`, `${ServerName}`, `${serverQueue.songs[0].thumbnail}`)
    serverQueue.textChannel.send(MusicSessionStarted)
             .then(async function(msg){
                msg.react('👍');
                msg.react('🎵');
                msg.react('🕺');
            })

    console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () => {
            console.log('Song Complete');
            serverQueue.songs.shift();
            PlayMusic(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

async function CheckTicket(message){
    
    if (message.channel.type == 'dm'){
        console.log(`Ticket Sent - ServerID :${ServerID}`);
        let active = await TicketSystem.get(`support_${message.author.id}`)
        
        let guild = bot.guilds.get(ServerID);
        let channel, found = true;
        let author = message.author;

        // Check if support channel already exists.
        try {
            if(active) bot.channels.get(active.channelID).guild;
        } catch(e){
            found = false;
        }

        if (!active || !found){

        
            console.log(`No Channel found ( New Support Ticket ), Creating Support Channel.`);
            active = {};

            let admin = guild.roles.find('name', 'Admin');
            let Everyone = guild.roles.find("name", "@everyone");

            channel = await guild.createChannel(`${message.author.username} - ID ${author.discriminator}`);
            await channel.setParent(SupportChannelCatagory);
            await channel.setTopic(`ses!complete to complete this ticket. | Support for ${message.author.tag} | Support ID : ${message.author.id}`);

            await channel.overwritePermissions(admin, {'READ_MESSAGES': true, 'SEND_MESSAGES': true,'MANAGE_MESSAGES': false,})
            await channel.overwritePermissions(Everyone, {'READ_MESSAGES': false, 'SEND_MESSAGES': false,'MANAGE_MESSAGES': false,})

            let time = GetTime()
            let GetEveryone = guild.roles.find("name", "@everyone")
            const newChannel = CreateEmbed(`${GetEveryone}\n${author.tag} has created a support ticket.\n**Commands**\nses!complete - will complete and close the ticket.`, `Support Ticket`, `Reply to respond to the support ticket.`);
            const newTicket = CreateEmbed(`Your support ticket has been sent to an ${ServerName} staff member.\nSupportID : ${author.discriminator}`,`${author.tag}`, `Support Ticket Created at ${time}`);

            //Send message above to the new created channel.
            await channel.send(newChannel);
            await author.send(newTicket);

            // Update User Data.
            active.channelID = channel.id;
            active.targetID = author.id;

            console.log(`ses Support: Support Ticket Created.\nActive Channel ID - ${active.channelID}\nActive TargetID - ${active.targetID}`);
        }

        channel = bot.channels.get(active.channelID);

        // Create DM embed
        const dm = CreateEmbed(``, `Thank you, ${message.author.tag}`,`Your message has been sent -- An ses staff member will contact you as soon as possible.`);
        const supportTicket = CreateEmbed(message.content, `${message.author.tag}`, `Message Recived -- ${message.author.tag}`);

        await author.send(dm);
        await channel.send(supportTicket);

        //Update User Data & return;
        TicketSystem.set(`support_${message.author.id}`, active);
        TicketSystem.set(`supportChannel_${channel.id}`, message.author.id);
        return;
    }

    // Staff stuff
    let Support = await TicketSystem.get(`supportChannel_${message.channel.id}`);

    if(Support){
        Support = await TicketSystem.get(`support_${Support}`);

        // Make sure the user who we are contacting is still inside the guild.
        let SupportUser = bot.users.get(Support.targetID);
        if(!SupportUser) return message.channel.delete(); // if user does no longer exist then just delete / remove the channel they created.

        // ses!complete command
        if (message.content.toLowerCase() === 'ses!complete')
        {
            const Complete = CreateEmbed(`Your Ticket has been marked as **Complete** by staff member :  ${message.author.username}. If you wish to reopen a ticket or create a new ticket reply back to me! Have a wonderful day ${SupportUser.tag}`, `Hey, ${SupportUser.tag}`, `Ticket Closed -- ${ServerName}`)
            SupportUser.send(Complete);
            message.channel.delete();

            return TicketSystem.delete(`support_${Support.targetID}`);
        }

        const SupportMessage = CreateEmbed(message.content, `${ServerName} Support`, `Message Recived -- ${ServerName} Staff Team.`);
        bot.users.get(Support.targetID).send(SupportMessage);

        message.delete({timeout: 1000})

        SupportMessage.setFooter(`Support Ticket Reply -- StaffMember : ${message.author.username}`);
        return message.channel.send(SupportMessage);

    }
}

function SendUserMessage(p)
{
    const WelcomeMessage = CreateEmbed(`Hi ${p.user.username},\n\nWelcome to **${ServerName}**\nHave any questions? Feel free to reply to this message to create a support ticket 🎟️.\n\n**About us**\n\nOur Community has been around for a short amount of time and pride ourselves on offering unbiased, critical discussion among people of all different backgrounds. We are working everyday to make sure our community is one of the best.\nBecome a **[Member](http://statewiderr.net/index.html)** today!\n\nWe hope you enjoy your time at ${ServerName} ${p.user.username}!`, `${ServerName}`, `From ${ServerName} Staff Team.`);
    p.send(WelcomeMessage);
}

function RandomStatus()
{
    let Statuses = status[Math.floor(Math.random()*status.length)];
    console.log(`Status : ${Statuses}`);
    bot.user.setActivity(Statuses);
}

function CreateEmbed(Description, author, footer)
{
    const newChannel = new Discord.RichEmbed()
    .setColor(EmbedColor)
    .setDescription(Description)
    .setAuthor(author)
    .setFooter(footer)
    .setTimestamp();

    return newChannel;
}

function CreateMusicEmbed(d, a, f, t)
{
    const Music = new Discord.RichEmbed()
    .setThumbnail(t)
    .setColor(EmbedColor)
    .setDescription(d)
    .setAuthor(a, 'http://icons.iconarchive.com/icons/dtafalonso/yosemite-flat/512/Music-icon.png')
    .setFooter(f)
    .setTimestamp();

    return Music;
}

function GetTime()
{
    var currentTime = new Date().toLocaleTimeString();
    return currentTime;
}

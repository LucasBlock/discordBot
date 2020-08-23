const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token, path } = require("./config.json");
//requiring path and fs modules
const fs = require('fs');

client.login(token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('message', async msg => {
    if (msg.author.bot) return;
    if (!msg.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    // if === !audio ou !audio --help ou --commands
    if(msg.content === "!audio" || msg.content === "!audio --help" || msg.content === "!audio --commands")
        return msg.channel.send("To see the list of audios type '!audio --list', to play some audio type !audio NameOfAudio");
        

    const args = msg.content.split(" ");

    if(args[1] === "--list"){
        fs.readdir(path, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                msg.channel.send(`${prefix} ${file.slice(0,-4)}`); 
            });
        });
        return;
    }else{
        // !audio algo procura arquivo mp3 que coincide
        console.log(`${path}${args[1]}.mp3`);
        try {
            await fs.promises.access(`${path}${args[1]}.mp3`);
            // The check succeeded
        } catch (error) {
            // The check failed
            return msg.channel.send("No file match the given name"); 
        }
    }
    // Only try to join the sender's voice channel if they are in one themselves
    if (msg.member.voice.channel) {
        const connection = await msg.member.voice.channel.join();
        const dispatcher = connection.play(`${path}${args[1]}.mp3`);
    } else {
        return msg.reply('You need to be in a voice channel, darling!');
    }

    // If has the right permisssions
    const voiceChannel = msg.member.voice.channel;
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }
    
});


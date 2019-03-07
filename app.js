var Telegraf = require('telegraf');
var config   = require('config');

var bot = new Telegraf(config.get('botToken'));

bot.start((ctx) => ctx.reply('Hi ' + ctx.message.from.first_name + ', Which batch are you from?(YYYY fromat)'));

// bot.help((ctx) => ctx.reply('Send me a sticker'))
// bot.on('sticker', (ctx) => ctx.reply('👍'))
// bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.on('new_chat_members', (ctx) => {
    console.log("New chat members =>", ctx.message.new_chat_members);
    var newMembers = ctx.message.new_chat_members;
    var membersFirstName = "";
    for (var i in newMembers) {
        if (i > 0) {
            membersFirstName += ", "
        }
        membersFirstName += newMembers[i].first_name;
    }
    var message = "Hi " + membersFirstName
    + ". Welcome to the NITK alumni group! Please introduce yourself to me, by clicking, @" + config.get('botName')
    ctx.reply(message);
})

bot.on('')

bot.launch();

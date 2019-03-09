var Telegraf    = require('telegraf');
var config      = require('config');
var MongoClient = require('mongodb').MongoClient;


var bot = new Telegraf(config.get('botToken'));

bot.start((ctx) => {
    ctx.reply('Dear ' + ctx.message.from.first_name + ', I suppose you are a NIT Kurukshetra Alumnus.' 
    + 'Which batch are you from?(YYYY fromat)');
    console.log("Message from = ", ctx.message.from);
});

bot.help((ctx) => ctx.reply('Hi am @' + config.get('botName') + ". I help introduce alumni of NIT Kurukshetra to each other"));

bot.on('new_chat_members', (ctx) => {
    console.log("New chat members =>", ctx && ctx.message && ctx.message.new_chat_members);
    var newMembers = ctx && ctx.message && ctx.message.new_chat_members;
    var membersFirstName = "";
    for (var i in newMembers) {
        if (i > 0) {
            membersFirstName += ", "
        }
        membersFirstName += newMembers[i].first_name;
    }
    var message = "Dear " + membersFirstName
    + ". Welcome to the NITK alumni group! It's a pleasure to have you here."
    + " Please introduce yourself to me, by clicking, @" + config.get('botName')
    + " And I shall further introduce you to everyone."
    ctx.reply(message);
})

bot.on('text', (ctx) => {
    console.log("message =>", ctx.update.message);
    if (ctx && ctx.update && ctx.update.message) {
        var messageRecieved = ctx.update.message;
        var textMsg = messageRecieved.text;
        var from = messageRecieved.from;
        var fromId = from.id;
        //have an array of questions, ask them in order
        //and based NER or regex mark them answered,
        //ask next question from unanswered set
        if (messageRecieved.chat.type == 'private') {
            //reply only if private chat
        }
    }
})

bot.launch();

function startInitialProcess() {
    MongoClient.connect(config.get('databaseSettings.database'), function(err, database) {
      db = ''
      if (!err) {
        console.log("Database initialized");
        db = database;
        dbo = db.db(config.get('databaseSettings.name'))
      } else {
        console.error("Error while connecting to database");
        throw err;
      }
    })
}
  
startInitialProcess();
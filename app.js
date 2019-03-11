config          = require('config');
var Telegraf    = require('telegraf');
var MongoClient = require('mongodb').MongoClient;

var constants   = require('./constants');
var utility     = require('./utility');

var bot = new Telegraf(config.get('botToken'));

bot.start((ctx) => {
    var message = ctx.message;
    var from = message && message.from;
    var chat = message && message.chat;
    if (chat && chat.type == 'private') {
        var mess = 'Dear ' + from.first_name + ', I suppose you are a NIT Kurukshetra Alumnus.\n\n' 
        + '(1/6) Which batch are you from(the year you took admission)?(YYYY format)';
        utility.sendMessage(ctx, mess, 'start', chat.type);
        console.log("Message from = ", ctx.message);
        var updateObj = {
            from : from,
            questions : constants.questions,
            batch : '',
            location : '',
            email : '',
            organization: '',
            designation: '',
            branch: '',
            last_asked: 1
        }
        dbo.collection(config.get('mongoCollections.users')).updateOne({"from.id" : from.id}, 
        { $set : updateObj }, {upsert: true}, function(error, result) {})
    } else {
        utility.sendMessage(ctx, constants.startPublicMessage, 'start', 'group');
    }
}); 

bot.help((ctx) => {
    utility.sendMessage(ctx, constants.helpMessage, 'help', 'any');
});

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
    + ".\n\nHeartiest welcome to the NITK alumni group! It's a pleasure to have you here.\n\n"
    + " Please introduce yourself to me, by clicking, @" + config.get('botName')
    + " And I shall further introduce you to everyone here."
    utility.sendMessage(ctx, message, 'welcome', 'any');
})

bot.on('text', (ctx) => {
    console.log("message =>", ctx.update.message);
    if (ctx && ctx.update && ctx.update.message) {
        var messageRecieved = ctx.update.message;
        var textMsg = messageRecieved.text;
        var from = messageRecieved.from;
        var fromId = from.id;

        //have an array of questions, ask them in order
        //ask next question from unanswered set
        if (messageRecieved.chat.type == 'private') {
            //reply only if private chat
            if(textMsg.toLowerCase().search('mybatchmates') >= 0) {
                //get my batchmates
                dbo.collection(config.get('mongoCollections.users')).findOne({"from.id" : fromId}, function(error, user) {
                    var reply = "Here are your batchmates : \n";
                    dbo.collection(config.get('mongoCollections.users')).find({"batch" : user.batch}).forEach(function(batchmate) {
                        reply += batchmate.from.first_name ;
                        if( batchmate.from.last_name) {
                            reply += " " + batchmate.from.last_name;
                        } 
                        reply += "\n";
                        }, function(latNull) {
                            utility.sendMessage(ctx, reply, 'search', 'private'); 
                    }) 
                })
            } else {
                dbo.collection(config.get('mongoCollections.users')).findOne({"from.id" : fromId}, function(error, user) {
                    var questionId = user.last_asked;

                    //when this answer is to last question, redirect to alumni group and ask to introduce
                    updateAnswerToQuestionForUser(user, questionId, textMsg, function(error, result) {
                        if (!result.nextQuestion) {
                            var mess = "It's pleasure to know you!\n\nPlease type /introduceMe@" 
                            + config.get('botName') + " in the NIT Kurkshetra Alumni group.";
                            utility.sendMessage(ctx, mess, 'introComplete', 'private');
                        } else {
                            var nextQuestion = result.nextQuestion;
                            utility.sendMessage(ctx, nextQuestion, 'nextQuestion', 'private');
                        }
                    });
                })
            }
        } else if (textMsg.search('@' + config.get('botName')) >= 0) {
            dbo.collection(config.get('mongoCollections.users')).findOne({"from.id" : fromId}, function(error, user) {
                if ( (textMsg.toLowerCase().search('introduceme') >= 0 || textMsg.toLowerCase().search('introduce me') >= 0) && user 
                && user.last_asked == constants.questions.length + 1) {
                    var reply = "Meet " + user.from.first_name + " " 
                    + (user.from.last_name ? user.from.last_name : "") + "\n";
                    constants.questions.map(question => {
                        reply += capitalizeFirstLetter(question.answer_key) + " - " + user[question.answer_key] + "\n";
                    })
                    utility.sendMessage(ctx, reply, 'introductory', 'group');
                } else {
                    var mess = "Dear " + from.first_name 
                    + ". I am a bot. Please introduce yourself on a private chat to @" + config.get('botName');
                    utility.sendMessage(ctx, mess, 'introHelp', 'group');
                }
            })
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
        setInterval(function () {
            utility.deleteUnnecessaryMessages(bot)
        }, config.get('messageDeleteHeartBeatRate'));
      } else {
        console.error("Error while connecting to mongo");
        throw err;
      }
    })
}
  
startInitialProcess();

function updateAnswerToQuestionForUser(userObj, questionId, textMsg, cb) {
    var questions = userObj.questions;
    var fieldLabel = '';
    var result = {};
    for (var i in questions) {
        if (questions[i].id == questionId) {
            questions[i].is_answered = true;
            fieldLabel = questions[i].answer_key;
            break;
        }
    }
    userObj[fieldLabel] = textMsg;
    for (var i in questions) {
        if ( !questions[i].is_asked ) {
            result.nextQuestion = questions[i].question;
            questions[i].is_asked = true;
            break;
        }
    }

    //tackle for last question
    delete(userObj['last_asked']);
    dbo.collection(config.get('mongoCollections.users')).updateOne({"from.id" : userObj.from.id },
    {$set : userObj, $inc: {last_asked :1}}, function(error, res) {
        console.log("Updating users in mongo::::::: error = ", error, " result = ", JSON.stringify( (res && res.result) || {}));
        return cb(error, result);
    })
}

function capitalizeFirstLetter(str) {
    return str.substring(0,1).toUpperCase() + str.substring(1, str.length);
}
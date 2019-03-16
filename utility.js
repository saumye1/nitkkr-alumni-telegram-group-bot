exports.sendMessage                 = sendMessage;
exports.deleteUnnecessaryMessages   = deleteUnnecessaryMessages;

function sendMessage(ctxObj, message, type, chatType) {
    //if type is introductory message don't delete
    //log all messages sent in mongo, for later to be deleted or referred deletion purpose
    var messageSent = ctxObj.reply(message);
    messageSent.then(messageInfo => { 
        console.log("Message Sent was ::: ", JSON.stringify(messageInfo));
        dbo.collection(config.get('mongoCollections.messageLogs')).insert(
            {
                message_info : messageInfo,
                datetime : new Date().getTime(),
                is_deleted : false,
                type : type,
                chat_type: chatType
            },
            function(error, result) {
                console.log("::::::::::: Inserting message log ::::::::::", error, result);
        })
    } );
}

//delete only, not private, not introductory messages, not deleted
function deleteUnnecessaryMessages(bot) {
    var deletionTime = new Date().getTime();
    var condition = {
        is_deleted : false, 
        type : { $nin : ['introductory'] },
        chat_type : { $nin : ['private'] },
        datetime : { $lt : deletionTime - config.get('deletePeriod') }
    };
    dbo.collection(config.get('mongoCollections.messageLogs')).find(condition).toArray( function(err, result) {
        console.log("Finding messages that have been more than " 
        + config.get('deletePeriod') / (1000 * 60 * 60) + " hours old", result && result.length);
        if (!err && result && result.length) {
            var messagesInfo = result.map(message => {return message.message_info});
            for (var i in messagesInfo) {
                bot.telegram.deleteMessage(messagesInfo[i].chat.id, messagesInfo[i].message_id);
            }
            var ids = result.map(message => {return message._id});
            console.log("The following IDs were deleted:\n", JSON.stringify(ids));
            dbo.collection(config.get('mongoCollections.messageLogs')).update(condition,
                {$set : {is_deleted : true}}, {multi : true},
                function(error, res) {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log("All updated deleted smoothely");
                    }
                })
        }
    }) 
}
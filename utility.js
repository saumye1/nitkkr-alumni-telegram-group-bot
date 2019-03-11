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
    dbo.collection(config.get('mongoCollections.messageLogs')).find(
        {
            is_deleted : false, 
            type : {$ne : 'introductory'},
            chat_type : {$ne : 'private'}
        }).toArray( function(err, result) {
            if (!err && result && result.length) {
                var messagesInfo = result.map(message => {return message.message_info});
                for (var i in messagesInfo) {
                    bot.telegram.deleteMessage(messagesInfo[i].chat.id, messagesInfo[i].message_id);
                }
                var ids = result.map(message => {return message._id});
                console.log("The following IDs were deleted:\n", JSON.stringify(ids));
                dbo.collection(config.get('mongoCollections.messageLogs')).update(
                {
                    is_deleted : false, 
                    type : {$ne : 'introductory'},
                    chat_type : {$ne : 'private'}
                }, {$set : {is_deleted : true}}, {multi : true},
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
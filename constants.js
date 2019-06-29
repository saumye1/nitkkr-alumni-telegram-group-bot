exports.questions = [{
    id: 1,
    question: "(1/6) Which batch are you from(the year of admission into NIT, Kurukshetra)?",
    is_answered: false,
    is_asked: true,
    answer_key: 'batch'
}, {
    id: 2,
    question: "(2/6) What is your current location?(City)",
    is_answered: false,
    is_asked: false,
    answer_key: 'location'
}, {
    id: 3,
    question: "(3/6) Where are you currently working?(Organization)",
    is_answered: false,
    is_asked: false,
    answer_key: 'organization'
}, {
    id: 4,
    question: "(4/6) What is your function/designation at your Organization?",
    is_answered: false,
    is_asked: false,
    answer_key: 'designation'
}, {
    id: 5,
    question: "(5/6) What's your email address?",
    is_answered: false,
    is_asked: false,
    answer_key: 'email'
}, {
    id: 6,
    question: "(6/6) What was your branch?",
    allowed_answers: {
        "Electrical" : 1,
        "Electronics" : 2,
        "IT" : 3,
        "Mechanical" : 4,
        "Computer Science" : 5,
        "IEM" : 6,
        "Civil" : 7,
        "Other" : 8
    },
    is_answered: false,
    is_asked: false,
    answer_key: 'branch'
}]

exports.messageTypes = {
    'start' : 1,
    'help' : 1,
    'welcome' : 1,
    'search' : 1,
    'introComplete' : 1,
    'nextQuestion' : 1,
    'introductory' : 1,
    'introHelp' : 1,
    'commandHelp' : 1,
    'invalidFormat' : 1
}

exports.helpMessage = 'Hi! I am @' + config.get('botName')
+ "\n\nI currently only help introduce alumni of NIT Kurukshetra to each other.\n\n"
+ " You can start by first introducing yourself to me in a private"
+ " chat by clicking my handle in the beginning of this message"
+ " and then in the NIT KKR alumni group ask me to introduce you."
+ "\n\nBot Development credits: Saumye Malhotra (@algoro) and Devender Yadav (@itsmedev)"
+ "\n\nList of commands:"
+ "\n/mybatchmates - gives a list of your batchmates - Developer credits: Narendra Kumawat (@nk_kumawat)"
+ "\n/nearme [number of kms] - gives a list of your friends near you - Developer credits: Saumye Malhotra (@algoro)"

exports.startPublicMessage = "Please introduce yourself on a private chat with me, click @" + config.get('botName')
+ ".\n\n**This command is meant to be used on a private chat only.**"

exports.formatErrorMessage = "Please answer in the given format.";

exports.introCompleteMessage = "It's pleasure to know you!\n\nPlease type /introduceMe@"
+ config.get('botName') + " in the NIT Kurkshetra Alumni group.";

exports.locationCollectionMessage = 'Please send your location (as an attachment, by first clicking the attachment sign below). Note: Your location will only be used to find your college friends near you and to better organize events in future.';

exports.emptyResultResponse = `We couldn't find anything on your search criteria. Please invite your friends to join the group.`;

exports.invalidCommand = `Sorry, I am unable to recognize this command.`;
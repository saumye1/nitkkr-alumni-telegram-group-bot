var config = require("config");

module.exports = {
    getmyBatchMates(params) {
        return new Promise( (resolve , reject) => {
            params.dbo.collection(config.get("mongoCollections.users")).findOne(params.condition, function(error, user) {
                if(error) {
                    reject(error);
                }else {
                    params.dbo.collection(config.get("mongoCollections.users")).find({"batch" : user.batch}).toArray( function(error , batchmates) {
                        if(error){
                            reject(error);
                        }else {
                            var reply = "Here are your batchmates : \n";
                            batchmates.map((batchmate) => {
                                reply += batchmate.from.first_name ;
                                if( batchmate.from.last_name) {
                                    reply +=  ` ${batchmate.from.last_name} `;
                                }
                                if(batchmate.from.username){
                                    reply += `(@${batchmate.from.username})\n`;
                                }
                            });
                            resolve(reply);
                        }
                    });
                }
            });
        });
    },
    getBatchMatesByYear(params) {
        return new Promise( (resolve , reject) => {
            params.dbo.collection(config.get("mongoCollections.users")).find(params.condition).toArray( function(error , batchmates) {
                if(error){
                    reject(error);
                }else {
                    var reply = `Here are batchmates from ${params.year} : \n`;
                    batchmates.map((batchmate) => {
                        reply += batchmate.from.first_name ;
                        if( batchmate.from.last_name) {
                            reply +=  ` ${batchmate.from.last_name} `;
                        }
                        if(batchmate.from.username){
                            reply += `(@${batchmate.from.username})\n`;
                        }
                    });
                    if(!batchmates || !batchmates.length){
                        reply = `No one from ${params.year} batch is registered.`;
                    }
                    resolve(reply);
                }
            });
        });
    }
};

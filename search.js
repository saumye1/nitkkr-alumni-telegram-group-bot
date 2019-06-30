exports.searches = {
  'mybatchmates' : {
      filter: function(user, params) {
          let batch = user.batch
          , userId = user.from && user.from.id;
          return {'batch': params.length > 1 ? params[1].toString() : batch, 'from.id': {'$ne': userId}}
      },
      getRespStr: function(resultArr, params=[]) {
          let resultStr = params.length > 1 ? ` Here are friends from ${params[1].toString()}:` : 'Here are your batch mates: \n';
          let count = 1;
          let requiredArr = resultArr.map(user => {return user.from});
          requiredArr.sort((a, b) => {return a.first_name.trim().toLowerCase() > b.first_name.trim().toLowerCase()});
          requiredArr.map(user => {
              resultStr += `${count.toString()}. ${capitalizeFirstLetter(user.first_name)} ${user.last_name ? capitalizeFirstLetter(user.last_name) : ''}${user.username ? ' (@'+ user.username+')': ''}\n`;
              count = count + 1;
          });
          return resultStr;
      }
  }, 'nearme' : {
    filter: function(user, params) {
        let userId = user.from && user.from.id;
        let coordinates = user.homeLoc && user.homeLoc.coordinates;
        if (!coordinates) {
            return {'from.id': -1};
        }
        let long = coordinates[0];
        let lat = coordinates[1];
        return {'from.id': {'$ne': userId}, 'homeLoc': {
            '$near': {
                '$geometry': {
                    type: 'Point',
                    coordinates: [long, lat]
                },
                '$maxDistance' : params.length > 1 ? parseInt(params[1]) * 1000 : 10000
            }
        }};
    },
    getRespStr: function(resultArr, params=[]) {
        let resultStr = `Here are friends near you${' (' + params.length > 1 ? 'in ' + params[1].toString() + ' Kms radius)' : 'in 10 Kms radius)'}:\n`;
        let count = 1;
        let requiredArr = resultArr.map(user => {return user.from});
        requiredArr.sort((a, b) => {return a.first_name.trim().toLowerCase() > b.first_name.trim().toLowerCase()});
        requiredArr.map(user => {
            resultStr += `${count.toString()}. ${capitalizeFirstLetter(user.first_name)} ${user.last_name ? capitalizeFirstLetter(user.last_name) : ''}${user.username ? ' (@'+ user.username+')': ''}\n`;
            count = count + 1;
        });
        return resultStr;
    }
  }
};

function capitalizeFirstLetter(str) {
    return str.substring(0,1).toUpperCase() + str.substring(1, str.length);
}
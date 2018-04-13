const request = require("request");

module.exports = {

  getMenu: async () => {

    const options = {
        url: 'http://localhost:8182/api/menu_items/admin?_format=json',
        headers: {
            'User-Agent': 'request'
        }
    };
    return new Promise(function (resolve, reject) {
      request.get(options, function(err, resp, body) {
        if (err) {
          reject(err);
        } else {
          return resolve(JSON.parse(body));
        }
      })
    })
  }

}

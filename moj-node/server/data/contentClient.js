const request = require('request');

module.exports = {

  getMenu: async () => {
    const options = {
      url: 'http://localhost:8182/api/menu_items/admin?_format=json',
      headers: {
        'User-Agent': 'request',
      },
    };
    return new Promise(((resolve, reject) => {
      request.get(options, (err, resp, body) => {
        if (err) {
          reject(err);
        }
        return resolve(JSON.parse(body));
      });
    }));
  },

};

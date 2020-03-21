const request = require('request')

const RequestGet = (url) => {
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

const RequestPost = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    request.post(url, { form: data }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

let pretty = (thing, debug = false) => {
  if (debug) {
    console.dir(thing, { colors: true, depth: null });
  }
}

let makeDoc = (length) => {
  let text = "";
  let possible = "0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

module.exports = {
  RequestGet,
  RequestPost,
  pretty,
  makeDoc,
};
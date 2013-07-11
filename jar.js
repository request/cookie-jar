/*!
* Tobi - CookieJar
* Copyright(c) 2010 LearnBoost <dev@learnboost.com>
* MIT Licensed
*/

/**
* Module dependencies.
*/

var url = require('url');

/**
* Initialize a new `CookieJar`.
*
* @api private
*/

var CookieJar = exports = module.exports = function CookieJar() {
  this.cookies = [];
};

/**
* Add the given `cookie` to the jar.
*
* @param {Cookie} cookie
* @api private
*/

CookieJar.prototype.add = function(cookie){
  this.cookies = this.cookies.filter(function(c){
    // Avoid duplication (same path, same name)
    return !(c.name == cookie.name && c.path == cookie.path);
  });
  this.cookies.push(cookie);
};

/**
* Get cookies for the given `req`.
*
* @param {IncomingRequest} req
* @return {Array}
* @api private
*/

CookieJar.prototype.get = function(req){
  var parsedUrl = url.parse(req.url)
    , path = parsedUrl.pathname
    , host = parsedUrl.hostname
    , now = new Date
    , specificity = {};
  return this.cookies.filter(function(cookie){
    if (0 == path.indexOf(cookie.path) && now < cookie.expires &&
        cookie.path.length > (specificity[cookie.name] || 0))
    {
      if (cookie.domain) {
        if (host.indexOf(cookie.domain) !== -1 && (host.length - cookie.domain.length) == host.indexOf(cookie.domain)) {
          return specificity[cookie.name] = cookie.path.length;
        } else return false
      } else return specificity[cookie.name] = cookie.path.length;
    }
  });
};

/**
* Return Cookie string for the given `req`.
*
* @param {IncomingRequest} req
* @return {String}
* @api private
*/

CookieJar.prototype.cookieString = function(req){
  var cookies = this.get(req);
  if (cookies.length) {
    return cookies.map(function(cookie){
      return cookie.name + '=' + cookie.value;
    }).join('; ');
  }
};

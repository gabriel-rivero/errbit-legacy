const Transport = require('winston-transport');
const Airbrake  = require('./airbrake');

module.exports = class AirbreakTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.airbrake = new Airbrake(opts);
  }

  log(level, message, meta, callback) {
    let error = { message: message || '' };
    if (meta.message && meta.stack && (!message || message === '')) {
      error = meta;
    } else {
      error.message = message;
    }
    error.type = level;
    if (meta) {
      error.stack     = meta.stack     || "";
      error.url       = meta.url       || "";
      error.component = meta.component || "";
      error.action    = meta.action    || "";
      error.params    = meta.params    || {};
      error.session   = meta.session   || {};
    }
    this.airbrake.notify(error);
    callback();
  }
};

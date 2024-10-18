const EventEmitter = require('events');
class OrderEmitter extends EventEmitter {}
const orderEmitter = new OrderEmitter();
module.exports = orderEmitter;
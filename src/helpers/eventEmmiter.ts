const EventEmitter = {
  events: {},

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = {listeners: []};
    }
    this.events[event].listeners.push(listener);
  },

  off(event) {
    delete this.events[event];
  },

  emit(name, ...payload) {
    if (!this.events[name]) return;
    this.events[name].listeners.forEach(listener => listener.apply(this, payload));
  },
};

export default EventEmitter;

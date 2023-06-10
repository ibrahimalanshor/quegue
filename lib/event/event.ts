type EventEmitterListener = (...args: any[]) => void;

export class EventEmitter {
  private events: Record<string, EventEmitterListener[]>;

  constructor() {
    this.events = {};
  }

  on(eventName: string, listener: EventEmitterListener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(listener);
  }

  async emit(eventName: string, ...args: any[]) {
    for (const listener of this.events[eventName]) {
      await listener(args);
    }
  }
}

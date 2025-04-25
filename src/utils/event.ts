// 事件总线
class EventBus {
    private events: Record<string, Function[]>;
    
    constructor() {
        this.events = {};
    }
    
    on(eventName: string, callback: Function): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }
    
    emit(eventName: string, ...args: any[]): void {
        const callbacks = this.events[eventName];
        if (callbacks) {
            callbacks.forEach(cb => cb(...args));
        }
    }
    
    off(eventName: string, callback: Function): void {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        }
    }
}

export default EventBus;
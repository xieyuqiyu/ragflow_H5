// 滑动检测
export class TouchHandler {
    private element: HTMLElement;
    private startX: number;
    private startY: number;
    private callbacks: {
        swipeLeft: Function[];
        swipeRight: Function[];
        swipeUp: Function[];
        swipeDown: Function[];
        [key: string]: Function[];
    };
    private isSwiping: boolean;
    
    constructor(element: HTMLElement) {
        this.element = element;
        this.startX = 0;
        this.startY = 0;
        this.isSwiping = false;
        this.callbacks = {
            swipeLeft: [],
            swipeRight: [],
            swipeUp: [],
            swipeDown: []
        };
        
        this.init();
    }
    
    private init(): void {
        this.element.addEventListener('touchstart', this.touchStart.bind(this), { passive: false });
        this.element.addEventListener('touchmove', this.touchMove.bind(this), { passive: false });
        this.element.addEventListener('touchend', this.touchEnd.bind(this), { passive: false });
    }
    
    private touchStart(e: TouchEvent): void {
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
        this.isSwiping = false;
    }
    
    private touchMove(e: TouchEvent): void {
        // 防止页面滚动
        if (this.isSwiping) {
            e.preventDefault();
        }
        
        const currentX = e.touches[0].pageX;
        const currentY = e.touches[0].pageY;
        const diffX = currentX - this.startX;
        const diffY = currentY - this.startY;
        const threshold = 10; // 较小的阈值用于检测滑动开始
        
        // 检测是否开始滑动
        if (!this.isSwiping && (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold)) {
            this.isSwiping = true;
        }
    }
    
    private touchEnd(e: TouchEvent): void {
        const endX = e.changedTouches[0].pageX;
        const endY = e.changedTouches[0].pageY;
        const diffX = endX - this.startX;
        const diffY = endY - this.startY;
        const threshold = 50;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > threshold) {
                this.trigger('swipeRight', { diffX, diffY });
            } else if (diffX < -threshold) {
                this.trigger('swipeLeft', { diffX, diffY });
            }
        } else {
            if (diffY > threshold) {
                this.trigger('swipeDown', { diffX, diffY });
            } else if (diffY < -threshold) {
                this.trigger('swipeUp', { diffX, diffY });
            }
        }
    }
    
    public on(event: string, callback: Function): this {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        } else {
            this.callbacks[event] = [callback];
        }
        return this;
    }
    
    public off(event: string, callback?: Function): this {
        if (!this.callbacks[event]) return this;
        
        if (callback) {
            this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
        } else {
            this.callbacks[event] = [];
        }
        return this;
    }
    
    private trigger(event: string, ...args: any[]): void {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(cb => cb(...args));
        }
    }
    
    public destroy(): void {
        this.element.removeEventListener('touchstart', this.touchStart.bind(this));
        this.element.removeEventListener('touchmove', this.touchMove.bind(this));
        this.element.removeEventListener('touchend', this.touchEnd.bind(this));
        
        // 清空所有回调
        Object.keys(this.callbacks).forEach(key => {
            this.callbacks[key] = [];
        });
    }
}

// 默认导出
export default TouchHandler;
const animation = {
  // 简单动画函数
  animate({
    element,
    property,
    start,
    end,
    duration = 300,
    easing = 'linear',
    onComplete
  }: {
    element: HTMLElement;
    property: string;
    start: number;
    end: number;
    duration?: number;
    easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
    onComplete?: () => void;
  }): void {
    const startTime = performance.now();
    const unit = property === 'opacity' ? '' : 'px';
    
    const easingFunctions = {
      linear: (t: number) => t,
      easeIn: (t: number) => t * t,
      easeOut: (t: number) => t * (2 - t),
      easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };
    
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunctions[easing](progress);
      const value = start + (end - start) * easedProgress;
      
      element.style[property as any] = value + unit;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    requestAnimationFrame(step);
  },

  // 淡入效果
  fadeIn(element: HTMLElement, duration = 300, onComplete?: () => void): void {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    this.animate({
      element,
      property: 'opacity',
      start: 0,
      end: 1,
      duration,
      onComplete
    });
  },

  // 淡出效果
  fadeOut(element: HTMLElement, duration = 300, onComplete?: () => void): void {
    this.animate({
      element,
      property: 'opacity',
      start: 1,
      end: 0,
      duration,
      onComplete: () => {
        element.style.display = 'none';
        if (onComplete) onComplete();
      }
    });
  }
};

export default animation;
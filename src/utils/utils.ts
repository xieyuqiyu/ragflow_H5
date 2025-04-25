/**
 * 通用工具函数集合
 * 提供常用的工具方法，如防抖、节流、存储操作等
 */

// 函数类型定义
type AnyFunction = (...args: any[]) => any;

// 存储类型定义
interface StorageUtils {
  set(key: string, value: any): void;
  get<T = any>(key: string): T | null;
  remove(key: string): void;
  clear(): void;
  getAll(): Record<string, any>;
}

const utils = {
  /**
   * 防抖函数 - 延迟执行函数，多次触发时只执行最后一次
   * @param fn 要执行的函数
   * @param delay 延迟时间(ms)
   * @returns 防抖处理后的函数
   */
  debounce<T extends AnyFunction>(fn: T, delay = 300): ((...args: Parameters<T>) => void) {
    let timer: number | null = null;
    return function(this: any, ...args: Parameters<T>): void {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    };
  },
  
  /**
   * 节流函数 - 限制函数执行频率，每隔一段时间执行一次
   * @param fn 要执行的函数
   * @param delay 间隔时间(ms)
   * @returns 节流处理后的函数
   */
  throttle<T extends AnyFunction>(fn: T, delay = 300): ((...args: Parameters<T>) => void) {
    let last = 0;
    let timer: number | null = null;
    
    return function(this: any, ...args: Parameters<T>): void {
      const now = Date.now();
      const remaining = delay - (now - last);
      
      if (remaining <= 0) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        last = now;
        fn.apply(this, args);
      } else if (!timer) {
        timer = window.setTimeout(() => {
          last = Date.now();
          timer = null;
          fn.apply(this, args);
        }, remaining);
      }
    };
  },
  
  /**
   * 本地存储工具
   * 提供 localStorage 的便捷操作方法
   */
  storage: {
    /**
     * 存储数据
     * @param key 键名
     * @param value 要存储的值
     */
    set(key: string, value: any): void {
      localStorage.setItem(key, JSON.stringify(value));
    },
    
    /**
     * 获取数据
     * @param key 键名
     * @returns 存储的值，如果不存在或解析失败则返回null
     */
    get<T = any>(key: string): T | null {
      const value = localStorage.getItem(key);
      if (value === null) return null;
      
      try {
        return JSON.parse(value) as T;
      } catch (e) {
        return value as unknown as T;
      }
    },
    
    /**
     * 删除数据
     * @param key 键名
     */
    remove(key: string): void {
      localStorage.removeItem(key);
    },
    
    /**
     * 清空所有存储
     */
    clear(): void {
      localStorage.clear();
    },
    
    /**
     * 获取所有存储的键值对
     * @returns 所有存储的数据对象
     */
    getAll(): Record<string, any> {
      const result: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          result[key] = this.get(key);
        }
      }
      return result;
    }
  } as StorageUtils,
  
  /**
   * 深拷贝对象
   * @param obj 要拷贝的对象
   * @returns 拷贝后的新对象
   */
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }
    
    if (obj instanceof RegExp) {
      return new RegExp(obj) as unknown as T;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item)) as unknown as T;
    }
    
    const result = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = this.deepClone(obj[key]);
      }
    }
    
    return result;
  },
  
  /**
   * 格式化日期
   * @param date 日期对象或时间戳
   * @param format 格式化模板，如 'YYYY-MM-DD HH:mm:ss'
   * @returns 格式化后的日期字符串
   */
  formatDate(date: Date | number | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = new Date(date);
    
    const formatMap: Record<string, number | string> = {
      YYYY: d.getFullYear(),
      MM: String(d.getMonth() + 1).padStart(2, '0'),
      DD: String(d.getDate()).padStart(2, '0'),
      HH: String(d.getHours()).padStart(2, '0'),
      mm: String(d.getMinutes()).padStart(2, '0'),
      ss: String(d.getSeconds()).padStart(2, '0')
    };
    
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => formatMap[match] as string);
  }
};

export default utils;
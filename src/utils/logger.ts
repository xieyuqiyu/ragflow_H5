/**
 * 日志工具
 * 提供统一的日志记录、格式化和上报功能
 */

// 日志级别类型
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// 日志选项接口
interface LogOptions {
  tag?: string;
  data?: any;
}

// 日志数据接口
interface LogData {
  level: LogLevel;
  message: string;
  tag: string;
  data: any;
  timestamp: string;
  userAgent: string;
  url: string;
  appVersion?: string;
}

// 日志配置接口
interface LoggerConfig {
  level: LogLevel;
  reportToServer: boolean;
  serverUrl: string;
  useLocalStorage: boolean;
  maxLocalLogs: number;
  batchReport: boolean;
  batchSize: number;
}

const logger = {
  // 配置选项
  config: {
    level: 'info' as LogLevel,
    reportToServer: false,
    serverUrl: '',
    useLocalStorage: false,
    maxLocalLogs: 100,
    batchReport: false,
    batchSize: 10
  } as LoggerConfig,
  
  // 缓存的日志
  _logQueue: [] as LogData[],
  
  // 设置日志级别
  setLevel(level: LogLevel): void {
    this.config.level = level;
  },
  
  // 启用服务器上报
  enableServerReport(url: string, batchReport = false): void {
    this.config.reportToServer = true;
    this.config.serverUrl = url;
    this.config.batchReport = batchReport;
  },
  
  // 启用本地存储
  enableLocalStorage(maxLogs = 100): void {
    this.config.useLocalStorage = true;
    this.config.maxLocalLogs = maxLogs;
  },
  
  // 日志方法
  debug(message: string, options: LogOptions = {}): void {
    this._log('debug', message, options);
  },
  
  info(message: string, options: LogOptions = {}): void {
    this._log('info', message, options);
  },
  
  warn(message: string, options: LogOptions = {}): void {
    this._log('warn', message, options);
  },
  
  error(message: string | Error, options: LogOptions = {}): void {
    if (message instanceof Error) {
      options.data = {
        ...options.data,
        stack: message.stack,
        name: message.name
      };
      message = message.message;
    }
    this._log('error', message, options);
  },
  
  // 内部日志处理方法
  _log(level: LogLevel, message: string, { tag = '', data = {} }: LogOptions): void {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    // 检查日志级别
    if (levels[level] < levels[this.config.level]) {
      return;
    }
    
    const logData: LogData = {
      level,
      message,
      tag,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      appVersion: process.env.VUE_APP_VERSION || '未知版本'
    };
    
    // 控制台输出
    const consoleMethod = level === 'debug' ? 'log' : level;
    console[consoleMethod as keyof Console](
      `[${logData.timestamp}] [${level.toUpperCase()}]${tag ? ` [${tag}]` : ''}: ${message}`,
      data
    );
    
    // 本地存储
    if (this.config.useLocalStorage) {
      this._saveToLocalStorage(logData);
    }
    
    // 上报到服务器
    if (this.config.reportToServer && this.config.serverUrl && levels[level] >= levels.warn) {
      if (this.config.batchReport) {
        this._queueLog(logData);
      } else {
        this._reportToServer(logData);
      }
    }
  },
  
  // 将日志保存到本地存储
  _saveToLocalStorage(logData: LogData): void {
    try {
      const key = 'app_logs';
      const storedLogs = JSON.parse(localStorage.getItem(key) || '[]');
      
      // 添加新日志
      storedLogs.push(logData);
      
      // 如果超过最大数量，删除最旧的
      if (storedLogs.length > this.config.maxLocalLogs) {
        storedLogs.shift();
      }
      
      localStorage.setItem(key, JSON.stringify(storedLogs));
    } catch (e) {
      console.error('保存日志到本地存储失败:', e);
    }
  },
  
  // 将日志加入队列
  _queueLog(logData: LogData): void {
    this._logQueue.push(logData);
    
    if (this._logQueue.length >= this.config.batchSize) {
      this._flushLogQueue();
    }
  },
  
  // 刷新日志队列
  _flushLogQueue(): void {
    if (this._logQueue.length === 0) return;
    
    const logsToSend = [...this._logQueue];
    this._logQueue = [];
    
    try {
      fetch(this.config.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logs: logsToSend }),
        keepalive: true
      }).catch(() => {
        // 忽略错误，避免循环报错
      });
    } catch (e) {
      // 出错时将日志放回队列
      this._logQueue = [...logsToSend, ...this._logQueue];
    }
  },
  
  // 上报日志到服务器
  _reportToServer(logData: LogData): void {
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          this.config.serverUrl,
          JSON.stringify(logData)
        );
      } else {
        fetch(this.config.serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(logData),
          // 使用keepalive确保请求在页面卸载时仍能完成
          keepalive: true
        }).catch(() => {
          // 忽略错误，避免循环报错
        });
      }
    } catch (e) {
      console.error('上报日志失败:', e);
    }
  },
  
  // 获取本地存储的日志
  getLocalLogs(): LogData[] {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch (e) {
      return [];
    }
  },
  
  // 清除本地存储的日志
  clearLocalLogs(): void {
    localStorage.removeItem('app_logs');
  }
};

// 页面卸载前发送剩余日志
window.addEventListener('beforeunload', () => {
  if (logger.config.batchReport && logger._logQueue.length > 0) {
    logger._flushLogQueue();
  }
});

export default logger;
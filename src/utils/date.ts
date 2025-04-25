const dateUtils = {
  // 格式化日期
  format(date: Date, fmt: string = 'YYYY-MM-DD HH:mm:ss'): string {
    const o: Record<string, number> = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    };
    
    if (/(Y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1, 
          RegExp.$1.length === 1 ? o[k] + '' : ('00' + o[k]).substr(('' + o[k]).length)
        );
      }
    }
    return fmt;
  },

  // 获取相对时间描述
  fromNow(date: Date | string | number): string {
    const now = new Date().getTime();
    const timestamp = typeof date === 'object' ? date.getTime() : new Date(date).getTime();
    const diff = now - timestamp;
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;
    
    if (diff < minute) {
      return '刚刚';
    } else if (diff < hour) {
      return Math.floor(diff / minute) + '分钟前';
    } else if (diff < day) {
      return Math.floor(diff / hour) + '小时前';
    } else if (diff < month) {
      return Math.floor(diff / day) + '天前';
    } else if (diff < year) {
      return Math.floor(diff / month) + '个月前';
    } else {
      return Math.floor(diff / year) + '年前';
    }
  }
};

export default dateUtils;
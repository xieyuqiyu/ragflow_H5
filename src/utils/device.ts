const device = {
  // 获取设备类型
  getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  },

  // 检测是否是iOS设备
  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  },

  // 检测是否是Android设备
  isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
  },

  // 检测是否是微信环境
  isWeChat(): boolean {
    return /MicroMessenger/i.test(navigator.userAgent);
  },

  // 检测是否是支付宝环境
  isAlipay(): boolean {
    return /AlipayClient/i.test(navigator.userAgent);
  },

  // 获取网络类型
  getNetworkType(): string {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    if (connection) {
      return connection.effectiveType || connection.type || 'unknown';
    }
    return 'unknown';
  }
};

export default device;
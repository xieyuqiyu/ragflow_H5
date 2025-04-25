const auth = {
  // Token相关操作
  token: {
    get(): string | null {
      return localStorage.getItem('token');
    },
    set(token: string): void {
      localStorage.setItem('token', token);
    },
    remove(): void {
      localStorage.removeItem('token');
    },
    isValid(): boolean {
      const token = this.get();
      if (!token) return false;
      
      // 这里可以添加token有效性验证逻辑，例如检查JWT过期时间
      try {
        // 简单示例：假设token是JWT格式
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } catch (e) {
        return false;
      }
    }
  },
  
  // 用户信息相关操作
  user: {
    get(): any {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    },
    set(user: any): void {
      localStorage.setItem('user', JSON.stringify(user));
    },
    remove(): void {
      localStorage.removeItem('user');
    },
    hasPermission(permission: string): boolean {
      const user = this.get();
      if (!user || !user.permissions) return false;
      return user.permissions.includes(permission);
    }
  },
  
  // 登录状态检查
  isLoggedIn(): boolean {
    return this.token.isValid() && !!this.user.get();
  },
  
  // 登出
  logout(): void {
    this.token.remove();
    this.user.remove();
    // 可以添加其他清理逻辑
  }
};

export default auth;
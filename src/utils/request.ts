import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import envConfig from '@/config/env.ts';

// 创建axios实例
const instance = axios.create({
  baseURL: envConfig.baseApi,
  timeout: envConfig.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // 根据自己的业务逻辑处理响应
    if (res.code !== 200) {
      // 处理错误
      if (res.code === 401) {
        // 未授权，可以跳转到登录页
      }
      return Promise.reject(new Error(res.message || '请求失败'));
    } else {
      return res.data;
    }
  },
  (error) => {
    // 处理网络错误
    return Promise.reject(error);
  }
);

// 导出请求方法
const request = {
  get<T = any>(url: string, params?: any): Promise<T> {
    return instance.get(url, { params });
  },
  post<T = any>(url: string, data?: any): Promise<T> {
    return instance.post(url, data);
  },
  put<T = any>(url: string, data?: any): Promise<T> {
    return instance.put(url, data);
  },
  delete<T = any>(url: string, params?: any): Promise<T> {
    return instance.delete(url, { params });
  }
};

export default request;
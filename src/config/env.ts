/**
 * 环境变量配置
 * 根据不同环境提供不同的配置参数
 */
export interface EnvConfig {
    baseApi: string;   // API基础路径
    timeout: number;   // 请求超时时间(ms)
    title: string;     // 应用标题
  }
  
  // 开发环境
  const dev: EnvConfig = {
    baseApi: 'http://localhost:3000/api',
    timeout: 15000,
    title: 'RagFlow开发环境'
  };
  
  // 测试环境
  const test: EnvConfig = {
    baseApi: 'http://test-api.example.com/api',
    timeout: 15000,
    title: 'RagFlow测试环境'
  };
  
  // 生产环境
  const prod: EnvConfig = {
    baseApi: 'https://api.example.com/api',
    timeout: 10000,
    title: 'RagFlow'
  };
  
  // 环境配置映射
  const config: Record<string, EnvConfig> = {
    development: dev,
    test: test,
    production: prod
  };
  
  // 获取当前环境
  const env = process.env.NODE_ENV || 'development';
  
  // 导出当前环境的配置
  export const currentEnv = env;
  export default config[env] || config.development;



  
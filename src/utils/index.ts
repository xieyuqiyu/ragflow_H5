/**
 * 工具函数集合
 * 统一导出所有工具函数，方便引用
 */
import request from './request';
import device from './device';
import dateUtils from './date'; 
import validator from './validator';
import imageUtils from './image';
import animation from './animation';
import auth from './auth';
import logger from './logger';
import EventBus from './event';
// 修正可能的拼写错误，如果确实是torch而非touch，请保留原样
import TouchHandler from './torch';

// 命名导出，保持原模块名称
export {
  request,
  device,
  dateUtils,
  validator,
  imageUtils,
  animation,
  auth,
  logger,
  EventBus,
  TouchHandler
};

// 默认导出，统一命名风格
export default {
  request,
  device,
  dateUtils, // 保持一致的命名风格，不再重命名为date
  validator,
  imageUtils, // 保持一致的命名风格，不再重命名为image
  animation,
  auth,
  logger,
  EventBus,
  TouchHandler
};
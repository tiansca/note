/**
 * Created by administrator on 2019/3/20.
 */
import axios from 'axios';
import {baseUrl} from './config'
import { Toast } from 'mint-ui'
import router from "./router";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//基本配置
const Util = {
    baseUtl:baseUrl
};

//ajax 通用配置
Util.ajax = axios.create({
    baseURL:Util.baseUtl,
    withCredentials: true
});


//添加响应拦截器
Util.ajax.interceptors.response.use(res => {
  if(res.data.code !== 0) {
    console.log(router.history.current, res.config.url)
    if (res.config.url === '/api/self') {
      setTimeout(() => {
        if (router.history && router.history.current && router.history.current.name === 'noteDetail') {
          // 详情页不要弹登录提示
        } else {
          Toast(res.data.error || res.data.msg || '操作失败')
        }
      })
      return res.data;
    }
    Toast(res.data.error || res.data.msg || '操作失败')
  }
    return res.data;
});

export default Util;

//editor 2-11

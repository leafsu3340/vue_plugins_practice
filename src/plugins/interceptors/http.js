import axios from 'axios';
import Vue from 'vue';
import GlobalBus from 'src/plugins/global-bus';
import Toast from 'src/plugins/toast';
import getCookie from 'src/utils/get-cookie';
import setCookie from 'src/utils/set-cookie';
import { SUCCESS, ERROR } from 'src/constant/request';
import { intervalStart, intervalEnd } from 'src/constant/login-timeout';

Vue.use(GlobalBus);
Vue.use(Toast, { zIndex: 1055 });

const vueInstance = new Vue();

const token = getCookie('tokenId');
const instance = axios.create({
  headers: {
    'XX-Auth': token,
  },
});

// http request 拦截器
instance.interceptors.request.use((config) => {
  const expTime = parseInt(getCookie('tokenexp'), 10);
  const newTime = new Date();
  const poorTime = expTime - newTime.getTime();

  if (poorTime < intervalStart && poorTime >= intervalEnd && !config.nCheckToken) {
    instance({
      url: '/api/auth/refreshToken',
      nCheckToken: true,
      method: 'put',
    })
      .then((res) => {
        if (res.data.success) {
          setCookie('tokenId', res.data.data);
          return config;
        }
      });
  }

  return config;
});

// http response 拦截器
instance.interceptors.response.use(
  (response) => {
    /**
     * FIXME: 不是所有接口都用了错误码，有的接口返回请求成功，但是无数据之类的
     * TODO: 可以在请求配置里面添加自定义字段
     *    如 requestName: '新建项目'，toast: (true/false)
     *    toast 不为 false 的请求，出错提示信息拼接
     */
    if (response.data.success === false) {
      if (response.data.msg in SUCCESS) {
        response.data.msg = SUCCESS[response.data.msg];
      }

      if (response.data.msg in ERROR) {
        response.data.msg = ERROR[response.data.msg];
      }

      vueInstance.$toast.error(response.data.msg);
    }

    return Promise.resolve(response);
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          vueInstance.$globalBus.$emit('sessionExpired');
          break;
        case 404:
          window.location.href = '/404.html';
          break;
        default:
          window.console.error(error);
      }
    }

    /* eslint-disable no-param-reassign */
    if (error.response.data.message in ERROR) {
      error.response.data.msg = error.response.data.message;
    }

    if (error.response.data.msg in ERROR) {
      error.response.data.msg = ERROR[error.response.data.msg];
    } else if (!error.response.data.msg) {
      error.response.data.msg = '请求失败，网络错误';
    }
    /* eslint-enable no-param-reassign */

    vueInstance.$toast.error(error.response.data.msg);
    return Promise.reject(error.response);
  }
);

export default instance;

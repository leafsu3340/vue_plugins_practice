import Vue from 'vue';
import { ZindexManager } from './zindex-manager';
import ToastComponent from './toast';

const ToastConstructor = Vue.extend(ToastComponent);

function doToast(ZindexManager, opts) {
  const zIndex = typeof opts.zIndex === 'undefined' ? ZindexManager.nextZIndex() : opts.zIndex;
  const toast = new ToastConstructor({
    propsData: {
      zIndex,
      // TODO: support vue component or html snippet
      message: opts.message,
      type: opts.type,
      // TODO: support
      // duration: opts.duration, // 0 means not close automaticlly
      // showClose: opts.showClose,
    },
  });

  toast.$mount();
  document.body.appendChild(toast.$el);
  toast.open();
}

class Toast {
  constructor(ZindexManager) {
    this.ZindexManager = ZindexManager;
  }
}

['error', 'warn', 'success', 'info'].forEach((key) => {
  Toast.prototype[key] = function toast(msg, opt) {
    doToast(this.ZindexManager, { message: msg, type: key, zIndex: opt && opt.zIndex });
  };
});

// eslint-disable-next-line no-shadow
function install(Vue, opt) {
  if (install.installed) return;
  install.installed = true;
  const customZIndex = opt && opt.zIndex;

  // eslint-disable-next-line no-param-reassign
  Vue.prototype.$toast = new Toast(new ZindexManager(customZIndex || 0));
}

export default { install };

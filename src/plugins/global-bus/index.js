// eslint-disable-next-line no-shadow
function install(Vue) {
  if (install.installed) return;
  install.installed = true;

  // eslint-disable-next-line no-param-reassign
  Vue.prototype.$globalBus = new Vue();
}

export default { install };

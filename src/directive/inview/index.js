import inview from './inview'

const install = function(Vue) {
  Vue.directive('inview', inview)
}

if (window.Vue) {
  window['inview'] = inview
  Vue.use(install); // eslint-disable-line
}

inview.install = install
export default inview

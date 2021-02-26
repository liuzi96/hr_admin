import Vue from 'vue'
Vue.directive('imgerror', {
  inserted(el, options) {
    el.src = el.src || options.value
    el.onerror = () => {
      el.src = options.value
    }
  },
  componentUpdated(el, options) {
    el.src = el.src || options.value
  }
})

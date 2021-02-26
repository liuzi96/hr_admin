import pageTools from './pageTools'
import uploadExcel from './UploadExcel'
import ImgUpload from './ImgUpload'
export default {
  install(Vue) {
    Vue.component('pageTools', pageTools)
    Vue.component('uploadExcel', uploadExcel)
    Vue.component('ImgUpload', ImgUpload)
  }
}

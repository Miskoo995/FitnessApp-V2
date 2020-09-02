import Vue from 'vue'
import Vuex from 'vuex'
import users from './modules/users'
import intensity from './modules/intensity'
import exercises from './modules/exercises'
import mealplans from './modules/mealplans'
import scheduler from './modules/scheduler'
import stats from './modules/stats'
import Swal from 'sweetalert2'
import VueYouTubeEmbed from 'vue-youtube-embed'
import Multiselect from 'vue-multiselect'
import VueApexCharts from "vue-apexcharts";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

//Alerting global properties 

window.Swal = Swal

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: false,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

window.Toast = Toast;
window.swalWithBootstrapButtons = swalWithBootstrapButtons;

Vue.component('apexcharts', VueApexCharts)
Vue.component('multiselect', Multiselect)
Vue.use(Vuex)
Vue.use(jsPDF)
Vue.use(html2canvas)
Vue.use(VueYouTubeEmbed, { global: true, componentId: "youtube-media" })

 const store = new Vuex.Store({
  modules:{
    users,
    stats,
    intensity,
    mealplans,
    exercises,
    scheduler
  }
})
export default store
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/theme/style.scss'
import VueRouter from 'vue-router'
import store from './store'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
// 引入封装好的js文件的路径
import plugin from './common/js/plugin'
import echarts from 'echarts'

// 把全局js挂接到vue原型上
Vue.prototype.plugin = plugin;
Vue.config.silent=true;//去除控制台的Vue warn警告信息
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.prototype.$echarts = echarts
//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login' || to.path == '/employee-login' ) {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && (to.path != '/login' && to.path != '/employee-login')) {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});
Vue.directive('removeAriaHidden', {
  bind(el, binding) {
    let ariaEls = el.querySelectorAll('.el-checkbox__original');
    ariaEls.forEach((item) => {
      item.removeAttribute('aria-hidden');
    });
  }
});

Vue.directive('removeAriaHidden', {
  bind(el, binding) {
    let ariaEls = el.querySelectorAll('.el-radio__original');
    ariaEls.forEach((item) => {
      item.removeAttribute('aria-hidden');
    });
  }
});


new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  data(){
    return {
      Event:new Vue()
    }
  },
  //components: { App }
  render: h => h(App)
}).$mount('#app')


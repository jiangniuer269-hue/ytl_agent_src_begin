import axios from 'axios'
import config from  '../../front/config'
import Vue from 'vue';
import router from '@/router'
console.log('config.BASE_API,',config.BASE_API)
// 创建axios实例
const service = axios.create({
    // api的base_url
    baseURL: config.BASE_API,
    // 请求超时时间
    timeout: 200000,
    // 允许携带cookie
    withCredentials: true
})

let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (config) => {
  for(let p in pending){
    if(pending[p].u === config.url + '&' + config.method) { //当当前请求在数组中存在时执行函数体
      pending[p].f(); //执行取消操作
      pending.splice(p, 1); //把这条记录从数组中移除
    }
  }
}

// request拦截器
service.interceptors.request.use(config => {
    if(config.url == "/messages" && config.method.toLowerCase() == 'post'){

    }else{
      removePending(config); //在一个ajax发送前执行一下取消操作
    }
    if(config.gameType &&localStorage.getItem("game_type") == 1){//lh
      var path = config.url.split("/");
      path[path.length-1] = "lh"+path[path.length-1]
      config.url = path.join("/")
    }
    config.cancelToken = new cancelToken((c)=>{
      // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
      pending.push({ u: config.url + '&' + config.method, f: c });
    });
    // Do something before request is sent
    if (localStorage.getItem('token')) {
        // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
        config.headers['X-Token'] = localStorage.getItem('token') || localStorage.getItem('token')
    }
    return config
}, error => {
    // Do something with request error
   // console.log(error) // for debug
    Promise.reject(error)
})

var vm = new Vue({
  router,
  render : h=>h(app).$mount('#app')
})

// respone拦截器
service.interceptors.response.use(
    response => {
        if (response.data.errCode == 2 || response.data.code == 400) {
          vm.$message({
            showClose: true,
            message: '登录缓存过期，请重新登录',
            type: 'error',
            duration:'3000'
          })
          localStorage.clear();
          vm.$router.push({
                path: "/loginbyphone",
                // 从哪个页面跳转
               // querry: { redirect: router.currentRoute.fullPath }
            })
        }

        return response;
    },
    error => {
        return Promise.reject(error)
    })

export default service

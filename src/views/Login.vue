<template>
  <div style="background: url('../../static/myimg/loginbg.jpg') 0% 0% / contain; position: absolute; inset: 0px;">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3   :class="quntitlesize <= 40? 'title58' :'title38'" >
        <img width="350" src="../../static/myimg/logo.png">
        {{ this.quntitle }}
      </h3>
      <el-form-item   prop="account">
        <el-input  type="text" prefix-icon="el-icon-mobile-phone" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item  prop="checkPass">
        <el-input type="password" prefix-icon="el-icon-lock"  v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item  style="width:100%;">
        <el-button type="primary" style="width:100%;background-color: #009688;border-color: #009688;"  :loading="logining" @click="handleSubmit2()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { requestEmployeeLogin ,getQunTitle} from '../api/api';
    	//import { QRCanvas } from 'qrcanvas-vue';
  //import  moment from 'moment'

  export default {
    components: {
			// VueQr
			//QRCanvas
		},
    data() {
      return {
        quntitle:'',
        quntitlesize:40,
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: '',
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    watch:{
      "ruleForm2.account":{
        handler(){
     
        }
      }
    },
    created(){
      getQunTitle().then(response => {
        console.log('data111',response);
        if(response.code == 200){
          this.quntitle = response.data.team_title;
          console.log('data111',this.quntitle);
          var qunlength = this.quntitle.length;
          if(qunlength <=4){
            this.quntitlesize = 40;
          }else if(qunlength >4){
            this.quntitlesize = 50;
          }
          this.$forceUpdate();
        }
      });
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      deleteCookie() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i];
          var eqPos = cookie.indexOf("=");
          var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }
        if(cookies.length > 0)
        {
          for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            var domain = location.host.substr(location.host.indexOf('.'));
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + domain;
          }
        }
      },
      handleSubmit2(ev) {
        //this.deleteCookie();
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
 
            this.logining = true;

            var loginParams = { account: this.ruleForm2.account, password: this.ruleForm2.checkPass};
            requestEmployeeLogin(loginParams).then(data => {
              console.log('data',data);
              this.logining = false;
              if (data.code !== 200) {
                this.$message({
                  message: data.msg,
                  type: 'error'
                });
              } else {
                localStorage.setItem('end_time_near', data.data.end_time_near);
                localStorage.setItem('head_domain', data.data.head_domain);
                sessionStorage.setItem('user', JSON.stringify(data.data));
                sessionStorage.setItem('setOtherLoginFlag',0);
                this.$message({
                  message: data.msg,
                  type: 'success'
                });
               if(data.data.agent_type == 0){
                 this.$router.push({ path: '/menu_member' });           
               }else if(data.data.agent_type == 2 || data.data.agent_type == 3){
                  this.$router.push({ path: '/room-controller' });    
               }     
                    
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px;
    .title38 {
      margin: 50px auto 40px;
      text-align: center;
      font: 14px Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif;
      color: gold;
      letter-spacing: 0;
      text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777, 0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333, 0px 8px 7px #001135;
      font-size: 45px;
      img{
        width: 20%;
        overflow: hidden;
        float: left;
      }
    }
    .title58 {
      margin: 50px auto 40px;
      text-align: center;
      font: 14px Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif;
      color: gold;
      letter-spacing: 0;
      text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777, 0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333, 0px 8px 7px #001135;
      font-size: 58px;
      img{
        width: 20%;
        overflow: hidden;
        float: left;
      }
    }
  }
</style>
<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">后台登录-员工登录</h3>
    <el-form-item   prop="account">
      <el-input type="text" v-model="ruleForm2.account" @change="hideCode" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item  prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="new-password" placeholder="密码"></el-input>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
     <el-form-item   v-if="showCode">
            <span style="color: #000;
    position: relative;
    top: -90px;">请使用微信扫码验证:</span>
            <QRCanvas  style="width:100px;height:100px;" id="qrcode" :options="qrcode"/>
          <!-- <el-input  type="text" v-model="ruleForm2.code" auto-complete="off" placeholder="验证码"></el-input> -->
        </el-form-item>

     <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="getqrcode" :loading="logining">登录</el-button>
    </el-form-item>
    <a style="float:right;margin-top:-10px;color:#ff6d00" href="/#/login">代理登录</a>
  </el-form>
</template>

<script>
  import { requestEmployeeLogin,requestqrcodeemp } from '../api/api';
  	import { QRCanvas } from 'qrcanvas-vue';
  import  moment from 'moment'
  export default {
     components: {
			// VueQr
			QRCanvas
		},
    data() {
      return {
        qrcode:{},
        showCode:false,
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: '',
          code:"",
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
    mounted(){
      
    },
    watch:{
      "ruleForm2.account":{
        handler(){
          this.showCode = false;
        }
      }
    },
    methods: {
      hideCode(){
        this.showCode = false;
        this.ruleForm2.code = "";
      },
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
      getqrcode(){
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            if(this.showCode){
                this.handleSubmit2(); 
                return false;
              }

            this.logining = true;

            var loginParams = { account: this.ruleForm2.account };
            requestqrcodeemp(loginParams).then(data => {
              this.logining = false;
              if (data.code !== 200) {
                this.$message({
                  message: data.msg,
                  type: 'error'
                });
              } else {
                if(data.sms){
                  this.showCode = true;
                      this.ruleForm2.code = data.qcode;
                      var origin = "http://"+window.location.host;
                      if(window.location.host.indexOf("localhost") != -1){
                        origin = "http://wxagent9529.daliqiao.com";
                      }
                      // var origin = "http://wxagent9529.daliqiao.com";
				              var qrcode_url = origin+"/v1/login/agent_auth?r="+moment().millisecond()+"&agent_id="+ data.agents_id+"&qcode="+ data.qcode;
                      this.qrcode = {
                        data: qrcode_url,
                        cellSize: 6,
                        size: 100,
                      }
                }else{
                      return this.handleSubmit2();
                      
                    }
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleSubmit2() {
        //this.deleteCookie();
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {

            this.logining = true;
            var loginParams = { account: this.ruleForm2.account, password: this.ruleForm2.checkPass,code:this.ruleForm2.code };
            requestEmployeeLogin(loginParams).then(data => {
              this.logining = false;
              this.$message.closeAll();
              if (data.code !== 200) {
                this.$message({
                  message: data.msg,
                  type: 'error'
                });
              } else {
                if(data.msg == "验证码已过期"){
                  this.hideCode();
                  this.$message({
                      message: "验证码已过期,重新获取验证码中",
                      type: 'info'
                    });
                  return this.handleIsEmp3();
                }
                localStorage.setItem('head_domain', data.data.head_domain);
                sessionStorage.setItem('user', JSON.stringify(data.data));
                sessionStorage.setItem('setOtherLoginFlag',0);
                this.$message({
                  message: data.msg,
                  type: 'success'
                });
                setTimeout(()=>{
                  if(data.data.agent_type == 3 || data.data.agent_type == 4){
                    this.$router.push({ path: '/board' });
                  }else{
                    this.$router.push({ path: '/agent-lists' });
                  }
                },1000)
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
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #e8f0fe;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #ff6d00;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
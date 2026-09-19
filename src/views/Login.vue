<template>
  <div style="background: url('../../static/myimg/loginbg.jpg') 0% 0% / contain; position: absolute; inset: 0px;">
 
    <!--<el-form :model="ruleForm2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">-->
     <!-- <h3   :class="quntitlesize <= 40? 'title58' :'title38'" >
        <img width="350" src="../../static/myimg/logo.png">
    {{ this.quntitle }}
      </h3>-->
   
     <!-- <el-form-item   prop="account"  >
        <el-input  style="height:70px !important" type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="请输入账号"></el-input>
      </el-form-item>-->
      <div class="demo-ruleForm login-container">
        <input name="account" id="account" type="text" class="accountClass" placeholder="请输入账号" auto-complete="off"  v-model="ruleForm2.account" >
        <input name="pwd" type="password"  id="pwd"  class="pwdClass" placeholder="请输入密码" auto-complete="off"  v-model="ruleForm2.checkPass" >
        <button class="buttonClass"  @click="handleSubmit2()"></button> 
      </div>
    <!-- <el-form-item  prop="checkPass">
        <el-input type="password" prefix-icon="el-icon-lock"  v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item  style="width:100%;margin-top:338px">
        <el-button type="primary" style="width:100%;background-color: #009688;border-color: #009688;"  :loading="logining" @click="handleSubmit2()">登录</el-button>
      </el-form-item>-->
      

   <!-- </el-form>-->
  </div>
</template>

<script>
  import { requestEmployeeLogin ,getQunTitle} from '../api/api';
  import   encrypt  from '@/utils/encrypto'
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

    },
    created(){
     /* getQunTitle().then(response => {
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
      });*/
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
        this.deleteCookie();
        var _this = this;
       // this.$refs.ruleForm2.validate((valid) => {
        //  if (valid) {
            if(this.ruleForm2.account==""){
                  this.$message({
                  message: '请输入账号',
                  type: 'error'
                });
                return;
            }
            var account = $("#account").val();
            if(account == ""){
          this.$message({
                  message: '请输入账号!',
                  type: 'error'
                });
                return;
            }

            if(this.ruleForm2.checkPass==""){
                  this.$message({
                  message: '请输入密码',
                  type: 'error'
                });
                return;
            }

          var pwd = $("#pwd").val();
            if(pwd == ""){
          this.$message({
                  message: '请输入密码!',
                  type: 'error'
                });
                return;
            }
            this.logining = true;
          //  var loginParams = { account: this.ruleForm2.account, password: this.ruleForm2.checkPass};
            var loginParams = { account:encrypt.encryptfunc(this.ruleForm2.account, 'bqoksdjf#$&190ajf','nfjdsj29i#$')
, password:encrypt.encryptfunc(this.ruleForm2.checkPass, 'changlong@#$%qwe','jz,nvkwpqpo2-')};

            requestEmployeeLogin(loginParams).then(data => {
              console.log('data1222',data);
              this.logining = false;
              if (data.code !== 200) {
                this.$message({
                  message: data.msg,
                  type: 'error'
                });
                return;
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
          /*} else {
            console.log('error submit!!');
            return false;
          }
        });*/
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    background:  url(../../static/myimg/box.png) no-repeat;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 576px;
    height: 462px;
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
    .accountClass {
    position: absolute;
    font-family: 黑体;
    color: rgb(0, 0, 0);
    font-size: 32px;
    width: 501px;
    height: 50px !important;
    line-height: 50px !important;
    left: 540px;
    top: 350px;
    background: none;
    border-width: medium;
    border-style: none;
    border-color: currentcolor;
    border-image: none;
    outline: none;
    }
    .pwdClass{
          position: absolute;
    font-family: 黑体;
    color: rgb(0, 0, 0);
    font-size: 32px;
    width: 501px;
    height: 50px !important;
    line-height: 50px !important;
    left: 540px;
    top: 438px;
    background: none;
    border-width: medium;
    border-style: none;
    border-color: currentcolor;
    border-image: none;
    outline: none;
    }
    .buttonClass{
    position: absolute;
    background: url(../../static/myimg/btn.png) no-repeat;
    background-size: 100% auto;
    left: 490px;
    top: 550px;
    width: 442px;
    height: 65px;
    border: none;
    }
    .boxClass{

    position: absolute;
    top: calc(50% + 90px);
    left: 50%;
    /* margin-left: -360px; */
    /* margin-top: -266.5px; */
    /* width: 720px; */
    /* height: 533px; */
    width: 576px;
    height: 426.4px;
    margin-top: -213.2px;
    margin-left: -288px;
    }
  }
</style>
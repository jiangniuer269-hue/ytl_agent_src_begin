<template>
    <section>

         <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true">
                <el-form-item v-if="!active">
                    <el-button @click="openHongbaiqun" type="primary">开启红包群</el-button>
                </el-form-item>
                 <el-form-item v-if="active">
                    <el-button @click="openHongbaiqun" type="primary">修改红包群</el-button>
                </el-form-item>

                 <el-form-item v-if="active">
                    <el-button @click="closeHongbaiqun" type="primary">关闭红包群</el-button>
                </el-form-item>
                <el-form-item v-if="active">
                    <el-button @click="setHongbao" type="primary">发红包</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <div style="position:absolute;top: 60px;left: 0;right: 0;bottom: 0;">
             <div style="position:absolute;top: 0px;left: 0;width:400px;bottom: 0;">
                 <div class="chat" id="chatcontentmain">
             <div id="messagepannel">
                 <div v-for="(chat,index) in chatMsg" :key="'hongbao'+index">
                    <div class="hongbaonotice" v-if="chat.error_order == 8">
                      <span>
                        <img style="width:15px;" src="../../../static/images/hongbao.png">{{chat.message}}
                      </span>
                    </div>
                     <div class="chatItem" v-if="chat.error_order != 8">
                          <div class="headimage" v-html="readerHeader(chat)"></div>
                           <div class="context">
                                <div class="nameandtime" v-html="readerNameAndTime(chat)"></div>
                                 <div class="text" v-if="chat.error_order == 3" v-html="chatMessage(chat)"></div>
                                 <div class="text hongbao" v-if="chat.error_order == 6">
                                     <div class="hongbaotop">
                                        <img style="width:45px;margin-top:12px;margin-left:12px;" src="../../../static/images/hongbao.png">
                                        <div class="hongbaotit">{{JSON.parse(chat.message).title}}</div>
                                        <div class="hongbaostatus">{{JSON.parse(chat.message).note}}</div>
                                     </div>
                                     <div class="hongbaoouttom">
                                         福利红包
                                     </div>
                                 </div>
                           </div>
                     </div>
                 </div>
             </div>
         </div>
         <div class="inputMsg">
           <div class="msgtool">
             <img  @click="triggerUploadImage()" src="../../../static/images/tupian.png">
              <input  style="display: none;"  type="file" name="filenameImage" id="uploadfileImage">  
           </div>
           <div class="input">
              <input id="msginput" type="text" placeholder="请输入消息..."/>
           </div>
           <button @click="doSendMessage()" class="sengMsg">发送</button>
         </div>
             </div>
              <div style="margin-left:400px;height:100%;overflow-y: auto;">
                  <!--列表-->
                    <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="resUsers" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
                        <el-table-column prop="uid" label="会员ID" min-width="100">
                        </el-table-column>
                        <el-table-column prop="username" label="会员名称" min-width="80">
                        </el-table-column>
                         <el-table-column prop="sf" label="身份" min-width="80">
                            <template slot-scope="scope">
                            <span v-if="scope.row.ai == 1">虚拟</span>
                            <span v-if="scope.row.tourist == 1">游客</span>
                            <span v-if="scope.row.ai == 0 && scope.row.tourist != 1">会员</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="score" label="红包金额" min-width="100" sortable>
                        </el-table-column>
                        <el-table-column prop="lucky" label="手气" min-width="100" sortable>
                          <template slot-scope="scope">
                            <span v-if="scope.row.lucky == 0"></span>
                            <span v-if="scope.row.lucky == 1">手气最佳</span>
                            <span v-if="scope.row.lucky == 2">豹子</span>
                            <span v-if="scope.row.lucky == 3">顺子</span>
                            <span v-if="scope.row.lucky == 4">手气最差</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="mktime" label="时间" min-width="120">
                        </el-table-column>
                    </el-table>
             </div>
        </div>

        <!-- 红包群设置 -->
        <el-dialog  title="红包群设置" :visible.sync="hongbaoQunVisible" :close-on-click-modal="false" width="1000px">
           
            <el-form
        size="mini"
        :model="settingForm"
        label-width="100px"
        labelWidth="100px"
        :rules="settingFormRules"
        ref="settingForm"
      >
            <el-form-item class="marginbot15" label="红包群名称" prop="name">
              <el-input v-model="settingForm.name" placeholder="红包群名称"></el-input>
            </el-form-item>
             <el-form-item class="marginbot15"  label="红包群头像" prop="head">
                <input style="display: none;" type="file" name="filename" id="uploadfileAdd" @change="uploadfileAdd()">  
                <div style="float:left;" @click="triggerUploadAdd()">
                        <el-avatar :src="settingForm.head"></el-avatar>           
                </div> 
            </el-form-item>

            <el-form-item class="marginbot15" label="管理员名称" prop="hb_agents_name">
              <el-input v-model="settingForm.hb_agents_name" placeholder="管理员名称"></el-input>
            </el-form-item>
             <el-form-item class="marginbot15"  label="管理员头像" prop="hb_agents_head">
                <input style="display: none;" type="file" name="filenamegl" id="uploadfileAddgl" @change="uploadfileAddgl()">  
                <div style="float:left;" @click="triggerUploadAddgl()">
                        <el-avatar :src="settingForm.hb_agents_head"></el-avatar>           
                </div> 
            </el-form-item>


             <el-form-item class="marginbot15" label="群禁言" prop="no_say">
              <template>
                <el-radio v-model="settingForm.no_say" label="0" >正常</el-radio>
                <el-radio v-model="settingForm.no_say" label="1" >禁言</el-radio>
              </template>
            </el-form-item>
             <el-form-item  class="marginbot15" label="成员" prop="members">
              <div class="chooseMember">
                <div v-show="!has_hb" class="chooseQuickly">
                  <el-form-item label-width="68px" label="快速选择" style="float:left;">
                      <el-select v-model="settingForm.jifen" placeholder="请选择">
                          <el-option label="日积分3个以上" value="1"></el-option>
                          <el-option label="月积分300个以上" value="2"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-checkbox style="margin: 0px 10px;" v-model="settingForm.filterYk">过滤游客</el-checkbox>
                  <el-checkbox style="margin:0px 10px;" v-model="settingForm.filterRobot">过滤机器人</el-checkbox>
                  <el-button style="margin-left:10px;" type="primary" @click.native="surequickchoose">确定</el-button>
                </div>
                <div v-show="!has_hb" class="chooseQuickly">
                  用户ID <el-input style="width:100px" v-model="settingForm.searchId"  :min="0" label="输入ID"></el-input>
                  <el-button type="primary" @click.native="surequickchooseId">确定</el-button>
                  &nbsp;&nbsp;&nbsp;&nbsp;已选择{{settingForm.users.length}}人
                </div>
                <div class="memberCon" style="margin-top:5px;">
                    <!-- <el-transfer
                    :titles="['未选择', '已选择']"
                    :button-texts="['到左边', '到右边']"
                     v-model="settingForm.members" :data="settingForm.users"></el-transfer> -->

                     <!--列表-->
                    <el-table v-if="settingForm.users.length" :row-class-name="plugin.tableRowClassName"   size="mini" border :data="settingForm.users" highlight-current-row class="tableStyle" style="width: 100%;">
                        <el-table-column prop="uid" label="用户ID" min-width="60">
                        </el-table-column>
                        <el-table-column prop="name" label="昵称" min-width="60">
                        </el-table-column>
                        <el-table-column prop="d_integral" label="日积分" min-width="80">
                        </el-table-column>
                         <el-table-column prop="y_integral" label="月积分" min-width="80">
                        </el-table-column>
                         <el-table-column  label="操作" min-width="120">
                            <template slot-scope="scope">
                                <a @click="removeUserItem(scope.row.uid)" v-show="!has_hb" style="color: #00c853">移除</a>
                                <a v-if="scope.row.noSay == 0" @click="scope.row.noSay = 1" style="color: red">禁言</a>
                                <a v-if="scope.row.noSay == 1" @click="scope.row.noSay = 0" style="color: red">取消禁言</a>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!-- <div class="userItem" style="margin-bottom:5px;" v-for="(item,index) in settingForm.users" :key="index">
                       <span>{{item.name}}(ID:{{item.uid}})(日积分:{{item.d_integral}})(月积分:{{item.y_integral}})</span>
                       <el-button style="float:right;margin-right:5px;" type="primary" @click.native="removeUserItem(item.uid)">移除</el-button>
                       <el-button style="float:right;margin-right:5px;" type="primary" v-if="item.noSay == 0" @click.native="item.noSay = 1">禁言</el-button>
                       <el-button style="float:right;margin-right:5px;" type="warning" v-if="item.noSay == 1" @click.native="item.noSay = 0">取消禁言</el-button>
                    </div> -->
                 
                </div>
              </div>
            </el-form-item>



        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hongbaoQunVisible = false;locked = false;">关闭</el-button>
                <el-button type="success" @click.native="openHongbaiqunsure" v-if="!active">开启</el-button>
                <el-button type="success" @click.native="openHongbaiqunsure" v-if="active">修改</el-button>
            </div>
        </el-dialog>

         <!-- 红包设置 -->
        <el-dialog  title="红包设置" :visible.sync="hongbaoVisible" :close-on-click-modal="false" width="1000px">
           
            <el-form
        size="mini"
        :model="settingFormHb"
        label-width="120px"
        labelWidth="120px"
        :rules="settingFormHbRules"
        ref="settingFormHb"
      >
             <el-form-item class="marginbot15" label="红包名称" prop="title">
              <el-input v-model="settingFormHb.title" placeholder="红包名称"></el-input>
            </el-form-item>
            <el-form-item class="marginbot15" label="红包留言" prop="note">
              <el-input v-model="settingFormHb.note" placeholder="红包留言"></el-input>
            </el-form-item>
             <el-form-item class="marginbot15" label="总金额" prop="score">
              <el-input v-model="settingFormHb.score" placeholder="总金额"></el-input>
            </el-form-item>
             <el-form-item class="marginbot15" label="红包个数" prop="counts">
              <el-input v-model="settingFormHb.counts" placeholder="红包个数"></el-input>
            </el-form-item>
             <el-form-item class="marginbot15" label="是否出现豹子" prop="has_baozi">
              <template>
                <el-radio v-model="settingFormHb.has_baozi" label="0" >不出现</el-radio>
                <el-radio v-model="settingFormHb.has_baozi" label="-1" >出现</el-radio>
                <el-radio v-model="settingFormHb.has_baozi" label="-2" >指定ID</el-radio>
                <el-input :disabled="settingFormHb.has_baozi == -2 ? false :true" style="width: 100px;display: inline-block;" size="mini" v-model="has_baozi" placeholder="请输入ID"></el-input>
                
              </template>
             </el-form-item>

              <el-form-item class="marginbot15" label="是否出现顺子" prop="has_shunzi">
              <template>
                <el-radio v-model="settingFormHb.has_shunzi" label="0" >不出现</el-radio>
                <el-radio v-model="settingFormHb.has_shunzi" label="-1" >出现</el-radio>
                <el-radio v-model="settingFormHb.has_shunzi" label="-2" >指定ID</el-radio>
                <el-input :disabled="settingFormHb.has_shunzi == -2 ? false :true" style="width: 100px;display: inline-block;" size="mini" v-model="has_shunzi" placeholder="请输入ID"></el-input>
              </template>
             </el-form-item>

              <el-form-item class="marginbot15" label="手气最佳" prop="max_lucky">
              <template>
                <el-radio v-model="settingFormHb.max_lucky" label="0" >不指定</el-radio>
                <el-radio v-model="settingFormHb.max_lucky" label="-2" >指定ID</el-radio>
                <el-input :disabled="settingFormHb.max_lucky == -2 ? false :true" style="width: 100px;display: inline-block;" size="mini" v-model="max_lucky" placeholder="请输入ID"></el-input>
              </template>
             </el-form-item>

              <el-form-item class="marginbot15" label="手气最差" prop="min_lucky">
              <template>
                <el-radio v-model="settingFormHb.min_lucky" label="0" >不指定</el-radio>
                <el-radio v-model="settingFormHb.min_lucky" label="-2" >指定ID</el-radio>
                <el-input :disabled="settingFormHb.min_lucky == -2 ? false :true" style="width: 100px;display: inline-block;" size="mini" v-model="min_lucky" placeholder="请输入ID"></el-input>
              </template>
             </el-form-item>



        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hongbaoVisible = false;locked = false;">关闭</el-button>
                <el-button type="success" @click.native="setHongbaosure">发送</el-button>
            </div>
        </el-dialog>


    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    import $ from 'jquery'
    import { getLogListPage,listUserByJifen,getUserListPage,listUserByJId,getLastHbSetting } from '../../api/api';

    export default {
        data() {
            return {
              // jifenType:"1",
              locked:false,
              resUsers:[],
              has_baozi:"",
              has_shunzi:"",
              max_lucky:"",
              min_lucky:"",
              notice:"ddd",
              has_hb:false,
              hongbaoVisible:false,
              settingFormHb:{
                title:"",
                note:"",
                score:"",
                counts:"",
                has_baozi:"0",
                has_shunzi:"0",
                max_lucky:"0",
                min_lucky:"0",
                searchId:"",
              },
              settingFormHbRules:{
                title: [
                  {
                    required: true,
                    message: "请输入红包标题",
                    trigger: "blur"
                  }
                ],
                note: [
                  {
                    required: true,
                    message: "请输入红包留言",
                    trigger: "blur"
                  }
                ],
                score: [
                  {
                    required: true,
                    message: "请输入红包金额",
                    trigger: "blur"
                  }
                ],
                counts: [
                  {
                    required: true,
                    message: "请输入红包个数",
                    trigger: "blur"
                  }
                ],
                has_baozi: [
                  {
                    required: true,
                    message: "请选择是否出现豹子",
                    trigger: "blur"
                  }
                ],
                has_shunzi: [
                  {
                    required: true,
                    message: "请选择是否出现顺子",
                    trigger: "blur"
                  }
                ],
              },
              active:false,
              settingForm:{
                name:"",
                hbgroup_id:"",
                hb_agents_head:"",
                hb_agents_name:"",
                head:"",
                no_say:"0",
                jifen:"1",
                users:[],
                members:[],
                 filterYk:false,
                filterRobot:false,
              },
              settingFormRules:{
                 title: [
                  {
                    required: true,
                    message: "请输入红包群标题",
                    trigger: "blur"
                  }
                ],
                head: [
                  {
                    required: true,
                    message: "请输入红包群头像",
                    trigger: "blur"
                  }
                ],
                 hb_agents_head: [
                  {
                    required: true,
                    message: "请输入管理员头像",
                    trigger: "blur"
                  }
                ], 
                hb_agents_name: [
                  {
                    required: true,
                    message: "请输入管理员名称",
                    trigger: "blur"
                  }
                ],
                no_say: [
                  {
                    required: true,
                    message: "请选择红包群禁言",
                    trigger: "blur"
                  }
                ],
                // members: [
                //   {
                //     required: true,
                //     message: "请选择红包群成员",
                //     trigger: "blur"
                //   }
                // ],
              },
              hongbaoQunVisible:false,
                logs:[],
                listLoading: false,
                tableHeight:"500",
                 chatMsg:[],
       message:"",
       isFirstGetHis:true,
            }
        },
        methods: {
          removeUserItem(uid){
            var index = this.settingForm.users.findIndex((vaule,index,arr)=>{
              return vaule.uid == uid;
            })
            if(index != undefined && index !=-1){
              this.settingForm.users.splice(index,1)
            }
            //
            // var members = [];
            // this.settingForm.users.map(function(item){
            //   members.push({uid:item.uid,no_say:item.noSay});
            // });
            // var json = {
            //   cmd:4609,
            //   members:members,
            //   hbgroup_id:this.sett,
            // }

          },
          surequickchooseId(){
            let para = {
                    uid:this.settingForm.searchId,
                };
                console.log(para);
                var that = this;
                listUserByJId(para).then((res) => {
                  if(!res.data.users.length){
                    return;
                  }
                  var rr = that.settingForm.users.filter((item)=>{
                    return item.uid == res.data.users[0].uid;
                  })
                  if(rr.length){
                    return;
                  }
                  res.data.users[0].integral = "-";
                  res.data.users[0].key = res.data.users[0].uid;
                  res.data.users[0].noSay = 0;
                  res.data.users[0].label = res.data.users[0].name + '(' +res.data.users[0].uid +") 当日积分:"+ res.data.users[0].integral;
                  // this.settingForm.members.push(res.data.users[0].uid);
                   this.settingForm.users.unshift(res.data.users[0]);

                   this.settingForm.users.sort((a,b)=>{
                     return a.uid - b.uid;
                   })
                   
                });
          },
          setHongbao(){
            this.hongbaoVisible = true;
             this.settingFormHb = {
                title:"",
                note:"",
                score:"",
                counts:this.settingForm.users.length,
                has_baozi:"0",
                has_shunzi:"0",
                max_lucky:"0",
                min_lucky:"0",
                
              }
          },
          setHongbaosure(){
             if(this.locked){
              return this.$message({
                  showClose: false,
                  message: "请勿重复操作",
                  type: 'error'
              })
            }
            this.$refs.settingFormHb.validate(valid => {
                if (valid) {
                  this.$confirm(
                  "确定发送红包吗?",
                  "提示",
                  {
                    type: "warning"
                  }
                ).then(() => {
                   //ws通知
                    if(!this.isMoney(this.settingFormHb.score)){
                      this.$message({
                          showClose: false,
                          message:"红包金额输入不正确",
                          type: 'error'
                      })
                      return;
                   }
                    if(isNaN(this.settingFormHb.counts)){
                      this.$message({
                          showClose: false,
                          message:"红包数量必须为整数",
                          type: 'error'
                      })
                      return;
                   }
                   if(this.settingFormHb.counts < this.settingForm.users.length){
                      this.$message({
                          showClose: false,
                          message:"红包个数不能小于群成员数量",
                          type: 'error'
                      })
                      return;
                   }
                  
                   if(this.settingFormHb.has_baozi == -2 && this.has_baozi == ""){
                      this.$message({
                          showClose: false,
                          message:"请指定抢到豹子的用户ID",
                          type: 'error'
                      })
                      return;
                    }
                  if(this.settingFormHb.has_shunzi == -2 && this.has_shunzi == ""){
                    this.$message({
                        showClose: false,
                        message:"请指定抢到顺子的用户ID",
                        type: 'error'
                    })
                    return;
                  }

                  if(this.settingFormHb.max_lucky == -2 && this.max_lucky == ""){
                    this.$message({
                        showClose: false,
                        message:"请指定手气最佳的用户ID",
                        type: 'error'
                    })
                    return;
                  }

                  if(this.settingFormHb.min_lucky == -2 && this.min_lucky == ""){
                    this.$message({
                        showClose: false,
                        message:"请指定手气最差的用户ID",
                        type: 'error'
                    })
                    return;
                  }


                  var baozi = "";
                  var shunzi = "";
                  if(this.settingFormHb.has_baozi == -2){
                    baozi = this.has_baozi;
                     var index = this.settingForm.users.findIndex((vaule,index,arr)=>{
                      return vaule.uid == baozi;
                    })
                    if(index == undefined || index ==-1){
                       this.$message({
                          showClose: false,
                          message:"指定中豹子的用户ID不再群里",
                          type: 'error'
                      })
                      return;
                    }

                  }else{
                    baozi = this.settingFormHb.has_baozi;
                  }
                  if(this.settingFormHb.has_shunzi == -2){
                    shunzi = this.has_shunzi;
                     var index = this.settingForm.users.findIndex((vaule,index,arr)=>{
                      return vaule.uid == shunzi;
                    })
                    if(index == undefined || index ==-1){
                       this.$message({
                          showClose: false,
                          message:"指定中顺子的用户ID不再群里",
                          type: 'error'
                      })
                      return;
                    }
                  }else{
                    shunzi = this.settingFormHb.has_shunzi;
                  }
                  if(this.settingFormHb.has_baozi == -2 && this.settingFormHb.has_shunzi == -2){
                    if(baozi == shunzi){
                       this.$message({
                          showClose: false,
                          message:"豹子和顺子不能是同一个ID",
                          type: 'error'
                      })
                      return;
                    }
                  }
                
                  var max_lucky = "";
                  var min_lucky = "";
                  if(this.settingFormHb.max_lucky == -2){
                    max_lucky = this.max_lucky;
                     var index = this.settingForm.users.findIndex((vaule,index,arr)=>{
                      return vaule.uid == max_lucky;
                    })
                    if(index == undefined || index ==-1){
                       this.$message({
                          showClose: false,
                          message:"指定中手气最佳的用户ID不再群里",
                          type: 'error'
                      })
                      return;
                    }

                  }else{
                    max_lucky = this.settingFormHb.max_lucky;
                  }

                   if(this.settingFormHb.min_lucky == -2){
                    min_lucky = this.min_lucky;
                     var index = this.settingForm.users.findIndex((vaule,index,arr)=>{
                      return vaule.uid == min_lucky;
                    })
                    if(index == undefined || index ==-1){
                       this.$message({
                          showClose: false,
                          message:"指定中手气最差的用户ID不再群里",
                          type: 'error'
                      })
                      return;
                    }

                  }else{
                    min_lucky = this.settingFormHb.min_lucky;
                  }

                  if(this.settingFormHb.max_lucky == -2 && this.settingFormHb.min_lucky == -2){
                    if(max_lucky == min_lucky){
                       this.$message({
                          showClose: false,
                          message:"手气最佳和最差不能是同一个ID",
                          type: 'error'
                      })
                      return;
                    }
                  }


                  var data = {
                      cmd: 4603,
                      hbgroup_id:this.settingForm.hbgroup_id,
                       title:this.settingFormHb.title,
                        note:this.settingFormHb.note,
                        score:this.settingFormHb.score,
                        counts:this.settingFormHb.counts,
                        has_baozi:baozi,
                        has_shunzi:shunzi,
                        max_lucky:max_lucky,
                        min_lucky:min_lucky,
                        type:2
                    };
                    console.log(data);
                    // this.has_hb = true;
                    this.locked = true;
                  this.$store.getters.imClient.send(
                    JSON.stringify(data)
                  );
                });
                }
            })
          },
          isMoney(money){
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (reg.test(money)) {
                 return true;
            }else{
                 return false;
            }
          },
          onCreateHb(data){
            if(data.code == 0){
              this.has_hb = true;
              this.hongbaoVisible = false;
              this.locked = false;
              this.settingFormHb = {
                title:"",
                note:"",
                score:"",
                counts:this.settingForm.users.length,
                has_baozi:"0",
                has_shunzi:"0",
                max_lucky:"0",
                min_lucky:"0",
              }
            }else{
              this.$message({
                  showClose: false,
                  message:data.msg,
                  type: 'error'
              })
            }
          },
          onHbHisMsg(data){
            for(var i = data.msg.length-1; i >=0;i--){
              data.msg[i].fromuser = JSON.parse(data.msg[i].fromuser);
              data.fromuid = data.uid;
              this.chatMsg.push(data.msg[i]);
              if(data.msg[i].error_order == 6){
                //请求红包详情
                this.$store.getters.imClient.send(
                    JSON.stringify({
                      cmd:4608,
                      type:2,
                      hb_id:JSON.parse(data.msg[i].message).hbId,
                    })
                  );
              }
            }

            this.goTopBottom("b");
              setTimeout(()=>{
                this.goTopBottom("b");
              },200)

          },
          onHbRealMsg(data){
            if(data.groupid != this.settingForm.hbgroup_id){
               return;
             }
            data.message = data.msg;
            data.createtime = data.cur_time;
             data.fromuid = data.uid;
            this.chatMsg.push(data);
             if(data.error_order == 6){
                //请求红包详情
                
                 this.$store.getters.imClient.send(
                    JSON.stringify({
                      cmd:4608,
                      type:2,
                      hb_id:JSON.parse(data.message).hbId,
                    })
                  );
              }
            this.goTopBottom("b");
             setTimeout(()=>{
                 if($("#chatcontentmain").get(0)){
                  this.goTopBottom("b",$("#chatcontentmain").get(0).scrollHeight - $("#chatcontentmain").scrollTop() - $("#chatcontentmain").height());
              }
              },200)
          },
           onHbResUser(data){
            this.resUsers = data.received_users;
            if(this.resUsers.length){
              var totalscore = 0;
              for(var i = 0 ; i < this.resUsers.length;i++){
                if(this.resUsers[i].ai == 0 && this.resUsers[i].tourist != 1){
                  totalscore += Number(this.resUsers[i].score);
                }
              }
              this.resUsers.push({
                uid:"合计(只包括会员)",
                score:totalscore.toFixed(2)
              })
            }
          },
           escape2Html(str) {
            var str = str.replace(/<(?!(img|br|p)).*?>/g, "");
            var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
            return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
          },
          doSendMessage() {
            this.message = $("#msginput").val();
            this.message = this.escape2Html(this.message);
            this.message = this.message.replace(/<p><br\/>/gm, "");
            for (var i = 0; i < 10; i++) {
              this.message = this.message.replace(/<br\/><br\/>/gm, "<br/>");
              this.message = this.message.replace(/<br><br>/gm, "<br>");
            }
            if (this.message.trim() === "") {
              return;
            }
            var uuid = Math.round(Math.random() * 100000);
            var contend = {
              cmd: 6005,
              msg: this.message,
              groupid: this.settingForm.hbgroup_id,
              msgtype: 0,
              error_order: 3,
              type:2,
              uuid: uuid
            };
            this.$store.getters.imClient.send(JSON.stringify(contend));
            this.$nextTick(() => {
              if ($("#chatcontentmain").get(0)) {
                $("#chatcontentmain").scrollTop(
                  $("#chatcontentmain").get(0).scrollHeight
                );
              }
            });
            this.message = "";
            $("#msginput").val("");
          },
          getUserByJifen(){
            // this.settingForm.users = [];
            // this.settingForm.members = [];
           
            listUserByJifen({
              type:this.settingForm.jifen,
              filterYk:this.settingForm.filterYk == true ? 1:0,
              filterRobot:this.settingForm.filterRobot == true ? 1:0,
              }).then((res) => {
                        if(res.code == 200){
                          var c = this.settingForm.users.concat(res.data),//合并成一个数组
                                temp = {},//用于id判断重复
                                result = [];//最后的新数组
                            //遍历c数组，将每个item.id在temp中是否存在值做判断， 
                            c.map((item,index)=>{
                                if(!temp[item.uid]){
                                    item['key'] = item.uid;
                                    item['noSay'] = 0;
                                    item.label = item.name + '(' +item.uid +") 当日积分:"+ item.integral;
                                    result.push(item);
                                    // this.settingForm.members.push(item.uid);
                                    temp[item.uid] = true
                                }
                            })
                            this.settingForm.users = result;
                            this.settingForm.users.sort((a,b)=>{
                              return a.uid - b.uid;
                            })
                          }else{
                              this.$message({
                                  message: res.msg,
                                  type: 'info'
                              });
                          }
                      })
          },
          surequickchoose(){
            this.getUserByJifen();
            // for(var i = 0 ; i < this.settingForm.users.length; i++){
            //   if(this.settingForm.users[i].integral >= this.settingForm.jifen){
            //     this.settingForm.members.push(this.settingForm.users[i].uid);
            //   }
            // }
          },
          triggerUploadAdd(){
                $("#uploadfileAdd").trigger("click");
            },
            uploadfileAdd(){
          var that = this;
          $.ajaxFileUpload({
              url: 'v1/user/UploadChatImage?filename=filename',
              type: 'get',
              secureuri: false, //一般设置为fals,
              fileElementId: 'uploadfileAdd', // 上传文件的id、name属性名
              dataType: "json", //返回值类型，一般设置为json、application/json
              success: function (rs) {
                  if (rs.code == 200) {
                      that.settingForm.head = rs.data.head;
                      that.$forceUpdate();
                      that.$message({
                          showClose: false,
                          message: "图片上传成功。",
                          type: 'success'
                      })
                  } else {
                      that.$message({
                          showClose: false,
                          message: "图片上传失败。",
                          type: 'error'
                      })
                  }
              },
              error: function () {
                  that.$message({
                      showClose: false,
                      message: "头像上传失败。",
                      type: 'error'
                  })
              }
          });
      },

       triggerUploadAddgl(){
                $("#uploadfileAddgl").trigger("click");
            },
            uploadfileAddgl(){
          var that = this;
          $.ajaxFileUpload({
              url: 'v1/user/UploadChatImage?filename=filenamegl',
              type: 'get',
              secureuri: false, //一般设置为fals,
              fileElementId: 'uploadfileAddgl', // 上传文件的id、name属性名
              dataType: "json", //返回值类型，一般设置为json、application/json
              success: function (rs) {
                  if (rs.code == 200) {
                      that.settingForm.hb_agents_head = rs.data.head;
                      that.$forceUpdate();
                      that.$message({
                          showClose: false,
                          message: "图片上传成功。",
                          type: 'success'
                      })
                  } else {
                      that.$message({
                          showClose: false,
                          message: "图片上传失败。",
                          type: 'error'
                      })
                  }
              },
              error: function () {
                  that.$message({
                      showClose: false,
                      message: "头像上传失败。",
                      type: 'error'
                  })
              }
          });
      },


       triggerUploadImage(){
                $("#uploadfileImage").trigger("click");
            },
       uploadfileImage(){
          var that = this;
          this.$confirm(
            "确定发送图片吗?",
            "提示",
            {
              type: "warning"
            }
          ).then(() => {
                if( $("#uploadfileImage").val() == ""){
                  return;
                }
                $.ajaxFileUpload({
                  url: 'v1/user/UploadImageChat?filename=filenameImage',
                  type: 'get',
                  secureuri: false, //一般设置为fals,
                  fileElementId: 'uploadfileImage', // 上传文件的id、name属性名
                  dataType: "json", //返回值类型，一般设置为json、application/json
                  success: function (rs) {
                      if (rs.code == 200) {
                        $("#uploadfileImage").val("");
                        var uuid = Math.round(Math.random() * 100000);
                         var contend = {
                            cmd: 6005,
                            msg: "<img data='"+rs.data.head+"' src="+rs.data.head+" />",
                            groupid: that.settingForm.hbgroup_id,
                            msgtype: 0,
                            error_order: 3,
                            uuid: uuid
                          };
                          that.$store.getters.imClient.send(JSON.stringify(contend));

                      } else {
                          that.$message({
                              showClose: false,
                              message: "图片上传失败。",
                              type: 'error'
                          })
                      }
                  },
                  error: function () {
                      that.$message({
                          showClose: false,
                          message: "头像上传失败。",
                          type: 'error'
                      })
                  }
              });
          }).catch(
              res => {
                 $("#uploadfileImage").val("");
              }
          )
      },


      closeHongbaiqun(){
        this.$confirm(
            "确定关闭红包群吗?",
            "提示",
            {
              type: "warning"
            }
          ).then(() => {
            this.$store.getters.imClient.send(
              JSON.stringify({ cmd: 4600,hbgroup_id:  this.settingForm.hbgroup_id,no_show:0})
            );
            this.$store.getters.imClient.send(//获取红包群
                    JSON.stringify({
                      cmd: 4602,
                      type:2
                    })
                  );
          });
      },
          openHongbaiqunsure(){
            if(this.locked){
              return this.$message({
                  showClose: false,
                  message: "请勿重复操作",
                  type: 'error'
              })
            }
            this.$refs.settingForm.validate(valid => {
                if (valid) {
                  //ws通知
                  var members = [];
                  this.settingForm.users.map(function(item){
                    members.push({uid:item.uid,no_say:item.noSay});
                  });
                  var data = {
                      cmd: 4600,
                      members: members,
                      name: this.settingForm.name,
                      head: this.settingForm.head,
                      no_say: this.settingForm.no_say,
                      hb_agents_head: this.settingForm.hb_agents_head,
                      hb_agents_name: this.settingForm.hb_agents_name,
                      no_show:1,
                      type:2,
                      agents_id:util.getSessionItem('user','agents_id'),
                      agents_name:util.getSessionItem('user','name')
                    };
                    if(this.settingForm.hbgroup_id){
                      data.hbgroup_id = this.settingForm.hbgroup_id;
                    }
                    this.locked = true;
                  this.$store.getters.imClient.send(
                    JSON.stringify(data)
                  );
                }
            })
          },
          openHongbaiqun(){
            this.hongbaoQunVisible = true;
            // this.getUserByJifen();
            this.$store.getters.imClient.send(//获取红包群
                    JSON.stringify({
                      cmd: 4602,
                      type:2
                    })
                  );
          },
          goTopBottom(type, height) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (type == "b") {
            if (this.isFirstGetHis) {
              this.isFirstGetHis = false;
              if ($("#chatcontentmain").get(0)) {
                $("#chatcontentmain").scrollTop(
                  $("#chatcontentmain").get(0).scrollHeight
                );
              }
            } else {
              if (height < 200) {
                if ($("#chatcontentmain").get(0)) {
                  $("#chatcontentmain").scrollTop(
                    $("#chatcontentmain").get(0).scrollHeight
                  );
                }
              }
            }
          }
        }, 100);
      });
    },
             chatMessage(chat){
          if(chat.iscache){
              return "<img class='loadingImg' src='../../../front/images/loading.gif'>"+chat.message;
          }else if(chat.error_order == 5){
            if(chat.fromuid == localStorage.getItem("uid")){
              return "<img class='loadingImg' src='../../../front/images/errormsg.png'>"+chat.message;
            }
          }else{
              if(chat.error_order == 1){
                if(chat.fromuid == localStorage.getItem("uid")){
                   return  chat.message;
                }else if(localStorage.getItem("openFlowBet") && localStorage.getItem("openFlowBet") == 0){

                   return  chat.message;
                }else{
                 
                  return  chat.message;
                }
              }else{
                  return chat.message;
              }
          }
      },
      readerHeader(chatItem) {
        //对方
        if (chatItem.fromuser != null && chatItem.fromuser != "") {
          if(chatItem.fromuser.head != ""){
                      if(chatItem.fromuser.head.indexOf("http") != -1){
                        return "<img width='32' height='32' src="+chatItem.fromuser.head+">";
                      }else{
                        return "<img width='32' height='32' src="+localStorage.getItem("head_domain")+chatItem.fromuser.head+">";
                      }
                  }else{
                      return "<div style='background-color: "+this.tranColor(chatItem.fromuser.name)+"'>"+ this.getFirstname(chatItem.fromuser.name) +"</div>"
                  }
        }else{
          return (
              "<div style='background-color: " +
              this.tranColor(chatItem.fromuser.name) +
              "'>" +
              this.getFirstname(chatItem.fromuser.name) +
              "</div>"
            );
            
        }
    },
       tranColor(name) {//颜色转换
        var str = '';
        for (var i = 0; i < name.length; i++) {
            str += parseInt(name[i].charCodeAt(0), 13).toString(16);
        }
        return '#' + str.slice(1, 4);
      },
      getFirstname(name) {
          return name.substr(0, 1)
      },
      readerNameAndTime(chatItem){
          if(chatItem.fromuser != null){
             return "<span style='color:"+ this.tranColor(chatItem.fromuser.name)+"'>"+chatItem.fromuser.name + " " + chatItem.createtime +"</span>";
          }
      },
     gobackdesk(){
          this.$router.push("/desk");
          $(".bottomFunc").show();
      },
      onScore(data){
          if(localStorage.getItem("uid") == data.uid){
              localStorage.setItem("score",data.score);
              this.yue = localStorage.getItem("score");
              this.$forceUpdate()
          }
      },
       pmd(){
          setTimeout(()=>{
              $(".pmd").css("width",$(".el-container").width()-120)
              $(".pmd .content").css({
                  "width":$(".pmd").width()-20,
              })
              $(".pmd .con").html(this.notice)
              this.animate()
          },1000)

      },
      onListHbGroup(data){
        if(data.code ==0){
          if(data.records.length){//红包群处于开启状态
            this.active = true;
            this.settingForm.name = data.records[0].name;
            this.settingForm.head = data.records[0].head;
            this.settingForm.hbgroup_id = data.records[0].hbgroupId;
            this.settingForm.hb_agents_head = data.records[0].hb_agents_head;
            this.settingForm.hb_agents_name = data.records[0].hb_agents_name;
            this.settingForm.no_say = (data.records[0].noSay).toString();
            this.has_hb = data.records[0].has_hb;
            var members = [];
            this.settingForm.users=[];
            for(var i = 0; i < data.records[0].members.length;i++){
              members.push(data.records[0].members[i].uid);
              data.records[0].members[i].name = data.records[0].members[i].username;
              if(!data.records[0].members[i].integral){
                data.records[0].members[i].integral = "-";
              }
              data.records[0].members[i].key = data.records[0].members[i].uid;
              data.records[0].members[i].label = data.records[0].members[i].name + '(' +data.records[0].members[i].uid +") 当日积分:"+ data.records[0].members[i].integral;
              this.settingForm.users.unshift(data.records[0].members[i])
              this.settingForm.users.sort((a,b)=>{
                     return a.uid - b.uid;
                   })
            }
            // this.settingForm.members = members;
            //获取历史消息
            this.chatMsg = [];
             this.$store.getters.imClient.send(//获取红包群
                    JSON.stringify({
                      cmd: 6078,
                      type:2,
                      "groupid":this.settingForm.hbgroup_id,
                      "startpage":0
                    })
                  );
          }else{
             this.active = false;
             this.chatMsg = [];
             this.has_hb = false;
             this.resUsers = [];
             this.settingForm = {
                name:"",
                hbgroup_id:"",
                head:"",
                no_say:"0",
                jifen:"1",
                users:[],
                members:[],
                hb_agents_head:"",
                hb_agents_name:"",
                filterYk:false,
                filterRobot:false,
              }
              //获取上一个红包群的name head hb_agents_head hb_agents_name
              getLastHbSetting().then((res) => {
                if(res.data){
                  this.settingForm.name = res.data.name;
                  this.settingForm.head = res.data.head;
                  this.settingForm.hb_agents_head = res.data.hb_agents_head;
                  this.settingForm.hb_agents_name = res.data.hb_agents_name;
                }
              })
          }
        }
      },
      onCreateHbGroup(data){
        if(data.code == 0){
          this.hongbaoQunVisible = false;
          this.locked = false;
          
          this.$store.getters.imClient.send(//获取红包群
                    JSON.stringify({
                      cmd: 4602,
                      type:2
                    })
                  );
        }else{
           this.$message({
              showClose: false,
              message:data.msg,
              type: 'error'
          })
        }
      },
      animate(){
          if($(".pmd .con").width() > $(".pmd .content").width() ){
              $(".pmd .con").css("left",$(".pmd .content").width())
              $(".pmd .con").animate({
                  "left":-$(".pmd .con").width()-20
              },this.notice.length * 400,'linear',this.animate)
          }else{
              $(".pmd .con").css("left",0)
          }
      },
            autoTableHeight(){
                this.$nextTick(() => {
                this.tableHeight = $(".content-container").height() - $(".toptoolbar").height() - 120
                    setTimeout(()=>{
                        for(var i = 0 ; i < $(".tableStyle").length;i++){
                            $(".tableStyle").eq(i).find(".is-scrolling-left").width($(".tableStyle").eq(i).find(".el-table__header").width())
                        }
                    },500)
             })
           }
        },
        watch:{
            // "$store.getters.userOnline":{
            //     handler(){
            //         this.logs = this.$store.getters.userOnline;
            //     },
            //     deep:true,
            // }
        },
        mounted() {
          $("body").on("change","#uploadfileImage",()=>{
            this.uploadfileImage()
          })
          this.$store.getters.imClient.bindHbResUser(this.onHbResUser);
          this.$store.getters.imClient.bindCreateHb(this.onCreateHb);
          this.$store.getters.imClient.bindHbHisMsg(this.onHbHisMsg);
          this.$store.getters.imClient.bindHbRealMsg(this.onHbRealMsg);
          this.$store.getters.imClient.bindListHbGroup(this.onListHbGroup);
          this.$store.getters.imClient.bindCreateHbGroup(this.onCreateHbGroup);
           this.$store.getters.imClient.send(//获取红包群
                    JSON.stringify({
                      cmd: 4602,
                      type:2
                    })
                  );
            this.autoTableHeight();
            $(window).resize(()=>{
                this.autoTableHeight();
            })
        }
    }

</script>
<style lang="scss" scoped>
      .chooseMember{
        // height: 330px;
      }
      .chooseQuickly{
        padding: 5px 0px;
        height: 30px;
        border-bottom: 1px solid #ccc;
        line-height: 27px;
      }
      .memberCon{
        // height: 290px;
        overflow-y: auto;
        max-height: 300px;
        .memberItem{
          float: left;
          height: 30px;
          line-height: 30px;
          margin-right: 15px;
        }
      }
     .hongbaonotice{
      text-align: center;
      margin: 10px;
      span{
        padding: 3px 20px;
      background-color: #ccc;
      color:#fff;
      font-size: 14px;
      }
      img{
        position: relative;
        top:2px;
      }
    }
    .inputMsg{
      position: absolute;
      bottom:0px;
      left:0px;
      right:0px;
      height: 70px;
      border-top: 1px solid #ccc;
      background-color: #fff;
      .msgtool{
        padding:0 5px;
        position: absolute;
        top:0px;
        left:0px;
        right:0px;
        height:25px;
        border-bottom:1px solid #ccc;
        img{
          cursor:pointer;
        }
      }
      .input{
        margin-top:25px;
        margin-right: 80px;
        height: 45px;
        line-height: 45px;
        input{
          height: 45px;
          width: 100%;
          margin: 0;
          padding: 0;
          border: none;
          outline: none;
          text-indent: 10px;
          font-size: 16px;
        }
      }
      .sengMsg{
        position: absolute;
        width:60px;
        height:35px;
        top: 30px;
        right: 10px;
        background-color: #F8D84D;
        color:#742F14;
        border-radius: 5px;
        border: none;
        font-size: 18px;
      }
    }
    .blackd{
      height:10px;
      background-color: #EDEDED;
      position: relative;
      top: 300px;
    }
    .hongbaodetail{
      position: absolute;
      top:0px;
      left:0px;
      right:0px;
      bottom:0px;
      .close{
            position: absolute;
          z-index: 1;
          left: 15px;
          top: 10px;
          font-size: 20px;
          color: #fff;
      }
      background-color: #fff;
       .hongbaodetailtop{
         position: absolute;
         top:0px;
         left:0px;
         right:0px;
         height:300px;
        //   background: url("../../../front/images/hongbaodetailtop.png") no-repeat center;
          background-position: 0% 0%;
          background-size: 100%;
          .title1{
            position: relative;
              top: 50%;
              text-align: center;
              font-size: 20px;
          }
          .title2{
                position: relative;
                top: 52%;
                text-align: center;
                font-size: 16px;
                color: #ccc;
          }
           .title3{
              position: relative;
              top: 55%;
              text-align: center;
              color: #C9A965;
              font-size: 60px;
              span{
                font-size: 18px;
                margin-left: 5px;
              }
          }
      }
      .hongbaodetailbottom{
        position: absolute;
        left:0px;
        right:0px;
        bottom:0px;
        top:310px;
        .itemcon{
          overflow-y: auto;
              position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 45px;
        }
        .item{
          height:50px;
          line-height: 50px;
          padding:5px 10px;
          color:#AFAFAF;
        }
        .lingqu{
          height:32px;
          line-height: 32px;
          padding:5px;
          border-bottom: 1px solid #F6F6F6;
        }
        .head{
          float: left;
          width: 40px;
          height:40px;
          border-radius: 5px;
          overflow: hidden;
          img{
            width: 40px;
            height:40px;
          }
        }
        .user{
          height: 50px;
          margin-left: 50px;
           border-bottom: 1px solid #F6F6F6;
           .member{
             height:24px;
             line-height: 24px;
             font-size: 18px;
             color: #000;
             span{
               float: right;
             }
           }
           .time{
             height:24px;
             line-height: 24px;
           }
        }
      }
       .hongbaohead{
          position: absolute;
          width: 80px;
          height: 80px;
          top:22%;
          left:50%;
          margin-left:-40px;
          border-radius: 40px;
          overflow: hidden;
        }
    }
    .content {
    position: absolute;
    top:0px;
    right:0px;
    left:0px;
    bottom: 0px;
    overflow: hidden;
    }
    .roomHeader{
    height: 25px;
    .back{
      float: left;
      width: 32px;
      height: 25px;
      line-height: 25px;
      background-color: #196260;
      text-align: center;
      img{
        width: 14px;
        height: 14px;
      }
    }
    .info{
      margin-left: 32px;
      margin-right: 90px;
      height: 25px;
      background-color: #333333;
      line-height: 25px;
      .icon{
        margin-left: 5px;
        width: 14px;
        height:14px;
        float: left;
        margin-top: 6px;
      }
      .text{
        height: 25px;
        line-height: 25px;
        margin-left: 20px;
        overflow: hidden;
        font-size: 14px;
        color: #fff;
      }
    }
    .money{
      float: right;
      width: 138px;
      padding: 0 6px;
      line-height: 25px;
      background-color: #196260;
      position: relative;
      top: -25px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
  }
  .pmd{
    overflow: hidden;
    .content{
      position: relative;
    }
    .con{
      position: relative;
      white-space : nowrap;
    }
  }
   .chat{
    position: absolute;
    top:0px;
    left:0px;
    right:0px;
    bottom:70px;
    background-color: #eeeeee;
    overflow-y: auto;
    .chatItem{
      overflow: hidden;
      margin-bottom: 10px;
      margin-right: 50px;
      .headimage{
        float: left;
        width: 32px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #fff;
        border-radius: 10%;
        margin: 3px 0 0 3px;
        border-radius: 5px;
        overflow: hidden;
      }
      .context{
        margin-left: 50px;
        .nameandtime{

          height: 20px;
          line-height: 20px;
          font-size: 15px;
          font-family: 微软雅黑;
          color: #0b7;
        }
        .text{
          background-color: #fff;
          float: left;
          margin-top: 5px;
          padding:10px;
          font-size: 16px;
           border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
          position: relative;
          &:before {
            content: '';
            position: absolute;
            left: -10px;
            top: 13px;
            width: 0;
            height: 0;
            border-style: solid dashed dashed;
            border-color: #fff transparent transparent;
            overflow: hidden;
            border-width: 10px;
          }
        }
        .text.hongbao{
           width: 220px;
            background-color: #F4B44E; 
            border-radius: 3px;
            width: 200px;
            height:84px;
            padding:0px 0px 0px 0px;
            &:before{
                 border-color: #F4B44E transparent transparent;
            }
        }
        .text.hongbaoy{
           width: 220px;
           background-color: rgb(255, 210, 135);
            border-radius: 3px;
            width: 200px;
            height:84px;
            padding:0px 0px 0px 0px;
            &:before{
                 border-color: rgb(255, 210, 135) transparent transparent;
            }
        }
        
      }
    }
    .chatItemright{
      margin-right: 0px;
      margin-left: 50px;
      .headimage{
        float: right;
        margin: 3px 3px 0px 0px;
      }
      .context{
        margin-left: 0px;
        margin-right: 50px;
        .nameandtime{
          text-align: right;
        }
        .text{
          float: right;
          &:before{
            display: none;
          }
          &:after {
            content: '';
            position: absolute;
            right: -10px;
            top: 13px;
            width: 0;
            height: 0;
            border-style: solid dashed dashed;
            border-color: #fff transparent transparent;
            overflow: hidden;
            border-width: 10px;
          }
        }
        .text.hongbao{
          width: 220px;
            background-color: #F4B44E;
            &:after{
                 border-color: #F4B44E transparent transparent;
            }
        }
      }
    }
    .hongbaotop{
        height: 70px;
        position: relative;
        .hongbaotit{
          position: absolute;
          top: 12px;
          left: 60px;
          color: #fff;
          width: 150px;
          font-size: 18px;
         
        }
        .hongbaostatus{
          position: absolute;
          top: 38px;
          left: 60px;
          color: #fff;
          width: 150px;
          font-size: 12px;
        }
    }
    .hongbaoouttom{
        height: 14px;
        background-color: #fff;
        font-size: 12px;
        line-height: 14px;
        text-indent: 10px;
        color: #ABABAB;
    }
  }
  .loadChatText{
    position: absolute;
    top: 25px;
    left: 0px;
    right: 0px;
    height: 14px;
    text-align: center;
    z-index: 2;
    font-size: 12px;
    background: rgba(0,0,0,0.4);
    color: #fff;
    line-height: 14px;
  }
  .openhongbao{
    position: absolute;
    // background: url("../../../front/images/hongbaobg.png")  no-repeat center;
    background-size: 100% 100%;
    .hongbaohead{
      position: absolute;
      width: 60px;
      height: 60px;
      top:8%;
      left:50%;
      margin-left:-30px;
      border-radius: 30px;
      overflow: hidden;
    }
    .hongbaoname{
      text-align: center;
      position: relative;
      line-height: 20px;
      font-size: 20px;
      color:#F3C198;
      top:25%;
    }
    .hongbaotip{
      position: relative;
      text-align: center;
      line-height: 14px;
      font-size: 14px;
      color:#E3A481;
      top:28%;
    }
    .hongbaotitle{
      position: relative;
      text-align: center;
      line-height: 24px;
      font-size: 24px;
      color:#F3C198;
      top:40%;
    }
    .hongbaokai{
    //   background: url("../../../front/images/hongbaokai.png")  no-repeat center;
      background-size: 100% 100%;
      width: 80px;
      height:80px;
      position: absolute;
      top:67%;
      left:50%;
      margin-left:-40px;
    }
  }
</style>
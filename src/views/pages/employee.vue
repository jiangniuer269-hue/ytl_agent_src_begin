<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="员工账号">
                    <el-input v-model="filters.account" placeholder="员工账号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchAgent">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增员工</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 
        <div class="lowList" v-if="lowList.length">
            <span><a @click="getLowerList()">{{plugin.getSessionItem("user","name")}}</a></span>
            <span :key="index" v-for="(item,index) in lowList"> > <a @click="getLowerList(item)">{{item.name}}</a></span>
        </div>
        -->   
        <!--列表-->
        <el-table @row-click="clicked" :row-class-name="plugin.tableRowClassName"  size="mini" border :data="agentList" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
             <el-table-column prop="account" label="账号" min-width="80">
            </el-table-column>
            <el-table-column prop="name" label="昵称" min-width="80">
            </el-table-column>
            <el-table-column prop="agent_type" label="账号类型" min-width="100">
                <template slot-scope="scope">
                    <input type="hidden" v-model="scope.row.agents_id">
                    <a v-if="scope.row.agent_type == 3 && scope.row.group_id" class="qiyong">主持账号</a>
                    <a v-if="scope.row.agent_type == 3 && !scope.row.group_id" class="jinyong">财务账号</a>
                </template>
            </el-table-column>
     
            <el-table-column prop="status" label="状态" min-width="50">
                <template slot-scope="scope">
                    <a v-if="scope.row.status == 0" class="qiyong">正常</a>
                    <a v-if="scope.row.status == 1" class="jinyong">禁用</a>
                </template>
            </el-table-column>
            <el-table-column prop="groupname" label="绑定桌子" min-width="120">
            </el-table-column>
            <el-table-column prop="mktime" label="开户时间" min-width="120" sortable>
            </el-table-column>     
            <el-table-column label="操作" min-width="330">
                <template slot-scope="scope"  v-if="scope.row.account !='合计' && !scope.row.countt && scope.row.agent_type != 4">
                        <a  v-if="scope.row.status == 1 "   size="mini" @click="handleForbidden(scope.row,0)" class="qiyong">启用</a>
                        <a v-if="scope.row.status == 0 "  size="mini" @click="handleForbidden(scope.row,1)" class="jinyong">禁用</a>
                    <el-divider  direction="vertical"></el-divider>
                        <a   size="mini"  @click="handleEdit(scope.row)" class="xiangqing">编辑</a>
                 <el-divider  direction="vertical"></el-divider>
                <!-- <a size="mini"  @click="handleDel(scope.row)" class="jinyong">删除</a>-->
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->

        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog :title="currentAgent.agents_name+'新增员工'" :visible.sync="addFormVisible" :close-on-click-modal="false" width="1200px">
            <el-form size="mini" :model="addForm" label-width="80px" labelWidth="100px" :rules="addFormRules" ref="addForm">
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                    <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="昵称" prop="name">
                                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label="登录账号" prop="account">
                                    <el-input v-model="addForm.account"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label="初始密码" prop="password1">
                                    <el-input v-model="addForm.password1"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label="确认密码" prop="password2">
                                    <el-input v-model="addForm.password2"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr class="el-table__row">
                            <td  colspan="4">
                                <el-form-item style="margin:0px 5px" label="账号类型"  prop="agent_type">
                                        <el-radio v-removeAriaHidden v-model="addForm.agent_type" label="2">财务账号</el-radio>
                                        <el-radio v-removeAriaHidden v-model="addForm.agent_type" label="3">主持账号</el-radio>
                                        <el-select  v-show="addForm.agent_type==3"  v-model="addForm.agent_group_id" placeholder="选择绑定桌子">
                                            <el-option v-for="(item, index) in rooms" :key="index" :label="item.groupname"
                                                :value="item.groupid"></el-option>
                                        </el-select>
                                </el-form-item>           
                            </td>  
                        </tr>                
                        <tr class="el-table__row">
                            <td colspan="4">
                                
                                   <el-form-item label="备注" >
                                        <el-input v-model="addForm.agents_desc" type='textarea' style=""></el-input>
                                    </el-form-item>
                                
                            </td>
                        </tr>

                    </table>
                </div>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑员工" :visible.sync="editFormVisible" :close-on-click-modal="false" width="1200px">
            <el-form size="mini" :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                    <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="昵称" prop="name">
                                    <el-input  v-model="editForm.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label="登录账号" prop="account">
                                    <el-input readonly v-model="editForm.account"></el-input>
                                </el-form-item>
                            </td>
                            <td colspan="2">
                                <el-form-item style="margin:0px 5px;" label="修改密码" prop="password1">
                                    <el-input v-model="editForm.password"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr class="el-table__row" v-show="editForm.group_id">
                            <td colspan="4">
                                <el-form-item style="margin:0px 20px;" label="绑定桌子">
                                    <el-select  v-model="editForm.agent_group_id" placeholder="选择绑定桌子">
                                        <el-option v-for="(item, index) in rooms" :key="index" :label="item.groupname"
                                            :value="item.groupid"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr class="el-table__row">
                            <td colspan="4">
                                
                                   <el-form-item label="备注" >
                                        <el-input v-model="editForm.agents_desc" type='textarea' style=""></el-input>
                                    </el-form-item>
                                
                            </td>
                        </tr>
                    </table>
                </div>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    import $ from 'jquery'
    import {  getEmpAgentLists, removeAgent, addEmpAgents,changeAgentStatus, editAgents,getRoomLists } from '../../api/api';
    import plugin from "../../common/js/plugin";

    export default {
        data() {
            return {
                rooms: [],
                auth_type:util.getSessionItem('user','auth_type'),
                agent_type:util.getSessionItem('user','agent_type'),
                auth_account:util.getSessionItem('user','account'),
                currentAgent:{
                    agents_id:"",
                    agents_name:"",
                    agents_account:"",
                },
                filters: {
                    account: '',
                    name: '',
                    level:"",
                    search_type: '2',
                },
                searchParam: {
                    account: '',
                    level:"",
                    name: '',
                    search_type: '2',
                },
                agentList: [],
                agentLists: [],
                tableHeight:"500",
                lowList:[],
                role:"0",
                total: 0,
                page: 1,
                listLoading: false,
                addFormVisible: false,//新增界面是否显示
                editFormVisible: false,//编辑界面是否显示
                //新增界面数据
                editForm: {
                    user: '',
                    name:"",
                    account:"",
                    password:"",
                    agent_type:"",
                    agents_desc:"",
                    agent_group_id:'',
                },
                changePwdForm: {
                    agents_id: '',
                    newpassword1: '',
                    newpassword2: '',
                },
                addForm: {
                    account	: '',
                    password1: "",
                    password2: "",
                    agents_desc:"",
                    agent_type:"",
                    name: '',
                    agent_group_id:'',
                },
                addFormRules: {
                    name: [
                        { required: true, message: '请输入员工名姓名', trigger: 'blur' }
                    ],
              
                    agent_type: [
                        { required: true, message: '请选择账号类型', trigger: 'blur' }
                    ],
         
                    password1: [
                        { required: true, message: '请输入初始密码', trigger: 'blur' }
                    ],
                    password2: [
                        { required: true, message: '请重复密码', trigger: 'blur' }
                    ],
                    account: [
                        { required: true, message: '请输入登录账号', trigger: 'blur' }
                    ],
                },
                editFormRules: {
                    // name: [
                    //     { required: true, message: '请输入员工姓名', trigger: 'blur' }
                    // ],
            
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
    
                },
                addLoading: false,
                editLoading: false,
                editItems:[],
                pagination:{
                    current:1,
                    size:50,
                    total:0,
                }

            }
        },
        computed:{

        },
        methods: {
            fetchRoomLists() {
                getRoomLists().then((res) => {
                    if (res.code == 200) {
                        this.rooms = res.data.rooms;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'info'
                        });
                    }
                }).catch((res) => {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                })
            },
             triggerUploadAdd(){
                $("#uploadfileAdd").click();
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
                      that.addForm.idcard = rs.data.head;
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
      triggerUploadEdit(){
                $("#uploadfileEdit").click();
            },
            uploadfileEdit(){
          var that = this;
          $.ajaxFileUpload({
              url: 'v1/user/UploadChatImage?filename=filename',
              type: 'get',
              secureuri: false, //一般设置为fals,
              fileElementId: 'uploadfileEdit', // 上传文件的id、name属性名
              dataType: "json", //返回值类型，一般设置为json、application/json
              success: function (rs) {
                  if (rs.code == 200) {
                      that.editForm.idcard = rs.data.head;
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
            levelChange(filter){
                if(isNaN(filter.level)){
                    filter.level = "";
                }
            },
            addMyAgent(row){
                this.currentAgent.agents_name = row.name;
                this.currentAgent.agents_account = row.account;
                this.currentAgent.agents_id = row.agents_id;
                this.handleAdd()
            },
     
          addSubmit(){
             console.log('this.addForm111',this.addForm);
                //校验输入
                if(this.addForm.password1 != this.addForm.password2){
                    this.$message({
                        message: '两次输入的密码不一致',
                        type: 'error'
                    });
                    return;
                }
                if(this.addForm.agent_type == 3 && !this.addForm.agent_group_id){
                     this.$message({
                        message: '主持账号需要绑定桌子',
                        type: 'error'
                    });
                    return;
                }

                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        var agents_id = "";
                        var agents_account = "";
                        var agents_name = "";
                        if(this.currentAgent.agents_id){
                            agents_id = this.currentAgent.agents_id;
                            agents_account = this.currentAgent.agents_account;
                            agents_name = this.currentAgent.agents_name;
                        }else{
                            agents_id = util.getSessionItem('user','agents_id');
                            agents_account = util.getSessionItem('user','account');
                            agents_name = util.getSessionItem('user','name');
                        }

                        this.addForm.boss_name = agents_name;
                        this.addForm.boss_account = agents_account;
                        this.addForm.boss_id= agents_id;
                        this.addLoading = true;
                        console.log('this.addForm',this.addForm);
                        addEmpAgents(this.addForm).then(data =>{
                            this.addLoading = false;
                            
                            if (data.code == 200) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.addFormVisible = false;
                                this.getAgents();
                            }else{
                                this.$message({
                                    message: data.msg,
                                    type: 'info'
                                });
                            }
                        }).catch((res)=>{
                            this.addLoading = false;
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        })
                    }
                })
            },
            editSubmit(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        var par = {
                            agents_id:this.editForm.user.agents_id,
                            name:this.editForm.name,
                            agent_type:this.editForm.agent_type,
                            agents_desc:this.editForm.agents_desc,
                            password:this.editForm.password,
                            boss_account:util.getSessionItem('user','account'),
                            agent_group_id:this.editForm.agent_group_id
                        }
                        this.editLoading = true;
                        editAgents(par).then(data =>{
                            this.editLoading = false;
                            if (data.code == 200) {
                                this.editItems = [];
                                this.editItems.push(this.editForm.user.agents_id);
                                this.editFormVisible = false;
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.getAgents();
                            }else{
                                this.$message({
                                    message: data.msg,
                                    type: 'info'
                                });
                            }
                        }).catch((res)=>{
                            this.editLoading = false;
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        })
                    }
                })
            },
            //显示编辑界面
            handleEdit: function (row) {
                if(this.$refs.xhTableEdit){
                    this.$refs.xhTableEdit.clearSelection()
                }

                this.editForm = {
                    user: row,
                    name:row.name,
                    account:row.account,
                    password:"",
                    agent_type:row.agent_type.toString(),
                    agents_desc:row.agents_desc,
                    group_id:row.group_id
                }
                this.fetchRoomLists();
                this.editFormVisible = true;
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    account	: '',
                    password1: "",
                    password2: "",
                    name: '',
                }
                this.fetchRoomLists();
                var agents_id = "";
                if(this.currentAgent.agents_id){
                    agents_id = this.currentAgent.agents_id;
                }else{
                    agents_id = util.getSessionItem('user','agents_id');
                }
            },
            //显示修改密码界面
            handlePassword: function (row) {
                this.changePwdVisible = true;
                this.changePwdForm = {
                    agents_id:row.agents_id,
                    newpassword1: '',
                    newpassword2: '',
                };
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            searchAgent(){
                this.searchParam = this.filters;
                this.getAgents()
            },
            handleSizeChange(val){
                this.pagination.size = val;
                this.getAgentList();
            },
            handleCurrentChange(val){
                this.pagination.current = val;
                this.getAgentList();
            },
            getAgentList(){
                this.agentList = []
                for(var i = (this.pagination.current-1) * this.pagination.size; i < this.pagination.size * (this.pagination.current);i++ ){
                    if(this.agentLists[i]){
                        this.agentList.push(this.agentLists[i])
                    }
                }
               // if(this.agentList.length){
                    // this.agentList.push(this.plugin.columnFilterFunc(this.agentList,"account"))
                //}
                
            },
            getLowerList(row){
                if(!row){
                    this.lowList = [];
                    this.getAgents()
                }else{
                    var lowIndex =this.lowList.findIndex(item => item.agents_id == row.agents_id)
                    if(lowIndex == -1){
                        this.lowList.push({
                            agents_id:row.agents_id,
                            name:row.name,
                        })
                    }else{
                        this.lowList.splice(lowIndex+1,this.lowList.length-1)
                    }
                    this.getAgents(row.agents_id)
                }

            },
            //获取代理列表
            getAgents(agents_id) {
                var boss_id  = "";
                if(agents_id){
                    boss_id = agents_id
                }else if(this.lowList.length){
                    boss_id = this.lowList[this.lowList.length-1].agents_id
                }else{
                    boss_id = util.getSessionItem("user","agents_id")
                }
                let para = {
                    boss_id: boss_id,
                    account:this.searchParam.account,
                    level:this.searchParam.level,
                    name:this.searchParam.name,
                    search_type:this.searchParam.search_type,
                };
                this.listLoading = true;
                getEmpAgentLists(para).then((res) => {
                    if(res.code == 500){
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                        return ;
                    }
                    this.agentLists = [];
                    for(var i = 0 ; i < res.data.length;i++){
                        this.agentLists.push(res.data[i])
                    }
                    this.pagination.current = 1;
                    this.pagination.total = this.agentLists.length;
                    this.getAgentList();
                    this.edited();
                    this.listLoading = false;
                });
            },
            //删除
            handleDel: function (row) {
                this.$confirm('确认删除该员工吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { agents_id: row.agents_id };
                    removeAgent(para).then((res) => {
                        this.listLoading = false;
                        if(res.code == 200){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            //发送ws
                            this.$store.getters.imClient.send(JSON.stringify({
                                "cmd": 4501,
                                'update_aid': row.agents_id
                            }))

                        this.getAgents();
                        }else{
                            this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                        }
                        
                    }).catch((res) => {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    });
                })
            },
            //停用
            handleForbidden: function (row,status) {
                var stat = "停用";
                if(status == 0){
                    stat = "启用";
                }
                this.$confirm(`确认${stat}该员工吗?`, '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { agents_id: row.agents_id,status:status };
                    changeAgentStatus(para).then((res) => {
                        this.listLoading = false;
                        if(res.code == 200){
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getAgents();
                        }else{
                             this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                        }
                        
                    }).catch((res) => {
                        this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                    this.listLoading = false;
                });
                }).catch(() => {
                    this.listLoading = false;
                });
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
           },
            clicked(){
               $(".isEdited").removeClass("isEdited");
           },
            edited(){
                this.$nextTick(()=>{
                    $(".current-row").removeClass("current-row");
                    for(var i =0;i < this.editItems.length;i++){
                        console.log(this.editItems[i]);
                        $("input[value="+this.editItems[i]+"]").parents("tr").addClass("isEdited")
                    }
                })
            }
        },
        watch:{
            "editItems":function() {
                this.edited()
            },
            "addFormVisible":function(val) {
                if(!val){
                    setTimeout(()=>{
                        this.currentAgent = {};
                        this.currentAgent.agents_name = "";
                    },500)
                }
            },
        },
        mounted() {
            this.getAgents();
            this.autoTableHeight();
            $(window).resize(()=>{
                this.autoTableHeight();
            })
        }
    }

</script>
<style lang="scss" scoped>
    .page-container {
        font-size: 20px;
        text-align: center;
        color: rgb(192, 204, 218);
    }
</style>
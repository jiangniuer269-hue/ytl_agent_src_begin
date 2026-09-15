<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="代理账号">
                    <el-input v-model="filters.account" placeholder="代理账号"></el-input>
                </el-form-item>
                <el-form-item label="代理名称">
                    <el-input v-model="filters.name" placeholder="代理名称"></el-input>
                </el-form-item>
                <el-form-item label="查询类型">
                    <el-select v-model="filters.search_type" placeholder="请选择">
                        <el-option label="模糊查询" value="1"></el-option>
                        <el-option label="精准查询" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchAgent">查询</el-button>
                </el-form-item>

                <el-form-item  v-if="auth_type == 1">
                    <el-button type="primary" @click="handleAdd">新增代理</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <div class="lowList" v-if="lowList.length">
            <span><a @click="getLowerList()">
                <span v-if="auth_type != 1">{{plugin.getSessionItem("user","name")}}</span>
                <span v-if="auth_type == 1">总代理</span>
                </a></span>
            <span :key="index" v-for="(item,index) in lowList"> > <a @click="getLowerList(item)">{{item.name}}</a></span>
        </div>
        <!--列表-->

        <el-table v-show="tabag == 1" @row-click="clicked" :row-class-name="plugin.tableRowClassName"  size="mini" border :data="agentList" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="account" label="账号" min-width="80">
            </el-table-column>
            <el-table-column prop="name" label="名称" min-width="130">
                <template slot-scope="scope">
                    <input type="hidden" v-model="scope.row.agents_id">
                  <a >{{scope.row.name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="boss_account" label="上线账号" min-width="110" sortable>
            </el-table-column>
            <el-table-column prop="boss_name" label="上线名称" min-width="120" sortable>
            </el-table-column>
            <el-table-column prop="relation_link" label="代理关系" min-width="330">
                <template slot-scope="scope">
                    <relation
                     :rela="scope.row.relation_link"
                     @getsearch="searchRela"
                    ></relation>
                </template>
            </el-table-column>
            <el-table-column prop="agents_desc" label="备注" min-width="80"  show-overflow-tooltip >
            </el-table-column>
             <el-table-column prop="status" label="状态" min-width="80">
               
                <template slot-scope="scope">
                    <div class="cell">
                        <a v-if="scope.row.status == 0" class="qiyong">启用</a>
                        <a v-if="scope.row.status == 1" class="jinyong">禁用</a>
                    </div>
                </template>
     
            </el-table-column>
            <el-table-column prop="mktime" label="开户时间" min-width="120" sortable>
            </el-table-column>
            <el-table-column label="操作" min-width="330"  v-if="auth_type == 1">
                <template slot-scope="scope"  v-if="scope.row.account !='合计' && !scope.row.countt">
                    <template v-if="scope.row.account != auth_account">
                      
                        <a  v-if="scope.row.status == 1 &&(auth_type == 1 || scope.row.boss_account == auth_account)" class="qiyong"  size="mini" @click="handleForbidden(scope.row,0)">启用</a>
                        <a v-if="scope.row.status == 0 &&(auth_type == 1 || scope.row.boss_account == auth_account)" class="jinyong" size="mini" @click="handleForbidden(scope.row,1)">禁用</a>
                    </template>
                    
                        <a v-if="(auth_type == 1 || scope.row.boss_account == auth_account)"  size="mini" class="bianji" @click="handleEdit(scope.row)">编辑</a>
                        <!-- <el-button size="mini" @click="handleDel(scope.row)">删除</el-button> -->

                        
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->


        <el-col v-show="tabag == 1" :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>       
        <!--新增代理-->
        <el-dialog :title="currentAgent.agents_name+'新增代理'" :visible.sync="addFormVisible" :close-on-click-modal="false" width="1200px">
            <el-form size="mini" :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                    <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="代理名称" prop="name">
                                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label="登录账号" prop="account">
                                    <el-input v-model="addForm.account"></el-input>
                                </el-form-item>
                            </td>
                             <td>
                                <el-form-item style="margin:0px 5px;" label="上级账号" prop="boss_account">
                                    <el-input v-model="addForm.boss_account"></el-input>
                                </el-form-item>
                            </td>
                        </tr>  
                        <tr class="el-table__row">                      
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
                            <td>

                            </td>
                        </tr>
                        <tr class="el-table__row">
                            <td colspan="4">
                                <el-form-item style="margin:0px 5px" label="备注" prop="agents_desc">
                                    <el-input type="textarea" v-model="addForm.agents_desc"></el-input>
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
        <el-dialog title="编辑代理" :visible.sync="editFormVisible" :close-on-click-modal="false" width="1200px">
            <el-form size="mini" :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                    <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="代理名称" prop="name">
                                    <el-input  v-model="editForm.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label="登录账号" prop="account">
                                    <el-input :disabled="true" readonly v-model="editForm.account"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                         <tr class="el-table__row">
                             <td>
                                <el-form-item style="margin:0px 5px;" label="上级账号" prop="boss_account">
                                    <el-input  v-model="editForm.boss_account"></el-input>
                                </el-form-item>
                            </td>
                            <td colspan="2">
                                <el-form-item style="margin:0px 5px;" label="修改密码" prop="password1">
                                    <el-input v-model="editForm.password"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr class="el-table__row">
                            <td colspan="4">
                                <el-form-item style="margin:0px 5px" label="备注" prop="agents_desc">
                                    <el-input type="textarea" v-model="editForm.agents_desc"></el-input>
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

        <!--上下分弹框-->
        <el-dialog  :title="fenFilters.user.name+'-'+ (fenFilters.type == 1 ? '上分':'下分')" :visible.sync="fenVisible" :close-on-click-modal="false" width="1000px">

            <el-form size="small" :inline="true" class="demo-form-inline">
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                    <table :row-class-name="plugin.tableRowClassName" max-height="500"  cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="代理名称">
                                    <el-input readonly v-model="fenFilters.yufen.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                 <el-form-item style="margin:0px 5px;" label="代理账号">
                                    <el-input readonly v-model="fenFilters.yufen.account" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                           
                        </tr>
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="当前额度">
                                    <el-input readonly v-model="fenFilters.yufen.agent_score" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                             <td>
                                <el-form-item style="margin:0px 5px;" label="上级额度">
                                    <el-input readonly v-model="fenFilters.yufen.boss_score" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                       
                        <tr class="el-table__row">
                           <td colspan="2">
                               <el-form-item style="margin:0px 5px;" :label="fenFilters.type == 1 ? '增加额度':'减少额度'">
                                   <el-input   v-model="money2Fen"></el-input>
                               </el-form-item>
                           </td>
                        </tr>
                        
                    </table>
                </div>
          </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmitFen(fenFilters.type)">提交</el-button>
                <el-button @click.native="fenVisible = false">关闭</el-button>
            </div>
        </el-dialog>

        <!--上下分明细弹框-->
        <el-dialog  :title="udfenFilters.user.name+'-余分明细'" :visible.sync="udfenVisible" :close-on-click-modal="false" width="1000px">
            <!--table-->
            <!--列表-->
            <el-table :row-class-name="plugin.tableRowClassName"  :max-height="500" v-loading="udfenLoading" size="mini" border :data="udfen" highlight-current-row class="tableStyle" style="width: 100%;">
                <!-- <el-table-column prop="agents_id" label="代理ID" width="80">
                </el-table-column> -->
                <el-table-column prop="agents_account" label="代理账号" min-width="60">
                </el-table-column>
                <el-table-column prop="agents_name" label="代理名称" min-width="130">
                </el-table-column>
                <el-table-column prop="score" label="变动前" min-width="70" sortable>
                </el-table-column>
                <el-table-column prop="score_change" label="金额" min-width="60" sortable>
                </el-table-column>
                <el-table-column prop="score_after" label="变动后" min-width="60" sortable>
                </el-table-column>
                
                <el-table-column prop="note" label="备注" min-width="140" >
                </el-table-column>
                <el-table-column prop="time" label="操作时间" min-width="120" sortable>
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination @size-change="handleSizeChangeUdfen" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeUdfen" :current-page="udfenPagination.current" :page-sizes="[50, 100,300]" :page-size="udfenPagination.size" :total="udfenPagination.total" style="float:right;">
                </el-pagination>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="udfenVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    import $ from 'jquery'
    import {getChat,dojiesuanagentprofit, getAgentLists, removeAgent, addAgents,changeAgentStatus, upDowFenAgent,getUdfenAgentPage, editAgents,getAgentUpdowinfo } from '../../api/api';
    import plugin from "../../common/js/plugin";
    import Relation from "@/components/relation";
    import MemberListscomp from "./memberListscomp";

    export default {
        data() {
            return {
                // activeName:"",
                // chatVisible:false,
                currentUser:{
                    user:{}
                },
                currentUserProfit:0,
                liushuiLoading:false,
                 handleFenLock:false,
                tabag:1,
                current_agents_id:"",
                user:[],
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
                    dep: '0',
                    active: '0',
                },
                searchParam: {
                    account: '',
                    level:"",
                    name: '',
                    search_type: '2',
                    dep: '0',
                    active: '0',
                },
                udfenPagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                udfenFilters: {
                    user: '',
                },
                fenFilters: {
                    user: '',
                    type: '',
                    value: '',
                    yufen:'',
                    password:'',
                },
                agentList: [],
                agentLists: [],
                tableHeight:"500",
                lowList:[],
                udfen: [],
                role:"0",
                total: 0,
                page: 1,
                listLoading: false,
                udfenLoading: false,

                addFormVisible: false,//编辑界面是否显示
                editFormVisible: false,//编辑界面是否显示
                udfenVisible: false,
                fenVisible: false,
                //新增界面数据
                editForm: {
                    boss_account:'',
                    user: '',
                    name:"",
                    account:"",
                    password:"",
                    xm_rate:"",
                    xm_type:"",
                    agents_desc:"",
                    share_rate:"",
                    xh_config: [],
                    xh:[],
                    phone:"",
                    wxchat:"",
                    qq:"",
                    bankcard:"",
                    service_code:"",
                    agent_link:"",
                    dep:"",
                    active:"",
                },
                changePwdForm: {
                    agents_id: '',
                    newpassword1: '',
                    newpassword2: '',
                },
                addForm: {
                    boss_account:'',
                    account	: '',
                    password1: "",
                    password2: "",
                    name: '',
                    xm_type: "1",
                    xm_rate: '',
                    share_rate: '0',
                    xh_config: [],
                    xh:[],
                    phone:"",
                    wxchat:"",
                    qq:"",
                    bankcard:"",
                    service_code:"",
                },
                addFormRules: {
                    name: [
                        { required: true, message: '请输入代理名称', trigger: 'blur' }
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
                    boss_account: [
                        { required: true, message: '请输入代理上级账号', trigger: 'blur' }
                    ],
                    agent_score: [
                        { required: true, message: '请输入代理余分', trigger: 'blur' }
                    ],
                    xm_type: [
                        { required: true, message: '请输入洗码类型', trigger: 'blur' }
                    ],
                    xm_rate: [
                        { required: true, message: '请输入积分比例', trigger: 'blur' }
                    ],
                    sb_xm_rate: [
                        { required: true, message: '请输入四宝洗码率', trigger: 'blur' }
                    ],
                    share_rate: [
                        { required: true, message: '请输入占成率', trigger: 'blur' }
                    ],
                    sb_share_rate: [
                        { required: true, message: '请输入四宝占成率', trigger: 'blur' }
                    ],
                    xh_config: [
                        { required: true, message: '请选择限红配置', trigger: 'blur' }
                    ],
                },
                editFormRules: {
                   boss_account: [
                        { required: true, message: '请输入代理上级账号', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入代理名称', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    xm_rate: [
                        { required: true, message: '请输入洗码率', trigger: 'blur' }
                    ],
                    sb_xm_rate: [
                        { required: true, message: '请输入四宝洗码率', trigger: 'blur' }
                    ],
                    share_rate: [
                        { required: true, message: '请输入占成率', trigger: 'blur' }
                    ],
                    sb_share_rate: [
                        { required: true, message: '请输入四宝占成率', trigger: 'blur' }
                    ],
                    xh_config: [
                        { required: true, message: '请选择限红配置', trigger: 'blur' }
                    ],
                },
                addLoading: false,
                editLoading: false,
                editItems:[],
                pagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                userpagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                money2Fen:0,
                // imInfo:{},
                imInfo:{},
				activeName:"",
            }
        },
        computed:{

            // money2Fen:function () {
            //     if(Number(this.fenFilters.yufen.share_rate) == 100){
            //         return this.fenFilters.value
            //     }
            //     if(this.fenFilters.type == 1){
            //         return (this.fenFilters.value / (100-this.fenFilters.yufen.share_rate) * 100).toFixed(2)
            //     }else{
            //         return (this.fenFilters.value * (100-this.fenFilters.yufen.share_rate)/100).toFixed(2)
            //     }
            // },
        },
        methods: {
            getIframeSrc(playid){
                return this.imInfo[playid].imdomain+"?"+Object.keys(this.imInfo[playid]).map((key)=> {
                            // body...
                            return encodeURIComponent(key) + "=" + encodeURIComponent(this.imInfo[playid][key]);
                        }).join("&")+'/#/agm_messages/messageChat/'+this.imInfo[playid].channelId
            },
            readerChat(row){
                if(this.imInfo[row.playid]){ 
                    this.activeName = row.playid;
                    this.$root.Event.$emit("showChat",this.imInfo,this.activeName);
                    return;
                }
                let para ={
                    touserid:row.playid
                }
                getChat(para).then(res=>{
                    this.imInfo[row.playid] = res.data;
                    this.imInfo[row.playid].imdomain = res.imdomain;
                    this.imInfo[row.playid].playid = res.playid;
                    this.imInfo[row.playid].toid = res.toid;
                    this.imInfo[row.playid].row = row;
                    this.imInfo[row.playid].src = this.getIframeSrc(row.playid); 
                    this.activeName = row.playid;
                    this.$root.Event.$emit("showChat",this.imInfo,this.activeName);
                }).catch((res)=>{
                  //  console.log(res)
                    this.$message({
                        message: "聊天室初始化异常",
                        type: 'error',
                        duration: 3000,    
                    });
                })
            },
            // handleClickTab(tab, event){

            // },
            changeAgentDep(){
                if(this.editForm.dep == 1){
                    this.editForm.dep = 2;
                }else{
                    this.editForm.dep = 1;
                    this.editForm.active = 1;
                }
            },
             changeAgentActive(){
                if(this.editForm.active == 1){
                    if(this.editForm.dep == 1){
                        return;
                    }
                    this.editForm.active = 2;
                }else{
                    this.editForm.active = 1;
                }
            },
            changeTab(type){
                this.tabag = type;
            },
            searchRela(account){
                this.filters.account = account;
                this.searchAgent();
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
            xhTableEditChange(val) {
                var ids = [];
                for(var i = 0; i < val.length;i++){
                    ids.push(val[i].id);
                }
                this.editForm.xh_config = ids;
            },
            xhTableAddChange(val) {
                var ids = [];
                for(var i = 0; i < val.length;i++){
                    ids.push(val[i].id);
                }
                this.addForm.xh_config = ids;
            },
            addXmTypeChange(){
                this.addForm.xm_rate = "";
                // this.addForm.sb_xm_rate = "";
            },
            editXmTypeChange(){
                this.editForm.xm_rate = "";
                // this.editForm.sb_xm_rate = "";
            },
            handleSizeChangeUdfen(val){
                this.udfenPagination.size = val;
                this.getUdfen()
            },
            handleCurrentChangeUdfen(val){
                this.udfenPagination.current = val;
                this.getUdfen()
            },
            handleudfen(row){
                this.udfenFilters = {
                    user:row,
                }
                this.udfenVisible = true;
                this.getUdfen()
            },
            //获取上下分明细
            getUdfen(){
                let para = {
                    pageNumber:this.udfenPagination.current,
                    pageSize:this.udfenPagination.size,
                    agents_id:this.udfenFilters.user.agents_id,
                };
                this.udfenLoading = true;
                getUdfenAgentPage(para).then((res) => {
                    if(res.code == 200){
                        this.udfenPagination.total = res.total;
                        this.udfen = res.data;
                        if(this.udfen.length){
                            this.udfen.push(this.plugin.columnFilterFunc(this.udfen,"agents_account"))
                        }
                        this.udfenLoading = false;
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'info'
                        });
                    }
                   
                }).catch((res)=>{
                    this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 3000,    
                        });
                })
            },
            onSubmitFen(){
                if(this.handleFenLock){
                    this.$message({
                            message: "请勿重复操作",
                            type: 'error',
                            duration: 3000,    
                        });
                        return;
                }
                if(this.money2Fen == ''){
                    this.$message({
                            message: "请填写额度",
                            type: 'error',
                            duration: 3000,    
                        });
                        return;
                }
                var reg = /^\d+(\.\d+)?$/
                if(!reg.test(this.money2Fen)){
                    this.$message({
                            message: "请输入正确的金额",
                            type: 'error',
                            duration: 3000,    
                        });
                        return;
                }
               
                var typename = this.fenFilters.type == 1 ? '上分': '下分';

                 this.$confirm('确认'+typename+'吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    let para = {
                    agents_id:this.fenFilters.user.agents_id,
                    fen:this.money2Fen,
                    doType:this.fenFilters.type,

                    do_agent_account:util.getSessionItem('user','account')
                    };
                    this.handleFenLock = true;//加锁
                    upDowFenAgent(para).then((res) => {
                         this.money2Fen = 0;
                        if(res.code == 200){
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            util.setSessionItem('user',['agent_score',res.data.agent_score])
                            this.editItems = [];
                            this.editItems.push(this.fenFilters.user.agents_id);
                            this.getAgents();
                            this.fenVisible = false;
                            setTimeout(()=>{
                                this.$root.Event.$emit("onAgentScoreChange")
                            },1000)
                            this.handleFenLock = false;//解锁
                        }else{
                            this.handleFenLock = false;//解锁
                            this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                        }
                    }).catch((res)=>{
                        this.handleFenLock = false;//解锁
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 3000,    
                        });
                     })
                })
                
            },
            handleFen(row,type){
                this.fenFilters = {
                    user:row,
                    type:type,
                    value:"",
                    yufen:"",
                    password:"",
                }
                this.fenVisible = true;
                getAgentUpdowinfo({
                    agents_id:row.agents_id
                }).then(res =>{
                    if(res.code == 200){
                        this.fenFilters.yufen = res.data.agents_score
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'info'
                        });
                    }
                }).catch((res)=>{
                    this.addLoading = false;
                    this.$message({
                        message: res.msg,
                        type: 'error',
                        duration: 3000   
                    });
                })
            },
            addSubmit(){
                //校验输入
                if(this.addForm.password1 != this.addForm.password2){
                    this.$message({
                        message: '两次输入的密码不一致',
                        type: 'error',
                        duration: 3000
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

                        this.addLoading = true;
                        addAgents(this.addForm).then(data =>{
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
                                type: 'error',
                                duration: 3000
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
                            xm_rate:this.editForm.xm_rate,
                            agents_desc:this.editForm.agents_desc,
                            xm_type:this.editForm.xm_type,
                            xh_config:this.editForm.xh_config,
                            share_rate:this.editForm.share_rate,
                            password:this.editForm.password,
                            boss_account:this.editForm.boss_account,
                            phone:this.editForm.phone,
                            wxchat:this.editForm.wxchat,
                            qq:this.editForm.qq,
                            bankcard:this.editForm.bankcard,
                            service_code:this.editForm.service_code,
                            dep:this.editForm.dep,
                            active:this.editForm.active,
                        }
                        this.editLoading = true;
                        editAgents(par).then(data =>{
                            // this.editLoading = false;
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
                                type: 'error',
                                duration: 3000
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
                    boss_account : row.boss_account,
                    user: row,
                    name:row.name,
                    account:row.account,
                    password:"",
                    xm_rate:row.xm_rate,
                    agents_desc:row.agents_desc,
                    xm_type:row.xm_type,
                    share_rate:row.share_rate,
                    xh_config: row.xh_config,
                    xh:[],
                    phone:row.phone,
                    wxchat:row.wxchat,
                    qq:row.qq,
                    bankcard:row.bankcard,
                    service_code:row.service_code,
                    agent_link:row.agent_link,
                    dep:row.dep,
                    active:row.active,
                }
                this.editFormVisible = true;
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    boss_account:util.getSessionItem('user','account'),
                    account	: '',
                    password1: "",
                    password2: "",
                    name: '',
                    xm_type: "1",
                    xm_rate: '',
                    share_rate: '0',
                    xh_config: [],
                    xh:[],
                    phone:"",
                    wxchat:"",
                    qq:"",
                    bankcard:"",
                    service_code:"",
                }
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
                this.getAgents();
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
                //添加合计
              /*  if(this.agentList.length){
                    this.agentList.push(this.plugin.columnFilterFunc(this.agentList,"account"))
                }*/
                
            },
            getLowerList(row){
                if(!row){
                    this.lowList = [];
                    this.getAgents();
                    this.userpagination = {
                        current:1,
                        size:50,
                        total:0,
                        }
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
                    this.userpagination = {
                        current:1,
                        size:50,
                        total:0,
                        }
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
                    dep:this.searchParam.dep,
                    active:this.searchParam.active,
                };
                this.listLoading = true;
                getAgentLists(para).then((res) => {
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
                this.$confirm('确认删除该代理吗?', '提示', {
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
                            type: 'error',
                            duration: 3000
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
                this.$confirm(`确认${stat}该代理吗?`, '提示', {
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
                                type: 'error',
                                duration: 3000
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
                       // console.log(this.editItems[i]);
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
        },
        components: {
            Relation,
            MemberListscomp
        }
    }

</script>
<style lang="scss" scoped>
    .page-container {
        font-size: 20px;
        text-align: center;
        color: rgb(192, 204, 218);
    }
    .tabag{
        line-height: 40px;
       // border-bottom:2px solid #ebeef5;
        clear: both;
       // margin-bottom: 10px;
        font-size: 16px;
        color:#fff;
        span{
           // margin:0 5px;
            cursor: pointer;
            padding:11px 0px;
        }
        .current{
            color:#009688;
            border-bottom:2px solid #009688;
        }
    }

</style>
<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="代理账号">
                    <el-input v-model="filters.agents_account" placeholder="代理账号"></el-input>
                </el-form-item>
                 <el-form-item label="层级">
                    <el-input style="width:125px;" v-model="filters.level" @change="levelChange(filters)" placeholder="请输入层级数字"></el-input>
                </el-form-item>

                 <el-form-item label="代理身份" v-if="auth_type == 1">
                    <el-select v-model="filters.dep" placeholder="请选择">
                         <el-option label="全部" value="0"></el-option>
                        <el-option label="普通代理" value="1"></el-option>
                        <el-option label="业务部门" value="2"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="在职状态" v-if="auth_type == 1">
                    <el-select v-model="filters.active" placeholder="请选择">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="离职" value="1"></el-option>
                        <el-option label="在职" value="2"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item style="width: 260px" label="开始时间">
                    <el-date-picker
                            v-model="filters.begin_time"
                            type="datetime"
                            placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 260px" label="结束时间">
                    <el-date-picker
                            v-model="filters.end_time"
                            type="datetime"
                            placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWin">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(5)">今天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(6)">昨天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(1)">本周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(2)">上周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(3)">本月</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(4)">上月</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="exportExcel()">导出报表</el-button>
                    <iframe style="display: none;" name="baseExport"></iframe>
                        <form id="baseForm" name="baseForm" method="post" action="" target="baseExport" style="display: none;">
                            <input type="hidden" :value="searchParam.agents_account" name="agents_account">
                            <input type="hidden" :value="searchParam.level" name="level">
                            <input type="hidden" :value="searchParam.begin_time" name="begin_time">
                            <input type="hidden" :value="searchParam.end_time" name="end_time">
                           
                        </form>
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
        <div class="tabag">
            <span class="ag" :class="{'current':tabag == 1}" @click="changeTab(1)">直属代理</span>
            <span class="user" :class="{'current':tabag == 2}" @click="changeTab(2)">直属会员</span>
        </div>
        <!--列表-->
        <el-table v-show="tabag == 1" :row-class-name="plugin.tableRowClassName"   size="mini" border :data="win" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            
            <el-table-column prop="agents_account" label="代理账号" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="agents_name" label="代理名称" min-width="80" sortable>
                <template slot-scope="scope">
                    <input type="hidden" v-model="scope.row.agents_id">
                    <a style="text-decoration: underline;cursor: pointer;" @click="getLowerList(scope.row)">{{scope.row.agents_name}}</a>
                </template>
            </el-table-column>
             <el-table-column prop="lower_total" label="有效代理数" min-width="90">
                <template slot="header">
                   <span>有效代理数</span>
                  
                   <span class="showlowertip" style="background-color: #fff; 
    color: #000;position:relative;
    border-radius: 8px;
    padding: 0 4px;
    margin-left: 5px;cursor:pointer;">?  <span class="showlowertipspan hide">即产生数据的下级代理数，包含所有层级。</span></span>
                </template>
                <template slot-scope="scope">
                     <span>{{scope.row.lower_total}}</span>
                </template>
            </el-table-column>

             <el-table-column prop="boss_account" label="上级账号" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="boss_name" label="上级名称" min-width="100" sortable>
            </el-table-column> 
           
            <el-table-column prop="relation_link" label="代理关系" min-width="330">
                <template slot-scope="scope">
                <relation
                     :rela="scope.row.relation_link"
                     @getsearch="searchRela"
                    ></relation>
                </template>
            </el-table-column>
            <el-table-column prop="level" label="层级" min-width="60">
            </el-table-column>
            <el-table-column prop="xm" label="会员累积产生积分" min-width="130">
            </el-table-column>
            <el-table-column prop="xm_money" label="会员积分可兑换额度" min-width="130">
            </el-table-column>
            <el-table-column prop="win" label="会员输赢数" min-width="90" sortable>
                <template slot-scope="scope">
                    <a v-if="scope.row.win >=0" style="color: #FF9900">{{scope.row.win}}</a>
                    <a v-if="scope.row.win <0" style="color: red">{{scope.row.win}}</a>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="extra_share_score" label="抽水额度" min-width="80" sortable>
            </el-table-column> -->
            <el-table-column prop="profit" label="会员收益" min-width="80" sortable>
                <template slot-scope="scope">
                    <a v-if="scope.row.profit >=0" style="color: #FF9900">{{scope.row.profit}}</a>
                    <a v-if="scope.row.profit <0" style="color: red">{{scope.row.profit}}</a>
                </template>
            </el-table-column>
             <el-table-column prop="mktime" label="时间" min-width="240">
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col v-show="tabag == 1" :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>

        <member-wincomp v-show="tabag == 2" @getusers="getuserag" :agents_id="current_agents_id" :win='user' :pagination="userpagination"></member-wincomp>


    </section>
</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import moment from 'moment'
    import $ from 'jquery'
    import { getDLWinsListPage,getDLWinsUserListPage } from '../../api/api';
 import Relation from "@/components/relation";
 import MemberWincomp from "./memberWincomp";
    export default {
        components: {
            Relation,
            MemberWincomp
        },
        data() {
            return {
                tabag:1,
                showlowertip:false,
                current_agents_id:"",
                filters: {
                    agents_account:"",
                    level:'',
                    begin_time: null,
                    end_time: null,
                    dep: '0',
                    active: '0',
                },
                searchParam:{
                    agents_account:"",
                    level:'',
                    begin_time: null,
                    end_time: null,
                    dep: '0',
                    active: '0',
                },
                lowList:[],
                tableHeight: "500",
                wins: [],
                win: [],
                user:[],
                listLoading: false,
                pagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                auth_type:util.getSessionItem('user','auth_type'),
                userpagination:{
                    current:1,
                    size:50,
                    total:0,
                },
            }
        },
        methods: {
            changeTab(type){
                this.tabag = type;
            },
            exportExcel(){
                this.$nextTick(()=>{
                    $("#baseForm").attr("action","v1/agents/agentsLoseWinExport").submit();
                })
            },
            searchRela(account){
                this.filters.agents_account = account;
                this.searchWin();
            },
            levelChange(filter){
                if(isNaN(filter.level)){
                    filter.level = "";
                }
            },
            searchWinQuickly(type){
                if(type == 1){
                    this.filters.begin_time = moment().startOf('isoWeek').add(0,"hours")
                    this.filters.end_time = moment().endOf('isoWeek').add(0,"hours")
                }
                if(type == 2){
                    this.filters.begin_time = moment().isoWeek(moment().isoWeek() - 1).startOf('isoWeek').add(0,"hours")
                    this.filters.end_time = moment().isoWeek(moment().isoWeek() - 1).endOf('isoWeek').add(0,"hours")
                }
                if(type == 3){
                    this.filters.begin_time = moment().startOf('month').add(0,"hours")
                    this.filters.end_time = moment().endOf('month').add(0,"hours")
                }
                if(type == 4){
                    this.filters.begin_time = moment().month(moment().month() - 1).startOf('month').add(0,"hours")
                    this.filters.end_time = moment().month(moment().month() - 1).endOf('month').add(0,"hours")
                }
                if(type == 5){
                    this.filters.begin_time = moment().startOf('days').add(0,"hours")
                    this.filters.end_time = moment().endOf('days').add(0,"hours")
                }
                if(type == 6){
                    this.filters.begin_time = moment().subtract('days',1).startOf('days').add(0,"hours")
                    this.filters.end_time = moment().subtract('days',1).endOf('days').add(0,"hours")
                }
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.searchWin()
            },
            getLowerList(row){
                if(!row){
                    this.lowList = [];
                    this.getWinsLists()
                    this.userpagination = {
                        current:1,
                        size:50,
                        total:0,
                        }
                    this.getWinsUserLists()
                }else{
                    var lowIndex =this.lowList.findIndex(item => item.agents_id == row.agents_id)
                    if(lowIndex == -1){
                        this.lowList.push({
                            agents_id:row.agents_id,
                            name:row.agents_name,
                        })
                    }else{
                        this.lowList.splice(lowIndex+1,this.lowList.length-1)
                    }
                    this.getWinsLists(row.agents_id);
                    this.userpagination = {
                        current:1,
                        size:50,
                        total:0,
                        }
                    this.getWinsUserLists(row.agents_id);
                }

            },
            getLowerListClom(row){
                if(!row){
                    this.lowList = [];
                    this.getWinsLists()
                    this.getWinsUserLists()
                }else{
                    var lowIndex =this.lowList.findIndex(item => item.agents_id == row.uid)
                    if(lowIndex == -1){
                        this.lowList.push({
                            agents_id:row.uid,
                            name:row.agents_name,
                        })
                    }else{
                        this.lowList.splice(lowIndex+1,this.lowList.length-1)
                    }
                    this.getWinsLists(row.uid);
                    this.getWinsUserLists(row.uid);
                }

            },
            searchWin(){
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.getWinsLists();
                this.getWinsUserLists();
            },
            handleSizeChange(val){
                this.pagination.size = val;
                this.getWinsLists();
            },
            handleCurrentChange(val){
                this.pagination.current = val;
                this.getWinsLists();
            },
            // getWinLists(){
            //     this.win = []
            //     for(var i = (this.pagination.current-1) * this.pagination.size; i < this.pagination.size * (this.pagination.current);i++ ){
            //         if(this.wins[i]){
            //             this.win.push(this.wins[i])
            //         }  
            //     }
            //     if(this.win.length){
            //         this.win.push(this.plugin.columnFilterFunc(this.win,"agents_account"))
            //     }
                
            // },
            //获取列表
            getuserag(agents_id){
                this.getDLWinsUserListPage(agents_id);
            },
            getWinsUserLists(agents_id) {
                var boss_id  = "";
                if(agents_id){
                    boss_id = agents_id
                }else if(this.lowList.length){
                    boss_id = this.lowList[this.lowList.length-1].agents_id
                }else{
                    boss_id = util.getSessionItem("user","agents_id")
                }
                this.current_agents_id = boss_id;
                let para = {
                    boss_id: boss_id,
                    pageNumber:this.userpagination.current,
                    pageSize:this.userpagination.size,
                    agents_account:this.searchParam.agents_account,
                    level:this.searchParam.level,
                    // boots_number:this.searchParam.boots_number,
                    // room_id:this.searchParam.room_id,
                    // ju:this.searchParam.ju,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.listLoading = true;
                //NProgress.start();
                getDLWinsUserListPage(para).then((res) => {
                    if(res.code == 200){
                        var data = res.data.list;
                        this.user=[]
                            for(var key in data){
                                this.user.push(data[key])
                            }
                        this.user.push(this.plugin.columnFilterFunc(this.user,"uid"))
                        this.userpagination.total = res.data.total;
                    }else{
                        this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                    }
                }).catch((res)=>{
                        this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                })
            },

            getWinsLists(agents_id) {
                var boss_id  = "";
                if(agents_id){
                    boss_id = agents_id
                }else if(this.lowList.length){
                    boss_id = this.lowList[this.lowList.length-1].agents_id
                }else{
                    boss_id = ""
                }
                this.current_agents_id = boss_id;
                let para = {
                    boss_id: boss_id,
                    pageNumber:this.pagination.current,
                    pageSize:this.pagination.size,
                    agents_account:this.searchParam.agents_account,
                    level:this.searchParam.level,
                    dep:this.searchParam.dep,
                    active:this.searchParam.active,
                    // boots_number:this.searchParam.boots_number,
                    // room_id:this.searchParam.room_id,
                    // ju:this.searchParam.ju,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.listLoading = true;
                //NProgress.start();
                getDLWinsListPage(para).then((res) => {
                    if(res.code == 200){
                        var data = res.data.list;
                        this.win=[]
                            for(var key in data){
                                this.win.push(data[key])
                            }
                        
                        this.win.push(this.plugin.columnFilterFunc(this.win,"agents_account"))

                        this.pagination.total = res.data.total;
                        this.listLoading = false;
                        // this.getWinLists()
                    }else{
                        this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                    }
                }).catch((res)=>{
                        this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                })
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
        mounted() {
            $("body").on("mouseover mouseout",".showlowertip",()=>{
                $(".showlowertipspan").toggleClass("hide");
                $(".showlowertipspan").css({
                    left:$(".showlowertip").offset().left,
                    top:$(".showlowertip").offset().top+20,
                })
            })
            this.getWinsLists();
            this.getWinsUserLists();
            this.autoTableHeight();
            $(window).resize(()=>{
                this.autoTableHeight();
            })
        }
    }

</script>
<style lang="scss" scoped>
    .hide{
        display: none;
    }
    .showlowertipspan{
        position: fixed;
        z-index: 2;
        background: #fff;
    border-radius: 2px;
    padding:0 4px;
    }
    .page-container {
        font-size: 20px;
        text-align: center;
        color: rgb(192, 204, 218);
    }
     .tabag{
        line-height: 40px;
        border-bottom:2px solid #ccc;
        clear: both;
        margin-bottom: 10px;
        font-size: 16px;
        color:#fff;
        span{
            margin:0 5px;
            cursor: pointer;
            padding:11px 0px;
        }
        .current{
            color:#ff6d00;
            border-bottom:2px solid #ff6d00;
        }
    }
</style>
<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                 <el-form-item label="会员/代理ID">
                    <el-input v-model="filters.username" placeholder="会员/代理ID"></el-input>
                </el-form-item>
                <el-form-item style="width: 260px" label="开始时间">
                    <el-date-picker
                            v-model="filters.begin_time"
                            type="datetime"
                            placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 260px;margin-left: 50px;" label="结束时间">
                    <el-date-picker
                            v-model="filters.end_time"
                            type="datetime"
                            placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
                <el-form size="small" :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" @click="searchTs">查询</el-button>
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
                <el-form-item style="margin-right: 15px;">
                    <el-button type="primary" @click="clearLoginLog">清空上线记录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
  
        <div class="lowList" v-if="lowList.length">
            <span><a @click="getLowerList()">{{plugin.getSessionItem("user","name")}}</a></span>
            <span :key="index" v-for="(item,index) in lowList"> > <a @click="getLowerList(item)">{{item.name}}</a></span>
        </div>
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"    size="mini" border :data="dcs" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="uid" label="会员/代理ID" min-width="80">
            </el-table-column>
            <el-table-column prop="name" label="会员/代理名称" min-width="130" sortable>
                <template slot-scope="scope">
                    <!-- <a v-if="scope.row.user_type ==1" style="text-decoration: underline;cursor: pointer;" @click="getLowerListClom(scope.row)">{{scope.row.name}}</a> -->
                    <a >{{scope.row.name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="user_type" label="身份" min-width="50">
                <template slot-scope="scope">
                    <a v-if="scope.row.user_type ==1" class="jinyong">代理</a>
                    <a v-if="scope.row.user_type ==0" class="qiyong">会员</a>
                </template>
            </el-table-column>
            <el-table-column prop="agents_account" label="代理账号" min-width="80">
            </el-table-column>
            <el-table-column prop="agents_name" label="代理名称" min-width="80">
            </el-table-column>
            <!--
            <el-table-column prop="relation_link" label="代理关系" min-width="330"></el-table-column>
            <el-table-column prop="level" label="层级" min-width="60"></el-table-column>
            <el-table-column prop="usertype" label="身份" min-width="30">
               <template slot-scope="scope">
                  <a v-if="scope.row.usertype ==1" style="color: red">代理</a>
                  <a v-if="scope.row.usertype ==2" >会员</a>
               </template>
           </el-table-column>
           -->
           <!--  <el-table-column prop="ip" label="IP" min-width="100">
            </el-table-column>
           
            <el-table-column prop="location" label="地点" min-width="120">
            </el-table-column>
            -->
            <el-table-column prop="mktime" label="时间" min-width="120">
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getOnlineListPage, doClearLoginLog} from '../../api/api';
    import moment from 'moment'
    import $ from 'jquery'
    export default {
        data() {
            return {
                agent_type:util.getSessionItem('user','agent_type'),
                filters: {
                    begin_time: null,
                    end_time: null,
                    username: null,
                },
                searchParam:{
                    begin_time: null,
                    end_time: null,
                    username: null,
                },
                dcs: [],
                dc: [],
                tableHeight:"500",
                tsUser:"",
                tsdetail:[],
                lowList:[],
                tsdetails:[],
                listLoading: false,
                listDetailLoading: false,
                detailVisible: false,
                pagination:{
                    current:1,
                    size:50,
                    total:0,
                }
            }
        },
        methods: {
            //清空上线记录按钮
            clearLoginLog(){
                if(this.agent_type != 2){
                    this.$message({
                            message: '请登录主管账号操作。',
                            type: 'error'
                    });
                    return;
                } 
                this.$confirm(
                    "上线记录清空后将不可恢复，确定清空吗?",
                    "提示",
                    {
                    type: "warning"
                    }
                ).then(() => {
                    this.$root.Event.$emit("showWindowsLoading")     
                    doClearLoginLog().then((res) => {
                        if(res.code == 200){
                            this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                            this.$root.Event.$emit("hideWindowsLoading")
                            this.getTsLists();
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
                        return;
                    })      
                });
            },
            searchWinQuickly(type){
                if(type == 1){
                    this.filters.begin_time = moment().startOf('isoWeek').add(0,"hours");
                    this.filters.end_time = moment().endOf('isoWeek').add(0,"hours");
                }
                if(type == 2){
                    this.filters.begin_time = moment().isoWeek(moment().isoWeek() - 1).startOf('isoWeek').add(0,"hours");
                    this.filters.end_time = moment().isoWeek(moment().isoWeek() - 1).endOf('isoWeek').add(0,"hours");
                }
                if(type == 3){
                    this.filters.begin_time = moment().startOf('month').add(0,"hours");
                    this.filters.end_time = moment().endOf('month').add(0,"hours");
                }
                if(type == 4){
                    this.filters.begin_time = moment().month(moment().month() - 1).startOf('month').add(0,"hours");
                    this.filters.end_time = moment().month(moment().month() - 1).endOf('month').add(0,"hours");
                }
                if(type == 5){
                    this.filters.begin_time = moment().startOf('days').add(0,"hours");
                    this.filters.end_time = moment().endOf('days').add(0,"hours");
                }
                if(type == 6){
                    this.filters.begin_time = moment().subtract('days',1).startOf('days').add(0,"hours");
                    this.filters.end_time = moment().subtract('days',1).endOf('days').add(0,"hours");
                }
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.searchTs()
            },
            searchTs(){
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.getTsLists();
            },
            
            handleSizeChange(val){
                this.pagination.size = val;
                this.getTsLists();
            },
            handleCurrentChange(val){
                this.pagination.current = val;
                this.getTsLists();
            },
            // getTLists(){
            //     this.dc = []
            //     for(var i = (this.pagination.current-1) * this.pagination.size; i < this.pagination.size * (this.pagination.current);i++ ){
            //         if(this.dcs[i]){
            //             this.dc.push(this.dcs[i])
            //         }              
            //     }
            // },
            getLowerList(row){
                if(!row){
                    this.lowList = [];
                    this.getTsLists()
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
                    this.getTsLists(row.agents_id)
                }

            },
            getLowerListClom(row){
                if(!row){
                    this.lowList = [];
                    this.getTsLists()
                }else{
                    var lowIndex =this.lowList.findIndex(item => item.agents_id == row.uid)
                    if(lowIndex == -1){
                        this.lowList.push({
                            agents_id:row.uid,
                            name:row.name,
                        })
                    }else{
                        this.lowList.splice(lowIndex+1,this.lowList.length-1)
                    }
                    this.getTsLists(row.uid)
                }

            },
            //获取下注列表
            getTsLists(agents_id) {
                var boss_id  = "";
                if(agents_id){
                    boss_id = agents_id
                }else if(this.lowList.length){
                    boss_id = this.lowList[this.lowList.length-1].agents_id
                }else{
                    boss_id = util.getSessionItem("user","agents_id")
                }
                let para = {
                    pageNumber:this.pagination.current,
                    pageSize:this.pagination.size,
                    username:this.searchParam.username,
                    agents_id:boss_id,
                    // boots_number:this.searchParam.boots_number,
                    // room_id:this.searchParam.room_id,
                    // ju:this.searchParam.ju,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.listLoading = true; 
                //NProgress.start();
                getOnlineListPage(para).then((res) => {
                    if(res.code == 200){
                       var data = res.data.list;
                        this.dcs=[]
                        for(var key in data){
                            this.dcs.push(data[key])
                        }
                        this.pagination.total = res.data.total;
                        this.listLoading = false;
                        // this.getTLists()
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
            this.getTsLists();
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
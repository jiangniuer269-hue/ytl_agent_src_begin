<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="被操作代理账号">
                    <el-input v-model="filters.agents_account" placeholder="代理账号"></el-input>
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
                <el-form-item label="数据类型">
                    <el-select v-model="filters.dataType" placeholder="请选择">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="上分" value="11"></el-option>
                        <el-option label="下分" value="12"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="用户类型">
                    <el-select v-model="filters.userType" placeholder="请选择">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="会员" value="1"></el-option>
                        <el-option label="代理" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchScoreLog">查询</el-button>
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
            </el-form>
        </el-col>


        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="logs" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
           
                <!-- <template slot-scope="scope">
                    <a v-if="scope.row.user_type ==1" style="text-decoration: underline;cursor: pointer;" @click="getLowerList(scope.row)">{{scope.row.name}}</a>
                    <a v-if="scope.row.user_type ==2" >{{scope.row.name}}</a>
                </template> -->
            </el-table-column>
            <!-- <el-table-column prop="user_type" label="身份" min-width="30">
                <template slot-scope="scope">
                    <a v-if="scope.row.user_type ==1" style="color: red">代理</a>
                    <a v-if="scope.row.user_type ==2" >会员</a>
                </template>
            </el-table-column> -->
             <el-table-column prop="agents_name" label="被操作代理名称" min-width="90">
            </el-table-column>
             <el-table-column prop="agents_account" label="被操作代理账号" min-width="90">
            </el-table-column>
            <el-table-column prop="score" label="调整前余分" min-width="80">
            </el-table-column>
            <el-table-column prop="score_change" label="调整金额" min-width="90" sortable>
                <template slot-scope="scope">
                    <a v-if="scope.row.score_change >=0" style="color: #FF9900">{{scope.row.score_change}}</a>
                    <a v-if="scope.row.score_change <0" style="color: red">{{scope.row.score_change}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="score_after" label="调整后余分" min-width="80">
            </el-table-column>
           
            <el-table-column prop="relation_link" label="代理关系" min-width="330">
            </el-table-column>
            <el-table-column prop="level" label="层级" min-width="60">
            </el-table-column>
            <el-table-column prop="note" label="操作内容" min-width="200">
            </el-table-column>
            <el-table-column prop="do_agents_account" label="操作人" min-width="120">
            </el-table-column>
            <el-table-column prop="mktime" label="操作时间" min-width="120">
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
    import { getScoreLogListPageAgents } from '../../api/api';
    import moment from 'moment'
    import $ from 'jquery'
    export default {
        data() {
            return {
                lowList:[],
                filters: {
                    begin_time: null,
                    end_time: null,
                    agents_account:"",
                    dataType:"0",
                    userType:"0",
                },
                searchParam:{
                    begin_time: null,
                    end_time: null,
                    agents_account:"",
                    dataType:"0",
                    userType:"0",
                },
                tableHeight: "500",
                logs: [],
                log: [],
                listLoading: false,
                pagination:{
                    current:1,
                    size:50,
                    total:0,
                }
            }
        },
        methods: {
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
                this.getLogLists(this.searchParam.do_account);
            },
            getLowerList(row){
                if(!row){
                    this.lowList = [];
                    this.pagination.current = 1;
                    this.searchParam = this.filters;
                    this.getLogLists()
                }else{
                    var lowIndex =this.lowList.findIndex(item => item.account == row.account)
                    if(lowIndex == -1){
                        this.lowList.push({
                            account:row.account,
                            name:row.name,
                        })
                    }else{
                        this.lowList.splice(lowIndex+1,this.lowList.length-1)
                    }
                    this.getLogLists(row.account)
                }

            },
            searchScoreLog(){
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.getLogLists(this.searchParam.do_account);
            },
            handleSizeChange(val){
                this.pagination.size = val;
                this.getLogLists();
            },
            handleCurrentChange(val){
                this.pagination.current = val;
                this.getLogLists();
            },
            //获取操作列表
            getLogLists(account) {
                if(account){
                    this.searchParam.be_do_account = account;
                    this.filters.be_do_account = account;
                }else{
                    this.searchParam.be_do_account = "";
                    this.filters.be_do_account = "";
                }
                let para = {
                    agents_account:this.searchParam.agents_account,
                    dataType:this.searchParam.dataType,
                    userType:this.searchParam.userType,
                    pageNumber:this.pagination.current,
                    pageSize:this.pagination.size,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.listLoading = true;
                //NProgress.start();
                getScoreLogListPageAgents(para).then((res) => {
                    if(res.code == 200){
                        this.logs = res.data.list;
                        this.pagination.total = res.data.total;
                        if(this.logs.length){
                            this.logs.push(this.plugin.columnFilterFunc(this.logs,"agents_name"))
                        }
                        this.listLoading = false;
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
                this.tableHeight = $(".content-container").height() - $(".toptoolbar").height() -
                        setTimeout(()=>{
                            for(var i = 0 ; i < $(".tableStyle").length;i++){
                                $(".tableStyle").eq(i).find(".is-scrolling-left").width($(".tableStyle").eq(i).find(".el-table__header").width())
                            }
                        },500)

             })
           }
        },
        mounted() {
            this.getLogLists();
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
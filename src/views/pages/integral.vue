<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="会员ID">
                    <el-input v-model="filters.uid" placeholder="会员ID"></el-input>
                </el-form-item>
                <el-form-item label="代理账号">
                    <el-input v-model="filters.agents_account" placeholder="代理账号"></el-input>
                </el-form-item>
                <el-form-item label="数据类型" v-if="auth_type == 1">
                    <el-select v-model="filters.dataType" placeholder="请选择">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="会员" value="1"></el-option>
                        <el-option label="游客" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 260px" label="开始时间">
                    <el-date-picker
                            v-model="filters.begin_time"
                            type="datetime"
                            placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 260px;margin-left: 20px;" label="结束时间">
                    <el-date-picker
                            v-model="filters.end_time"
                            type="datetime"
                            placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>    
            <el-form size="small" :inline="true" :model="filters"> 
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
                <el-form-item>
                    <el-button type="primary" @click="exportExcel()">导出报表</el-button>
                    <iframe style="display: none;" name="baseExport"></iframe>
                        <form id="baseForm" name="baseForm" method="post" action="" target="baseExport" style="display: none;">
                            <input type="hidden" :value="searchParam.uid" name="uid">
                            <input type="hidden" :value="searchParam.dataType" name="dataType">
                            <input type="hidden" :value="searchParam.agents_account" name="agents_account">                           
                            <input type="hidden" :value="searchParam.begin_time" name="begin_time">
                            <input type="hidden" :value="searchParam.end_time" name="end_time">
                           
                        </form>
                </el-form-item>
            </el-form>
        </el-col>

        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 4px;">
            <el-button
                type="greenButton"
                effect="dark">
            累计产生积分: {{integral_all}}
            </el-button>
            <el-button
                type="greenButton"
                effect="dark">
            累计已提积分: {{integral_exchange}}
            </el-button>
            <el-button
                type="greenButton"
                effect="dark">
            总剩余积分: {{user_integral}}
            </el-button>
        </el-col>
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="log" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="uid" label="会员ID" min-width="80">
            </el-table-column>
            <el-table-column prop="name" label="会员名称" min-width="80">
            </el-table-column>
            <el-table-column prop="agents_account" label="代理账号" min-width="80">
            </el-table-column>
            <el-table-column prop="integral" label="每日积分" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="integral_exchange" label="已提积分" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="integral_total" label="剩余积分" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="xm_rate" label="积分比例" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="date" label="时间" min-width="80">
            </el-table-column>
            <el-table-column label="操作" min-width="200">
                 <template slot-scope="scope" v-if="!scope.row.countt">
                     <a style="color:#20a0ff;cursor: pointer"  size="mini" @click="handleDetail(scope.row)">查看每日积分</a>
                 </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--详情弹框-->
        <el-dialog  :title="detailFilters.user.name+'-每日积分详情'" :visible.sync="DetailVisible" :close-on-click-modal="false" width="1000px">           
            <el-table  :row-class-name="plugin.tableRowClassName"  v-loading="detailLoading" size="mini" border :data="detaillogs" highlight-current-row   class="tableStyle" style="width: 100%" max-height=650>
                <el-table-column prop="uid" label="会员ID" min-width="80">
                </el-table-column>
                <el-table-column prop="name" label="会员名称" min-width="80">
                </el-table-column>
                <el-table-column prop="agents_account" label="代理账号" min-width="80">
                </el-table-column>
                <el-table-column prop="integral" label="每日积分" min-width="80" sortable>
                </el-table-column>
                <el-table-column prop="integral_exchange" label="已提积分" min-width="80" sortable>
                </el-table-column>
                <el-table-column prop="integral_total" label="剩余积分" min-width="80" sortable>
                </el-table-column>
                <el-table-column prop="xm_rate" label="积分比例" min-width="80" sortable>
                </el-table-column>
                <el-table-column prop="date" label="时间" min-width="80">
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination @size-change="handleSizeChangeDetail" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeDetail" :current-page="detailPagination.current" :page-sizes="[50, 100, 300]" :page-size="detailPagination.size" :total="detailPagination.total" style="float:right;">
                </el-pagination>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="DetailVisible = false">关闭</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getIntegralListPage,getIntegralDetailListPage } from '../../api/api';
    import moment from 'moment'
    import $ from 'jquery'
    export default {
        data() {
            return {
                auth_type:util.getSessionItem('user','auth_type'),
                integral_all:null,
                integral_exchange:null,
                user_integral:null,
                DetailVisible:false,
                detailLoading:false,
                filters: {
                    begin_time: null,
                    end_time: null,
                    agents_account:null,
                    uid:"",
                    dataType:"0",
                },
                searchParam:{
                    begin_time: null,
                    end_time: null,
                    agents_account:null,
                    uid:"",
                    dataType:"0",
                },
                tableHeight: "500px",
                logs: [],
                log: [],
                detaillogs:[],
                listLoading: false,
                pagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                detailFilters: {
                    user: '',
                    begin_time: null,
                    end_time: null,    
                },
                detailSearchParam: {
                    begin_time: null,
                    end_time: null,
                    uid:'',
                },
                detailPagination:{
                    current:1,
                    size:50,
                    total:0,
                },
            }
        },
        methods: {
            //导出报表
            exportExcel(){
                this.$nextTick(()=>{
                    $("#baseForm").attr("action","v1/integral/integralExport").submit();
                })
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
                this.getLogLists();
            },

            handleDetail(row){
                console.log('rowrow',row);
                this.DetailVisible = true;
                this.detailPagination.current = 1;
                this.detailFilters.user = row;
                if(this.searchParam.begin_time){
                    this.detailSearchParam.begin_time = this.searchParam.begin_time;
                }else{
                    this.detailSearchParam.begin_time = row.begin_time;
                }
                if(this.searchParam.end_time){
                    this.detailSearchParam.end_time = this.searchParam.end_time;
                }else{
                    this.detailSearchParam.end_time = row.end_time;
                }
                this.detailSearchParam.uid = row.uid;
                this.getDetail();
            },
            handleSizeChangeDetail(val){
                this.detailPagination.size = val;
                this.getDetail();
            },
            handleCurrentChangeDetail(val){
                this.detailPagination.current = val;
                this.getDetail();
            },
            getDetail(){
                let para = {
                    uid:this.detailSearchParam.uid,
                    begin_time:this.detailSearchParam.begin_time == null ? "": moment(this.detailSearchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.detailSearchParam.end_time == null ? "": moment(this.detailSearchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                    pageNumber:this.detailPagination.current,
                    pageSize:this.detailPagination.size,
                    doSearchDetail:1,
                };
                this.detailLoading = true;
                //NProgress.start();
               getIntegralListPage(para).then((res) => {
                    if(res.code == 200){
                        this.detaillogs = res.data.list;
                        this.detailPagination.total = this.detaillogs.length;
                       // this.getLog();
                        this.detailLoading = false;
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
            searchScoreLog(){
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.getLogLists();
            },
            handleSizeChange(val){
                this.pagination.size = val;
                this.getLog();
            },
            handleCurrentChange(val){
                this.pagination.current = val;
                this.getLog();
            },
            //获取操作列表
            getLogLists() {
                let para = {
                    uid:this.searchParam.uid,
                    dataType:this.searchParam.dataType,
                    agents_account:this.searchParam.agents_account,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                    pageNumber:this.pagination.current,
                    pageSize:this.pagination.size
                };
                this.listLoading = true;
                //NProgress.start();
                getIntegralListPage(para).then((res) => {
                    if(res.code == 200){
                        this.logs = res.data.list;
                        this.pagination.total = this.logs.length;
                        this.getLog();

                        this.integral_all = res.data.integral_all;
                        this.integral_exchange = res.data.integral_exchange;
                        this.user_integral = res.data.user_integral;
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
            getLog(){
                this.log = []
                for(var i = (this.pagination.current-1) * this.pagination.size; i < this.pagination.size * (this.pagination.current);i++ ){
                    if(this.logs[i]){
                        this.log.push(this.logs[i])
                    }
                }
                this.log.length>0 && this.log.push(this.plugin.columnFilterFunc(this.log,"uid"))
            },
            autoTableHeight(){
                this.$nextTick(() => {
                // this.tableHeight = $(".content-container").height() - $(".toptoolbar").height();
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
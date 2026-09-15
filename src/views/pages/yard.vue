<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="用户ID">
                    <el-input v-model="filters.uid" placeholder="用户ID"></el-input>
                </el-form-item>
     
                <el-form-item label="代理账号">
                    <el-input v-model="filters.agents_account" placeholder="代理账号"></el-input>
                </el-form-item>
                
                <el-form-item style="width: 260px" label="开始时间">
                    <el-date-picker
                            v-model="filters.begin_time"
                            type="datetime"
                            placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 260px;margin-left:35px;" label="结束时间">
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
            </el-form>
        </el-col>

        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 4px;">
            <el-button
                type="primary"
                effect="dark">
            结算积分总数量: {{exchange_integral_all}}
            </el-button>
            <el-button
                type="primary"
                effect="dark">
            上分总额度: {{exchange_score}}
            </el-button>
            <el-button v-if="agent_type == 3" style="cursor:pointer"
                type="danger" @click="guiling"
                effect="dark">
            一键结算
            </el-button>
        </el-col>
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="log" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="uid" label="会员ID" min-width="80">
            </el-table-column>
            <el-table-column prop="name" label="会员昵称" min-width="80">
            </el-table-column>

            <el-table-column prop="agents_account" label="代理账号" min-width="80">
            </el-table-column>
            <el-table-column prop="agents_name" label="代理昵称" min-width="80">
            </el-table-column>
            
            <el-table-column prop="integral_exchange" label="结算积分" min-width="80">
            </el-table-column>
            <el-table-column prop="integral_rate" label="积分比例" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="exchange_score" label="上分额度" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="mktime" label="时间" min-width="80">
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--详情弹框-->
        <el-dialog  :title="detailFilters.user.name+'-详情'" :visible.sync="DetailVisible" :close-on-click-modal="false" width="1000px">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form size="small" :inline="true" :model="detailFilters">
                    <el-form-item style="width: 260px" label="开始时间">
                        <el-date-picker
                                v-model="detailFilters.begin_time"
                                type="datetime"
                                placeholder="开始时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="width: 260px" label="结束时间">
                        <el-date-picker
                                v-model="detailFilters.end_time"
                                type="datetime"
                                placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="searchDetail">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--table-->
            <!--列表-->
            <el-table  :row-class-name="plugin.tableRowClassName" max-height="300" v-loading="detailLoading" size="mini" border :data="detaillogs" highlight-current-row   class="tableStyle" style="width: 100%;">
                <el-table-column prop="uid" label="会员ID">
                </el-table-column>
                <el-table-column prop="name" label="会员名称" min-width="80">
                </el-table-column>
                <el-table-column prop="score" label="流水" min-width="60">
                </el-table-column>
                <el-table-column prop="integral" label="积分" min-width="60">
                </el-table-column>
                <el-table-column prop="card_game_id" label="牌局ID" min-width="100">
                </el-table-column>
                <el-table-column prop="type" label="类型" min-width="100">
                    <template slot-scope="scope">
                        <a v-if="scope.row.type == 1" style="color: blue">增加</a>
                        <a v-if="scope.row.type == 2" style="color: red">减少</a>
                    </template>
                </el-table-column>
                 <el-table-column prop="mktime" label="时间" min-width="100">
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
    import { getYardListPage,yardCount } from '../../api/api';
    import moment from 'moment'
    import $ from 'jquery'
    export default {
        data() {
            return {
                agent_type:util.getSessionItem('user','agent_type'),
                exchange_integral_all:null,
                exchange_score:null,
                DetailVisible:false,
                detailLoading:false,
                filters: {
                    begin_time: null,
                    end_time: null,
                    agents_account:null,
                    uid:"",
                },
                searchParam:{
                    begin_time: null,
                    end_time: null,
                    agents_account:null,
                    uid:"",
                },
                tableHeight: "500",
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
                },
                detailPagination:{
                    current:1,
                    size:50,
                    total:0,
                },
            }
        },
        methods: {
            guiling(){
                this.$confirm('确认结算吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    this.$root.Event.$emit("showWindowsLoading")
                    yardCount().then((res) => {
                        this.$root.Event.$emit("hideWindowsLoading")
                    if(res.code == 200){
                            this.$message({
                                message: "结算成功",
                                type: 'success'
                            });
                           this.getLogLists();
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
            searchDetail(){
                this.detailSearchParam.begin_time = this.detailFilters.begin_time;
                this.detailSearchParam.end_time = this.detailFilters.end_time;
                this.getDetail()
            },
            handleDetail(row){
                this.DetailVisible = true;
                this.detailPagination.current = 1;
                this.detailFilters.user = row;
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
                    uid:this.detailFilters.user.uid,
                    date_time:this.detailFilters.user.date_time,
                    begin_time:this.detailSearchParam.begin_time == null ? "": moment(this.detailSearchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.detailSearchParam.end_time == null ? "": moment(this.detailSearchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                    pageNumber:this.detailPagination.current,
                    pageSize:this.detailPagination.size
                };
                this.detailLoading = true;
                //NProgress.start();
                getIntegralDetailListPage(para).then((res) => {
                    if(res.code == 200){
                        this.detaillogs = res.data.list;
                        this.detailPagination.total = res.data.total;
                        this.detaillogs.length>0 && this.detaillogs.push(this.plugin.columnFilterFunc(this.detaillogs,"uid"))
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
                    agents_account:this.searchParam.agents_account,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                    pageNumber:this.pagination.current,
                    pageSize:this.pagination.size
                };
                this.listLoading = true;
                //NProgress.start();
                getYardListPage(para).then((res) => {
                    if(res.code == 200){
                        this.logs = res.data.list;
                        this.pagination.total = this.logs.length;
                        this.getLog();

                        this.exchange_integral_all = res.data.sumData.exchange_integral_all;
                        this.exchange_score = res.data.sumData.exchange_score;
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
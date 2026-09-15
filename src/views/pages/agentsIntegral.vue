<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="代理账号">
                    <el-input v-model="filters.agents_account" placeholder="代理账号"></el-input>
                </el-form-item>
                <el-form-item label="会员ID">
                    <el-input v-model="filters.uid" placeholder="会员ID"></el-input>
                </el-form-item>
                 <el-form-item label="层级">
                    <el-input style="width:125px;" v-model="filters.level" @change="levelChange(filters)" placeholder="请输入层级数字"></el-input>
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
                            <input type="hidden" :value="searchParam.uid" name="uid">
                            <input type="hidden" :value="searchParam.level" name="level">
                            <input type="hidden" :value="searchParam.begin_time" name="begin_time">
                            <input type="hidden" :value="searchParam.end_time" name="end_time">
                           
                        </form>
                </el-form-item>

            </el-form>
        </el-col>
        <!-- <div class="lowList" v-if="lowList.length">
            <span><a @click="getLowerList()">{{plugin.getSessionItem("user","name")}}</a></span>
            <span :key="index" v-for="(item,index) in lowList"> > <a @click="getLowerList(item)">{{item.name}}</a></span>
        </div> -->
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="win" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="agents_name" label="代理名称" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="agents_account" label="代理账号" min-width="80" sortable>
            </el-table-column>
            <!-- <el-table-column prop="boss_name" label="上级名称" min-width="80" sortable>
            </el-table-column> 
            <el-table-column prop="boss_account" label="上级账号" min-width="80" sortable>
            </el-table-column> -->
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
            <el-table-column prop="profit" label="代理收益" min-width="80">
            </el-table-column>

            <el-table-column prop="mktime" label="时间" min-width="250">
            </el-table-column>
            <el-table-column label="操作" min-width="140">
                <template slot-scope="scope">
                    <a style="color: rgb(255, 153, 0);cursor: pointer" size="mini" @click="handleLiushui(scope.row)">收益明细</a>
                    
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--流水明细弹框-->
        <el-dialog  :title="liushuiFilters.user.agents_name+'-收益明细'" :visible.sync="LiushuiVisible" :close-on-click-modal="false" width="1400px">

            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form size="small" :inline="true" :model="liushuiFilters">
                    <el-form-item label="会员ID">
                    <el-input v-model="liushuiFilters.uid" placeholder="会员ID"></el-input>
                    </el-form-item>
                    <el-form-item style="width: 260px" label="开始时间">
                        <el-date-picker
                                v-model="liushuiFilters.begin_time"
                                type="datetime"
                                placeholder="开始时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="width: 260px" label="结束时间">
                        <el-date-picker
                                v-model="liushuiFilters.end_time"
                                type="datetime"
                                placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="searchLiushui">查询</el-button>
                    </el-form-item>

                     <el-form-item>
                    <el-button type="primary" @click="searchLsQuickly(5)">今天</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchLsQuickly(6)">昨天</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchLsQuickly(1)">本周</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchLsQuickly(2)">上周</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchLsQuickly(3)">本月</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchLsQuickly(4)">上月</el-button>
                    </el-form-item>

                </el-form>
            </el-col>
            <!--table-->
            <!--列表-->
            <el-table  :row-class-name="plugin.tableRowClassName" max-height="420" v-loading="liushuiLoading" size="mini" border :data="liushui" highlight-current-row   class="tableStyle" style="width: 100%;">
                <el-table-column prop="user_name" label="会员名称" min-width="120">
                </el-table-column>
                <el-table-column prop="uid" label="会员ID">
                </el-table-column>
                <el-table-column prop="user_xm_rate" label="会员积分比例" min-width="80">
                </el-table-column>
                <el-table-column prop="integral" label="会员产生积分" min-width="80">
                </el-table-column>
                <el-table-column prop="user_profit" label="会员收益" min-width="60">
                </el-table-column>
                <el-table-column prop="agents_name" label=" 代理名称" min-width="80">
                </el-table-column>
                <el-table-column prop="agents_account" label="代理账号" min-width="80">
                </el-table-column>
                <el-table-column prop="agents_xm_rate" label="代理积分比例" min-width="80">
                </el-table-column>
                <el-table-column prop="agents_integral" label="代理收益" min-width="80">
                </el-table-column>
                <el-table-column prop="relation_link" label="代理关系" min-width="250">
                </el-table-column>
                <el-table-column prop="level" label="层级" min-width="80">
                </el-table-column>
                <el-table-column prop="mktime" label="时间" min-width="120">
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
                <el-pagination @size-change="handleSizeChangeLiushui" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeLiushui" :current-page="liushuiPagination.current" :page-sizes="[50, 100, 300]" :page-size="liushuiPagination.size" :total="liushuiPagination.total" style="float:right;">
                </el-pagination>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="LiushuiVisible = false">关闭</el-button>
            </div>
        </el-dialog>


        

    </section>
</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import moment from 'moment'
    import $ from 'jquery'
    import { getDLIntegralListPage,getAgentsLiushuiPage } from '../../api/api';
    import Relation from "@/components/relation";

    export default {
        data() {
            return {
                
                liushui:[],
                LiushuiVisible:false,
                liushuiFilters: {
                    user: '',
                    uid:"",
                    begin_time: '',
                    end_time: '',
                },
                liushuiSearchParam: {
                    uid:"",
                    begin_time: '',
                    end_time: '',
                },
                filters: {
                    agents_account:"",
                    uid:"",
                    level:"",
                    begin_time: null,
                    end_time: null,
                },
                searchParam:{
                    agents_account:"",
                    uid:"",
                    level:"",
                    begin_time: null,
                    end_time: null
                },
                lowList:[],
                tableHeight: "500",
                wins: [],
                win: [],
                listLoading: false,
                pagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                liushuiPagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                liushuiLoading:false,
            }
        },
        methods: {
             exportExcel(){
                this.$nextTick(()=>{
                    $("#baseForm").attr("action","v1/agents/profitExport").submit();
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
            searchLiushui(){
                this.liushuiSearchParam.begin_time = this.liushuiFilters.begin_time;
                this.liushuiSearchParam.end_time = this.liushuiFilters.end_time;
                this.liushuiSearchParam.uid = this.liushuiFilters.uid;
                this.getLiushui()
            },
            handleLiushui(row){
                this.liushuiFilters = {
                    begin_time: "",
                    end_time: "",
                    user:row,
                    uid:"",
                }
                this.liushuiSearchParam = {
                    begin_time:"",
                    end_time:"",
                    uid:""
                }
                this.LiushuiVisible = true;
                this.getLiushui()
            },
            handleSizeChangeLiushui(val){
                this.liushuiPagination.size = val;
                this.getLiushui();
            },
            handleCurrentChangeLiushui(val){
                this.liushuiPagination.current = val;
                this.getLiushui();
            },
            getLiushui(){
                let para = {
                    pageNumber:this.liushuiPagination.current,
                    pageSize:this.liushuiPagination.size,
                    agents_id:this.liushuiFilters.user.agents_id,
                    uid:this.liushuiSearchParam.uid,
                    begin_time:this.liushuiSearchParam.begin_time == "" ? "": moment(this.liushuiSearchParam.begin_time).unix(),
                    end_time:this.liushuiSearchParam.end_time == "" ? "": moment(this.liushuiSearchParam.end_time).unix(),
                };
                this.liushuiLoading = true;
                getAgentsLiushuiPage(para).then((res) => {
                    this.liushuiPagination.total = res.data.total;
                    this.liushui = res.data.list;
                    if(this.liushui.length){
                        this.liushui.push(this.plugin.columnFilterFunc(this.liushui,"user_name"))
                    }
                    this.autoTableHeight();
                    this.liushuiLoading = false;
                });
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
            searchLsQuickly(type){
                if(type == 1){
                    this.liushuiFilters.begin_time = moment().startOf('isoWeek').add(0,"hours")
                    this.liushuiFilters.end_time = moment().endOf('isoWeek').add(0,"hours")
                }
                if(type == 2){
                    this.liushuiFilters.begin_time = moment().isoWeek(moment().isoWeek() - 1).startOf('isoWeek').add(0,"hours")
                    this.liushuiFilters.end_time = moment().isoWeek(moment().isoWeek() - 1).endOf('isoWeek').add(0,"hours")
                }
                if(type == 3){
                    this.liushuiFilters.begin_time = moment().startOf('month').add(0,"hours")
                    this.liushuiFilters.end_time = moment().endOf('month').add(0,"hours")
                }
                if(type == 4){
                    this.liushuiFilters.begin_time = moment().month(moment().month() - 1).startOf('month').add(0,"hours")
                    this.liushuiFilters.end_time = moment().month(moment().month() - 1).endOf('month').add(0,"hours")
                }
                if(type == 5){
                    this.liushuiFilters.begin_time = moment().startOf('days').add(0,"hours")
                    this.liushuiFilters.end_time = moment().endOf('days').add(0,"hours")
                }
                if(type == 6){
                    this.liushuiFilters.begin_time = moment().subtract('days',1).startOf('days').add(0,"hours")
                    this.liushuiFilters.end_time = moment().subtract('days',1).endOf('days').add(0,"hours")
                }
                this.liushuiPagination.current = 1;
                this.liushuiSearchParam.begin_time = this.liushuiFilters.begin_time;
                this.liushuiSearchParam.end_time = this.liushuiFilters.end_time;
                this.getLiushui()
            },
            getLowerList(row){
                if(!row){
                    this.lowList = [];
                    this.getWinsLists()
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
                    this.getWinsLists(row.agents_id)
                }

            },
            getLowerListClom(row){
                if(!row){
                    this.lowList = [];
                    this.getWinsLists()
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
                    this.getWinsLists(row.uid)
                }

            },
            searchWin(){
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.getWinsLists();
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
            getWinsLists(agents_id) {
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
                    uid:this.searchParam.uid,
                    level:this.searchParam.level,
                    agents_account:this.searchParam.agents_account,
                    // boots_number:this.searchParam.boots_number,
                    // room_id:this.searchParam.room_id,
                    // ju:this.searchParam.ju,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.listLoading = true;
                //NProgress.start();
                getDLIntegralListPage(para).then((res) => {
                    if(res.code == 200){
                        var data = res.data.list;
                        this.win=[]
                            for(var key in data){
                                this.win.push(data[key])
                            }
                        
                        // this.win.length && this.win.push(this.plugin.columnFilterFunc(this.win,"agents_name"))

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
            this.getWinsLists();
            this.autoTableHeight();
            $(window).resize(()=>{
                this.autoTableHeight();
            })
        },
        components: {
            Relation,
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
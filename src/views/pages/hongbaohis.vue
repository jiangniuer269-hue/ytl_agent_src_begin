<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
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
            <!-- </el-table-column> -->
            <!-- <el-table-column prop="user_type" label="身份" min-width="30">
                <template slot-scope="scope">
                    <a v-if="scope.row.user_type ==1" style="color: red">代理</a>
                    <a v-if="scope.row.user_type ==2" >会员</a>
                </template>
            </el-table-column> -->
             <el-table-column prop="title" label="红包名称" min-width="90">
            </el-table-column>
             <el-table-column prop="counts" label="红包个数" min-width="60">
            </el-table-column>
            <el-table-column prop="score" label="红包金额" min-width="80">
            </el-table-column>
             <el-table-column prop="note" label="留言" min-width="200">
            </el-table-column>
           <el-table-column prop="mktime" label="时间" min-width="150">
            </el-table-column>
            <el-table-column  label="操作" min-width="120">
                 <template slot-scope="scope" v-if="!scope.row.countt">
                    <a style='color:rgb(32, 160, 255)' @click="getDetail(scope.row)">查看详情</a>
                </template>
            </el-table-column>
        </el-table>


     <!--上下分明细弹框-->
        <el-dialog   :title="currentHb.title+'-红包明细'" :visible.sync="hbdetailVisible" :close-on-click-modal="false" width="1000px">

            <!--table-->
            <!--列表-->
            <el-table :row-class-name="plugin.tableRowClassName" max-height="400" size="mini" border :data="details" highlight-current-row class="tableStyle" style="width: 100%;">
               
                <el-table-column prop="uid" label="会员ID">
                </el-table-column>
                <el-table-column prop="name" label="会员名称">
                </el-table-column>
                 <el-table-column label="身份" min-width="80">
                            <template slot-scope="scope">
                            <span v-if="scope.row.ai == 1">虚拟</span>
                            <span v-if="scope.row.tourist == 1">游客</span>
                            <span v-if="scope.row.ai == 0 && scope.row.tourist != 1">会员</span>
                        </template>
                        </el-table-column>
                <el-table-column prop="score" label="领取金额" min-width="60">
                </el-table-column>
                <el-table-column prop="uptime" label="领取时间" min-width="120" >
                </el-table-column>
                <el-table-column  label="手气" min-width="60">
                     <template slot-scope="scope">
                            <span v-if="scope.row.lucky == 0"></span>
                            <span v-if="scope.row.lucky == 1">手气最佳</span>
                            <span v-if="scope.row.lucky == 2">豹子</span>
                            <span v-if="scope.row.lucky == 3">顺子</span>
                            <span v-if="scope.row.lucky == 4">手气最差</span>
                        </template>
                </el-table-column>

            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hbdetailVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        
    </section>
</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getHbHis,getHbDetail } from '../../api/api';
    import moment from 'moment'
    import $ from 'jquery'
    export default {
        data() {
            return {
                currentHb:{},
                lowList:[],
                details:[],
                hbdetailVisible:false,
                filters: {
                    begin_time: null,
                    end_time: null,
                },
                searchParam:{
                    begin_time: null,
                    end_time: null,
                },
                tableHeight: "500",
                logs: [],
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
            getDetail(hb){
                this.currentHb = hb;
                this.hbdetailVisible = true;
                getHbDetail({hbid:hb.hb_id}).then((res) => {
                    if(res.code == 200){
                        this.details = res.data;
                       
                        if(this.details.length){
                             var totalscore = 0;
                                for(var i = 0 ; i < this.details.length;i++){
                                    if(this.details[i].ai == 0 && this.details[i].tourist != 1){
                                    totalscore += Number(this.details[i].score);
                                    }
                                }
                                this.details.push({
                                    uid:"合计(只包括会员)",
                                    score:totalscore.toFixed(2)
                                })
                        }
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
            getLogLists(account) {
                let para = {
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.listLoading = true;
                //NProgress.start();
                getHbHis(para).then((res) => {
                    if(res.code == 200){
                        this.logs = res.data;
                       
                        if(this.logs.length){
                            this.logs.push(this.plugin.columnFilterFunc(this.logs,"title"))
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
            // this.getLogLists();
            this.searchWinQuickly(1);
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
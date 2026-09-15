<template>
    <section>
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true">
               <el-form-item style="width: 200px" label="开始时间">
                    <el-date-picker
                            v-model="filters.begin_time"
                            type="datetime"
                            placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 200px;margin-left: 100px;" label="结束时间">
                    <el-date-picker
                            v-model="filters.end_time"
                            type="datetime"
                            placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
                <el-form size="small" :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="searchShare">查询</el-button>
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
        
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true">
                <el-form-item>
                    <el-button @click="goShare(0)" type="primary">今日报表</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goShare(1)" type="primary">历史报表</el-button>
                </el-form-item>

                <el-form-item v-if="agent_type == 3">
                    <el-button type="warning" @click="guiling">归零</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="logs" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="begin_date" label="开始时间" min-width="120">
            </el-table-column>
            <el-table-column prop="end_date" label="结束时间" min-width="120">
            </el-table-column>
            <el-table-column prop="upfen_total" label="上分总额" min-width="120">
            </el-table-column>
            <el-table-column prop="dowfen_total" label="下分总额" min-width="120">
            </el-table-column>
            <el-table-column prop="integral_exchange_total" label="积分兑换总额">
            </el-table-column>
            <el-table-column prop="user_win_lose" label="用户输赢数" min-width="80">
            </el-table-column>
            <el-table-column prop="user_original_score" label="用户初始分" min-width="80">
            </el-table-column>
            <el-table-column prop="user_integral" label="用户剩余积分" min-width="80">
            </el-table-column> 
            <!--
            <el-table-column prop="agent_score_total" label="代理余分" min-width="80">
            </el-table-column>
            -->
            <el-table-column prop="user_score_total" label="会员余分" min-width="80">
            </el-table-column>
             <el-table-column prop="all_score_total" label="总余分" min-width="80">
            </el-table-column>
        </el-table>


    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment, { duration } from 'moment'
    import $ from 'jquery'
    import { getZiyingLogListPage,setZiyingGuiling } from '../../api/api';

    export default {
        data() {
            return {
                type:0,
                logs:[],
                dangtian:[],
                agent_type:util.getSessionItem('user','agent_type'),
                listLoading: false,
                tableHeight:"500",
                filters: {
                    begin_time: null,
                    end_time: null,
                },
                searchParam:{
                    begin_time: null,
                    end_time: null,
                },
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
                this.searchParam = this.filters;
                this.getZiyingLogList(this.type);
            },
            searchShare(){
                this.searchParam = this.filters;
                this.getZiyingLogList(this.type);
            },
            goShare(type){
                this.type = type;              
                if(type == 0){
                     this.filters.begin_time = null
                    this.filters.end_time = null
                    this.searchParam = this.filters;
                }
                this.getZiyingLogList(type);
            },
            guilingHttp(){
                setZiyingGuiling(this.dangtian[0]).then((res) => {
                     this.$root.Event.$emit("hideWindowsLoading");
                        if(res.code == 200){
                            this.getZiyingLogList(this.type);
                            }else{                                
                                this.$message({
                                    message: res.msg,
                                    type: 'info'
                                });
                            }
                    }).catch((res)=>{
                        this.$root.Event.$emit("hideWindowsLoading")
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    })
            },
            onGuiling(data){
                this.$root.Event.$emit("hideWindowsLoading");
                if(data.code == 500){              
                    this.$message({
                        message: data.msg,
                        type: 'error',
                        duration:3000
                    });
                    return;
                }else if(data.code == 0){
                     this.getZiyingLogList(this.type);
                    //发http
                    this.guilingHttp();
                }else if(data.code == 200){
                     this.getZiyingLogList(this.type);
                    this.$message({
                           message: data.msg,
                           type: 'success',
                           duration:3000
                    });
                     return;
                }
            },
            guiling(){
                //先操作ws
                this.$confirm(
                    "本操作后，自营报表将被清空,且不可恢复，确认归零吗?",
                    "提示",
                    {
                    type: "warning"
                    }
                ).then(() => {
                    this.$root.Event.$emit("showWindowsLoading")                 
                    this.$store.getters.imClient.send(
                       JSON.stringify({ cmd: 4201, set: 104 })
                    );
                    
                  //  this.guilingHttp();
                    });
                 
                 
            },
            getZiyingLogList(type){
                let para = {
                    type:type,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                getZiyingLogListPage(para).then((res) => {
                        if(res.code == 200){
                            this.$message({
                                message: "数据请求成功",
                                type: 'success',
                            });
                           
                            this.logs = [];
                            if(res.data.list instanceof Array){
                                this.logs = res.data.list;
                                this.logs.push(this.plugin.columnFilterFunc(this.logs,"begin_date"))
                            }else{
                                this.logs.push(res.data.list);
                            }
                            if(type == 0){
                                this.dangtian = this.logs;
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
           
        },
        mounted() {
            this.$store.getters.imClient.bindGuiling(this.onGuiling);
            this.autoTableHeight();
            this.getZiyingLogList(this.type);
            $(window).resize(()=>{
                this.autoTableHeight();
            
            })
        }
    }

</script>
<style lang="scss" scoped>
    
</style>
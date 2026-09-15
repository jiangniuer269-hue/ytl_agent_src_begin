<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="代理账号">
                    <el-input v-model="filters.agents_account" placeholder="代理账号"></el-input>
                </el-form-item>
                <el-form-item label="会员ID">
                    <el-input v-model="filters.username" placeholder="会员ID"></el-input>
                </el-form-item>
                <el-form-item label="房间ID">
                    <el-input v-model="filters.room_id" placeholder="房间ID"></el-input>
                </el-form-item>
                <el-form-item label="靴号">
                    <el-input v-model="filters.boots_number" placeholder="靴号"></el-input>
                </el-form-item>
                <el-form-item label="局数">
                    <el-input v-model="filters.ju" placeholder="局数"></el-input>
                </el-form-item>
            </el-form>
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item  style="width: 200px" label="开始时间">
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
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" @click="searchBet">查询</el-button>
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

        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 4px;margin:0px;">
            <el-button
                type="primary"
                effect="dark">
            当页输赢: {{current_total_win}}
            </el-button>
            <el-button
                type="primary"
                effect="dark">
            当页积分: {{current_total_jifen}}
            </el-button>
            <el-button
                type="primary"
                effect="dark">
            总输赢: {{total_win}}
            </el-button>
            <el-button
                type="primary"
                effect="dark">
            总积分: {{total_jifen}}
            </el-button>
        </el-col>
<!--
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true">
                <el-form-item>
                    <el-button @click="goBet(-1)" :class="{'el-button--primarys':type ==-1 }" :type="type ==-1 ? 'primary' : 'warning'">下注汇总</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goBet(0)" :class="{'el-button--primarys':type ==0 }" :type="type ==0 ? 'primary' : 'warning'">百家乐下注</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goBet(1)" :class="{'el-button--primarys':type ==1 }" :type="type ==1 ? 'primary' : 'warning'">龙虎下注</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goBet(2)" :class="{'el-button--primarys':type ==2}" :type="type ==2 ? 'primary' : 'warning'">炸金花下注</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goBet(3)" :class="{'el-button--primarys':type ==3 }" :type="type ==3 ? 'primary' : 'warning'">牛牛下注</el-button>
                </el-form-item>
            </el-form>
        </el-col>
-->
        <div class="lowList" v-if="lowList.length">
            <span><a @click="getLowerList()">{{plugin.getSessionItem("user","name")}}</a></span>
            <span :key="index" v-for="(item,index) in lowList"> > <a @click="getLowerList(item)">{{item.name}}</a></span>
        </div>
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="bets" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="uid" label="会员ID" min-width="80" sortable></el-table-column>
            <el-table-column prop="nickname" label="会员名称" min-width="130" >
            </el-table-column>
            <el-table-column prop="agents_name" label="代理名称" min-width="100">
            </el-table-column>
             <el-table-column prop="agents_account" label="代理账号" min-width="100">
            </el-table-column>

            <el-table-column prop="ju" label="局数" min-width="150">
                <template slot-scope="scope" v-if="!scope.row.countt">
                    <a size="small">{{scope.row.room_id}}桌{{scope.row.boots_number}}-{{scope.row.ju}}局</a>
                </template>
            </el-table-column>
            <el-table-column prop="odds_text" label="下注类别" min-width="250" >
            </el-table-column>
            <el-table-column prop="game_result_text" label="开牌结果" min-width="130" >
            </el-table-column>
           <el-table-column prop="score_before" label="下注前余分" min-width="90" ></el-table-column>
             <el-table-column prop="win" label="输赢" min-width="60" >
                 <template slot-scope="scope">
                    <a v-if="scope.row.win >=0" style="color: #FF9900">{{scope.row.win}}</a>
                    <a v-if="scope.row.win <0" style="color: red">{{scope.row.win}}</a>
                </template>
            </el-table-column>
           <el-table-column prop="score_after" label="结算后余分" min-width="90" ></el-table-column>
           <el-table-column prop="xm" label="积分" min-width="60" ></el-table-column>
          <!-- <el-table-column prop="ip" label="IP" min-width="120"></el-table-column>-->
           <el-table-column prop="mktime" label="时间" min-width="120"></el-table-column>
           
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
    import moment from 'moment'
    import $ from 'jquery'
    //import NProgress from 'nprogress'
    import { getBetsListPage } from '../../api/api';
    export default {
        data() {
            return {
                current_total_win:0,
                current_total_jifen:0,
                total_win:0,
                total_jifen:0,
                type:0,
                filters: {
                    agents_account:"",
                    boots_number: '',
                    username:"",
                    ju: '',
                    room_id: '',
                    begin_time: null,
                    end_time: null,
                },
                searchParam:{
                    agents_account:"",
                    boots_number: '',
                    ju: '',
                    username:"",
                    room_id: '',
                    begin_time: null,
                    end_time: null
                },
                lowList: [],
                bets: [],
                tableHeight: "500",
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                pagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
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
                this.getBetsLists();
            },
            searchRela(account){
                this.filters.agents_account = account;
                this.searchBet();
            },
            goBet(type){
                this.type = type;
                this.getBetsLists();
            },
            getLowerList(row){
                if(!row){
                    this.lowList = [];
                    this.getBetsLists()
                }else{
                    var lowIndex =this.lowList.findIndex(item => item.agents_id == row.agents_id)
                    if(lowIndex == -1){
                        this.lowList.push({
                            agents_id:row.agents_id,
                            name:row.nickname,
                        })
                    }else{
                        this.lowList.splice(lowIndex+1,this.lowList.length-1)
                    }
                    this.getBetsLists(row.agents_id)
                }

            },
            getLowerListClom(row){
                if(!row){
                    this.lowList = [];
                    this.getBetsLists()
                }else{
                    var lowIndex =this.lowList.findIndex(item => item.agents_id == row.uid)
                    if(lowIndex == -1){
                        this.lowList.push({
                            agents_id:row.uid,
                            name:row.nickname,
                        })
                    }else{
                        this.lowList.splice(lowIndex+1,this.lowList.length-1)
                    }
                    this.getBetsLists(row.uid)
                }

            },
            searchBet(){
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.getBetsLists();
            },
            handleSizeChange(val){
                this.pagination.size = val;
                this.getBetsLists();
            },
            handleCurrentChange(val){
                this.pagination.current = val;
                this.getBetsLists();
            },
            //获取下注列表
            getBetsLists(agents_id) {
                var boss_id  = "";
                if(agents_id){
                    boss_id = agents_id
                }else if(this.lowList.length){
                    boss_id = this.lowList[this.lowList.length-1].agents_id
                }else{
                    boss_id = util.getSessionItem("user","agents_id")
                }
                let para = {
                    agents_account:this.searchParam.agents_account,
                    pageNumber:this.pagination.current,
                    pageSize:this.pagination.size,
                    agents_id:boss_id,
                    game_type:this.type,
                    boots_number:this.searchParam.boots_number,
                    room_id:this.searchParam.room_id,
                    ju:this.searchParam.ju,
                    username:this.searchParam.username,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.listLoading = true;
                //NProgress.start();
                getBetsListPage(para).then((res) => {
                    if(res.code == 200){
                        this.pagination.total = res.data.total;
                        this.bets = res.data.data;
                        this.current_total_win = 0;
                        this.current_total_jifen = 0;
                        for(var jj =0 ; jj < this.bets.length;jj++){
                            this.current_total_win += Number(this.bets[jj].win);
                            this.current_total_jifen += Number(this.bets[jj].xm);
                        }
                        this.current_total_win = this.current_total_win.toFixed(2);
                        this.current_total_jifen = this.current_total_jifen.toFixed(2);
                        if(this.bets.length){
                            this.bets.push(this.plugin.columnFilterFunc(this.bets,"uid"))
                        }
                        // this.current_total_win = res.data.current_total_win;
                        // this.current_total_jifen = res.data.current_total_jifen;
                        this.total_win = res.data.total_win;
                        this.total_jifen = res.data.total_jifen;
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
            this.getBetsLists();
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
    .el-button--primarys {
    background-color: #ff6d00;
    border-color: #ff6d00;
}
</style>
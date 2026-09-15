<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="large" :inline="true" :model="filters">
                <el-form-item label="会员ID">
                    <el-input v-model="filters.uid" placeholder="会员ID"></el-input>
                </el-form-item>

                <el-form-item label="代理账号">
                    <el-input v-model="filters.agents_account" placeholder="代理账号"></el-input>
                </el-form-item>
                <span>选择桌子: </span>
                <el-select @change="changeGroup" v-model="currentGroup.groupid" placeholder="请选择桌子">
                <el-option
                    v-for="(room,index) in rooms"
                    v-if="room.game_type != -1 && room.xstate !=0"
                    :key="index"
                    :label="room.groupname"
                    :value="room.groupid">
                </el-option>
                </el-select>
                <el-form-item style="width: 200px;margin-left: 10px;" label="开始时间">
                    <el-date-picker
                            v-model="filters.begin_time"
                            type="datetime"
                            placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item  style="width: 200px;margin-left: 100px;" label="结束时间">
                    <el-date-picker
                            v-model="filters.end_time"
                            type="datetime"
                            placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-form size="small" :inline="true" >
                <el-form-item>
                    <el-button type="primary" @click="searchWin" >查询</el-button>
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
                            <input type="hidden" :value="searchParam.level" name="level">
                            <input type="hidden" :value="searchParam.begin_time" name="begin_time">
                            <input type="hidden" :value="searchParam.end_time" name="end_time">
                           
                        </form>
                </el-form-item>

            </el-form>
        </el-col>
        <div class="lowList" v-if="lowList.length">
            <span><a @click="getLowerList()">{{plugin.getSessionItem("user","name")}}</a></span>
            <span :key="index" v-for="(item,index) in lowList"> > <a @click="getLowerList(item)">{{item.name}}</a></span>
        </div>
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="win" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="uid" label="会员ID" min-width="40"></el-table-column>
            <el-table-column prop="name" label="会员名称" min-width="130">
                <template slot-scope="scope">
                    <a v-if="scope.row.usertype ==1" style="text-decoration: underline;cursor: pointer;" @click="getLowerListClom(scope.row)">{{scope.row.name}}</a>
                    <a v-if="scope.row.usertype ==2" >{{scope.row.name}}</a>
                </template>
            </el-table-column>
            <!--
            <el-table-column prop="usertype" label="身份" min-width="30">
                <template slot-scope="scope">
                    <a v-if="scope.row.usertype ==1" style="color: red">代理</a>
                    <a v-if="scope.row.usertype ==2" >会员</a>
                </template>
            </el-table-column>
            -->
            <el-table-column prop="agents_name" label="代理名称" min-width="120"></el-table-column>
            <el-table-column prop="agents_account" label="代理账号" min-width="120" ></el-table-column>
            <el-table-column prop="score" label="会员余分" min-width="80" sortable></el-table-column>
            <el-table-column prop="xm" label="累计产生积分" min-width="120" sortable></el-table-column>
            <el-table-column prop="xm_money" label="积分已兑换额度" min-width="120" sortable></el-table-column>
            <el-table-column prop="win" label="输赢数" min-width="80" sortable>
                <template slot-scope="scope">
                    <a v-if="scope.row.win >=0" style="color: #FF9900">{{scope.row.win}}</a>
                    <a v-if="scope.row.win <0" style="color: red">{{scope.row.win}}</a>
                </template>
            </el-table-column>
          <el-table-column prop="user_zx_losewin" label="庄闲输赢" min-width="80" sortable></el-table-column> 
          <el-table-column prop="user_sb_losewin" label="四宝输赢" min-width="80" sortable></el-table-column> 
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
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>


    </section>
</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import moment from 'moment'
    import $ from 'jquery'
    import { getWinsListPage,getRoomLists } from '../../api/api';

    export default {
        data() {
            return {
                currentGroup: {
                    gameType: 0,
                    groupid: "",
                    toTime: "",
                    group: {
                    userhead:"",
                    adminname:"",
                    ai_auto_fen: 0,
                    groupid: 0,
                    xstate: 1,
                    game_type: 0,
                    groupname: "",
                    video_link:"",
                    ps_name:"",
                    ai_num: 20,
                    headimgurl:"",
                    id: 1,
                    state: 0,
                    ai_upfen: "",
                    ai_state: 0,
                    mark: "",
                    ai_time: ""
                    }
                },
                rooms:[],
                filters: {
                    uid:"",
                    agents_account:"",
                    begin_time: null,
                    end_time: null,
                    groupid:0,
                },
                searchParam:{
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
            }
        },
        methods: {
            changeGroup() {
                this.filters['groupid'] =  this.currentGroup.groupid;
                //console.log('this.currentGroup.groupid',this.currentGroup.groupid);
            },
            getRoomListsAll() {
                getRoomLists({type:1})
                    .then(res => {
                    if (res.code == 200) {
                        this.rooms = res.data.rooms;

                    } else {
                        this.$message({
                        message: res.msg,
                        type: "info"
                        });
                    }
                    })
                    .catch(res => {
                    this.$message({
                        message: res.msg,
                        type: "error"
                    });
                    });
                },
             exportExcel(){
                this.$nextTick(()=>{
                    $("#baseForm").attr("action","v1/user/userLoseWinExport").submit();
                })
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
                    groupid:this.searchParam.groupid,
                    agents_id:boss_id,
                    agents_account:this.searchParam.agents_account,
                    // boots_number:this.searchParam.boots_number,
                    // room_id:this.searchParam.room_id,
                    // ju:this.searchParam.ju,
                    uid:this.searchParam.uid,
                    level:this.searchParam.level,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.listLoading = true;
                //NProgress.start();
                getWinsListPage(para).then((res) => {
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
            this.getRoomListsAll();//获取所有房间
            this.getWinsLists();
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
<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="会员ID">
                    <el-input v-model="filters.userId" placeholder="会员ID"></el-input>
                </el-form-item>
                <el-form-item label="代理账号">
                    <el-input v-model="filters.agents_account" placeholder="代理账号"></el-input>
                </el-form-item>
                <el-form-item style="width: 260px;" label="开始时间">
                    <el-date-picker
                            v-model="filters.begin_time"
                            type="datetime"
                            placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 260px;margin-left: 35px;" label="结束时间">
                    <el-date-picker
                            v-model="filters.end_time"
                            type="datetime"
                            placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
              </el-form>
                <el-form size="small" :inline="true" >
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
                    <el-button style="font-size: 13px;font-weight: 700;"  type='success'>庄闲占成总输赢：{{ zx_share_total }}</el-button>
                </el-form-item>             
            
                <el-form-item>
                    <el-button style="font-size: 13px;font-weight: 700;margin-left: 80px;"  type='warning'>四宝占成总输赢：{{ sb_share_total }}</el-button>
                </el-form-item>
                <!--
                <el-form-item>
                    <el-button @click="goShare(-1)" :type="type ==-1 ? 'primary' : 'warning'">占成汇总</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goShare(0)" :type="type ==0 ? 'primary' : 'warning'">百家乐占成</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goShare(1)" :type="type ==1 ? 'primary' : 'warning'">龙虎占成</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goShare(2)" :type="type ==2 ? 'primary' : 'warning'">炸金花占成</el-button>
                </el-form-item>
                -->
            </el-form>
        </el-col>

        <!--总-->
        <el-table v-show="type == -1" :row-class-name="plugin.tableRowClassName" size="mini" empty-text="-"  border :data="share" highlight-current-row  v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="uid" label="会员ID" min-width="80"></el-table-column>
            <el-table-column prop="nickname" label="会员昵称" min-width="80"></el-table-column>
            <el-table-column prop="agents_account" label="代理账号" min-width="80"></el-table-column>
            <el-table-column prop="agents_name" label="代理名称" min-width="130">
               <!-- <template slot-scope="scope">
                    <a style="text-decoration: underline;cursor: pointer;" @click="getLowerList(scope.row)">{{scope.row.agents_name}}</a>
                </template>
                -->
            </el-table-column>
            <el-table-column prop="room_boots_ju" label="靴局" min-width="70" ></el-table-column>
            <el-table-column prop="odds_text" label="下注" min-width="150" ></el-table-column>
            <el-table-column prop="agents_share_rate" label="占成" min-width="60" ></el-table-column>
            <el-table-column prop="game_result_text" label="开牌结果" min-width="100" ></el-table-column>
            <el-table-column prop="win_lose" label="用户输赢" min-width="70" ></el-table-column>
            <el-table-column prop="win_lose_share" label="占成输赢" min-width="70" ></el-table-column>
            <el-table-column prop="mktime" label="时间" min-width="100" ></el-table-column>
        </el-table>
        <!--工具条-->
       <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChangeShare" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeShare" :current-page="paginationShare.current" :page-sizes="[50, 100, 300]" :page-size="paginationShare.size" :total="paginationShare.total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    import $ from 'jquery'
    import { getShareListPage } from '../../api/api';

    export default {
        data() {
            return {
                type:-1,
                filters: {
                    userId: '',
                    agents_account: '',
                    begin_time: null,
                    end_time: null,
                },
                searchParam:{
                    agents_account: '',
                    begin_time: null,
                    end_time: null
                },
                share: [],
                shares: [],
                lowList:[],
                userDatas: [],
                userData: [],
                total: 0,
                page: 1,
                tableHeight:"500",
                listLoading: false,
                detailVisibleAll: false,
                detailVisible: false,
                pagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                paginationShare:{
                    current:1,
                    size:50,
                    total:0,
                },
                zx_share_total:0,
                sb_share_total:0
                
            }
        },
        methods: {
            goShare(type){
                this.$router.push({ path: '/agent-share',query:{
                        type:type
                    } });
                this.type = type;
                this.lowList = [];
                this.pagination = {
                    current:1,
                        size:50,
                        total:0,
                };

                this.paginationShare = {
                    current:1,
                        size:50,
                        total:0,
                };
                //切换数据
                this.getShareLists(null,"self");
                this.autoTableHeight();
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
                this.paginationShare.current = 1;
                this.searchParam = this.filters;
                this.getShareLists();
            },
            handleSizeChange(val){
                this.pagination.size = val;
                this.getDetails();
            },
            handleCurrentChange(val) {
                this.pagination.current = val;
                this.getDetails();
            },
            handleSizeChangeShare(val){
                this.paginationShare.size = val;
                this.getShare();
            },
            handleCurrentChangeShare(val) {
                this.paginationShare.current = val;
                this.getShare();
            },
            handleDetail(row){
                this.userDatas = []
                for(var key in row){
                    this.userDatas.push(row[key])
                }
                this.pagination.total = this.userDatas.length
                this.getDetails();
            },
            getDetails(){
                this.userData = []
                for(var i = (this.pagination.current-1) * this.pagination.size; i < this.pagination.size * (this.pagination.current);i++ ){
                    if(this.userDatas[i]){
                        this.userData.push(this.userDatas[i])
                    }
                }
                if(this.userData.length){
                    this.userData.push(this.plugin.columnFilterFunc(this.userData,"agents_account"))
                }
                if(this.type == -1){
                    this.detailVisibleAll = true;
                }else if(this.type == 0){
                    this.detailVisible = true;
                }else if(this.type == 1){
                    this.detailVisibleLH = true;
                }else if(this.type == 2){
                    this.detailVisibleZJH = true;
                }
                this.autoTableHeight()
            },
            searchShare(){
                this.paginationShare.current = 1;
                this.searchParam = this.filters;
                this.getShareLists(null,"self");
            },
            getShare(){
                this.share = []
                for(var i = (this.paginationShare.current-1) * this.paginationShare.size; i < this.paginationShare.size * (this.paginationShare.current);i++ ){
                    if(this.shares[i]){
                        this.share.push(this.shares[i])
                    }
                }

                if(this.share.length){
                    this.share.push(this.plugin.columnFilterFunc(this.share,"uid"))
                }
                
            },
            getLowerList(row){

                if(!row){
                    this.lowList = [];
                    this.getShareLists(null,"self")
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
                    this.getShareLists(row.agents_id,null)
                }

            },
            //获取占成列表
            getShareLists(agents_id,self) {
                var boss_id  = "";
                if(agents_id){
                    boss_id = agents_id
                }else if(this.lowList.length){
                    boss_id = this.lowList[this.lowList.length-1].agents_id
                }else{
                    boss_id = util.getSessionItem("user","agents_id")
                }
                let para = {
                    userId:this.searchParam.userId,
                    agents_account:this.searchParam.agents_account,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                if(self == "self"){
                    para.cur_agents_id = boss_id
                }else{
                    para.agents_id = boss_id
                }
                para.game_type = this.type;
                this.listLoading = true;
                //NProgress.start();
                getShareListPage(para).then((res) => {
                    if(res.code == 200){
                        var data = res.data.data;
                        this.zx_share_total = res.data.zx_share_total;
                        this.sb_share_total = res.data.sb_share_total;
                        this.shares=[]
                        for(var key in data){
                            this.shares.push(data[key])
                        }
                       
                        this.paginationShare.total = this.shares.length;
                        this.getShare();
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
                this.tableHeight = $(".content-container").height() - $(".toptoolbar").height() - 120;
                    setTimeout(()=>{
                        for(var i = 0 ; i < $(".tableStyle").length;i++){
                            $(".tableStyle").eq(i).find(".is-scrolling-left").width($(".tableStyle").eq(i).find(".el-table__header").width())
                        }
                    },500)
             })
           }
        },
        mounted() {
            if (JSON.stringify(this.$route.query) != "{}") {
                this.type = this.$route.query.type;
            }
            this.getShareLists(null,"self");
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
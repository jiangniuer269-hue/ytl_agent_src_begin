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
                
                <el-form-item style="width: 250px" label="开始时间">
                    <el-date-picker
                            v-model="filters.begin_time"
                            type="datetime"
                            placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 200px;margin-left: 50px;" label="结束时间">
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
                <el-form-item>
                    <el-button type="primary" @click="exportExcel()">导出报表</el-button>
                    <iframe style="display: none;" name="baseExport"></iframe>
                        <form id="baseForm" name="baseForm" method="post" action="" target="baseExport" style="display: none;">
                            <input type="hidden" :value="searchParam.uid" name="uid">
                            <input type="hidden" :value="searchParam.agents_account" name="agents_account">                           
                            <input type="hidden" :value="searchParam.begin_time" name="begin_time">
                            <input type="hidden" :value="searchParam.end_time" name="end_time">
                           
                        </form>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table v-show="type == 0" :row-class-name="plugin.tableRowClassName"   size="mini" border :data="dc" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="agents_account" label="代理账号" min-width="80"></el-table-column>
            <el-table-column prop="agents_name" label="代理名称" min-width="110"> </el-table-column>
            <el-table-column prop="uid" label="会员ID" min-width="80" ></el-table-column>
            <el-table-column prop="nickname" label="会员昵称" min-width="80" ></el-table-column>
            <el-table-column prop="user_zx_xm_dan" label="庄闲单边洗码" min-width="90" >
            </el-table-column>
            <el-table-column prop="user_sb_xm" label="三宝洗码" min-width="90" >
            </el-table-column>
            <el-table-column prop="user_lucky_xm" label="幸运六洗码" min-width="90" >
            </el-table-column>
            <el-table-column prop="all_xm" label="总洗码" min-width="90" >
            </el-table-column>
            <el-table-column prop="mktime" label="时间" min-width="200" >
            </el-table-column>
             <el-table-column label="操作" min-width="200">
                 <template slot-scope="scope" v-if="!scope.row.countt">
                     <a style="color:#20a0ff;cursor: pointer"  size="mini" @click="handleDetail(scope.row)">查看每日洗码</a>
                 </template>
            </el-table-column>
        </el-table>

        <el-table v-show="type == 1" :row-class-name="plugin.tableRowClassName"  size="mini" border :data="dc" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="agents_account" label="代理账号" min-width="80">
            </el-table-column>
            <el-table-column prop="agents_name" label="代理名称" min-width="110">
                <template slot-scope="scope">
                    <a style="text-decoration: underline;cursor: pointer;" @click="getLowerList(scope.row)">{{scope.row.agents_name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="zhuang_bets" label="龙下注额" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="xian_bets" label="虎下注额" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="zhuang_xian_bets" label="龙虎下注额" min-width="90" sortable>
            </el-table-column>
            <el-table-column prop="he_bets" label="和下注额" min-width="90" sortable>
            </el-table-column>

            <el-table-column prop="zhuang_losewin" label="龙输赢数" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="xian_losewin" label="虎输赢数" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="he_losewin" label="和输赢数" min-width="80" sortable>
            </el-table-column>

            <el-table-column prop="total_losewin" label="总输赢数" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="zhuang_xm" label="龙洗码量(单/双)" min-width="135" sortable>
                <template slot-scope="scope">
                    {{scope.row.zhuang_xm}} / {{scope.row.shuang_zhuang_xm}}
                </template>
            </el-table-column>
            <el-table-column prop="xian_xm" label="虎洗码量(单/双)" min-width="135" sortable>
                <template slot-scope="scope">
                    {{scope.row.xian_xm}} / {{scope.row.shuang_xian_xm}}
                </template>
            </el-table-column>
            <el-table-column prop="xian_xm" label="龙虎总洗码量（单/双）" min-width="155" sortable>
                <template slot-scope="scope">
                    {{scope.row.total_zx_xm}} / {{scope.row.shuang_total_zx_xm}}
                </template>
            </el-table-column>
            <el-table-column prop="he_xm" label="和洗码量" min-width="80" sortable>
                <template slot-scope="scope">
                    {{scope.row.he_xm}}
                </template>
            </el-table-column>

        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>

               <!--详情弹框-->
        <el-dialog  :title="detailFilters.user.nickname+'-每日洗码详情'" :visible.sync="detailVisible" :close-on-click-modal="false" width="1000px">           
            <el-table  :row-class-name="plugin.tableRowClassName"  v-loading="detailLoading" size="mini" border :data="detaillogs" highlight-current-row   class="tableStyle" style="width: 100%" max-height=650>
                <el-table-column prop="uid" label="会员ID" min-width="80">
                </el-table-column>
                <el-table-column prop="nickname" label="会员名称" min-width="80">
                </el-table-column>
                <el-table-column prop="agents_account" label="代理账号" min-width="80">
                </el-table-column>
                <el-table-column prop="agents_name" label="代理名称" min-width="80">
                </el-table-column>
          <el-table-column prop="user_zx_xm_dan" label="庄闲单边洗码" min-width="90" >
            </el-table-column>
            <el-table-column prop="user_sb_xm" label="三宝洗码" min-width="90" >
            </el-table-column>
            <el-table-column prop="user_lucky_xm" label="幸运六洗码" min-width="90" >
            </el-table-column>
            <el-table-column prop="all_xm" label="总洗码" min-width="90" >
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
                <el-button @click.native="detailVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getDanXmListPage } from '../../api/api';
    import moment from 'moment'
    import $ from 'jquery'
    export default {
        data() {
            return {
                type:0,
                filters: {
                    begin_time: null,
                    end_time: null,
                    agents_account: null,
                },
                searchParam:{
                    begin_time: null,
                    end_time: null,
                    agents_account: null,
                },
                detailSearchParam: {
                    begin_time: null,
                    end_time: null,
                    uid:'',
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
                detailLoading : false,
                detailVisible: false,
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
               getDanXmListPage(para).then((res) => {
                    if(res.code == 200){
                        this.detailLoading = false;
                        this.detaillogs = res.data;
                        this.detailPagination.total = this.detaillogs.length;                    
                    }else{
                        this.$message({
                                message: res.msg,
                                type: 'info'
                        });
                         return;
                    }
                }).catch((res)=>{
                        this.$message({
                                message: res.msg,
                                type: 'error'
                        });
                        return;
                })
            },
          //导出报表
            exportExcel(){
                this.$nextTick(()=>{
                    $("#baseForm").attr("action","v1/bet/danXmExport").submit();
                })
            },
            goDc(type){
                this.$router.push({ path: '/agent-dc',query:{
                        type:type
                    } });
                this.type = type;
                this.lowList = [];
                this.pagination = {
                    current:1,
                        size:50,
                        total:0,
                };
                //切换数据
                this.getTsLists(null,"self");
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
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.searchTs()
            },
            searchTs(){
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.getTsLists();
            },
            
            handleDetail(row){
               // console.log('rowrow',row);
                this.detailVisible = true;
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

            getTLists(){
                this.dc = []
                for(var i = (this.pagination.current-1) * this.pagination.size; i < this.pagination.size * (this.pagination.current);i++ ){
                    if(this.dcs[i]){
                        this.dc.push(this.dcs[i])
                    }              
                }
                if(this.dc.length){
                    this.dc.push(this.plugin.columnFilterFunc(this.dc,"agents_account"))
                }
                
            },
            handleSizeChange(val){
                this.pagination.size = val;
                this.getTLists();
            },
            handleCurrentChange(val){
                this.pagination.current = val;
                this.getTLists();
            },
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
                    // pageNumber:this.pagination.current,
                    agents_account:this.searchParam.agents_account,
                    uid:this.searchParam.uid,
                    agents_id:boss_id,
                    // boots_number:this.searchParam.boots_number,
                    // room_id:this.searchParam.room_id,
                    // ju:this.searchParam.ju,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.listLoading = true;
                para.game_type = this.type;
                //NProgress.start();
                getDanXmListPage(para).then((res) => {
                    if(res.code == 200){
                       var data = res.data;
                        this.dcs=[]
                        for(var key in data){
                            this.dcs.push(data[key])
                        }
                        this.pagination.total = this.dcs.length;
                        this.listLoading = false;
                        this.getTLists()
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
                    },2000)
             })
           }
        },
        mounted() {
            if (JSON.stringify(this.$route.query) != "{}") {
                this.type = this.$route.query.type;
            }
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
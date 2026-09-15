<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
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
                <el-form-item style="width: 260px" label="结束时间">
                    <el-date-picker
                            v-model="filters.end_time"
                            type="datetime"
                            placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
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
            </el-form>
        </el-col>
        <div class="lowList" v-if="lowList.length">
            <span><a @click="getLowerList()">首页</a></span>
            <span :key="index" v-for="(item,index) in lowList"> > <a @click="getLowerList(item)">{{item.name}}</a></span>
        </div>
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"    size="mini" border :data="dc" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="agents_account" label="代理账号" min-width="80">
            </el-table-column>
            <el-table-column prop="agents_name" label="代理名称" min-width="110">
                <template slot-scope="scope">
                    <a style="text-decoration: underline;cursor: pointer;" @click="getLowerList(scope.row)">{{scope.row.agents_name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="user_losewin" label="会员输赢数" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="zhuang_losewin" label="对冲后庄输赢数" min-width="120" sortable>
            </el-table-column>
            <el-table-column prop="xian_losewin" label="对冲后闲输赢数" min-width="120" sortable>
            </el-table-column>
            <el-table-column prop="sb_losewin" label="四宝输赢数" min-width="90" sortable>
            </el-table-column>
            <el-table-column prop="agents_losewin" label="对冲后龙输赢数" min-width="120" sortable>
            </el-table-column>
            <el-table-column prop="agents_losewin" label="对冲后虎输赢数" min-width="120" sortable>
            </el-table-column>
            <el-table-column prop="agents_losewin" label="对冲后输赢总数" min-width="120" sortable>
            </el-table-column>
            <el-table-column prop="zts" label="退水总额" min-width="100" sortable>
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
    import { getTsListPage } from '../../api/api';
    import moment from 'moment'
    import $ from 'jquery'
    export default {
        data() {
            return {
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
                dcs: [],
                dc: [],
                tableHeight:"500",
                tsUser:"",
                tsdetail:[],
                lowList:[],
                tsdetails:[],
                listLoading: false,
                listDetailLoading: false,
                detailVisible: false,
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
                this.searchTs()
            },
            searchTs(){
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.getTsLists();
            },

            handleSizeChange(val){
                this.pagination.size = val;
                this.getTLists();
            },
            handleCurrentChange(val){
                this.pagination.current = val;
                this.getTLists();
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
            getLowerList(row){

                if(!row){
                    this.lowList = [];
                    this.getTsLists(null,"self")
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
                    this.getTsLists(row.agents_id,null)
                }

            },
            //获取下注列表
            getTsLists(agents_id,self) {
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
                    // agents_id:boss_id,
                    // boots_number:this.searchParam.boots_number,
                    // room_id:this.searchParam.room_id,
                    // ju:this.searchParam.ju,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                };
                if(self == "self"){
                    para.cur_agents_id = boss_id
                }else{
                    para.agents_id = boss_id
                }
                this.listLoading = true;
                //NProgress.start();
                getTsListPage(para).then((res) => {
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
                    },500)
                })
            }
        },
        mounted() {
            this.getTsLists(null,"self");
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
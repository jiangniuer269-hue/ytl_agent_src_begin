<template>
    <section>
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="win" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            
            <el-table-column prop="uid" label="会员ID" min-width="40">
            </el-table-column>
            <el-table-column prop="name" label="会员名称" min-width="130">
            </el-table-column>
            <el-table-column prop="agents_account" label="代理账号" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="agents_name" label="代理名称" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="usertype" label="身份" min-width="30">
                <template slot-scope="scope">
                    <a v-if="scope.row.usertype ==1" style="color: red">代理</a>
                    <a v-if="scope.row.usertype ==2" >会员</a>
                </template>
            </el-table-column>
            <el-table-column prop="relation_link" label="代理关系" min-width="260">
            </el-table-column>
            <!-- <el-table-column prop="level" label="层级" min-width="60">
            </el-table-column> -->
            <el-table-column prop="score" label="会员余分" min-width="80" sortable>
            </el-table-column>

            <el-table-column prop="xm" label="累计产生积分" min-width="100" sortable>
            </el-table-column>
            <!-- <el-table-column prop="win" label="输赢" min-width="" sortable>
            </el-table-column> -->
            <el-table-column prop="xm_money" label="积分已兑换额度" min-width="120" sortable>
            </el-table-column>
            <el-table-column prop="win" label="输赢数" min-width="70" sortable>
                <template slot-scope="scope">
                    <a v-if="scope.row.win >=0" style="color: #FF9900">{{scope.row.win}}</a>
                    <a v-if="scope.row.win <0" style="color: red">{{scope.row.win}}</a>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="extra_share_score" label="抽水额度" min-width="80" sortable>
            </el-table-column> -->
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
    import { getWinsListPage } from '../../api/api';

    export default {
        props:['win','pagination','agents_id'],
        data() {
            return {
                filters: {
                    uid:"",
                    level:"",
                    begin_time: null,
                    end_time: null,
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
                // win: [],
                listLoading: false,
                // pagination:{
                //     current:1,
                //     size:50,
                //     total:0,
                // },
            }
        },
        methods: {
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
            
            handleSizeChange(val){
                this.pagination.size = val;
                this.$emit("getusers",this.agents_id)
            },
            handleCurrentChange(val){
                this.pagination.current = val;
                this.$emit("getusers",this.agents_id)
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
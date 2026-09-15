<template>
    <section>
         <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="操作人账号">
                    <el-input v-model="filters.deal_account" placeholder="操作人账号"></el-input>
                </el-form-item>
                <el-form-item label="被操作人账号">
                    <el-input v-model="filters.be_deal_account" placeholder="被操作人账号"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="filters.type" placeholder="全部" style="width: 135px;">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 15px;">
                    <el-button type="primary" @click="searchLog">查询</el-button>
                </el-form-item>
                <!--
                <el-form-item style="margin-right: 15px;">
                    <el-button type="primary" @click="clearSystemLog">清空操作日志</el-button>
                </el-form-item>
                -->
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName" class="tableStyle" size="mini" border :data="logs" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="deal_account" label="操作人账号" min-width="80">
            </el-table-column>
            <el-table-column prop="be_deal_account" label="被操作人账号" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="type" label="类型" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="note" label="日志" min-width="240">
            </el-table-column>
            <!--<el-table-column prop="ip" label="IP" min-width="100">
            </el-table-column>-->
            <el-table-column prop="mktime" label="时间" min-width="120">
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
    import moment from 'moment'
    //import NProgress from 'nprogress'
    import { getLogListPage ,doClearSystemLog} from '../../api/api';

    export default {
        data() {
            return {
                agent_type:util.getSessionItem('user','agent_type'),
                options:[
                      {label:'全部',value:-1},
                      {label:'修改占成比例',value:3},
                      {label:'修改会员昵称',value:4},
                      {label:'修改密码',value:5},
                      {label:'牌局修改路单',value:21},
                      {label:'牌局重新结算',value:22},
                      {label:'上分',value:6},
                      {label:'下分',value:7},
                      {label:'下积分',value:8},
                      {label:'设为游客',value:10},
                      {label:'设为会员',value:11},
                      {label:'结算码粮',value:12},
                      {label:'操作输赢归零',value:13},
                      {label:'修改代理名称',value:14},
                      {label:'修改代理上级',value:15},
                      {label:'重置会员密码',value:16},
                      {label:'修改会员直属代理',value:17},
                    ],
                filters:{
                    deal_account:"",
                    be_deal_account:"",
                    type :'',
                },
                searchParam:{
                    deal_account:"",
                    be_deal_account:"",
                    type :-1,
                },
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
            //清空操作日志按钮
            clearSystemLog(){
                if(this.agent_type != 2){
                    this.$message({
                            message: '请登录主管账号操作。',
                            type: 'error'
                    });
                    return;
                } 
             //先操作ws
                this.$confirm(
                    "操作日志清空后将不可恢复，确定清空吗?",
                    "提示",
                    {
                    type: "warning"
                    }
                ).then(() => {
                    this.$root.Event.$emit("showWindowsLoading")     
                    doClearSystemLog().then((res) => {
                        if(res.code == 200){
                            this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                            this.$root.Event.$emit("hideWindowsLoading")
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
                                return;
                    })      
                });
            },

            searchLog(){  
                this.pagination.current = 1;
                this.searchParam = this.filters;
                this.getLogLists();
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
            getLogLists() {
                let para = {
                    pageNumber:this.pagination.current,
                    pageSize:this.pagination.size,
                    deal_account:this.searchParam.deal_account,
                    be_deal_account:this.searchParam.be_deal_account,
                    type :this.searchParam.type,
                };
                this.listLoading = true;
                //NProgress.start();
                getLogListPage(para).then((res) => {
                    if(res.code == 200){
                        this.pagination.total = res.data.total;
                        this.logs = res.data.data;
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
                            return;
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
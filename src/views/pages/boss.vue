<template>
    <section>
        
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"  size="mini" border :data="logs" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="domain" label="群名称" min-width="80">
            </el-table-column>
             <el-table-column prop="account" label="总代理账号" min-width="80">
            </el-table-column>
            <el-table-column prop="agent_score" label="总代理余分" min-width="100">
            </el-table-column>
            <el-table-column label="操作" min-width="100">
                 <template slot-scope="scope">
                        <a style="color: #20a0ff;cursor: pointer" size="mini" @click="handleFen(scope.row,1)">上分</a>
                 </template>
            </el-table-column>
        </el-table>

         <!--上下分弹框-->
        <el-dialog  :title="fenFilters.user.name+'-'+ (fenFilters.type == 1 ? '上分':'下分')" :visible.sync="fenVisible" :close-on-click-modal="false" width="1000px">

            <el-form size="small" :inline="true" class="demo-form-inline">
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                    <table :row-class-name="plugin.tableRowClassName" max-height="500"  cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="代理名称">
                                    <el-input readonly v-model="fenFilters.yufen.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                 <el-form-item style="margin:0px 5px;" label="代理账号">
                                    <el-input readonly v-model="fenFilters.yufen.account" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                           
                        </tr>
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="当前额度">
                                    <el-input readonly v-model="fenFilters.yufen.agent_score" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                               <el-form-item style="margin:0px 5px;" :label="fenFilters.type == 1 ? '增加额度':'减少额度'">
                                   <el-input   v-model="money2Fen"></el-input>
                               </el-form-item>
                           </td>
                        </tr>
                        
                    </table>
                </div>
          </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmitFen(fenFilters.type)">提交</el-button>
                <el-button @click.native="fenVisible = false">关闭</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    //import NProgress from 'nprogress'
    import { getBossList,getGroupAgentUpdowinfo,groupupDowFenAgent } from '../../api/api';

    export default {
        data() {
            return {
                
                logs: [],
                listLoading: false,
                fenFilters : {
                    user:"",
                    type:"",
                    value:"",
                    yufen:"",
                    db:"",
                },
                money2Fen:"",
                fenVisible:false,
                handleFenLock:false,
            }
        },
        methods: {
            handleDelete(row){
                this.$confirm('确认禁用['+row.domain+']吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    deleteDomain({id:row.id}).then((res) => {
                    if(res.code == 200){
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
                })
                })
            },
            //获取操作列表
            getLogLists() {
                this.listLoading = true;
                //NProgress.start();
                getBossList().then((res) => {
                    if(res.code == 200){
                        this.logs = res.data;
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
            handleFen(row,type){
                this.fenFilters = {
                    user:row,
                    type:type,
                    value:"",
                    yufen:"",
                    db:row.database,
                }
                this.fenVisible = true;
                getGroupAgentUpdowinfo({
                    agents_id:row.agents_id,
                    db:row.database
                }).then(res =>{
                    if(res.code == 200){
                        this.fenFilters.yufen = res.data.agents_score
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'info'
                        });
                    }
                }).catch((res)=>{
                    this.addLoading = false;
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                })
            },
            onSubmitFen(){
                if(this.handleFenLock){
                    this.$message({
                            message: "请勿重复操作",
                            type: 'error'
                        });
                        return;
                }
                if(this.money2Fen == ''){
                    this.$message({
                            message: "请填写额度",
                            type: 'error'
                        });
                        return;
                }
                var reg = /^\d+(\.\d+)?$/
                if(!reg.test(this.money2Fen)){
                    this.$message({
                            message: "请输入正确的金额",
                            type: 'error'
                        });
                        return;
                }
               
                var typename = this.fenFilters.type == 1 ? '上分': '下分';

                 this.$confirm('确认'+typename+'吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    let para = {
                    agents_id:this.fenFilters.user.agents_id,
                    fen:this.money2Fen,
                    doType:this.fenFilters.type,
                    db:this.fenFilters.db,
                    do_agent_account:util.getSessionItem('user','account')
                    };
                    this.handleFenLock = true;//加锁
                    groupupDowFenAgent(para).then((res) => {
                         this.money2Fen = 0;
                        if(res.code == 200){
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            
                            this.editItems = [];
                            this.editItems.push(this.fenFilters.user.agents_id);
                            
                            this.fenVisible = false;
                            this.getLogLists();
                            this.handleFenLock = false;//解锁
                        }else{
                            this.handleFenLock = false;//解锁
                            this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                        }
                    }).catch((res)=>{
                        this.handleFenLock = false;//解锁
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                     })
                })
                
            },
        },
        mounted() {
            this.getLogLists();
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
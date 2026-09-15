<template>
    <section>
        
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"  size="mini" border :data="logs" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="ID" min-width="80">
            </el-table-column>
            <el-table-column prop="domain" label="域名" min-width="100">
            </el-table-column>
            <el-table-column label="操作" min-width="100">
                 <template slot-scope="scope">
                     <a style="color:red;cursor: pointer"  size="mini" @click="handleDelete(scope.row)">禁用</a>
                 </template>
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    //import NProgress from 'nprogress'
    import { getDomain,deleteDomain } from '../../api/api';

    export default {
        data() {
            return {
                
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
                getDomain().then((res) => {
                    if(res.code == 200){
                        this.logs = res.data.list;
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
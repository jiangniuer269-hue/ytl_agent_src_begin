<template>
    <section>
         <div class="page-container">
        <!--列表-->
        <el-table  :row-class-name="plugin.tableRowClassName" border  size="mini"  :data="logs" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;margin-top: 10px;">
            <el-table-column prop="groupid" label="房间ID" min-width="80">
            </el-table-column>
            <el-table-column prop="groupname" label="房间名称" min-width="80">
            </el-table-column>
            <el-table-column prop="mark" label="台号" min-width="80">
            </el-table-column>
            <el-table-column prop="game_type" label="类型" min-width="80">
                <template slot-scope="scope">
                        <a size="small" v-if="scope.row.game_type == -1">大厅</a>
                        <a size="small" v-if="scope.row.game_type == 0">百家乐</a>
                        <a size="small" v-if="scope.row.game_type == 1">龙虎</a>
                        <a size="small" v-if="scope.row.game_type == 2">炸金花</a>
                        <a size="small" v-if="scope.row.game_type == 3">牛牛</a>
                    </template>
            </el-table-column>
            <el-table-column prop="xstate" label="状态" min-width="80">
                <template slot-scope="scope">
                        <a size="small" class="qiyong" v-if="scope.row.xstate == 1">正常</a>
                        <a size="small" class="jinyong" v-if="scope.row.xstate == 0">休场</a>
                    </template>
            </el-table-column>
            <!--
            <el-table-column prop="state" label="显示" min-width="80">
                <template slot-scope="scope">
                        <a size="small" class="qiyong" v-if="scope.row.state == 0">正常</a>
                        <a size="small"  class="xiangqing" v-if="scope.row.state == 1">下架</a>
                    </template>
            </el-table-column>
            --> 
            <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
            
                        <a v-if="scope.row.xstate == 0" class="xiangqing" size="mini" @click="operaRoom(scope.row,1)">取消休场</a>
                   
                        <a v-if="scope.row.xstate == 1" class="xiangqing" size="mini" @click="operaRoom(scope.row,0)">休场</a>
             
                    <!--
                        <a v-if="scope.row.state == 1" class="jinyong" size="mini" @click="operaRoom(scope.row,2)">取消下架</a>
                    
                        <a v-if="scope.row.state == 0" class="jinyong" size="mini" @click="operaRoom(scope.row,3)">下架</a>
                    -->
                </template>
            </el-table-column>
        </el-table>
    </div>
    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    //import NProgress from 'nprogress'
    import { getRoomLists } from '../../api/api';

    export default {
        data() {
            return {
                
                logs: [],
                listLoading: false,
            }
        },
        methods: {
            operaRoom(row,type){
                var tip = "";
                if(type == 1){
                    tip = "取消休场";
                }else if(type == 0){
                    tip = "休场";
                }else if(type == 2){
                    tip = "取消下架";
                }else if(type == 3){
                    tip = "下架";
                }
                this.$confirm('确认操作房间['+row.groupname+']'+tip+'？', '提示', {}).then(() => {
                        this.$store.getters.imClient.bindRoomOpera(this.onRoomOpera);
                        if(type == 0 || type == 1){
                            this.$store.getters.imClient.send(JSON.stringify({
                                "cmd": 4010,
                                "groupid": row.groupid || 73,
                                'xstate': type,
                            }))
                        }else if(type == 2 || type == 3){
                            this.$store.getters.imClient.send(JSON.stringify({
                                "cmd": 4010,
                                "groupid": row.groupid || 73,
                                'state': type % 2
                                }))
                        }
                }).catch((res) => {

                });
            },
            onRoomOpera(data){
                this.getLogLists();
            },
            //获取操作列表
            getLogLists() {
            
                this.listLoading = true;
                //NProgress.start();
                getRoomLists({type:1}).then((res) => {
                    if(res.code == 200){
                        this.logs = res.data.rooms;
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
        th {

         }
    }
</style>
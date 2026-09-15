<template>
    <section>
      <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition" style="margin-top:20px;">
          <el-form size="mini" >
                    <table  cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="代理名称:">
                                    {{agentsInfo.name}}
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label="登录账号:">
                                    {{agentsInfo.account}}
                                </el-form-item>
                            </td>
                            <td>
                                
                            </td>
                        </tr>
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px" label="洗码类型:">
                                    <a v-if="agentsInfo.xm_type == 1">单边洗码</a>
                                    <a v-if="agentsInfo.xm_type == 2">双边洗码</a>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label-width="100" label="庄闲洗码率:">
                                    {{agentsInfo.xm_rate}}%
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label-width="100" label="庄闲占成率:">
                                    {{agentsInfo.share_rate}}%
                                </el-form-item>
                            </td>
                        </tr>
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label-width="100" label="四宝洗码率:">
                                    {{agentsInfo.sb_xm_rate}}%
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label-width="100" label="四宝占成率:">
                                     {{agentsInfo.sb_share_rate}}%                                   
                                </el-form-item>
                            </td>
                        </tr>
                    </table>
          </el-form>
                </div>
    </section>
</template>
<script>
    import util from '../../common/js/util'

    import { getAgentsInfo } from '../../api/api';

    export default {
        data() {
            return {
                agentsInfo:{},
            }
        },
        methods: {
            //获取操作列表
            getLists() {
                let para = {
                    agents_id:util.getSessionItem('user','agents_id'),
                };
                this.listLoading = true;
                //NProgress.start();
                getAgentsInfo(para).then((res) => {
                    if(res.code == 200){
                        this.agentsInfo = res.data;
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
            this.getLists();
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
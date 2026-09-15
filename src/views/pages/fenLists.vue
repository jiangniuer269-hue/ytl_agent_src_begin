<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item label="会员ID">
                    <el-input v-model="filters.uid" placeholder="会员ID"></el-input>
                </el-form-item>
                <el-form-item style="width: 260px" label="开始时间">
                    <el-date-picker
                            v-model="filters.begin_time"
                            type="date"
                            placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 260px" label="结束时间">
                    <el-date-picker
                            v-model="filters.end_time"
                            type="date"
                            placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="数据类型">
                    <el-select v-model="dataType" placeholder="请选择">
                        <el-option label="全部分类" value="0"></el-option>
                        <el-option label="积分兑换" value="100"></el-option>
                        <el-option label="后台上分" value="11"></el-option>
                        <el-option label="后台下分" value="12"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                    <el-button type="primary" v-on:click="getUsers">导出报表</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" class="toolbar" style="">
            <el-button type="primary" v-on:click="jiesuan(0)">积分兑换总额：12131</el-button>
            <el-button type="primary" v-on:click="jiesuan(1)">清零</el-button>
        </el-col>

        <!--列表-->
        <el-table :data="fens" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="id" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="uid" label="会员ID" width="" sortable>
            </el-table-column>
            <el-table-column prop="name" label="昵称" width="" sortable>
            </el-table-column>
            <el-table-column prop="type" label="上下分" width="" sortable>
                <template slot-scope="scope">
                    <a size="small" v-if="scope.row.type == 11">上分</a>
                    <a size="small" v-if="scope.row.type == 12">下分</a>
                </template>
            </el-table-column>
            <el-table-column prop="money_change" label="上下分金额" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="money" label="余分" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="time" label="操作时间" min-width="100" sortable>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>


        <!--修改密码界面-->
        <el-dialog title="验证密码" v-model="checkPwdVisible" :close-on-click-modal="false">
            <el-form :model="checkPwdForm" label-width="120px" :rules="checkPwdFormRules" ref="checkForm">
                <el-form-item label="密码" prop="name">
                    <el-input v-model="checkPwdForm.name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="checkPwdVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确认</el-button>
            </div>
        </el-dialog>


    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    //import NProgress from 'nprogress'
    import { getFenListPage } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    username: '',
                    uid: '',
                    begin_time: '',
                    end_time: '',
                },
                pagination:{
                    current:1,
                    size:20,
                    total:20,
                },
                fens: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                dataType: "0",
                checkPwdVisible:false,
                checkPwdForm:{
                    name:"",
                },
                checkPwdFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
            }
        },
        methods: {
            jiesuan(type){
                this.checkPwdVisible = true;
                this.checkPwdForm = {
                    name:"",
                }
            },
            //获取用户列表
            getFensList() {
                let para = {
                    pageNumber:this.pagination.current,
                    pageSize:this.pagination.size,
                    agents_id:util.getSessionItem('user','agents_id'),
                };
                this.listLoading = true;
                //NProgress.start();
                getFenListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.fens = res.data.data;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
        },
        mounted() {
            this.getFensList();
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
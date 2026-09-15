<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item label="会员ID">
                    <el-input v-model="filters.uid" placeholder="会员ID"></el-input>
                </el-form-item>
                <el-form-item label="数据类型">
                    <el-select v-model="dataType" placeholder="请选择">
                        <el-option label="全部分类" value="0"></el-option>
                        <el-option label="增加积分" value="1"></el-option>
                        <el-option label="提取积分" value="2"></el-option>
                    </el-select>
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
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="name" label="会员ID" width="" sortable>
            </el-table-column>
            <el-table-column prop="sex" label="昵称" width="">
            </el-table-column>
            <el-table-column prop="age" label="下注金额" width="" sortable>
            </el-table-column>
            <el-table-column prop="birth" label="兑换比例" width="" sortable>
            </el-table-column>
            <el-table-column prop="addr" label="产生的积分" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="addr" label="牌局ID" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="addr" label="时间" min-width="100" sortable>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>


    </section>
</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    username: '',
                    uid: '',
                    begin_time: '',
                    end_time: '',
                },
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                dataType: "0",
            }
        },
        methods: {
            //获取用户列表
            getUsers() {
                let para = {
                    page: this.page,
                    name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getUserListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.users = res.data.users;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
        },
        mounted() {
            this.getUsers();
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
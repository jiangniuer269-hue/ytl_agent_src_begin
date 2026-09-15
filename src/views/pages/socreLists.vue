<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item label="会员ID">
                    <el-input v-model="filters.uid" placeholder="会员ID"></el-input>
                </el-form-item>
                <el-form-item label="牌局ID">
                    <el-input v-model="filters.username" placeholder="牌局ID"></el-input>
                </el-form-item>
                <el-form-item label="数据类型">
                    <el-select v-model="dataType" placeholder="请选择">
                        <el-option label="全部分类" value="0"></el-option>
                        <el-option label="庄注" value="1"></el-option>
                        <el-option label="闲注" value="2"></el-option>
                        <el-option label="和注" value="3"></el-option>
                        <el-option label="庄对" value="4"></el-option>
                        <el-option label="闲对" value="5"></el-option>
                        <el-option label="上分" value="11"></el-option>
                        <el-option label="下分" value="12"></el-option>
                        <el-option label="下分删除" value="13"></el-option>
                        <el-option label="手动上分" value="20"></el-option>
                        <el-option label="手动下分" value="21"></el-option>
                        <el-option label="码粮结算" value="100"></el-option>
                        <el-option label="取消下注" value="110"></el-option>
                        <el-option label="牌局结算" value="111"></el-option>
                        <el-option label="重新结算" value="121"></el-option>
                        <el-option label="领取红包" value="122"></el-option>
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
        <el-table :data="score" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="id" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="uid" label="会员ID" width="" sortable>
            </el-table-column>
            <el-table-column prop="name" label="昵称" width="">
            </el-table-column>
            <el-table-column prop="score" label="操作前余分" width="" sortable>
            </el-table-column>
            <el-table-column prop="score_change" label="变化的分" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="score_after" label="操作后的分" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="type" label="类型" min-width="100" sortable>
                <template slot-scope="scope">
                    <a size="small" v-if="scope.row.type == 1">庄注</a>
                    <a size="small" v-if="scope.row.type == 2">闲注</a>
                    <a size="small" v-if="scope.row.type == 3">和注</a>
                    <a size="small" v-if="scope.row.type == 4">庄对</a>
                    <a size="small" v-if="scope.row.type == 5">闲对</a>
                    <a size="small" v-if="scope.row.type == 11">上分</a>
                    <a size="small" v-if="scope.row.type == 12">下分</a>
                    <a size="small" v-if="scope.row.type == 13">下分删除</a>
                    <a size="small" v-if="scope.row.type == 20">手动上分</a>
                    <a size="small" v-if="scope.row.type == 21">手动下分</a>
                    <a size="small" v-if="scope.row.type == 100">码粮结算</a>
                    <a size="small" v-if="scope.row.type == 110">取消下注</a>
                    <a size="small" v-if="scope.row.type == 111">牌局结算</a>
                    <a size="small" v-if="scope.row.type == 121">重新结算</a>
                    <a size="small" v-if="scope.row.type == 122">领取红包</a>
                </template>
            </el-table-column>
            <el-table-column prop="card_game_id" label="牌局ID" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="time" label="时间" width="" sortable>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>


    </section>
</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getScoreListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

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
                score: [],
                total: 0,
                page: 1,
                listLoading: false,

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                dataType: "0",
            }
        },
        methods: {
            //获取用户列表
            getScoreList() {
                let para = {
                    pageNumber:this.pagination.current,
                    pageSize:this.pagination.size,
                    agents_id:util.getSessionItem('user','agents_id'),
                };
                this.listLoading = true;
                getScoreListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.score = res.data.data;
                    this.listLoading = false;
                });
            },
        },
        mounted() {
            this.getScoreList();
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
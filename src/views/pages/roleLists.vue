<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增角色</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="name" label="角色名" width="" sortable>
            </el-table-column>
            <el-table-column prop="sex" label="角色等级" width="">
            </el-table-column>
            <el-table-column prop="age" label="会员列表" width="" sortable>
            </el-table-column>
            <el-table-column prop="birth" label="描述" width="" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog :title="addRole ? '添加角色':'编辑角色'" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item
                        label="角色等级"
                        prop="name"
                        :rules="[
                  { required: true, message: '角色等级不能为空'},
                  { type: 'number', message: '角色等级必须为数字值'}
                ]"
                            >
                    <el-input type="age" v-model.number="addForm.age" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="name">
                    <el-input v-model="addForm.name" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="角色权限">
                    <div v-for="(item,index) in isIndeterminate">
                        <el-checkbox :indeterminate="isIndeterminate[index]" v-model="checkAll[index]" @change="handleCheckAllChange(index,checkAll[index])">{{rolepowerTitle[index]}}</el-checkbox>
                        <el-checkbox-group style="border-bottom: 1px solid #ccc;" v-model="rolepower[index]" @change="handleCheckedCitiesChange(index,rolepower[index])">
                            <el-checkbox v-for="power in powers[index]" :label="power" :key="power">{{power}}</el-checkbox>
                        </el-checkbox-group>
                    </div>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

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
                addRole:true,
                addFormVisible: false,//编辑界面是否显示
                editFormVisible: false,//编辑界面是否显示
                //新增界面数据
                addForm: {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },
                addFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                addLoading: false,
                editLoading: false,

                checkAll: [false,false,false,false,false,false,false,false,false,false],
                rolepowerTitle: ["系统管理","码粮管理","运营管理","代理管理","积分管理","余分管理","下注管理","上下分管理","牌局管理","会员管理"],
                rolepower: [[],[],[],[],[],[],[],[],[],[]],
                powers: [
                    ["牌局密码设置"],
                    ["一键清积分"],
                    ["累计统计","按天统计"],
                    ["代理列表","角色管理"],
                    ["积分流水","积分列表"],
                    ["余分流水"],
                    ["下注列表"],
                    ["上下分列表"],
                    ["牌局列表"],
                    ["会员列表"],
                ],
                isIndeterminate: [true,true,true,true,true,true,true,true,true,true]

            }
        },
        methods: {
            handleCheckAllChange(type,val) {
                this.rolepower[type] = val ? this.powers[type] : [];
                this.isIndeterminate[type] = false;
                this.$forceUpdate()
            },
            handleCheckedCitiesChange(type,value) {
                let checkedCount = value.length;
                this.checkAll[type] = checkedCount === this.powers[type].length;
                this.isIndeterminate[type] = checkedCount > 0 && checkedCount < this.powers[type].length;
                this.$forceUpdate()
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.addRole = false;
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                };
            },
            //显示新增界面
            handleAdd: function () {
                this.addRole = true;
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                };
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
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
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

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
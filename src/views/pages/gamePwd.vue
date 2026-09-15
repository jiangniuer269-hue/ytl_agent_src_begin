<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item label="新密码">
                    <el-input v-model="filters.uid" placeholder="新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码">
                    <el-input v-model="filters.uid" placeholder="确认新密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">确定</el-button>
                </el-form-item>
            </el-form>
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
            }
        },
        methods: {},
        mounted() {

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
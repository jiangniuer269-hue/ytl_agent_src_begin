<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form ref="changePwdForm" size="small" label-width="120px" :model="filters" :rules="formRules" >
                <el-form-item  label="原密码" prop="oldpassword">
                    <el-input type="password"  style="width: 200px;" v-model="filters.oldpassword" placeholder="原密码"></el-input>
                </el-form-item><br>
                <el-form-item label="新密码" prop="newpassword1">
                    <el-input type="password" style="width: 200px;" v-model="filters.newpassword1" placeholder="新密码"></el-input>
                </el-form-item><br>
                <el-form-item label="确认新密码" prop="newpassword2">
                    <el-input type="password" style="width: 200px;" v-model="filters.newpassword2" placeholder="确认新密码"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 20px;">
                    <el-button type="primary" @click="changePwd">修改</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </section>
</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { changePwd } from '../../api/api';

    export default {
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.filters.newpassword1) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                formRules: {
                    oldpassword: [
                        { required: true, message: '请输入原密码', trigger: 'blur' }
                    ],
                    newpassword1: [
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                    ],
                    newpassword2: [
                        { required: true, message: '请重复新密码', trigger: 'blur' },
                        {validator: validatePass2,}
                    ]
                },
                filters: {
                    agents_id: util.getSessionItem('user','agents_id'),
                    oldpassword: '',
                    newpassword1: '',
                    newpassword2: '',
                },
            }
        },
        methods: {
            changePwd(){
                this.$refs['changePwdForm'].validate((valid) => {
                    if (valid) {
                        changePwd(this.filters).then((res) => {
                            this.listLoading = false;
                            if(res.code == 200){
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
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
                    } else {
                        return false
                    }
                })
            },
        },
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
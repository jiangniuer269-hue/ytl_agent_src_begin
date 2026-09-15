<template>
    <section>
         <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true">
                <el-form-item>
                    <el-button @click="opentiaobanset" type="primary">新建跳板配置</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"  size="mini" border :data="logs" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="title" label="名称" min-width="80">
            </el-table-column>
            <el-table-column prop="ws" label="ws地址" min-width="100">
            </el-table-column>
            <el-table-column prop="domains" label="业务域名" min-width="100">
            </el-table-column>
             <el-table-column prop="status" label="状态" min-width="100">
                  <template slot-scope="scope">
                    <a style="color: rgb(32, 160, 255);" v-if="scope.row.status == 0">当前使用</a>
                    <a  style="color: rgb(0, 200, 83);"  v-if="scope.row.status == 1">未使用</a>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
                 <template slot-scope="scope">
                     <a style="color: rgb(32, 160, 255);cursor: pointer"  size="mini" @click="handleApp(scope.row)">应用</a>
                     <a style="color: rgb(0, 200, 83);cursor: pointer"  size="mini" @click="handleEdit(scope.row)">编辑</a>
                     <a style="color:red;cursor: pointer"  size="mini" @click="handleDelete(scope.row)">删除</a>
                 </template>
            </el-table-column>
        </el-table>

        <!--新建跳板配置-->
        <el-dialog title="新建跳板配置" :visible.sync="tiaobanVis" :close-on-click-modal="false" width="700px">

          <el-form size="small" label-width="120px" class="demo-form-inline">
              <el-form-item label="跳板机名称" prop="title">
                <el-input v-model="title" placeholder="跳板机名称"></el-input>
              </el-form-item> 

              <el-form-item label="ws地址" prop="ws">
                <el-input v-model="ws" placeholder="ws地址"></el-input>
              </el-form-item> 
               <el-form-item label="业务域名" prop="domains">
                <el-input type="textarea" v-model="domains" placeholder="业务域名"></el-input>
                (使用+隔开每个业务域名，例子: a.com+b.com)
              </el-form-item> 
          </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDomains">提交</el-button>
                <el-button @click.native="tiaobanVis = false">关闭</el-button>
            </div>
        </el-dialog>

        <!--编辑跳板配置-->
        <el-dialog title="编辑跳板配置" :visible.sync="tiaobanVisedit" :close-on-click-modal="false" width="700px">

          <el-form size="small" label-width="120px" class="demo-form-inline">
              <el-form-item label="跳板机名称" prop="title">
                <el-input v-model="title" placeholder="跳板机名称"></el-input>
              </el-form-item> 

              <el-form-item label="ws地址" prop="ws">
                <el-input v-model="ws" placeholder="ws地址"></el-input>
              </el-form-item> 
               <el-form-item label="业务域名" prop="domains">
                <el-input type="textarea" v-model="domains" placeholder="业务域名"></el-input>
                (使用+隔开每个业务域名，例子: a.com+b.com)
              </el-form-item> 
          </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDomainsedit">提交</el-button>
                <el-button @click.native="tiaobanVisedit = false">关闭</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    //import NProgress from 'nprogress'
    import { setdomains,getDomainset,deleteDomainset,appDomainset } from '../../api/api';

    export default {
        data() {
            return {
                eid:"",
                title:"",
                ws:"",
                domains:"",
                tiaobanVisedit:false,
                tiaobanVis:false,
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
            handleApp(row){
                this.$confirm('确认切换到跳板['+row.title+']吗?', '提示', {
                    type: 'info'
                    }).then(() => {
                        appDomainset({id:row.id}).then((res) => {
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
            submitDomainsedit(){
                if(this.title == ""){
                    this.$message({
                        message: "请填写跳板机名称。",
                        type: 'error'
                    });
                    return;
                }
                if(this.ws == "" && this.domains == ""){
                    this.$message({
                        message: "请填写表单再点击提交。",
                        type: 'error'
                    });
                    return;
                }
                //
                console.log(this.eid);
                setdomains({id:this.eid,title:this.title,ws:this.ws,domains:this.domains}).then((res)=>{
                    if(res.code == 200){
                        this.getLogLists();
                       this.tiaobanVisedit = false;
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
            handleEdit(row){
                this.tiaobanVisedit = true;
                this.title = row.title;
                this.ws = row.ws;
                this.domains = row.domains;
                this.eid = row.id;
                console.log(this.eid);
            },
            submitDomains(){
                if(this.title == ""){
                    this.$message({
                        message: "请填写跳板机名称。",
                        type: 'error'
                    });
                    return;
                }
                if(this.ws == "" && this.domains == ""){
                    this.$message({
                        message: "请填写表单再点击提交。",
                        type: 'error'
                    });
                    return;
                }
                //
                setdomains({title:this.title,ws:this.ws,domains:this.domains}).then((res)=>{
                    if(res.code == 200){
                        this.getLogLists();
                        this.tiaobanVis = false;
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
            opentiaobanset(){
                this.tiaobanVis = true;
                this.title = "";
                this.ws = "";
                this.domains = "";
            },
            handleDelete(row){
                this.$confirm('确认删除['+row.title+']吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    deleteDomainset({id:row.id}).then((res) => {
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
                getDomainset().then((res) => {
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
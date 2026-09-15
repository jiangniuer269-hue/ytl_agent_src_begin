<template>
    <section>
         <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true">
                 <el-form-item>
                    <el-button type="primary" @click="addNotice">新增公告</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"  size="mini" border :data="logs" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="id" min-width="40">
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="80">
            </el-table-column>
            <el-table-column prop="contentShot" label="内容" min-width="100">
            </el-table-column>
            <el-table-column prop="mktime" label="新增时间" min-width="80">
            </el-table-column>
            <el-table-column prop="uptime" label="修改时间" min-width="80">

            </el-table-column>
            <el-table-column prop="top" label="置顶" min-width="40">
                <template slot-scope="scope">
                        <a v-if="scope.row.top == 0" style="color: blue">否</a>
                        <a v-if="scope.row.top == 1" style="color: red">是</a>
                    </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                        <a style="color: #20a0ff;cursor: pointer" size="mini" @click="editNotice(scope.row)"> 修改</a>
                        <a style="color: red;cursor: pointer" size="mini" @click="deleteNotice(scope.row)"> 删除</a>
                </template>
            </el-table-column>

        </el-table>

        <!--新增弹框-->
        <el-dialog  title="新增公告" :visible.sync="addVisible" :close-on-click-modal="false" width="1000px">
            <el-form size="small" :inline="true">
                <el-form-item label="标题" style="width:500px;">
                    <el-input style="width:400px;" v-model="addNoticeTitle" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-checkbox v-model="addtop">置顶</el-checkbox>
                </el-form-item>
            </el-form>

            <Uediter
              id="ue3"
              style="width: 100%;height:450px;overflow: auto; "
              ref="ue3"
              :value="ueditor.value"
              :config="ueditor.config"
            ></Uediter>
            <div slot="footer" class="dialog-footer">
                 <el-button @click.native="addVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑弹框-->
        <el-dialog  title="编辑公告" :visible.sync="editVisible" :close-on-click-modal="false" width="1000px">
            <el-form size="small" :inline="true">
                <el-form-item label="标题" style="width:500px;">
                    <el-input style="width:400px;" v-model="editNoticeTitle" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-checkbox v-model="edittop">置顶</el-checkbox>
                </el-form-item>
            </el-form>

            <Uediter
              id="ue4"
              style="width: 100%;height:450px;overflow: auto; "
              ref="ue4"
              :value="eueditor.value"
              :config="eueditor.config"
            ></Uediter>
            <div slot="footer" class="dialog-footer">
                 <el-button @click.native="editVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    //import NProgress from 'nprogress'
    import { getRoomLists } from '../../api/api';
    import Uediter from "@/components/ue.vue";

    export default {
        data() {
            return {
                ueditor:{
                    value:"",
                    config:"",
                },
                addNoticeTitle:"",
                addLoading:false,
                addVisible:false,
                addtop:false,
                eueditor:{
                    value:"",
                    config:"",
                },
                editId:"",
                editNoticeTitle:"",
                editLoading:false,
                editVisible:false,
                edittop:false,
                logs: [],
                listLoading: false,
            }
        },

        methods: {
            deleteNotice(row){
                this.$confirm('确认删除吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    this.$store.getters.imClient.send(
                        JSON.stringify({
                            "ids": row.id,
                            "cmd": 4302,
                            })
                        );
                })
            },
            editSubmit(){
                if(this.editNoticeTitle == ""){
                    this.$message({
                        message: "标题不能为空",
                        type: 'error'
                    });
                    return;
                }
                if(this.$refs.ue4.getUEContent() == ""){
                    this.$message({
                        message: "内容不能为空",
                        type: 'error'
                    });
                    return;
                }
                this.editLoading = true;
                this.$store.getters.imClient.send(
                  JSON.stringify({
                    "agentsId": util.getSessionItem('user',"agents_id"),
                    "content": this.$refs.ue4.getUEContent(),
                    "title": this.editNoticeTitle,
                    "top": this.edittop?"1":"0",
                    "type": 0,
                    "id":this.editId,
                    "cmd": 4301,
                    })
                );
            },
            editNotice(row){
                this.editVisible = true;
                this.editNoticeTitle = row.title;
                this.editId = row.id;
                this.edittop = row.top == 0? false:true;
                this.$nextTick(()=>{
                    setTimeout(()=>{
                        this.$refs.ue4.setUEContent(row.content);
                    },2000)
                })
            },
            addSubmit(){
                if(this.addNoticeTitle == ""){
                    this.$message({
                        message: "标题不能为空",
                        type: 'error'
                    });
                    return;
                }
                if(this.$refs.ue3.getUEContent() == ""){
                    this.$message({
                        message: "内容不能为空",
                        type: 'error'
                    });
                    return;
                }
                this.addLoading = true;
                this.$store.getters.imClient.send(
                  JSON.stringify({
                    "agentsId": util.getSessionItem('user',"agents_id"),
                    "content": this.$refs.ue3.getUEContent(),
                    "title": this.addNoticeTitle,
                    "top": this.addtop?"1":"0",
                    "type": 0,
                    "cmd": 4301,
                    })
                );
            },
            addNotice(){
                this.addVisible = true;
            },
            onRoomOpera(data){
                if(data.code == 200){
                    this.getLogLists();
                }
            },
            onNotices(data){
                for(var i = 0 ; i < data.records.length;i++){
                    var hhh = data.records[i].content.replace(/<[^>]+>/g,"");
                    if(hhh.length > 20){
                        data.records[i].contentShot = hhh.substr(0,20)+"...";
                        }else{
                        data.records[i].contentShot = hhh
                        }
                }
                this.logs = data.records;
            },
            onDelNotices(){
                this.$store.getters.imClient.send(
                  JSON.stringify({
                    cmd: 4300
                  })
                );
            },
            onsendNotices(data){
                this.addNoticeTitle = "",
                this.addLoading = false
                this.addVisible = false
                this.addtop = false;
                this.editNoticeTitle = ""
                this.editLoading = false
                this.editVisible = false;
                this.editId = "";
                this.edittop = false;
                this.$store.getters.imClient.send(
                  JSON.stringify({
                    cmd: 4300
                  })
                );
            },
        },
        mounted() {
            setTimeout(()=>{
                this.$store.getters.imClient.bindsendNotices(this.onsendNotices);
                this.$store.getters.imClient.bindDelNotices(this.onDelNotices);
                this.$store.getters.imClient.bindNotices(this.onNotices);
                this.$store.getters.imClient.send(
                  JSON.stringify({
                    cmd: 4300
                  })
                );
            },1000)
        },
        components: {
            Uediter
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
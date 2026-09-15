<template>
    <section>
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true">
               <el-form-item style="width: 250px" label="开始时间">
                    <el-date-picker
                            v-model="filters.begin_time"
                            type="datetime"
                            placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 200px;margin-left: 50px;" label="结束时间">
                    <el-date-picker
                            v-model="filters.end_time"
                            type="datetime"
                            placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-form size="small" :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="searchShare">查询</el-button>
                </el-form-item>
                 <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(5)">今天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(6)">昨天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(1)">本周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(2)">上周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(3)">本月</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchWinQuickly(4)">上月</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <!--
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 3px;">
        <span style="color:#fff;">选择桌子 </span>
          <el-select @change="onchangeGroup" size="mini" v-model="currentGroupId" placeholder="请选择桌子">
            <el-option
                v-for="(room,index) in rooms"
                v-if="room.game_type != -1 && room.xstate !=0"
                :key="index"
                :label="room.groupname"
                :value="room.groupid">
            </el-option>
            </el-select>

           <el-tag
          v-for="(room,index) in rooms"
          v-if="room.game_type != -1"
          :key="index"
          @click="changeGroup(room.groupid,room.game_type)"
          style="margin-right:10px;cursor:pointer"
          :type="currentGroupId == room.groupid ? 'danger':'warning'"
          effect="dark"
        >{{room.groupname}}</el-tag>  
        </el-col>-->
   
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="log" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="mktime" label="时间" min-width="120">
            </el-table-column>
            <el-table-column prop="zxyk" label="庄闲盈亏" min-width="60"></el-table-column>
            <el-table-column  v-if="currentGroupType == 0" prop="zxxm" label="庄闲洗码" min-width="60">
            </el-table-column>
            <el-table-column  v-if="currentGroupType == 1" prop="zxxm" label="龙虎洗码" min-width="60">
            </el-table-column>
            <el-table-column  v-if="currentGroupType == 2" prop="zxxm" label="龙凤洗码" min-width="60">
            </el-table-column>
            <el-table-column v-if="currentGroupType == 0" prop="sbyk" label="三宝盈亏" min-width="60">
            </el-table-column>
            <el-table-column  v-if="currentGroupType == 1" prop="sbyk" label="四宝盈亏" min-width="60">
            </el-table-column>
            <el-table-column  v-if="currentGroupType == 2" prop="sbyk" label="五宝盈亏" min-width="60">
            </el-table-column>
            <el-table-column v-if="currentGroupType == 0" prop="sbxm" label="三宝洗码" min-width="60">
            </el-table-column>
            <el-table-column v-if="currentGroupType == 1" prop="sbxm" label="四宝洗码" min-width="60">
            </el-table-column>
            <el-table-column v-if="currentGroupType == 2" prop="sbxm" label="五宝洗码" min-width="60">
            </el-table-column>

            <el-table-column prop="luckysix_yk" label="幸运六盈亏" min-width="60"></el-table-column>
            <el-table-column prop="luckysix_xm" label="幸运六洗码" min-width="60"></el-table-column>
            <el-table-column prop="khyk" label="客户盈亏" min-width="60">
            </el-table-column>
            <el-table-column prop="tmyk" label="台面盈亏" min-width="60">
            </el-table-column>
        </el-table>
         <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    import $ from 'jquery'
    import { getRoomLists,zyReport } from '../../api/api';

    export default {
        data() {
            return {
                rooms:[],
                currentGroupId:0,
                currentGroupType:0,
                type:0,
                log:[],
                logs:[],
                listLoading: false,
                tableHeight:"500",
                filters: {
                    begin_time: null,
                    end_time: null,
                },
                searchParam:{
                    begin_time: null,
                    end_time: null,
                },
                pagination:{
                    current:1,
                    size:50,
                    total:0,
                },
            }
        },
        methods: {
             searchWinQuickly(type){
                if(type == 1){
                    this.filters.begin_time = moment().startOf('isoWeek').add(0,"hours")
                    this.filters.end_time = moment().endOf('isoWeek').add(0,"hours")
                }
                if(type == 2){
                    this.filters.begin_time = moment().isoWeek(moment().isoWeek() - 1).startOf('isoWeek').add(0,"hours")
                    this.filters.end_time = moment().isoWeek(moment().isoWeek() - 1).endOf('isoWeek').add(0,"hours")
                }
                if(type == 3){
                    this.filters.begin_time = moment().startOf('month').add(0,"hours")
                    this.filters.end_time = moment().endOf('month').add(0,"hours")
                }
                if(type == 4){
                    this.filters.begin_time = moment().month(moment().month() - 1).startOf('month').add(0,"hours")
                    this.filters.end_time = moment().month(moment().month() - 1).endOf('month').add(0,"hours")
                }
                if(type == 5){
                    this.filters.begin_time = moment().startOf('days').add(0,"hours")
                    this.filters.end_time = moment().endOf('days').add(0,"hours")
                }
                if(type == 6){
                    this.filters.begin_time = moment().subtract('days',1).startOf('days').add(0,"hours")
                    this.filters.end_time = moment().subtract('days',1).endOf('days').add(0,"hours")
                }
                this.searchParam = this.filters;
                this.changeGroup(this.currentGroupId,this.currentGroupType);
            },
            onchangeGroup(val){
                for(var i =0;i<this.rooms.length;i++){
                    if(this.rooms[i].groupid == val){
                        return this.changeGroup(val,this.rooms[i].game_type);
                    }
                }
            },
            handleSizeChange(val){
                this.pagination.size = val;
                this.getLog();
            },
            handleCurrentChange(val){
                this.pagination.current = val;
                this.getLog();
            },
            getLog(){
                this.log = []
                for(var i = (this.pagination.current-1) * this.pagination.size; i < this.pagination.size * (this.pagination.current);i++ ){
                    if(this.logs[i]){
                        this.log.push(this.logs[i])
                    }
                }
                this.log.length>0 && this.log.push(this.plugin.columnFilterFunc(this.log,"mktime"))
            },
            searchShare(){
                this.searchParam = this.filters;
                this.changeGroup(this.currentGroupId,this.currentGroupType);
            },
            changeGroup(groupid,game_type){
                this.currentGroupId = groupid;
                this.currentGroupType = game_type;
                this.logs = [];
                var par = {
                    groupid:groupid,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
                }
                zyReport(par).then((res) => {
                        if(res.code == 200){
                            this.logs = res.data.list;
                            this.pagination.total = this.logs.length;
                            this.getLog();
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
            autoTableHeight(){
                this.$nextTick(() => {
                this.tableHeight = $(".content-container").height() - $(".toptoolbar").height() - 120
                    setTimeout(()=>{
                        for(var i = 0 ; i < $(".tableStyle").length;i++){
                            $(".tableStyle").eq(i).find(".is-scrolling-left").width($(".tableStyle").eq(i).find(".el-table__header").width())
                        }
                    },500)
             })
           },
           getRoomListsAll() {
      getRoomLists({type:1})
        .then(res => {
          if (res.code == 200) {
            this.rooms = res.data.rooms;
            this.changeGroup(this.rooms[0].groupid,this.rooms[0].game_type);
          } else {
            this.$message({
              message: res.msg,
              type: "info"
            });
          }
        })
        .catch(res => {
          this.$message({
            message: res.msg,
            type: "error"
          });
        });
    },
        },
        watch:{
           
        },
        mounted() {
            this.autoTableHeight();
            this.getRoomListsAll();
            $(window).resize(()=>{
                this.autoTableHeight();
            
            })
        }
    }

</script>
<style lang="scss" scoped>
    
</style>
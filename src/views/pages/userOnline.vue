<template>
    <section>
        <!--列表-->
        <el-table :row-class-name="plugin.tableRowClassName"   size="mini" border :data="$store.getters.userOnline" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="uid" label="会员ID" min-width="80">
            </el-table-column>
             <el-table-column prop="name" label="会员名称" min-width="80">
            </el-table-column>
            <el-table-column prop="relationship" label="会员关系" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="score" label="余额" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="cur_online" label="当前在线" min-width="120">
            </el-table-column>
            <el-table-column prop="card_game_id" label="牌局ID" min-width="120">
            </el-table-column>
            <el-table-column prop="ju" label="局数" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.room_id}}桌 {{scope.row.boots_number}}-{{scope.row.ju}}局</span>
                </template>
            </el-table-column>
            <el-table-column prop="last_odds_time" label="下注时间" min-width="120">
            </el-table-column>
            <el-table-column prop="last_odds_text" label="下注内容" min-width="120">
            </el-table-column>
            <el-table-column prop="last_odds_sum" label="下注总额" min-width="120">
            </el-table-column>
            <el-table-column prop="ip" label="IP" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.ip}} {{scope.row.ip_address}}</span>
                </template>
            </el-table-column>
        </el-table>


    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    import $ from 'jquery'
    import { getLogListPage } from '../../api/api';

    export default {
        data() {
            return {
                logs:[],
                listLoading: false,
                tableHeight:"500",
            }
        },
        methods: {
            autoTableHeight(){
                this.$nextTick(() => {
                this.tableHeight = $(".content-container").height() - $(".toptoolbar").height() - 120
                    setTimeout(()=>{
                        for(var i = 0 ; i < $(".tableStyle").length;i++){
                            $(".tableStyle").eq(i).find(".is-scrolling-left").width($(".tableStyle").eq(i).find(".el-table__header").width())
                        }
                    },500)
             })
           }
        },
        watch:{
            // "$store.getters.userOnline":{
            //     handler(){
            //         this.logs = this.$store.getters.userOnline;
            //     },
            //     deep:true,
            // }
        },
        mounted() {
            this.autoTableHeight();
            $(window).resize(()=>{
                this.autoTableHeight();
            })
        }
    }

</script>
<style lang="scss" scoped>
    
</style>
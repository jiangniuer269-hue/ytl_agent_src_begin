<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card shadow="always" class="box-card box-card-t">
                    <div style="position:absolute;left:0;top:0px;width:100px;bottom:0px;background-color:#83C6CA;text-align:center;"><img style="margin-top:15px;" src="/static/images/daili.svg"></div>
                    <div style="position:absolute;left:100px;top:0px;right:0px;bottom:0px;text-align:center;height:100px;">
                        <div class="title">代理数量</div>
                        <div class="count">{{agentsCount}}</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="always" class="box-card box-card-t">
                    <div style="position:absolute;left:0;top:0px;width:100px;bottom:0px;background-color:#F07466;text-align:center;"><img style="margin-top:20px;" width="50px" height="50px" src="/static/images/huiyuan.svg"></div>
                    <div style="position:absolute;left:100px;top:0px;right:0px;bottom:0px;text-align:center;height:100px;">
                        <div class="title">会员数量</div>
                        <div class="count">{{userCount}}</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="always" class="box-card box-card-t">
                    <div style="position:absolute;left:0;top:0px;width:100px;bottom:0px;background-color:#F2D263;text-align:center;"><img style="margin-top:20px;" width="50px" height="50px" src="/static/images/youxiaohuiyuan.svg"></div>
                    <div style="position:absolute;left:100px;top:0px;right:0px;bottom:0px;text-align:center;height:100px;">
                        <div class="title">有效会员</div>
                        <div class="count">{{userRealCount}}</div>
                    </div>
                </el-card>
               
            </el-col>
            <el-col :span="6">
                 <el-card shadow="always" class="box-card box-card-t">
                    <div style="position:absolute;left:0;top:0px;width:100px;bottom:0px;background-color:#75C7ED;text-align:center;"><img style="margin-top:20px;" width="50px" height="50px" src="/static/images/online.svg"></div>
                    <div style="position:absolute;left:100px;top:0px;right:0px;bottom:0px;text-align:center;height:100px;">
                        <div class="title">在线会员</div>
                        <div class="count">{{userOnline}}</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
         <el-row :gutter="24">
            <el-col :span="12">
                 <div class="tabag">
                    <span :class="{'current':tabag == 1}" @click="changeTab(1)">累计赢口</span>
                    <span :class="{'current':tabag == 5}" @click="changeTab(5)">累计输口</span>
                    <span  :class="{'current':tabag == 2}" @click="changeTab(2)">累计上分</span>
                    <span  :class="{'current':tabag == 3}" @click="changeTab(3)">累计下分</span>
                    <span  :class="{'current':tabag == 4}" @click="changeTab(4)">累计积分</span>
                    <div style="float: right;color: #ff6d00;font-weight: bold;">(前五十名排行榜)</div>
                </div>
                <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
                    <el-form size="small" :inline="true" :model="filters">
                        <el-form-item style="width: 260px" label="开始时间">
                            <el-date-picker
                                    v-model="filters.begin_time"
                                    type="datetime"
                                    placeholder="开始时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item style="width: 260px" label="结束时间">
                            <el-date-picker
                                    v-model="filters.end_time"
                                    type="datetime"
                                    placeholder="结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getUserWinLostRank()">查询</el-button>
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
                <el-table v-loading="vloading" v-show="tabag == 1" @row-click="clicked" :row-class-name="plugin.tableRowClassName"  size="mini" border :data="winfen" highlight-current-row style="width: 100%;">
                    <el-table-column min-width="30" label="序号">
                        <template slot-scope="scope">
                        {{scope.$index+1}} 
                        </template>
                    </el-table-column>
                    <el-table-column prop="uid" label="会员ID" min-width="50" sortable> </el-table-column>
                    <!-- <el-table-column prop="username" label="账号" min-width="80" sortable> </el-table-column> -->
                    <el-table-column prop="nickname" label="会员昵称" min-width="80" sortable> </el-table-column>
                    <el-table-column prop="number" label="累计赢口" min-width="80" sortable> </el-table-column>
                    <el-table-column label="操作" min-width="40">
                        <template slot-scope="scope">
                            <a style="color: #20a0ff;cursor: pointer" size="mini" @click="handleLiushui(scope.row)">流水明细</a>
                        </template>
                    </el-table-column>
                </el-table>
                 <el-table v-loading="vloading" v-show="tabag == 5" @row-click="clicked" :row-class-name="plugin.tableRowClassName"  size="mini" border :data="losefen" highlight-current-row style="width: 100%;">
                    <el-table-column min-width="30" label="序号">
                        <template slot-scope="scope">
                        {{scope.$index+1}} 
                        </template>
                    </el-table-column>
                    <el-table-column prop="uid" label="会员ID" min-width="40" sortable> </el-table-column>
                    <!-- <el-table-column prop="username" label="账号" min-width="80" sortable> </el-table-column> -->
                    <el-table-column prop="nickname" label="会员昵称" min-width="80" sortable> </el-table-column>
                    <el-table-column prop="number" label="累计输口" min-width="80" sortable> </el-table-column>
                    <el-table-column label="操作" min-width="40">
                        <template slot-scope="scope">
                            <a style="color: #20a0ff;cursor: pointer" size="mini" @click="handleLiushui(scope.row)">流水明细</a>
                        </template>
                    </el-table-column>
                </el-table>
                 <el-table v-loading="vloading" v-show="tabag == 2" @row-click="clicked" :row-class-name="plugin.tableRowClassName"  size="mini" border :data="upfen" highlight-current-row style="width: 100%;">
                    <el-table-column min-width="30" label="序号">
                        <template slot-scope="scope">
                        {{scope.$index+1}} 
                        </template>
                    </el-table-column>
                    <el-table-column prop="uid" label="会员ID" min-width="40" sortable> </el-table-column>
                    <!-- <el-table-column prop="username" label="账号" min-width="80" sortable> </el-table-column> -->
                    <el-table-column prop="nickname" label="会员昵称" min-width="80" sortable> </el-table-column>
                    <el-table-column prop="number" label="累计上分" min-width="80" sortable> </el-table-column>
                </el-table>
                 <el-table v-loading="vloading" v-show="tabag == 3" @row-click="clicked" :row-class-name="plugin.tableRowClassName"  size="mini" border :data="downfen" highlight-current-row style="width: 100%;">
                   <el-table-column min-width="30" label="序号">
                        <template slot-scope="scope">
                        {{scope.$index+1}} 
                        </template>
                    </el-table-column>
                   <el-table-column prop="uid" label="会员ID" min-width="40" sortable> </el-table-column>
                    <!-- <el-table-column prop="username" label="账号" min-width="80" sortable> </el-table-column> -->
                    <el-table-column prop="nickname" label="会员昵称" min-width="80" sortable> </el-table-column>
                    <el-table-column prop="number" label="累计下分" min-width="80" sortable> </el-table-column>
                </el-table>
                 <el-table v-loading="vloading" v-show="tabag == 4" @row-click="clicked" :row-class-name="plugin.tableRowClassName"  size="mini" border :data="xmall" highlight-current-row style="width: 100%;">
                    <el-table-column min-width="30" label="序号">
                        <template slot-scope="scope">
                        {{scope.$index+1}} 
                        </template>
                    </el-table-column>
                    <el-table-column prop="uid" label="会员ID" min-width="40" sortable> </el-table-column>
                    <!-- <el-table-column prop="username" label="账号" min-width="80" sortable> </el-table-column> -->
                    <el-table-column prop="nickname" label="会员昵称" min-width="80" sortable> </el-table-column>
                    <el-table-column prop="number" label="累计积分" min-width="80" sortable> </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="12">
                <div class="tabag">
                    <span class="current">会员输赢</span>
                    <el-button-group size="mini" style="float:right;margin-top:7px;">
                        <el-button @click="userWinLoseList(1)" size="mini" type="primary">按天</el-button>
                        <el-button @click="userWinLoseList(2)" size="mini" type="primary">按周</el-button>
                        <el-button @click="userWinLoseList(3)" size="mini" type="primary">按月</el-button>
                        </el-button-group>
                </div>
                <div style="background-color:#fff;padding-top:20px;">
                    <div class="charts" id="charts1" style="background-color:#fff;">

                    </div>
                </div>

                <div class="tabag">
                    <span class="current">上分总额</span>
                    <el-button-group size="mini" style="float:right;margin-top:7px;">
                        <el-button @click="upfenLists(1)" size="mini" type="primary">按天</el-button>
                        <el-button @click="upfenLists(2)" size="mini" type="primary">按周</el-button>
                        <el-button @click="upfenLists(3)" size="mini" type="primary">按月</el-button>
                        </el-button-group>
                </div>
                <div style="background-color:#fff;padding-top:20px;">
                    <div class="charts" id="charts2" style="background-color:#fff;">

                    </div>
                </div>

                <div class="tabag">
                    <span class="current">下分总额</span>
                    <el-button-group size="mini" style="float:right;margin-top:7px;">
                        <el-button @click="downfenLists(1)" size="mini" type="primary">按天</el-button>
                        <el-button @click="downfenLists(2)" size="mini" type="primary">按周</el-button>
                        <el-button @click="downfenLists(3)" size="mini" type="primary">按月</el-button>
                        </el-button-group>
                </div>
                <div style="background-color:#fff;padding-top:20px;">
                    <div class="charts" id="charts3" style="background-color:#fff;">

                    </div>
                </div>

                <div class="tabag">
                    <span class="current">洗码量</span>
                    <el-button-group size="mini" style="float:right;margin-top:7px;">
                        <el-button @click="xmlist(1)" size="mini" type="primary">按天</el-button>
                        <el-button @click="xmlist(2)" size="mini" type="primary">按周</el-button>
                        <el-button @click="xmlist(3)" size="mini" type="primary">按月</el-button>
                        </el-button-group>
                </div>
                <div style="background-color:#fff;padding-top:20px;">
                    <div class="charts" id="charts4" style="background-color:#fff;">

                    </div>
                </div>
            </el-col>
         </el-row>

         <!--流水明细弹框-->
        <el-dialog  :title="liushuiFilters.user.nickname+'-流水明细'" :visible.sync="LiushuiVisible" :close-on-click-modal="false" width="1300px">

            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form size="small" :inline="true" :model="liushuiFilters">
                    <el-form-item style="width: 260px" label="开始时间">
                        <el-date-picker
                                v-model="liushuiFilters.begin_time"
                                type="datetime"
                                placeholder="开始时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="width: 260px" label="结束时间">
                        <el-date-picker
                                v-model="liushuiFilters.end_time"
                                type="datetime"
                                placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="searchLiushui">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="searchQuicklyLiushui(5)">今天</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchQuicklyLiushui(6)">昨天</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchQuicklyLiushui(1)">本周</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchQuicklyLiushui(2)">上周</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchQuicklyLiushui(3)">本月</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchQuicklyLiushui(4)">上月</el-button>
                    </el-form-item>
                                    <span style="font-size:18px;line-height:35px;color:#fff;">(请输入时间查询)</span>

                </el-form>
            </el-col>
            <!--table-->
            <!--列表-->
            <el-table  :row-class-name="plugin.tableRowClassName"  v-loading="liushuiLoading" size="mini" border :data="liushui" highlight-current-row   class="tableStyle" style="width: 100%;">
                <!-- <el-table-column prop="uid" label="会员ID">
                </el-table-column> -->
                <el-table-column prop="name" label="会员名称">
                </el-table-column>
                <el-table-column prop="score" label="变动前" min-width="60" sortable>
                </el-table-column>
                <el-table-column prop="score_change" label="金额" min-width="60" sortable>
                </el-table-column>
                <el-table-column prop="score_after" label="变动后" min-width="60" sortable>
                </el-table-column>
                <el-table-column prop="type" label="类型" min-width="60" sortable>
                    <!-- <template slot-scope="scope">
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
                    </template> -->
                </el-table-column>
                <!-- <el-table-column prop="card_game_id" label="牌局ID" min-width="100" sortable>
                </el-table-column> -->
                <el-table-column prop="note" label="备注" min-width="100">
                </el-table-column>
                <el-table-column prop="time" label="时间" min-width="120">
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
                <el-pagination @size-change="handleSizeChangeLiushui" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeLiushui" :current-page="liushuiPagination.current" :page-sizes="[50, 100, 300]" :page-size="liushuiPagination.size" :total="liushuiPagination.total" style="float:right;">
                </el-pagination>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="LiushuiVisible = false">关闭</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import util from '../../common/js/util'
    import moment from 'moment'
    import $ from 'jquery'
    import { getLiushuiPage,listAgentsUser,listUserWinLostRank,listshuyinguser,upfenlistchat,downfenlistchat,xmlistchat} from '../../api/api';

    export default {
        data() {
            return {
                vloading:false,
                filters: {
                    begin_time: null,
                    end_time: null,
                },
                searchParam:{
                    begin_time: null,
                    end_time: null
                },
               tabag:1,
               agentsCount:0,
               userCount:0,
               userRealCount:0,
               upfen:[],
               downfen:[],
               winfen:[],
               losefen:[],
               xmall:[],
               charts1:{
                    title: {
                        show: false
                    },
                    legend: {
                        data: ["会员"],
                        show: false
                    },
                    toolbox: {},
                    dataZoom: [{
                        type: 'inside',
                    }, {
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    tooltip: {
                        trigger: "axis",
                        formatter: function (params) {
                            return (
                                params[0].name +
                                "<br/>" +
                                params[0].seriesName +
                                " : " +
                                params[0].value +
                                "(分)"
                            );
                        },
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: "line" // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        show: false,
                        top: "10px",
                        left: "70px",
                        right: "30px",
                        bottom: "65px"
                    },
                    xAxis: {
                        name: "时间",
                        nameTextStyle: {
                            padding: [200, 0, 0, -35]
                        },
                        type: "category",
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            // interval: 0 //横轴信息全部显示
                        },
                        axisLine: {onZero: false},
                        data: []
                    },
                    yAxis: {
                        type: "value",
                        name: "分数",
                        // min: 0,
                        // max: 100,
                        // interval: 10
                    },
                    series: [
                        {
                            name: "分数",
                            type: "line",
                            itemStyle: {
                                color: "#FF0000"
                            },
                            smooth: true,
                            data: []
                        }
                    ]
                },
                charts2:{
                    title: {
                        show: false
                    },
                    legend: {
                        data: ["上分总额"],
                        show: false
                    },
                    toolbox: {},
                    dataZoom: [{
                        type: 'inside',
                    }, {
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    tooltip: {
                        trigger: "axis",
                        formatter: function (params) {
                            return (
                                params[0].name +
                                "<br/>" +
                                params[0].seriesName +
                                " : " +
                                params[0].value +
                                "(分)"
                            );
                        },
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: "line" // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        show: false,
                        top: "10px",
                        left: "70px",
                        right: "30px",
                        bottom: "65px"
                    },
                    xAxis: {
                        name: "时间",
                        nameTextStyle: {
                            padding: [200, 0, 0, -35]
                        },
                        type: "category",
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            // interval: 0 //横轴信息全部显示
                        },
                        axisLine: {onZero: false},
                        data: []
                    },
                    yAxis: {
                        type: "value",
                        name: "分数",
                        // min: 0,
                        // max: 100,
                        // interval: 10
                    },
                    series: [
                        {
                            name: "分数",
                            type: "line",
                            itemStyle: {
                                color: "#FF0000"
                            },
                            smooth: true,
                            data: []
                        }
                    ]
                },
                charts3:{
                    title: {
                        show: false
                    },
                    legend: {
                        data: ["下分总额"],
                        show: false
                    },
                    toolbox: {},
                    dataZoom: [{
                        type: 'inside',
                    }, {
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    tooltip: {
                        trigger: "axis",
                        formatter: function (params) {
                            return (
                                params[0].name +
                                "<br/>" +
                                params[0].seriesName +
                                " : " +
                                params[0].value +
                                "(分)"
                            );
                        },
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: "line" // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        show: false,
                        top: "10px",
                        left: "70px",
                        right: "30px",
                        bottom: "65px"
                    },
                    xAxis: {
                        name: "时间",
                        nameTextStyle: {
                            padding: [200, 0, 0, -35]
                        },
                        type: "category",
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            // interval: 0 //横轴信息全部显示
                        },
                        axisLine: {onZero: false},
                        data: []
                    },
                    yAxis: {
                        type: "value",
                        name: "分数",
                        // min: 0,
                        // max: 100,
                        // interval: 10
                    },
                    series: [
                        {
                            name: "分数",
                            type: "line",
                            itemStyle: {
                                color: "#FF0000"
                            },
                            smooth: true,
                            data: []
                        }
                    ]
                },
                charts4:{
                    title: {
                        show: false
                    },
                    legend: {
                        data: ["洗码"],
                        show: false
                    },
                    toolbox: {},
                    dataZoom: [{
                        type: 'inside',
                    }, {
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    tooltip: {
                        trigger: "axis",
                        formatter: function (params) {
                            return (
                                params[0].name +
                                "<br/>" +
                                params[0].seriesName +
                                " : " +
                                params[0].value +
                                ""
                            );
                        },
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: "line" // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        show: false,
                        top: "10px",
                        left: "70px",
                        right: "30px",
                        bottom: "65px"
                    },
                    xAxis: {
                        name: "时间",
                        nameTextStyle: {
                            padding: [200, 0, 0, -35]
                        },
                        type: "category",
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            // interval: 0 //横轴信息全部显示
                        },
                        axisLine: {onZero: false},
                        data: []
                    },
                    yAxis: {
                        type: "value",
                        name: "洗码量",
                        // min: 0,
                        // max: 100,
                        // interval: 10
                    },
                    series: [
                        {
                            name: "洗码量",
                            type: "line",
                            itemStyle: {
                                color: "#FF0000"
                            },
                            smooth: true,
                            data: []
                        }
                    ]
                },
                liushui:[],
                liushuiLoading:false,
                 liushuiFilters : {
                    begin_time: "",
                    end_time: "",
                    user:"",
                },
                liushuiPagination:{
                    current:1,
                    size:50,
                    total:0,
                },
            liushuiSearchParam : {
                    begin_time:"",
                    end_time:""
                },
            LiushuiVisible : false
            }
        },
        methods: {

            searchQuicklyLiushui(type){

                if(type == 1){
                    this.liushuiFilters.begin_time = moment().startOf('isoWeek').add(0,"hours")
                    this.liushuiFilters.end_time = moment().endOf('isoWeek').add(0,"hours")
                }
                if(type == 2){
                    this.liushuiFilters.begin_time = moment().isoWeek(moment().isoWeek() - 1).startOf('isoWeek').add(0,"hours")
                    this.liushuiFilters.end_time = moment().isoWeek(moment().isoWeek() - 1).endOf('isoWeek').add(0,"hours")
                }
                if(type == 3){
                    this.liushuiFilters.begin_time = moment().startOf('month').add(0,"hours")
                    this.liushuiFilters.end_time = moment().endOf('month').add(0,"hours")
                }
                if(type == 4){
                    this.liushuiFilters.begin_time = moment().month(moment().month() - 1).startOf('month').add(0,"hours")
                    this.liushuiFilters.end_time = moment().month(moment().month() - 1).endOf('month').add(0,"hours")
                }
                if(type == 5){
                    this.liushuiFilters.begin_time = moment().startOf('days').add(0,"hours")
                    this.liushuiFilters.end_time = moment().endOf('days').add(0,"hours")
                }
                if(type == 6){
                    this.liushuiFilters.begin_time = moment().subtract('days',1).startOf('days').add(0,"hours")
                    this.liushuiFilters.end_time = moment().subtract('days',1).endOf('days').add(0,"hours")
                }
                this.liushuiSearchParam.begin_time = this.liushuiFilters.begin_time;
                this.liushuiSearchParam.end_time = this.liushuiFilters.end_time;
                this.getLiushui()
            },


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
                this.getUserWinLostRank()
            },
            searchLiushui(){
                this.liushuiSearchParam.begin_time = this.liushuiFilters.begin_time;
                this.liushuiSearchParam.end_time = this.liushuiFilters.end_time;
                this.getLiushui()
            },
            handleSizeChangeLiushui(val){
                this.liushuiPagination.size = val;
                this.getLiushui();
            },
            handleCurrentChangeLiushui(val){
                this.liushuiPagination.current = val;
                this.getLiushui();
            },
            handleLiushui(row){
                this.liushuiFilters = {
                    begin_time: "",
                    end_time: "",
                    user:row,
                }
                this.liushuiSearchParam = {
                    begin_time:"",
                    end_time:""
                }
                this.LiushuiVisible = true;
                this.getLiushui()
            },
            //获取流水列表
            getLiushui() {
                let para = {
                    pageNumber:this.liushuiPagination.current,
                    pageSize:this.liushuiPagination.size,
                    uid:this.liushuiFilters.user.uid,
                    begin_time:this.liushuiSearchParam.begin_time == "" ? "": moment(this.liushuiSearchParam.begin_time).unix(),
                    end_time:this.liushuiSearchParam.end_time == "" ? "": moment(this.liushuiSearchParam.end_time).unix(),
                };
                this.liushuiLoading = true;
                getLiushuiPage(para).then((res) => {
                    this.liushuiPagination.total = res.total;
                    this.liushui = res.data;
                    if(this.liushui.length){
                        this.liushui.push(this.plugin.columnFilterFunc(this.liushui,"name"))
                    }
                    this.liushuiLoading = false;
                });
            },
            clicked(){
               $(".isEdited").removeClass("isEdited");
           },
            getshuying(){},
             changeTab(type){
                this.tabag = type;
                this.getUserWinLostRank();
            },
            getAgentsUser(){
                listAgentsUser().then((res) => {
                       
                        if(res.code == 200){
                            
                            this.agentsCount = res.data.agentsCount;
                            this.userCount = res.data.userCount;
                            this.userRealCount = res.data.userRealCount;
                        }else{
                             this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                        }
                        
                    }).catch((res) => {
                       
                    this.listLoading = false;
                });
            },
            getUserWinLostRank(){
                this.vloading = true;
                if(this.tabag == 1){
                    this.upfen = [];
                }else if(this.tabag == 5){
                     this.downfen = [];
                }else if(this.tabag == 2){
                    this.winfen = [];
                }else if(this.tabag == 3){
                    this.losefen = [];
                }else if(this.tabag == 4){
                    this.losefen = [];
                }
                
               
                this.xmall = [];
                listUserWinLostRank({
                    type:this.tabag,
                    begin_time:this.searchParam.begin_time == null ? "": moment(this.searchParam.begin_time).unix(),
                    end_time:this.searchParam.end_time == null ? "": moment(this.searchParam.end_time).unix(),
                    }).then((res) => {
                        this.vloading = false;
                        if(res.code == 200){
                           
                            this.upfen = res.data.upfen;
                            this.downfen = res.data.downfen;
                            this.winfen = res.data.winfen;
                            this.losefen = res.data.losefen;
                            this.xmall = res.data.xmall;
                        }else{
                             this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                        }
                        
                    }).catch((res) => {
                    this.listLoading = false;
                    this.vloading = false;
                });

            },
            userWinLoseList(type){
                this.shuyinguser(type);//此接口修改为
            },
            xmlist(type){
                xmlistchat({
                    type:type,
                }).then((res) => {
                        if(res.code == 200){
                            this.charts4.xAxis.data = [];
                            this.charts4.series[0].data = [];
                            for(var i = 0 ; i < res.data.xm.length;i++){
                                if(type ==2){
                                    var date1 = res.data.xm[i].Hour.split("-");
                                    this.charts4.xAxis.data.push(this.getDateFromWeek(date1[1],date1[0]));
                                }else{
                                    this.charts4.xAxis.data.push(res.data.xm[i].Hour);
                                }
                                
                                this.charts4.series[0].data.push(res.data.xm[i].Count);
                            }
                            var chart = this.$echarts.getInstanceByDom(document.getElementById('charts4'));
                            chart.setOption(this.charts4)
                        }else{
                             this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                        }
                        
                    }).catch((res) => {
                       
                });
            },
            shuyinguser(type){
                listshuyinguser({
                    type:type,
                }).then((res) => {
                        if(res.code == 200){
                            this.charts1.xAxis.data = [];
                            this.charts1.series[0].data = [];
                            for(var i = 0 ; i < res.data.adduser.length;i++){
                                if(type ==2){
                                    var date1 = res.data.adduser[i].Hour.split("-");
                                    this.charts1.xAxis.data.push(this.getDateFromWeek(date1[1],date1[0]));
                                }else{
                                    this.charts1.xAxis.data.push(res.data.adduser[i].Hour);
                                }
                                
                                this.charts1.series[0].data.push(res.data.adduser[i].Count);
                            }
                            var chart = this.$echarts.getInstanceByDom(document.getElementById('charts1'));
                            chart.setOption(this.charts1)
                        }else{
                             this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                        }
                        
                    }).catch((res) => {
                       
                });
            },
            upfenLists(type){
                upfenlistchat({
                    type:type,
                }).then((res) => {
                        if(res.code == 200){
                            this.charts2.xAxis.data = [];
                            this.charts2.series[0].data = [];
                            for(var i = 0 ; i < res.data.upfen.length;i++){
                                if(type ==2){
                                    var date1 = res.data.upfen[i].Hour.split("-");
                                    this.charts2.xAxis.data.push(this.getDateFromWeek(date1[1],date1[0]));
                                }else{
                                    this.charts2.xAxis.data.push(res.data.upfen[i].Hour);
                                }
                                
                                this.charts2.series[0].data.push(res.data.upfen[i].Count);
                            }
                            var chart = this.$echarts.getInstanceByDom(document.getElementById('charts2'));
                            chart.setOption(this.charts2)
                        }else{
                             this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                        }
                        
                    }).catch((res) => {
                       
                });
            },
             downfenLists(type){
                downfenlistchat({
                    type:type,
                }).then((res) => {
                        if(res.code == 200){
                            this.charts3.xAxis.data = [];
                            this.charts3.series[0].data = [];
                            for(var i = 0 ; i < res.data.downfen.length;i++){
                                if(type ==2){
                                    var date1 = res.data.downfen[i].Hour.split("-");
                                    this.charts3.xAxis.data.push(this.getDateFromWeek(date1[1],date1[0]));
                                }else{
                                    this.charts3.xAxis.data.push(res.data.downfen[i].Hour);
                                }
                                
                                this.charts3.series[0].data.push(-res.data.downfen[i].Count);
                            }
                            var chart = this.$echarts.getInstanceByDom(document.getElementById('charts3'));
                            chart.setOption(this.charts3)
                        }else{
                             this.$message({
                                message: res.msg,
                                type: 'info'
                            });
                        }
                        
                    }).catch((res) => {
                        
                });
            },
            getDateFromWeek(week, year) {
                return moment().day("Monday").year(year).week(week).format("YYYY-MM-DD")+"-"+moment().day("Monday").year(year).week(week).add("days",7).format("YYYY-MM-DD");
            }
        },
        computed:{
            userOnline(){
                return this.$store.getters.userOnline.length;
            }
        },
        mounted() {
            this.getAgentsUser();
            this.getUserWinLostRank();
            this.shuyinguser(1);
            this.upfenLists(1);
            this.downfenLists(1);
            this.xmlist(1);
           
            var chart = this.$echarts.init(document.getElementById('charts1'))
            var chart2 = this.$echarts.init(document.getElementById('charts2'))
            var chart3 = this.$echarts.init(document.getElementById('charts3'))
            var chart4 = this.$echarts.init(document.getElementById('charts4'))
            $(window).resize(()=>{
               chart.resize();
               chart2.resize();
               chart3.resize();
               chart4.resize();
            })
           
        }
    }

</script>
<style lang="scss" scoped>
    .box-card-t{
        position: relative;
        height: 100px;
        border:none;
        .title{
            height:50px;
            line-height: 50px;
            font-size: 24px;
            text-align: center;
            color: #ccc;
        }
        .count{
            margin-top: 0px;
            height:30px;
            line-height: 30px;
            font-size: 24px;
            text-align: center;
            color: #ccc;
        }
    }
    .tabag{
        line-height: 40px;
        border-bottom:2px solid #ccc;
        clear: both;
        margin-bottom: 10px;
        font-size: 16px;
        color:#fff;
        span{
            margin:0 5px;
            cursor: pointer;
            padding:11px 0px;
        }
        .current{
            color:#ff6d00;
            border-bottom:2px solid #ff6d00;
        }
    }
    .charts{
        height:275px;
    }
</style>
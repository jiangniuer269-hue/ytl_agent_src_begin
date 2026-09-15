<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item label="桌子ID">
                    <el-input v-model="filters.room_id" placeholder="桌子ID"></el-input>
                </el-form-item>
                <el-form-item label="靴号">
                    <el-input v-model="filters.boots_number" placeholder="靴号"></el-input>
                </el-form-item>
                <el-form-item label="局数">
                    <el-input v-model="filters.ju" placeholder="局数"></el-input>
                </el-form-item>

                <el-form-item style="width: 260px" label="开始时间">
                    <el-date-picker v-model="filters.begin_time" type="datetime" placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 260px;margin-left: 50px;" label="结束时间">
                    <el-date-picker v-model="filters.end_time" type="datetime" placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-form size="small" :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" @click="searchGame">查询</el-button>
                </el-form-item>
                <!--
                <el-form-item>
                    <el-button type="primary" @click="addGameRes">新增牌局</el-button>
                </el-form-item>
                -->
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
        
      <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 4px;margin:0px;">
            <el-button
                type="primary"
                effect="dark">
            客户总输赢: {{total_khyk}}
            </el-button>
            <el-button
                type="primary"
                effect="dark">
            庄闲占成总输赢: {{total_zxyk_zc}}
            </el-button>
            <el-button
                type="primary"
                effect="dark">
            推码总数: {{total_tm}}
            </el-button>
           <el-button
                type="primary"
                effect="dark">
             推码盈亏总数: {{total_tmyk}}
            </el-button>
            <!--
            <el-button
                type="primary"
                effect="dark">
             四宝总数: {{total_sb_total}}
            </el-button>
            <el-button
                type="primary"
                effect="dark">
             四宝盈亏总数: {{total_sbyk}}
            </el-button>
            -->
        </el-col>
        <!--
        <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 0px;">
            <el-form size="small" :inline="true">
                <el-form-item>
                    <el-button @click="goRes(0)" :type="type ==0 ? 'primary' : 'warning'">百家乐</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goRes(1)" :type="type ==1 ? 'primary' : 'warning'">龙虎</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goRes(2)" :type="type ==2 ? 'primary' : 'warning'">炸金花</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goRes(3)" :type="type ==3 ? 'primary' : 'warning'">牛牛</el-button>
                </el-form-item>
            </el-form>
        </el-col>
-->
        <!--列表-->
        <el-table v-if="type == 0" :row-class-name="plugin.tableRowClassName" size="mini" border :data="gamelist"
            highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <el-table-column prop="card_game_id" label="牌局ID" min-width="80">
            </el-table-column>
            <el-table-column prop="room_id" label="桌子ID" min-width="80">
            </el-table-column>
            <el-table-column label="局数" min-width="120">
                <template slot-scope="scope">
                    <a size="small">{{ scope.row.mark }}-{{ scope.row.boots_number }}-{{ scope.row.ju }}局</a>
                </template>
            </el-table-column>
            <el-table-column prop="game_result" label="开牌结果" min-width="140">
                <template slot-scope="scope">
                    <a v-if="scope.row.state ==2" style="color: black">{{scope.row.game_result}}</a> 
                    <a v-if="scope.row.state <2" style="color: #FF9900">{{scope.row.game_result}}</a>
                    <a v-if="scope.row.state ==3" style="color: red">{{scope.row.game_result}}</a>
                </template>
            </el-table-column>
             <el-table-column prop="khyk" label="客户总盈亏" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="zxyk_zc" label="庄闲占成盈亏" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="tm" label="推码" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="tmyk" label="推码盈亏" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="sb_total" label="四宝总额" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="sbyk" label="四宝盈亏" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="mktime" label="时间" min-width="120" sortable>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <a v-if='auth_type == 1' class="qiyong" size="mini" @click="editGame(scope.row)">修改</a>
                  <!-- <a v-if='auth_type == 1' class="jinyong" size="mini" @click="deleteGame(scope.row)">删除</a>--> 
                    <a  class="xiangqing" size="mini" @click="handleChat(scope.row)">聊天记录</a>
                </template>
            </el-table-column>
        </el-table>
        <!--列表-->
        <el-table v-if="type == 1" :row-class-name="plugin.tableRowClassName" size="mini" border :data="gamelist"
            highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">

            <el-table-column label="局数" min-width="120">
                <template slot-scope="scope">
                    <a size="small">{{ scope.row.room_id }}桌{{ scope.row.boots_number }}-{{ scope.row.ju }}局</a>
                </template>
            </el-table-column>
            <el-table-column prop="game_result" label="开牌结果" min-width="140">
            
            </el-table-column>
            <el-table-column prop="mktime" label="时间" min-width="120" sortable>
            </el-table-column>

            <el-table-column prop="zhuang_dian" label="龙家点" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="xian_dian" label="虎家点" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="player" label="龙家牌型" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="banker" label="虎家牌型" min-width="80" sortable>
            </el-table-column>


            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <a v-if='auth_type == 1' style="color: green;cursor: pointer" size="mini"
                        @click="editGame(scope.row)">修改</a>
                    <a v-if='auth_type == 1' style="color: red;cursor: pointer" size="mini"
                        @click="deleteGame(scope.row)">删除</a>
                    <a style="color: #20a0ff;cursor: pointer" size="mini" @click="handleChat(scope.row)">聊天记录</a>
                </template>
            </el-table-column>
        </el-table>
        <!--列表-->
        <el-table v-if="type == 2" :row-class-name="plugin.tableRowClassName" size="mini" border :data="gamelist"
            highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">

            <el-table-column label="局数" min-width="120">
                <template slot-scope="scope">
                    <a size="small">{{ scope.row.room_id }}桌{{ scope.row.boots_number }}-{{ scope.row.ju }}局</a>
                </template>
            </el-table-column>
            <el-table-column prop="game_result" label="开牌结果" min-width="140">
            </el-table-column>
            <el-table-column prop="mktime" label="时间" min-width="120" sortable>
            </el-table-column>

            <el-table-column prop="zhuang_dian" label="龙家点" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="xian_dian" label="凤家点" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="player" label="龙家牌型" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="banker" label="凤家牌型" min-width="80" sortable>
            </el-table-column>

            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <a v-if='auth_type == 1' style="color: green;cursor: pointer" size="mini"
                        @click="editGame(scope.row)">修改</a>
                    <a v-if='auth_type == 1' style="color: red;cursor: pointer" size="mini"
                        @click="deleteGame(scope.row)">删除</a>
                    <a style="color: #20a0ff;cursor: pointer" size="mini" @click="handleChat(scope.row)">聊天记录</a>
                </template>
            </el-table-column>
        </el-table>

        <!--列表-->
        <el-table v-if="type == 3" :row-class-name="plugin.tableRowClassName" size="mini" border :data="gamelist"
            highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">

            <el-table-column label="局数" min-width="120">
                <template slot-scope="scope">
                    <a size="small">{{ scope.row.room_id }}桌{{ scope.row.boots_number }}-{{ scope.row.ju }}局</a>
                </template>
            </el-table-column>
            <el-table-column prop="game_result" label="开牌结果" min-width="140">
            </el-table-column>
            <el-table-column prop="mktime" label="时间" min-width="120" sortable>
            </el-table-column>

            <el-table-column prop="zhuang_dian" label="红牛点" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="xian_dian" label="黑牛点" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="player" label="红牛牌型" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="banker" label="黑牛牌型" min-width="80" sortable>
            </el-table-column>


            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <a v-if='auth_type == 1' style="color: green;cursor: pointer" size="mini"
                        @click="editGame(scope.row)">修改</a>
                    <a v-if='auth_type == 1' style="color: red;cursor: pointer" size="mini"
                        @click="deleteGame(scope.row)">删除</a>
                    <a style="color: #20a0ff;cursor: pointer" size="mini" @click="handleChat(scope.row)">聊天记录</a>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper"
                @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]"
                :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--聊天记录-->
        <el-dialog :title="chatTitle" :visible.sync="chatVisible" :close-on-click-modal="false" width="1200px">
            <div v-loading="chatlistLoading"
                style="height:500px;border:1px solid #ccc;padding:10px;border-radius: 10px;overflow-y: scroll">
                <div v-if="!gameChat.length" class="noChat">无聊天记录</div>
                <div class="chat-item" v-for="(item, index) in gameChat" :key="index">
                    <div v-if="item.msgtype == 0 || item.msgtype == 5"><!--文本-->
                        <div class="touxaing" v-if="!item.fromuser.headimage"
                            :style="{ 'background-color': transColor(item.fromuser.nickname) }">{{ item.fromuser.nickname |
                            transTx}}</div>
                        <div class="touxaing" v-if="item.fromuser.headimage">
                            <img :src="item.fromuser.headimage" width="40px" height="40px">
                        </div>
                        <div class="msgcon">
                            <p class="info">{{ item.fromuser.nickname }} {{ item.createtime }}</p>
                            <div class="msgText">{{ item.msg }}</div>
                        </div>
                    </div>
                    <div v-if="item.msgtype == 1"><!--图片-->
                        <div class="touxaing" v-if="!item.fromuser.headimage"
                            :style="{ 'background-color': transColor(item.fromuser.nickname) }">{{ item.fromuser.nickname |
                            transTx}}</div>
                        <div class="touxaing" v-if="item.fromuser.headimage">
                            <img :src="item.fromuser.headimage" width="40px" height="40px">
                        </div>
                        <div class="msgcon">
                            <p class="info">{{ item.fromuser.nickname }} {{ item.createtime }}</p>
                            <div class="msgText"><img style="width:200px!important;" :src="item.msg"></div>
                        </div>
                    </div>
                    <div v-if="item.msgtype == 2"><!--加粗-->
                        <div class="touxaing" v-if="!item.fromuser.headimage"
                            :style="{ 'background-color': transColor(item.fromuser.nickname) }">{{ item.fromuser.nickname |
                            transTx}}</div>
                        <div class="touxaing" v-if="item.fromuser.headimage">
                            <img :src="item.fromuser.headimage" width="40px" height="40px">
                        </div>
                        <div class="msgcon">
                            <p class="info">{{ item.fromuser.nickname }} {{ item.createtime }}</p>
                            <div class="msgText" style="color:red;font-weight: bold;font-size: 22px;">{{ item.msg }}</div>
                        </div>
                    </div>
                    <div v-if="item.msgtype == 3"><!--投注表-->
                        <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                            <table v-if="type == 0" cellspacing="0" cellpadding="0" border="0"
                                class="el-table__body tzb" width="100%">
                                <tr class="el-table__row">
                                    <td colspan="7">投注表</td>
                                </tr>
                                <tr>
                                    <td>昵称</td>
                                    <td>闲</td>
                                    <td>庄</td>
                                    <td>闲对</td>
                                    <td>庄对</td>
                                    <td>和</td>
                                    <td>幸运6</td>
                                </tr>
                                <tr v-for="tz in parseStrJson(item.msg)">
                                    <td>{{ tz.name || '总计' }}</td>
                                    <td>{{ tz.x }}</td>
                                    <td>{{ tz.z }}</td>
                                    <td>{{ tz.xd }}</td>
                                    <td>{{ tz.zd }}</td>
                                    <td>{{ tz.h }}</td>
                                    <td>{{ tz.xy }}</td>
                                </tr>
                            </table>

                            <table v-if="type == 1" cellspacing="0" cellpadding="0" border="0"
                                class="el-table__body tzb" width="100%">
                                <tr class="el-table__row">
                                    <td colspan="4">投注表</td>
                                </tr>
                                <tr>
                                    <td width="22%" class="odds_nickname">昵称</td>
                                    <td width="10%" class="odds_z">龙</td>
                                    <td width="10%" class="odds_x">虎</td>
                                    <td width="10%" class="odds_h">和</td>
                                </tr>
                                <tr v-for="tz in parseStrJson(item.msg)">
                                    <td>{{ tz.name || '总计' }}</td>
                                    <td width="10%" class="odds_z">{{ tz.z }}</td>
                                    <td width="10%" class="odds_x">{{ tz.x }}</td>
                                    <td width="10%" class="odds_h">{{ tz.h }}</td>
                                </tr>
                            </table>

                            <table v-if="type == 2" cellspacing="0" cellpadding="0" border="0"
                                class="el-table__body tzb" width="100%">
                                <tr class="el-table__row">
                                    <td colspan="8">投注表</td>
                                </tr>
                                <tr>
                                    <td width="22%" class="odds_nickname">昵称</td>
                                    <td width="9%" class="odds_z">龙</td>
                                    <td width="9%" class="odds_x">凤</td>
                                    <td width="16%" class="odds_d8">幸运一击</td>
                                    <td width="10%" class="odds_xd">顺子</td>
                                    <td width="10%" class="odds_zd">同花</td>

                                    <td width="16%" class="odds_ths">同花顺</td>

                                    <td width="10%" class="odds_xy">豹子</td>
                                </tr>
                                <tr v-for="tz in parseStrJson(item.msg)">
                                    <td>{{ tz.name || '总计' }}</td>
                                    <td width="9%" class="odds_z">{{ tz.z }}</td>
                                    <td width="9%" class="odds_x">{{ tz.x }}</td>
                                    <td width="16%" class="odds_zd">{{ tz.d8 }}</td>
                                    <td width="10%" class="odds_zd">{{ tz.zd }}</td>

                                    <td width="10%" class="odds_xd">{{ tz.xd }}</td>

                                    <td width="16%" class="odds_zd">{{ tz.ths }}</td>

                                    <td width="10%" class="odds_xy">{{ tz.xy }}</td>

                                </tr>
                            </table>


                            <table v-if="type == 3" cellspacing="0" cellpadding="0" border="0"
                                class="el-table__body tzb" width="100%">
                                <tr class="el-table__row">
                                    <td colspan="2">投注表</td>
                                </tr>
                                <tr>
                                    <td width="22%" class="odds_nickname">昵称</td>
                                    <td width="80%" class="odds_nickname">下注明细</td>
                                </tr>
                                <tr v-for="tz in parseStrJson(item.msg)">
                                    <td>{{ tz.name || '总计' }}</td>
                                    <td width="80%" class="odds_nickname">{{ readerTZbiao(tz) }}</td>

                                </tr>
                            </table>





                        </div>
                    </div>
                    <div v-if="item.msgtype == 4"><!--开牌结果 余分表-->
                        <div class="touxaing" v-if="!item.fromuser.headimage"
                            :style="{ 'background-color': transColor(item.fromuser.nickname) }">{{ item.fromuser.nickname |
                            transTx}}</div>
                        <div class="touxaing" v-if="item.fromuser.headimage">
                            <img :src="item.fromuser.headimage" width="40px" height="40px">
                        </div>
                        <div class="msgcon">
                            <p class="info">{{ item.fromuser.nickname }} {{ item.createtime }}</p>
                            <div class="msgText" v-html="strToRes(item)"></div>
                        </div>

                        <div style="margin-top: 5px;"
                            class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body tzb" width="100%">
                                <tr class="el-table__row">
                                    <td colspan="4">余分表</td>
                                </tr>
                                <tr>
                                    <td>昵称</td>
                                    <td>本局得分</td>
                                    <td>剩余分</td>
                                    <td>初始分</td>
                                </tr>
                                <tr v-for="tz in parseStrJsonData(item.msg)">
                                    <td>{{ tz.name }}</td>
                                    <td>{{ tz.win }}</td>
                                    <td>{{ tz.score }}</td>
                                    <td>{{ tz.score_old }}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="chatVisible = false">关闭</el-button>
            </div>
        </el-dialog>

        <!--新增弹框-->
        <el-dialog :title="editFlag ? '修改牌局' : '新增牌局'" :visible.sync="addVisible" :close-on-click-modal="false"
            width="1200px">
            <el-form size="mini" :model="addForm" label-width="50px" labelWidth="50px" :rules="addFormRules"
                ref="addForm">
                <el-form-item style="margin:10px 0px;" label="桌号" prop="room_id">
                    <el-select v-if="!editFlag" v-model="addForm.room_id" placeholder="请选择">
                        <el-option v-if="item.game_type != -1" v-for="(item, index) in rooms" :key="index"
                            :label="item.mark" :value="item.groupid"></el-option>
                    </el-select>
                    <el-select disabled v-if="editFlag" v-model="addForm.room_id" placeholder="请选择">
                        <el-option v-for="(item, index) in rooms" :key="index" :label="item.mark"
                            :value="item.groupid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin:10px 0px" label="靴号" prop="boots_number">
                    <el-input v-if="!editFlag" v-model="addForm.boots_number" placeholder="靴号"></el-input>
                    <el-input disabled v-if="editFlag" v-model="addForm.boots_number" placeholder="靴号"></el-input>
                </el-form-item>
                <el-form-item style="margin:10px 0px" label="局号" prop="ju">
                    <el-input v-if="!editFlag" v-model="addForm.ju" placeholder="局号"></el-input>
                    <el-input disabled v-if="editFlag" v-model="addForm.ju" placeholder="局号"></el-input>
                </el-form-item>
                <div style="margin-top: 15px;margin-bottom: 15px;">   
                      <el-radio v-model="radio1" label="101" border>修改路单</el-radio>
                      <el-radio v-model="radio1" label="100" border>重新结算</el-radio>
                </div>
                <el-button-group>
                    <el-button @click="changeAddPai('zhuang', 1)"
                        :type="addPai.zhuang == 1 ? 'primary' : 'info'">庄</el-button>
                    <el-button @click="changeAddPai('zhuang', 2)"
                        :type="addPai.zhuang == 2 ? 'primary' : 'info'">闲</el-button>
                    <el-button @click="changeAddPai('zhuang', 3)"
                        :type="addPai.zhuang == 3 ? 'primary' : 'info'">和</el-button>
                    <el-button @click="changeAddPai('zhuang_dui', 1)"
                        :type="addPai.zhuang_dui == 1 ? 'primary' : 'info'">庄对</el-button>
                    <el-button @click="changeAddPai('xian_dui', 1)"
                        :type="addPai.xian_dui == 1 ? 'primary' : 'info'">闲对</el-button>
                    <el-button @click="changeAddPai('lucky_six', 6)"
                        :type="addPai.lucky_six == 6 ? 'primary' : 'info'">幸运六12倍</el-button>
                    <el-button @click="changeAddPai('lucky_six', 7)"
                        :type="addPai.lucky_six == 7 ? 'primary' : 'info'">幸运六20倍</el-button>
                </el-button-group>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
import util from '../../common/js/util'
import moment from 'moment'
import $ from 'jquery'
import { getGamesListPage, getGamesChat, dodeleteGame, getRoomLists, addGame, editGame } from '../../api/api';

export default {
    filters: {
        transTx(val) {
            return val.substr(0, 1);
        },
    },
    data() {
        return {
            total_tm : 0,
            total_tmyk : 0,
            total_khyk : 0,
            total_sb_total : 0,
            total_sbyk : 0,
            total_zxyk_zc : 0,
            radio1: 0,
            auth_type: util.getSessionItem('user', 'auth_type'),
            editFlag: false,
            addLoading: false,
            addFormRules: {
                room_id: [
                    { required: true, message: "请输入桌号", trigger: "blur" }
                ],
                boots_number: [
                    { required: true, message: "请输入靴号", trigger: "blur" }
                ],
                ju: [
                    { required: true, message: "请输入局号", trigger: "blur" }
                ],
            },
            addForm: {
                room_id: "",
                boots_number: "",
                card_game_id: "",
                ju: "",
            },
            addPai: {
                zhuang: "0",
                zhuang_dui: "0",
                xian_dui: "0",
                lucky_six: "",
                room_id: "",
                boots_number: "",
                card_game_id: "",
                ju: "",
            },
            addVisible: false,
            type: 0,
            filters: {
                boots_number: '',
                ju: '',
                room_id: '',
                begin_time: null,
                end_time: null,
            },
            searchParam: {
                boots_number: '',
                ju: '',
                room_id: '',
                begin_time: null,
                end_time: null
            },
            pagination: {
                current: 1,
                size: 50,
                total: 0,
            },
            tableHeight: "500",
            rooms: [],
            gamelist: [],
            gameChat: [],
            chatTitle: "",
            listLoading: false,
            chatlistLoading: false,

            editFormVisible: false,//编辑界面是否显示
            chatVisible: false,//聊天界面
            editLoading: false,
        }
    },
    methods: {
        onUpdateCardGame(data) {
            this.getGameLists();
            this.$root.Event.$emit("hideWindowsLoading")
            if(data.code && data.set && data.code==500 && data.set==100){
                this.$message({
                    message: data.msg,
                    type: 'error'
                });
                return;
            }
            this.$message({
                message: '操作成功',
                type: 'success'
            });
        },
        readerTZbiao(res) {
            var text = "/";
            if (res.HeiNiu != 0) {
                text += "黑牛" + res.HeiNiu + "/";
            }
            if (res.HongNiu != 0) {
                text += "红牛" + res.HongNiu + "/";
            }
            if (res.He != 0) {
                text += "和" + res.He + "/";
            }

            if (res.Niu1 != 0) {
                text += "牛一" + res.Niu1 + "/";
            }
            if (res.Niu2 != 0) {
                text += "牛二" + res.Niu2 + "/";
            }
            if (res.Niu3 != 0) {
                text += "牛三" + res.Niu3 + "/";
            }
            if (res.Niu4 != 0) {
                text += "牛四" + res.Niu4 + "/";
            }
            if (res.Niu5 != 0) {
                text += "牛五" + res.Niu5 + "/";
            }
            if (res.Niu6 != 0) {
                text += "牛六" + res.Niu6 + "/";
            }
            if (res.Niu7 != 0) {
                text += "牛七" + res.Niu7 + "/";
            }
            if (res.Niu8 != 0) {
                text += "牛八" + res.Niu8 + "/";
            }
            if (res.Niu9 != 0) {
                text += "牛九" + res.Niu9 + "/";
            }
            if (res.NiuNiu != 0) {
                text += "牛牛" + res.NiuNiu + "/";
            }
            if (res.ShuangNiu != 0) {
                text += "双牛牛" + res.ShuangNiu + "/";
            }
            if (res.HongNFB != 0) {
                text += "红牛翻倍" + res.HongNFB + "/";
            }
            if (res.HeiNFB != 0) {
                text += "黑牛翻倍" + res.HeiNFB + "/";
            }
            if (res.SuperNius != 0) {
                text += "银牛金牛炸弹五小牛" + res.SuperNius + "/";
            }
            text = text.substr(1);
            text = text.substring(0, text.length - 1)
            return text;
        },
        searchWinQuickly(type) {
            if (type == 1) {
                this.filters.begin_time = moment().startOf('isoWeek').add(0, "hours")
                this.filters.end_time = moment().endOf('isoWeek').add(0, "hours")
            }
            if (type == 2) {
                this.filters.begin_time = moment().isoWeek(moment().isoWeek() - 1).startOf('isoWeek').add(0, "hours")
                this.filters.end_time = moment().isoWeek(moment().isoWeek() - 1).endOf('isoWeek').add(0, "hours")
            }
            if (type == 3) {
                this.filters.begin_time = moment().startOf('month').add(0, "hours")
                this.filters.end_time = moment().endOf('month').add(0, "hours")
            }
            if (type == 4) {
                this.filters.begin_time = moment().month(moment().month() - 1).startOf('month').add(0, "hours")
                this.filters.end_time = moment().month(moment().month() - 1).endOf('month').add(0, "hours")
            }
            if (type == 5) {
                this.filters.begin_time = moment().startOf('days').add(0, "hours")
                this.filters.end_time = moment().endOf('days').add(0, "hours")
            }
            if (type == 6) {
                this.filters.begin_time = moment().subtract('days', 1).startOf('days').add(0, "hours")
                this.filters.end_time = moment().subtract('days', 1).endOf('days').add(0, "hours")
            }
            this.pagination.current = 1;
            this.searchParam = this.filters;
            this.getGameLists();
        },
        editGame(row) {
            this.editFlag = true,
                this.addVisible = true;
            console.log('rowrow', row);
            console.log('this.rooms', this.rooms);
            var rindex = this.rooms.findIndex(item => (item.groupid == row.room_id))
            this.addForm = {
                room_id: this.rooms[rindex].groupid,
                boots_number: row.boots_number,
                card_game_id: row.card_game_id,
                ju: row.ju,
            },
                this.addPai = {
                    zhuang: row.zhuang,
                    zhuang_dui: row.zhuang_dui,
                    xian_dui: row.xian_dui,
                    lucky_six: row.lucky_six,
                    room_id: this.rooms[rindex].groupid,
                    boots_number: row.boots_number,
                    card_game_id: row.card_game_id,
                    ju: row.ju,
                }
        },
        changeAddPai(type, val) {
            if (type == 'zhuang') {
                if (this.addPai['zhuang'] == val) {
                    this.addPai['zhuang'] = ""
                    this.addPai['lucky_six'] = ""
                } else {
                    this.addPai['zhuang'] = val;
                    if (val == 2 || val == 3) {
                        this.addPai['lucky_six'] = ""
                    }
                }
            } else if (type == 'zhuang_dui' || type == 'xian_dui') {
                if (this.addPai[type] == val) {
                    this.addPai[type] = "0"
                } else {
                    this.addPai[type] = val;
                }
            } else if (type == 'lucky_six') {
                if (this.addPai['lucky_six'] == val) {
                    this.addPai['lucky_six'] = ""
                } else {
                    this.addPai['zhuang'] == 1 && (this.addPai['lucky_six'] = val);

                }
            }
        },
        addSubmit() {
            if (this.radio1 == 0) {
                this.$message({
                    message: "请选择操作类型(修改路单或重新结算)",
                    type: 'info'
                });
                return;
            }
            if (!this.addPai.zhuang) {
                this.$message({
                    message: "结果庄，闲，和必须选择一项",
                    type: 'info'
                });
                return;
            }
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    if (this.editFlag) {
                        this.addVisible = false,
                        this.$root.Event.$emit("showWindowsLoading")
                        this.$store.getters.imClient.send(
                            JSON.stringify({
                                //{"cmd":4210,"set":101,"y":1,"zd":0,"xd":0,"xy":6,"lq":0,"fb":0,"super_he":0,"gameID":0,"groupid":0,"room_id":0,"boots_number":0,"ju":0,}
                                //{"cmd":4210,"set":100,"groupid":100,"gameID":402,"y":1,"zd":0,"xd":0,"xy":0,"lq":0,"fb":"0","super_he":"0"}
                                "cmd": 4210, // 固定值
                                "set": this.radio1,//101 修改路单 100 重新结算
                                "y": this.addPai.zhuang,
                                "zd": this.addPai.zhuang_dui,
                                "xd": this.addPai.xian_dui,
                                "xy": this.addPai.lucky_six,
                                "lq": 0,
                                "fb": 0,
                                "super_he": 0,
                                "gameID": this.addForm.card_game_id,
                                "groupid": this.addForm.room_id,
                                "room_id": this.addForm.room_id,
                                "boots_number": this.addPai.boots_number,
                                "ju": this.addPai.ju,
                            })
                        );
                        return;
                    }
                }
            })
        },
        addGameRes() {
            this.addForm = {
                room_id: "",
                boots_number: "",
                card_game_id: "",
                ju: "",
            },
                this.addPai = {
                    zhuang: "",
                    zhuang_dui: "0",
                    xian_dui: "0",
                    lucky_six: "",
                }

            this.editFlag = false,
                this.addVisible = true;
        },
        deleteGame(row) {
            this.$confirm('确认删除吗?', '提示', {
                type: 'info'
            }).then(() => {
                var para = {
                    card_game_id: row.card_game_id,
                    game_type: row.game_type,
                }
                dodeleteGame(para).then((res) => {
                    if (res.code == 200) {
                        this.getGameLists();
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
                }).catch((res) => {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                })
            })
        },
        goRes(type) {
            this.type = type;
            this.getGameLists();
        },
        searchGame() {
            this.pagination.current = 1;
            this.searchParam = this.filters;
            this.getGameLists();
        },
        strToRes(resp) {
            var msg = JSON.parse(resp.msg);
            var htmlStr = "";
            if (this.type == 0) {
                htmlStr += "<span style='color: #C23A2C;'>庄家:" + msg.zhuang_dian + "点</span><br>";
                htmlStr += "<span style='color: #469CDC;'>闲家:" + msg.xian_dian + "点</span><br>";
                htmlStr += "<span style='color: #30615E'>|</span>"

                if (msg.zxh == 1) {
                    htmlStr += "<span style='color: #C23A2C'>庄赢</span>"
                } else if (msg.zxh == 2) {
                    htmlStr += "<span style='color: #3978F3'>闲赢</span>"
                } else if (msg.zxh == 3) {
                    htmlStr += "<span style='color: #5AAD3E'>和局</span>"
                }

                htmlStr += "<span style='color: #30615E'>|</span>";
                var dui = "";
                if (msg.zhuang_dui == 4) {
                    dui = "<span style='color: #DD4729'>庄对</span>"
                }
                if (msg.xian_dui == 5) {
                    dui = "<span style='color: #469CDC'>闲对</span>"
                }
                if (msg.zhuang_dui == 0 && msg.xian_dui == 0) {
                    dui = "<span>无对</span>"
                }
                if (msg.zhuang_dui != 0 && msg.xian_dui != 0) {
                    dui = "<span>双对</span>"
                }
                htmlStr += dui;
                htmlStr += "<span style='color: #30615E'>|</span>";
                if (msg.lucky_six == 6) {
                    htmlStr += "<span style='color: #A84F89'>幸运六12倍</span>"
                }
                if (msg.lucky_six == 7) {
                    htmlStr += "<span style='color: #D14382'>幸运六20倍</span>"
                }
            } else if (this.type == 1) {
                htmlStr += "<span style='color: #C23A2C;'>龙:" + msg.zhuang_dian + "点</span><br>";
                htmlStr += "<span style='color: #469CDC;'>虎:" + msg.xian_dian + "点</span><br>";
                if (msg.zxh == 1) {
                    htmlStr += "<span style='color: #C23A2C'>龙赢</span>"
                } else if (msg.zxh == 2) {
                    htmlStr += "<span style='color: #3978F3'>虎赢</span>"
                } else if (msg.zxh == 3) {
                    htmlStr += "<span style='color: #5AAD3E'>和局</span>"
                }
            } else if (this.type == 2) {
                htmlStr += "<span style='color: #C23A2C;'>龙:" + msg.vo3094.l_msg + "</span><br>";
                htmlStr += "<span style='color: #469CDC;'>凤:" + msg.vo3094.f_msg + "</span><br>";
                htmlStr += "<span style=''>" + msg.vo3094.resultWin + "</span>"

            } else if (this.type == 3) {
                htmlStr += "<span style='color: #C23A2C;'>红牛:" + msg.vo3094.l_msg + "</span><br>";
                htmlStr += "<span style='color: #469CDC;'>黑牛:" + msg.vo3094.f_msg + "</span><br>";
                htmlStr += "<span style=''>" + msg.vo3094.resultWin + "</span>"
            }

            return htmlStr
        },
        parseStrJsonData(str) {
            console.log(JSON.parse(str));
            return JSON.parse(str)['data'];
        },
        parseStrJson(str) {
            console.log(JSON.parse(str));
            return JSON.parse(str)[0];
        },
        transColor(val) {
            console.log(val)
            var name = val;
            var str = '';
            for (var i = 0; i < name.length; i++) {
                str += parseInt(name[i].charCodeAt(0), 13).toString(16);
            }
            return '#' + str.slice(1, 4);
        },
        handleChat(row) {
            //获取聊天数据
            this.gameChat = [];
            this.chatlistLoading = true;
            this.chatTitle = `${row.room_id}桌${row.boots_number}-${row.ju}局 聊天记录`;
            var par = {
                card_game_id: row.card_game_id,
                game_type: this.type
                // card_game_id:493
            }
            getGamesChat(par).then((res) => {
                this.chatlistLoading = false;
                this.gameChat = res.data.reverse();
            });
            this.chatVisible = true;
        },
        handleSizeChange(val) {
            this.pagination.size = val;
            this.getGameLists();
        },
        handleCurrentChange(val) {
            this.pagination.current = val;
            this.getGameLists();
        },
        //获取牌局列表
        getGameLists() {
            let para = {
                pageNumber: this.pagination.current,
                pageSize: this.pagination.size,
                game_type: this.type,
                agents_id: util.getSessionItem('user', 'agents_id'),
                boots_number: this.searchParam.boots_number,
                room_id: this.searchParam.room_id,
                ju: this.searchParam.ju,
                begin_time: this.searchParam.begin_time == null ? "" : moment(this.searchParam.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                end_time: this.searchParam.end_time == null ? "" : moment(this.searchParam.end_time).format("YYYY-MM-DD HH:mm:ss"),
            };
            this.listLoading = true;
            getGamesListPage(para).then((res) => {
                this.pagination.total = res.data.total;
                this.total_tm = res.data.total_tm;
                this.total_tmyk = res.data.total_tmyk;
                this.total_khyk = res.data.total_khyk;
                this.total_sb_total = res.data.total_sb_total;
                this.total_sbyk = res.data.total_sbyk;
                this.total_zxyk_zc = res.data.total_zxyk_zc;
                this.gamelist = res.data.data;
                this.listLoading = false;
            });
        },
        autoTableHeight() {
            this.$nextTick(() => {
                this.tableHeight = $(".content-container").height() - $(".toptoolbar").height() - 120
                setTimeout(() => {
                    for (var i = 0; i < $(".tableStyle").length; i++) {
                        $(".tableStyle").eq(i).find(".is-scrolling-left").width($(".tableStyle").eq(i).find(".el-table__header").width())
                    }
                }, 500)
            })
        },
        fetchRoomLists() {
            //NProgress.start();
            getRoomLists().then((res) => {
                if (res.code == 200) {
                    this.rooms = res.data.rooms;
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'info'
                    });
                }
            }).catch((res) => {
                this.$message({
                    message: res.msg,
                    type: 'error'
                });
            })
        },
    },
    mounted() {
        this.$store.getters.imClient.bindUpdateCardGame(this.onUpdateCardGame);
        this.fetchRoomLists();
        this.getGameLists();
        this.autoTableHeight();
        $(window).resize(() => {
            this.autoTableHeight();
        })
    }
}

</script>
<style lang="scss" scoped>
.page-container {
    font-size: 20px;
    text-align: center;
    color: rgb(192, 204, 218);
}

.chat-item {
    margin: 10px;
    min-height: 40px;
}

.touxaing {
    float: left;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
}

.msgcon {
    max-width: 100%;
    margin-left: 45px;

    .info {
        height: 24px;
        line-height: 24px;
        margin: 0px;
    }

    .msgText {
        padding: 10px;
        background: #D0B183;
        border-radius: 5px;
    }
}

.tzb {
    tr {
        td {
            text-align: center;
        }
    }
}
.noChat {
    text-align: center;
    padding: 10px;
}
</style>
<template>
    <section>
        <!--列表-->
        <el-table @row-click="clicked" :row-class-name="plugin.tableRowClassName"   size="mini" border :data="user" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
           <el-table-column prop="uid" label="会员ID" min-width="50">

           </el-table-column>
            <!-- <el-table-column prop="username" label="会员账号" min-width="100" sortable>
            </el-table-column> -->
            <el-table-column prop="name" label="会员名称" min-width="100" sortable>
               
            </el-table-column>
            <el-table-column prop="username" label="会员账号" min-width="80" sortable>
            </el-table-column>

            <el-table-column prop="agents_account" label="代理账号" min-width="80" sortable>

            </el-table-column>
            <el-table-column prop="agents_name" label="代理名称" min-width="80" sortable>

            </el-table-column>
             <el-table-column prop="relation_link" label="代理关系" min-width="330">
                
            </el-table-column>
            <!-- <el-table-column prop="level" label="层级" min-width="60">
            </el-table-column> -->
            <el-table-column prop="score" label="余额" min-width="60" sortable>
            </el-table-column>
            <el-table-column prop="xm_rate" label="积分比例" min-width="90" sortable>
            </el-table-column>
            <el-table-column prop="integral" label="剩余积分" min-width="90" sortable>
            </el-table-column>
            <!-- <el-table-column prop="xm_type" label="洗码类型" min-width="80" sortable>
                <template slot-scope="scope">
                    <a v-if="scope.row.xm_type == 1" >单边</a>
                    <a v-if="scope.row.xm_type == 2" >双边</a>
                </template>
            </el-table-column>
            <el-table-column prop="xm_rate" label="洗码率(%)" min-width="110" sortable>
            </el-table-column>
            <el-table-column prop="sb_xm_rate" label="四宝洗码率(%)" min-width="120" sortable>
            </el-table-column> -->
            <el-table-column prop="status" label="状态" min-width="30">
                <template slot-scope="scope">
                    <a v-if="scope.row.status == 0" style="color: #00c853">启用</a>
                    <a v-if="scope.row.status == 1" style="color: red">停用</a>
                    <a v-if="scope.row.no_say == 1" style="color: red">禁言</a>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="user_desc" label="备注" >
            </el-table-column> -->
            <el-table-column label="操作" min-width="360">
                <template slot-scope="scope" v-if="!scope.row.countt">
                    <div>
                        <input type="hidden" :value="scope.row.uid">
                        <a style="color: #20a0ff;cursor: pointer" size="mini" @click="handleMemberDetail(scope.row)">详情</a>
                        <!-- <a style="color: #20a0ff;cursor: pointer" size="mini" @click="handleLiushui(scope.row)">流水明细</a> -->
                    <el-divider v-if="agent_type == 3 || scope.row.agents_account == auth_account" direction="vertical"></el-divider>
                        <a v-if="agent_type == 3 || scope.row.agents_account == auth_account" style="color: #20a0ff;cursor: pointer" size="mini" @click="handleFen(scope.row,1)">上分</a>
                    <!-- <el-divider  direction="vertical"></el-divider>
                        <a  style="color: #20a0ff;cursor: pointer" size="mini" @click="handleFen(scope.row,2)">下分</a> -->
                    <!-- <el-divider v-if="auth_type == 1" direction="vertical"></el-divider>

                    <a v-if="auth_type == 1" style="color: #20a0ff;cursor: pointer" size="mini" @click="handleJiFen(scope.row,1)">上积分</a> -->
                    
                    <!-- <el-divider  direction="vertical"></el-divider>
                        <a style="color: #20a0ff;cursor: pointer" size="mini" @click="handleudfen(scope.row)">上下分明细</a> -->
                    <el-divider  v-if="scope.row.playid" direction="vertical"></el-divider>
                    <a v-if="scope.row.playid" style="color: #20a0ff;cursor: pointer" @click="readerChat(scope.row)" size="mini">聊天</a>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="pagination.current" :page-sizes="[50, 100, 300]" :page-size="pagination.size" :total="pagination.total" style="float:right;">
            </el-pagination>
        </el-col>

        <iframe id="iframeForm" name="iframeForm" style="display:none;"></iframe>
        <!--编辑会员弹框-->
        <el-dialog title="编辑会员" :visible.sync="editFormVisible" :close-on-click-modal="false" width="1000px">
            <el-form size="mini" :model="editForm" label-width="80px" :rules="editFormRules" labelWidth="100px" ref="editForm">
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                    <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px" label="会员头像">
                                    <input style="display: none;" type="file" name="filename" id="filename" @change="uploadfile()">  
                                    <div @click="triggerUpload()">
                                         <el-avatar :src="editForm.head"></el-avatar>           
                                    </div> 
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px" label="会员昵称" prop="name">
                                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                 <el-form-item style="margin:0px 5px" label="代理账号" prop="agent_id">
                                    <el-input readonly  v-model="editForm.agents_account"></el-input>
                                </el-form-item>
                                <!-- <el-form-item style="margin:0px 5px"  label="登录账号" prop="username">
                                    <el-input readonly v-model="editForm.username"  auto-complete="off"></el-input>
                                </el-form-item> -->
                            </td>
                            <td>
                                 <el-form-item style="margin:0px 5px" label="代理名称" prop="agent_name">
                                    <el-input readonly  v-model="editForm.agents_name"></el-input>
                                </el-form-item>
                                <!-- <el-form-item style="margin:0px 5px" label="密码" prop="password">
                                    <el-input v-model="editForm.password" auto-complete="off"></el-input>
                                </el-form-item> -->
                            </td>
                        </tr>
                        <!-- <tr class="el-table__row">
                            <td>
                               
                            </td>
                            <td>
                               
                            </td>
                            <td> -->
                                <!-- <el-form-item style="margin:0px 5px" label="代理余分" prop="agent_name">
                                    <el-input readonly  v-model="editForm.agent_score"></el-input>
                                </el-form-item> -->
                            <!-- </td>
                        </tr> -->
                        <!-- <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px" label="洗码率" prop="xm_rate">
                                    <el-input  v-model="editForm.xm_rate" auto-complete="off">
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px" label="占成比例" prop="agents_share_rate">
                                    <el-input  v-model="editForm.agents_share_rate" auto-complete="off">
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px" label="洗码类型" prop="xm_type">
                                    <el-radio-group v-model="editForm.xm_type">
                                        <el-radio label="1">单边洗码</el-radio>
                                        <el-radio label="2">双边洗码</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </td>
                        </tr> -->
                        <tr class="el-table__row">
                            <td colspan="4">
                                <el-form size="mini" :inline="true">
                                    <el-form-item label="手机">
                                        <el-input style="width: 150px;" v-model="editForm.phone"></el-input>
                                    </el-form-item>
                                    <el-form-item label="微信">
                                        <el-input style="width: 150px;"  v-model="editForm.wxchat"></el-input>
                                    </el-form-item>
                                    <el-form-item label="QQ">
                                        <el-input style="width: 150px;"  v-model="editForm.qq"></el-input>
                                    </el-form-item>
                                    <el-form-item label="银行卡号">
                                        <el-input style="width: 180px;"  v-model="editForm.bankcard"></el-input>
                                    </el-form-item>
                                </el-form>
                            </td>
                        </tr>


                        <!-- <tr>
                            <td colspan="3">
                                <el-form-item :inline-message="true"  style="margin:0px 5px;" label-width="100" label="限红配置（最高限红不能大于最低限红的1000倍）" prop="xh_config">
                                    <input type="hidden" v-model="xh_config">
                                </el-form-item>
                                <el-row class="xhconfig">
                                    <el-col :span="24">
                                        <div class="block" style="padding: 0 10px;">
                                            <div>庄闲/龙虎最低限红: <span style="font-size: 20px;font-weight: bolder;">{{editForm.zx_min}}</span></div>
                                            <el-row>
                                                <el-col :span="2" style="line-height: 38px;text-align: left;">10</el-col>
                                                <el-col :span="20"><el-slider :step="10"  @change="editXHSliderChange(0)" :min="10" :max="10000" v-model="editForm.zx_min"></el-slider></el-col>
                                                <el-col :span="2" style="line-height: 38px;text-align: right;">10000</el-col>
                                            </el-row>
                                        </div>
                                        <div class="block" style="padding: 0 10px;">
                                            <div>庄闲/龙虎最高限红: <span style="font-size: 20px;font-weight: bolder;">{{editForm.zx_max}}</span></div>
                                            <el-row>
                                                <el-col :span="2" style="line-height: 38px;text-align: left;">1000</el-col>
                                                <el-col :span="20"><el-slider :step="1000" @change="editXHSliderChange(1)" :min="1000" :max="100000" v-model="editForm.zx_max"></el-slider></el-col>
                                                <el-col :span="2" style="line-height: 38px;text-align: right;">100000</el-col>
                                            </el-row>
                                        </div>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-table ref="xhTableEdit" size="mini" :data="editForm.xh" highlight-current-row style="width: 90%;margin: 0 auto; border-left: 1px solid #000;">

                                            <el-table-column label="" width="55">
                                                <template slot-scope="scope">
                                                    <el-radio :label="scope.row.id" v-model="xh_config" @change.native="changeXh_config(scope.row.id)">&nbsp;</el-radio>
                                                </template>
                                            </el-table-column>

                                            <el-table-column prop="mark" label="名称">

                                            </el-table-column>
                                            <el-table-column label="三宝">
                                                <template slot-scope="scope">
                                                    三宝:最低 {{scope.row.sb_min}} | 最高 {{scope.row.sb_max}}
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="幸运六">
                                                <template slot-scope="scope">
                                                    幸运六:最低 {{scope.row.lucky_six_min}} | 最高 {{scope.row.lucky_six_max}}
                                                </template>
                                            </el-table-column>
                                        </el-table>

                                    </el-col>
                                </el-row>
                            </td>
                        </tr> -->
                        <!-- <tr class="el-table__row">
                            <td colspan="3">
                                <div class="block" style="padding: 0 10px;">
                                    <span>个人额外抽水值</span>
                                    <el-row style="width: 450px;">
                                        <el-col :span="2" style="line-height: 38px;text-align: left;">0%</el-col>
                                        <el-col :span="16"><el-slider :min="0" :max="20" v-model="editForm.extra_share"></el-slider></el-col>
                                        <el-col :span="2" style="line-height: 38px;text-align: right;">20%</el-col>
                                        <el-col :span="4" style="line-height: 38px;text-align: right;"><span style="font-size: 20px;font-weight: bolder;">值:{{editForm.extra_share}}%</span></el-col>
                                    </el-row>
                                </div>
                            </td>
                        </tr> -->

                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px" label="积分比例" prop="xm_rate">
                                    <el-input  v-model="editForm.xm_rate" auto-complete="off">
                                    </el-input>
                                </el-form-item>
                            </td>
                            <td colspan="3">
                                <el-form-item style="margin:0px 5px" label="操作">
                                    <el-checkbox @change="changeStatus"  v-model="editForm.status == 1" >停用</el-checkbox>
                                    <el-checkbox @change="changeNosay" v-model="editForm.no_say == 1">禁言</el-checkbox>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr class="el-table__row">
                            <td colspan="4">
                                <el-form-item style="margin:0px 5px" label="备注">
                                    <el-input type="textarea" v-model="editForm.user_desc"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                    </table>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editUserSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--上下分弹框-->
        <el-dialog :title="fenFilters.user.name+'-'+ (fenFilters.type == 1 ? '上分':'下分')" :visible.sync="fenVisible" :close-on-click-modal="false" width="800px">

            <el-form size="small" :inline="true" class="demo-form-inline">
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                    <table  cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="会员名称">
                                    <el-input readonly v-model="fenFilters.yufen.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                 <el-form-item style="margin:0px 5px;" label="会员ID">
                                    <el-input readonly v-model="fenFilters.user.uid" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label="代理余分">
                                    <el-input readonly v-model="fenFilters.yufen.agent_score" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="当前额度">
                                    <el-input readonly v-model="fenFilters.yufen.score" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                             <td colspan="2">
                                 <el-form-item style="margin:0px 5px;" :label="fenFilters.type == 1 ? '增加额度':'减少额度'">
                                    <el-input autocomplete="off"  :placeholder="fenFilters.type == 1 ? '增加额度':'减少额度'" v-model="fenFilters.value"></el-input>
                                   <input style="display:none">
                               </el-form-item>
                               
                            </td>
                           
                        </tr>
                        <!-- <tr class="el-table__row">
                           <td colspan="2">
                               
                           </td>
                        </tr> -->
                        <!-- <tr class="el-table__row">
                            <td colspan="2">
                                <form>
                                <el-form-item style="margin:0px 5px;" label="登录密码">
                                    <el-input type="password" autocomplete="off" placeholder="登录密码" v-model="fenFilters.password"></el-input>
                                </el-form-item>
                                </form>
                            </td>
                        </tr> -->
                    </table>
                </div>
          </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmitFen(fenFilters.type)">提交</el-button>
                <el-button @click.native="fenVisible = false">关闭</el-button>
            </div>
        </el-dialog>

 <!--上下积分分弹框-->
        <el-dialog :title="jifenFilters.user.name+'-'+ (jifenFilters.type == 1 ? '上积分':'下积分')" :visible.sync="jifenVisible" :close-on-click-modal="false" width="1000px">

            <el-form size="small" :inline="true" class="demo-form-inline">
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                    <table  cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="会员名称">
                                    <el-input readonly v-model="jifenFilters.user.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                 <el-form-item style="margin:0px 5px;" label="会员ID">
                                    <el-input readonly v-model="jifenFilters.user.uid" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                           
                        </tr>
                        <tr class="el-table__row">
                            <td>
                                <el-form-item style="margin:0px 5px;" label="会员积分比例">
                                    <el-input readonly v-model="jifenFilters.user.xm_rate" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item style="margin:0px 5px;" label="结算类型" prop="jslx">
                                    <el-radio v-model="jifenFilters.jslx" label="0">正常结算</el-radio>
                                    <el-radio v-model="jifenFilters.jslx" label="1">提前结算</el-radio>
                                </el-form-item>
                            </td>
                           
                        </tr>
                        <tr class="el-table__row">
                            <!-- <td>
                                <el-form-item style="margin:0px 5px;" label="当前额度">
                                    <el-input readonly v-model="fenFilters.yufen.score" auto-complete="off"></el-input>
                                </el-form-item>
                            </td> -->
                            <td>
                                <el-form-item style="margin:0px 5px;" label="剩余积分">
                                    <el-input readonly v-model="jifenFilters.yufen.integral" auto-complete="off"></el-input>
                                </el-form-item>
                            </td>
                             <td>
                                 <el-form-item style="margin:0px 5px;" :label="jifenFilters.type == 1 ? '增加积分':'减少积分'">
                                    <el-input autocomplete="off"  :placeholder="jifenFilters.type == 1 ? '增加积分':'减少积分'" v-model="jifenFilters.value"></el-input>
                                   <input style="display:none">
                               </el-form-item>
                             </td>
                            
                                <!-- <el-form-item style="margin:0px 5px;" label="上级额度">
                                    <el-input readonly v-model="fenFilters.yufen.agent_score" auto-complete="off"></el-input>
                                </el-form-item> -->
                            <!-- </td> -->
                        </tr>
                        <!-- <tr class="el-table__row">
                           <td colspan="2">
                               
                           </td>
                        </tr> -->
                        <!-- <tr class="el-table__row">
                           <td colspan="2">
                                <form>
                                <el-form-item style="margin:0px 5px;" label="登录密码">
                                    <el-input type="password" autocomplete="off" placeholder="登录密码" v-model="jifenFilters.password"></el-input>
                                </el-form-item>
                                </form>
                            </td>
                        </tr> -->
                    </table>
                </div>
          </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmitjiFen(jifenFilters.type)">提交</el-button>
                <el-button @click.native="jifenVisible = false">关闭</el-button>
            </div>
        </el-dialog>

       


        <!--新增界面-->
        <el-dialog :title="currentAgent.agents_name+'添加会员'" :visible.sync="addFormVisible" :close-on-click-modal="false" width="1200px">
            <el-form size="mini" :model="addForm" label-width="80px" labelWidth="100px" :rules="addFormRules" ref="addForm" >
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                    <tr class="el-table__row">
                        <td>
                            <el-form-item style="margin:0px 5px"  label="头像" prop="head">
                                <input style="display: none;" type="file" name="filename" id="uploadfileAdd" @change="uploadfileAdd()">  
                                <div @click="triggerUploadAdd()">
                                        <el-avatar :src="addForm.head"></el-avatar>           
                                </div> 
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item style="margin:0px 5px"  label="会员昵称" prop="name">
                                <el-input v-model="addForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item style="margin:0px 5px"  label="会员账号" prop="username">
                                <el-input v-model="addForm.username" auto-complete="off"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item style="margin:0px 5px" label="初始密码" prop="password">
                                <el-input v-model="addForm.password" auto-complete="off"></el-input>
                            </el-form-item>
                        </td>
                         
                    </tr>
                    <tr class="el-table__row">
                        <td>
                            <el-form-item style="margin:0px 5px" label="积分比例" prop="xm_rate">
                                <el-input  v-model="addForm.xm_rate" auto-complete="off">
                                </el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item style="margin:0px 5px" label="代理账号" prop="agent_id">
                                <el-input readonly  v-model="addForm.agents_account"></el-input>
                            </el-form-item>
                        </td>
                        <!-- <td>
                            <el-form-item style="margin:0px 5px" label="代理名称" prop="agent_name">
                                <el-input readonly  v-model="addForm.agents_name"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                             <el-form-item style="margin:0px 5px" label="代理余分" prop="agent_name">
                                <el-input readonly  v-model="addForm.agent_score"></el-input>
                            </el-form-item>
                        </td> -->
                        <td></td>
                        <td></td>
                    </tr>
                    <!-- <tr class="el-table__row">
                        <td>
                            <el-form-item style="margin:0px 5px" label="洗码率" prop="xm_rate">
                                <el-input  v-model="addForm.xm_rate" auto-complete="off">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item style="margin:0px 5px" label="占成比例" prop="agents_share_rate">
                                <el-input  v-model="addForm.agents_share_rate" auto-complete="off">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item style="margin:0px 5px" label="洗码类型" prop="xm_type">
                                <el-radio-group v-model="addForm.xm_type">
                                    <el-radio label="1">单边洗码</el-radio>
                                    <el-radio label="2">双边洗码</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </td>
                    </tr> -->
                    <tr class="el-table__row">
                        <td colspan="4">
                            <el-form size="mini" :inline="true">
                                <el-form-item label="手机">
                                    <el-input style="width: 150px;" v-model="addForm.phone"></el-input>
                                </el-form-item>
                                <el-form-item label="微信">
                                    <el-input style="width: 150px;"  v-model="addForm.wxchat"></el-input>
                                </el-form-item>
                                <el-form-item label="QQ">
                                    <el-input style="width: 150px;"  v-model="addForm.qq"></el-input>
                                </el-form-item>
                                <el-form-item label="银行卡号">
                                    <el-input style="width: 180px;"  v-model="addForm.bankcard"></el-input>
                                </el-form-item>
                            </el-form>
                        </td>
                    </tr>


                    <!-- <tr>
                        <td colspan="3">
                            <el-form-item :inline-message="true" style="margin:0px 5px;" label-width="100" label="限红配置（最高限红不能大于最低限红的1000倍）" prop="xh_config">
                                <input type="hidden" v-model="xh_config">
                            </el-form-item>
                            <el-row class="xhconfig">
                                <el-col :span="24">
                                    <div class="block" style="padding: 0 10px;">
                                        <div>庄闲/龙虎最低限红: <span style="font-size: 20px;font-weight: bolder;">{{addForm.zx_min}}</span></div>
                                        <el-row>
                                            <el-col :span="2" style="line-height: 38px;text-align: left;">10</el-col>
                                            <el-col :span="20"><el-slider  :step="10" @change="addXHSliderChange(0)" :min="10" :max="10000" v-model="addForm.zx_min"></el-slider></el-col>
                                            <el-col :span="2" style="line-height: 38px;text-align: right;">10000</el-col>
                                        </el-row>
                                    </div>
                                    <div class="block" style="padding: 0 10px;">
                                        <div>庄闲/龙虎最高限红: <span style="font-size: 20px;font-weight: bolder;">{{addForm.zx_max}}</span></div>
                                        <el-row>
                                            <el-col :span="2" style="line-height: 38px;text-align: left;">1000</el-col>
                                            <el-col :span="20"><el-slider  :step="1000" @change="addXHSliderChange(1)" :min="1000" :max="100000" v-model="addForm.zx_max"></el-slider></el-col>
                                            <el-col :span="2" style="line-height: 38px;text-align: right;">100000</el-col>
                                        </el-row>
                                        </div>
                                </el-col>
                                <el-col :span="24">
                                    <el-table ref="xhTableAdd" size="mini" :data="addForm.xh" highlight-current-row style="width: 90%;margin: 0 auto; border-left: 1px solid #000;">
                                        <el-table-column label="" width="55">
                                            <template slot-scope="scope">
                                                <el-radio :label="scope.row.id" v-model="xh_config" @change.native="changeXh_config(scope.row.id)">&nbsp;</el-radio>
                                            </template>
                                        </el-table-column>

                                        <el-table-column prop="mark" label="名称">

                                        </el-table-column> -->

<!--                                        <el-table-column label="庄闲">-->
<!--                                            <template slot-scope="scope">-->
<!--                                                庄闲:最低 {{scope.row.zx_min}} | 最高 {{scope.row.zx_max}}-->
<!--                                            </template>-->
<!--                                        </el-table-column>-->
                                        <!-- <el-table-column label="三宝">
                                            <template slot-scope="scope">
                                                三宝:最低 {{scope.row.sb_min}} | 最高 {{scope.row.sb_max}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="幸运六">
                                            <template slot-scope="scope">
                                                幸运六:最低 {{scope.row.lucky_six_min}} | 最高 {{scope.row.lucky_six_max}}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </td>
                    </tr> -->
                    <!-- <tr class="el-table__row">
                        <td colspan="3">
                            <div class="block" style="padding: 0 10px;">
                                <span>个人额外抽水值</span>
                                <el-row style="width: 450px;">
                                    <el-col :span="2" style="line-height: 38px;text-align: left;">0%</el-col>
                                    <el-col :span="16"><el-slider :min="0" :max="20" v-model="addForm.extra_share"></el-slider></el-col>
                                    <el-col :span="2" style="line-height: 38px;text-align: right;">20%</el-col>
                                    <el-col :span="4" style="line-height: 38px;text-align: right;"><span style="font-size: 20px;font-weight: bolder;">值:{{addForm.extra_share}}%</span></el-col>
                                </el-row>
                            </div>
                        </td>
                    </tr> -->
                    <tr class="el-table__row">
                        <td colspan="4">
                            <el-form-item style="margin:0px 5px" label="备注">
                                <el-input type="textarea" v-model="addForm.user_desc"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addUserSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


 <!--新增机器人界面-->
        <el-dialog :title="currentAgent.agents_name+'添加机器人'" :visible.sync="addFormRobotVisible" :close-on-click-modal="false" width="1000px">
            <el-form size="mini" :model="addFormRobot" label-width="80px" labelWidth="100px" :rules="addFormRobotRules" ref="addFormRobot" >
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                    <tr class="el-table__row">
                        <td>
                            <el-form-item style="margin:0px 5px"  label="头像" prop="head">
                                <input style="display: none;" type="file" name="filename" id="uploadfileRobot" @change="uploadfileRobot()">  
                                <div @click="triggerUploadRobot()">
                                        <el-avatar :src="addFormRobot.head"></el-avatar>           
                                </div> 
                            </el-form-item>
                        </td>
                         <td>
                            <el-form-item style="margin:0px 5px" label="昵称" prop="name">
                                <el-input v-model="addFormRobot.name" auto-complete="off"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item style="margin:0px 5px" label="余分" prop="score">
                                <el-input-number size="medium" v-model="addFormRobot.score"></el-input-number>
                              
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormRobotVisible = false">取消</el-button>
                <el-button type="primary" :loading="robotLoading" @click.native="addRobotSubmit">提交</el-button>
            </div>
        </el-dialog>
 <!--重置密码界面-->
        <el-dialog :title="upPwd.name+'重置密码'" :visible.sync="upPwdVis" :close-on-click-modal="false" width="500px">
            <el-form size="mini" :model="upPwd" label-width="80px" labelWidth="100px" :rules="upPwdFormRules" ref="upPwdForm" >
                <div class="el-table el-table--fit el-table--border  el-table--enable-row-transition">
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                    <tr class="el-table__row">
                        <td>
                            <el-form-item style="margin:0px 5px" label="新密码" prop="password">
                                <el-input size="medium" v-model="upPwd.password"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="upPwdVis = false">取消</el-button>
                <el-button type="primary" :loading="upPwdLoading" @click.native="upPwdSubmit">提交</el-button>
            </div>
        </el-dialog>


        <!--会员详情界面-->
        <el-dialog :title="currentUser.name+'-会员详情'"  :visible.sync="memberDetailVis" :close-on-click-modal="false" width="1400px">
            <div class="detailtop">
                <div class="imgcontent" v-html="readerName()"></div>
                <div class="info">
                    <div class="top">{{currentUser.name}} <span style="font-size:18px;">ID:{{currentUser.uid}} 余额:{{currentUser.score}}</span></div>
                    <div class="bottom" style="font-size:18px;">积分比例:{{currentUser.xm_rate}} 积分:{{currentUser.integral}}</div>
                </div>
            </div>
            <!-- <div class="middle">
                <div class="item">
                    <div class="key">上级账号</div>
                    <div class="value">{{currentUser.agents_account}}</div>
                </div>
                 <div class="item">
                    <div class="key">上级昵称</div>
                    <div class="value">{{currentUser.agents_name}}</div>
                </div>
                 <div class="item">
                    <div class="key">上分总额</div>
                    <div class="value">{{currentUser.upfen}}</div>
                </div>
                 <div class="item">
                    <div class="key">下分总额</div>
                    <div class="value">{{currentUser.downfen}}</div>
                </div>
                 <div class="item">
                    <div class="key">输赢总额</div>
                    <div class="value">{{currentUser.winfen}}</div>
                </div>
                 <div class="item">
                    <div class="key">累计产生积分</div>
                    <div class="value">{{currentUser.integral_total}}</div>
                </div>
                 <div class="item">
                    <div class="key">累计积分兑换总额</div>
                    <div class="value">{{currentUser.integral_exchange}}</div>
                </div>
                 <div class="item">
                    <div class="key">会员收益</div>
                    <div class="value">{{currentUser.user_profit}}</div>
                </div>
            </div> -->

             <!--列表-->
            <div class="tabag">
                <span class="ag" :class="{'current':tabag == 1}" @click="changeTab(1)">流水明细</span>
                <span class="user" :class="{'current':tabag == 2}" @click="changeTab(2)">上下分明细</span>
                <span class="user" :class="{'current':tabag == 3}" @click="changeTab(3)">下注记录</span>
                <span class="user" :class="{'current':tabag == 4}" @click="changeTab(4)">日积分</span>
                <span class="user" :class="{'current':tabag == 5}" @click="changeTab(5)">红包领取记录</span>
            </div>
            
            <!--流水工具条-->
            <el-col v-show="tabag == 1" :span="24" class="toolbar" style="padding-bottom: 0px;">
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
                    <el-button type="primary" @click="searchLiushuiQuickly(5)">今天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchLiushuiQuickly(6)">昨天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchLiushuiQuickly(1)">本周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchLiushuiQuickly(2)">上周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchLiushuiQuickly(3)">本月</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchLiushuiQuickly(4)">上月</el-button>
                </el-form-item>
                <span style="font-size:18px;line-height:35px;color:#fff;">(请输入时间查询)</span>
                </el-form>
            </el-col>

            <el-col v-show="tabag == 2" :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form size="small" :inline="true" :model="tabFilters">
                    <el-form-item style="width: 260px" label="开始时间">
                        <el-date-picker
                                v-model="tabFilters.begin_time"
                                type="datetime"
                                placeholder="开始时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="width: 260px" label="结束时间">
                        <el-date-picker
                                v-model="tabFilters.end_time"
                                type="datetime"
                                placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="searchtabFilters">查询</el-button>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="searchtabFiltersQuickly(5)">今天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFiltersQuickly(6)">昨天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFiltersQuickly(1)">本周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFiltersQuickly(2)">上周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFiltersQuickly(3)">本月</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFiltersQuickly(4)">上月</el-button>
                </el-form-item>
                <span style="font-size:18px;line-height:35px;color:#fff;">(请输入时间查询)</span>

                </el-form>
            </el-col>

             <el-col v-show="tabag == 3" :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form size="small" :inline="true" :model="tabFilters1">
                    <el-form-item style="width: 260px" label="开始时间">
                        <el-date-picker
                                v-model="tabFilters1.begin_time"
                                type="datetime"
                                placeholder="开始时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="width: 260px" label="结束时间">
                        <el-date-picker
                                v-model="tabFilters1.end_time"
                                type="datetime"
                                placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="searchtabFilters1">查询</el-button>
                    </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="searchtabFilters1Quickly(5)">今天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters1Quickly(6)">昨天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters1Quickly(1)">本周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters1Quickly(2)">上周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters1Quickly(3)">本月</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters1Quickly(4)">上月</el-button>
                </el-form-item>
                <span style="font-size:18px;line-height:35px;color:#fff;">(请输入时间查询)</span>

                </el-form>
            </el-col>

             <el-col v-show="tabag == 4" :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form size="small" :inline="true" :model="tabFilters2">
                    <el-form-item style="width: 260px" label="开始时间">
                        <el-date-picker
                                v-model="tabFilters2.begin_time"
                                type="datetime"
                                placeholder="开始时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="width: 260px" label="结束时间">
                        <el-date-picker
                                v-model="tabFilters2.end_time"
                                type="datetime"
                                placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="searchtabFilters2">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                <el-button type="primary" @click="searchtabFilters2Quickly(5)">今天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters2Quickly(6)">昨天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters2Quickly(1)">本周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters2Quickly(2)">上周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters2Quickly(3)">本月</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters2Quickly(4)">上月</el-button>
                </el-form-item>
                                <span style="font-size:18px;line-height:35px;color:#fff;">(请输入时间查询)</span>

                </el-form>
            </el-col>

             <el-col v-show="tabag == 5" :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form size="small" :inline="true" :model="tabFilters3">
                    <el-form-item style="width: 260px" label="开始时间">
                        <el-date-picker
                                v-model="tabFilters3.begin_time"
                                type="datetime"
                                placeholder="开始时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="width: 260px" label="结束时间">
                        <el-date-picker
                                v-model="tabFilters3.end_time"
                                type="datetime"
                                placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="searchtabFilters3">查询</el-button>
                    </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="searchtabFilters3Quickly(5)">今天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters3Quickly(6)">昨天</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters3Quickly(1)">本周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters3Quickly(2)">上周</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters3Quickly(3)">本月</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchtabFilters3Quickly(4)">上月</el-button>
                </el-form-item>
                                <span style="font-size:18px;line-height:35px;color:#fff;">(请输入时间查询)</span>

                </el-form>
            </el-col>


            <div style="height:400px;overflow-y:auto;clear:both;">


            <!--table-->
            <!--列表-->
            <el-table  v-show="tabag == 1" :row-class-name="plugin.tableRowClassName" max-height="300" v-loading="liushuiLoading" size="mini" border :data="liushui" highlight-current-row   class="tableStyle" style="width: 100%;">
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
                </el-table-column>
                <!-- <el-table-column prop="card_game_id" label="牌局ID" min-width="100" sortable>
                </el-table-column> -->
                <el-table-column prop="note" label="备注" min-width="100">
                </el-table-column>
                <el-table-column prop="time" label="时间" min-width="120">
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-col v-show="tabag == 1" :span="24" class="toolbar">
                <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
                <el-pagination @size-change="handleSizeChangeLiushui" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeLiushui" :current-page="liushuiPagination.current" :page-sizes="[50, 100, 300]" :page-size="liushuiPagination.size" :total="liushuiPagination.total" style="float:right;">
                </el-pagination>
            </el-col>
                <!--table-->
            <!--上下分明细列表-->
            <el-table  v-show="tabag == 2" :row-class-name="plugin.tableRowClassName" max-height="400" v-loading="udfenLoading" size="mini" border :data="udfen" highlight-current-row class="tableStyle" style="width: 100%;">
                <!-- <el-table-column prop="agents_id" label="代理ID" min-width="80">
                </el-table-column> -->
                <!-- <el-table-column prop="username" label="会员账号">
                </el-table-column> -->
                <el-table-column prop="name" label="会员名称">
                </el-table-column>
                <el-table-column prop="score" label="变动前" min-width="60" sortable>
                </el-table-column>
                <el-table-column prop="score_change" label="金额" min-width="60" sortable>
                </el-table-column>
                <el-table-column prop="score_after" label="变动后" min-width="60" sortable>
                </el-table-column>
                <el-table-column prop="type" label="类型" min-width="60">
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
                <el-table-column prop="note" label="备注" min-width="100" >
                </el-table-column>
                <el-table-column prop="time" label="操作时间" min-width="120" sortable>
                </el-table-column>
            </el-table>
                <!--工具条-->
            <el-col v-show="tabag == 2"  :span="24" class="toolbar">
                <el-pagination @size-change="handleSizeChangeUdfen" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeUdfen" :current-page="udfenPagination.current" :page-sizes="[50, 100, 300]" :page-size="udfenPagination.size" :total="udfenPagination.total" style="float:right;">
                </el-pagination>
            </el-col>

             <!--列表-->
        <el-table  v-show="tabag == 3" :row-class-name="plugin.tableRowClassName"   size="mini" border :data="bets" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
            <!-- <el-table-column prop="uid" label="会员ID" min-width="80">
            </el-table-column> -->
            <el-table-column prop="agents_account" label="代理账号" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="uid" label="会员ID" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="nickname" label="会员名称" min-width="130" sortable>
                <template slot-scope="scope">
                    <a v-if="scope.row.usertype ==1" style="text-decoration: underline;cursor: pointer;" @click="getLowerListClom(scope.row)">{{scope.row.nickname}}</a>
                    <a v-if="scope.row.usertype ==2" >{{scope.row.nickname}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="usertype" label="身份" min-width="30">
                <template slot-scope="scope">
                    <a v-if="scope.row.usertype ==1" style="color: red">代理</a>
                    <a v-if="scope.row.usertype ==2" >会员</a>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="id" label="桌号" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="boots_number" label="靴数" min-width="100" sortable>
            </el-table-column> -->
            <el-table-column prop="ju" label="局数" min-width="150">
                <template slot-scope="scope" v-if="!scope.row.countt">
                    <a size="small">{{scope.row.room_id}}桌{{scope.row.boots_number}}-{{scope.row.ju}}局</a>
                </template>
            </el-table-column>
            <el-table-column prop="odds_text" label="下注类别" min-width="250" sortable>
            </el-table-column>
            <el-table-column prop="game_result_text" label="开牌结果" min-width="130" sortable>
            </el-table-column>
<!--            <el-table-column prop="score_before" label="下注前余分" min-width="90" sortable>-->
<!--            </el-table-column>-->
             <el-table-column prop="win" label="输赢" min-width="60" sortable>
            </el-table-column>
<!--            <el-table-column prop="score_after" label="结算后余分" min-width="90" sortable>-->
<!--            </el-table-column>-->
            <!-- <el-table-column prop="extra_share" label="抽水比例(%)" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="extra_share_score" label="抽水额度" min-width="80" sortable>
            </el-table-column> -->
           
            <el-table-column prop="xm" label="积分" min-width="60" sortable>
            </el-table-column>
            <!-- <el-table-column prop="agents_name" label="代理名称" min-width="60">
            </el-table-column>
             <el-table-column prop="agents_account" label="代理账号" min-width="60">
            </el-table-column> -->
            <el-table-column prop="relation_link" label="代理关系" min-width="330">
                <template slot-scope="scope">
                <relation
                     :rela="scope.row.relation_link"
                     @getsearch="searchRela"
                    ></relation>
                </template>
            </el-table-column>
            <el-table-column prop="level" label="层级" min-width="60">
            </el-table-column>
            <!-- <el-table-column prop="xm_type" label="洗码类型" min-width="80" sortable>
                 <template slot-scope="scope">
                    <a v-if="scope.row.xm_type == 1" >单边</a>
                    <a v-if="scope.row.xm_type == 2" >双边</a>
                </template>
            </el-table-column> -->
            <!-- <el-table-column prop="xm_rate" label="洗码率(%)" min-width="90" sortable>
            </el-table-column> -->
            
<!--            <el-table-column prop="status" label="状态" min-width="100" sortable>-->
<!--            </el-table-column>-->
            <el-table-column prop="mktime" label="时间" min-width="120" sortable>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col v-show="tabag == 3" :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChangebets" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangebets" :current-page="paginationbets.current" :page-sizes="[50, 100, 300]" :page-size="paginationbets.size" :total="paginationbets.total" style="float:right;">
            </el-pagination>
        </el-col>



         <el-table  v-show="tabag == 4" :row-class-name="plugin.tableRowClassName"   size="mini" border :data="jifens" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
             <el-table-column prop="uid" label="会员ID" min-width="80">
            </el-table-column>
            <el-table-column prop="name" label="会员名称" min-width="80">
            </el-table-column>
            <el-table-column prop="agents_account" label="代理账号" min-width="80">
            </el-table-column>
            <el-table-column prop="integral" label="每日积分" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="integral_exchange" label="已提积分" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="integral_total" label="剩余积分" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="xm_rate" label="积分比例" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="date" label="时间" min-width="80">
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col v-show="tabag == 4" :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChangejifens" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangejifens" :current-page="paginationjifens.current" :page-sizes="[50, 100, 300]" :page-size="paginationjifens.size" :total="paginationjifens.total" style="float:right;">
            </el-pagination>
        </el-col>


        <el-table  v-show="tabag == 5" :row-class-name="plugin.tableRowClassName"   size="mini" border :data="Hbs" highlight-current-row v-loading="listLoading" class="tableStyle" style="width: 100%;">
             <el-table-column prop="uid" label="会员ID">
                </el-table-column>
                <el-table-column prop="name" label="会员名称">
                </el-table-column>
                
                <el-table-column prop="score" label="领取金额" min-width="60">
                </el-table-column>
                <el-table-column prop="uptime" label="领取时间" min-width="120" >
                </el-table-column>
                <el-table-column  label="手气" min-width="60">
                     <template slot-scope="scope">
                            <span v-if="scope.row.lucky == 0"></span>
                            <span v-if="scope.row.lucky == 1">手气最佳</span>
                            <span v-if="scope.row.lucky == 2">豹子</span>
                            <span v-if="scope.row.lucky == 3">顺子</span>
                            <span v-if="scope.row.lucky == 4">手气最差</span>
                        </template>
                </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col v-show="tabag == 5" :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChangeHbs" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeHbs" :current-page="paginationHb.current" :page-sizes="[50, 100, 300]" :page-size="paginationHb.size" :total="paginationHb.total" style="float:right;">
            </el-pagination>
        </el-col>


            </div>
        </el-dialog>


         <!--token界面-->
        <el-dialog :title="token.name+' - 临时登录地址'" :visible.sync="tokenVis" :close-on-click-modal="false" width="800px">
            <div>提示：临时登录地址只能使用一次即失效,再次使用请重新获取</div>
            <div>链接:</div>
            <div>{{token.tokenurl}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary"  @click.native="tokenVis = false">确定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import moment from 'moment'
   
    import $ from 'jquery'
    window.$ = window.jQuery = $
     import ajaxFileUpload from '../../../static/js/ajaxfileupload'
    //import NProgress from 'nprogress'
    import { getChat,getUdfenPageAgent,getDayHbPage,getDayJifenPage,getUserDetail,getBetsListPage,user_token,update_pwd,addRobot,getUserJifen,upDowjiFen,getAgentsInfo,getAgentsFen,getAgentsXh,getUserListPage, getUserUpdowinfo, editUser, addUser,getLiushuiPage,upDowFen,getUdfenPage,handleForbiddenUser,handleDeleteUser,handleSayUser } from '../../api/api';

    import Relation from "@/components/relation";

    export default {
        components: {
            Relation,
        },
        props:['user','pagination','agents_id'],
        data() {
            var validateUserName = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('请输入登录账号'));
                } else {    
                    var c = new RegExp();   
                    c = /^[A-Za-z0-9]+$/;  
                    if(!c.test(value)){
                        callback(new Error('账号只支持数字和字母'));
                    }else{
                        callback();
                    }                 
                }
            };
            return {
                tabFilters:{
                    begin_time: '',
                    end_time: '',
                },
                tabFilters1:{
                    begin_time: '',
                    end_time: '',
                },
                tabFilters2:{
                    begin_time: '',
                    end_time: '',
                },
                tabFilters3:{
                    begin_time: '',
                    end_time: '',
                },
                tabsearchParam:{
                    begin_time: '',
                    end_time: '',
                },
                tabsearchParam1:{
                    begin_time: '',
                    end_time: '',
                },
                tabsearchParam2:{
                    begin_time: '',
                    end_time: '',
                },
                tabsearchParam3:{
                    begin_time: '',
                    end_time: '',
                },

                bets:[],
                paginationbets:{
                    current:1,
                    size:50,
                    total:0,
                },
                jifens:[],
                paginationjifens:{
                    current:1,
                    size:50,
                    total:0,
                },

                tabag:1,
                currentUser:{},
                memberDetailVis:false,
                token:{
                    tokenurl:"",
                    name:""
                },
                robotLoading:false,
                handleFenLock:false,
                addFormRobotVisible:false,
                currentAgent:{
                    agents_id:"",
                    agents_name:"",
                    agents_account:"",
                },
                filters: {
                    agents_name:'',
                    username:'',
                    name: '',
                    search_type: '2',
                    user_type: '0',
                    agents_account: '',
                    level:''
                },
                liushuiFilters: {
                    user: '',
                    begin_time: '',
                    end_time: '',
                },
                udfenFilters: {
                    user: '',
                },
                jifenFilters: {
                    user: '',
                    type: '',
                    value: '',
                    yufen:'',
                    jslx:"0",
                    password:''
                },
                fenFilters: {
                    user: '',
                    type: '',
                    value: '',
                    yufen:'',
                    password:''
                },
                searchParam: {
                    agents_name:'',
                    username:'',
                    name: '',
                    search_type: '2',
                    user_type: '0',
                    agents_account: '',
                    level:''
                },
                liushuiSearchParam: {
                    begin_time: '',
                    end_time: '',
                },
                jifenVisible:false,
                // user: [],
                // users: [],
                liushui: [],
                udfen: [],
                tableHeight:"500",
                // pagination:{
                //     current:1,
                //     size:50,
                //     total:0,
                // },
                liushuiPagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                udfenPagination:{
                    current:1,
                    size:50,
                    total:0,
                },
                paginationHb:{
                    current:1,
                    size:50,
                    total:0,
                },

                lowList:[],
                listLoading: false,
                liushuiLoading: false,
                udfenLoading: false,
                editItems:[],
                editFormVisible: false,
                LiushuiVisible: false,
                udfenVisible: false,
                fenVisible: false,

                editLoading: false,
                //编辑界面数据
                editForm: {
                    uid:"",
                    name: '',
                    username: '',
                    password: '',
                    agents_id: util.getSessionItem('user','agents_id'),
                    agents_account: util.getSessionItem('user','account'),
                    agents_name: util.getSessionItem('user','name'),
                    xm_rate: '',
                    xm_type: '1',
                    agents_share_rate: '',
                    user_desc: '',
                    agent_score: util.getSessionItem('user','agent_score'),
                    head:"",
                    status:"",
                    no_say:"",
                    xh_config:"",
                    xh:[],
                    zx_min:0,
                    zx_max:0,
                    extra_share:0,
                    phone:"",
                    wxchat:"",
                    qq:"",
                    bankcard:"",
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                upPwdLoading: false,
                xh_config:"",
                upPwdFormRules:{
                    password: [
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                    ],
                },
                addFormRobotRules: {
                    name: [
                        { required: true, message: '请输入机器人昵称', trigger: 'blur' }
                    ],
                    head: [
                        { required: true, message: '请上传头像', trigger: 'blur' }
                    ],
                    score: [
                        { required: true, message: '请输入余分', trigger: 'blur' }
                    ],
                },
                addFormRules: {
                    name: [
                        { required: true, message: '请输入会员昵称', trigger: 'blur' }
                    ],
                    username: [
                        { validator: validateUserName,required: true, trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入初始密码', trigger: 'blur' }
                    ],
                    xm_rate: [
                        { required: true, message: '请输入积分比例', trigger: 'blur' }
                    ],
                    agents_share_rate: [
                        { required: true, message: '请输入占成比例', trigger: 'blur' }
                    ],
                    xm_type: [
                        { required: true, message: '请选择洗码类型', trigger: 'blur' }
                    ],
                    xh_config: [
                        { required: true, message: '请选择限红配置', trigger: 'blur' }
                    ],
                },
                editFormRules: {
                    name: [
                        { required: true, message: '请输入会员昵称', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入登录账号', trigger: 'blur' }
                    ],
                    xm_rate: [
                        { required: true, message: '请输入洗码率', trigger: 'blur' }
                    ],
                    agents_share_rate: [
                        { required: true, message: '请输入占成比例', trigger: 'blur' }
                    ],
                    xm_type: [
                        { required: true, message: '请选择洗码类型', trigger: 'blur' }
                    ],
                    xh_config: [
                        { required: true, message: '请选择限红配置', trigger: 'blur' }
                    ],
                },
                addFormRobot:{
                    name: '',
                    head: '',
                    score: '',
                },
                //新增界面数据
                addForm: {
                    name: '',
                    head: '',
                    username: '',
                    password: '0',
                    agents_id: util.getSessionItem('user','agents_id'),
                    agents_account: util.getSessionItem('user','account'),
                    agents_name: util.getSessionItem('user','name'),
                    xm_rate: '0',
                    xm_type: '1',
                    agents_share_rate: '0',
                    user_desc: '',
                    xh_config:"",
                    xh:[],
                    zx_min:0,
                    zx_max:0,
                    extra_share:0,
                    phone:"",
                    wxchat:"",
                    qq:"",
                    bankcard:"",
                    agent_score: util.getSessionItem('user','agent_score')
                },
                auth_type:util.getSessionItem('user','auth_type'),
                agent_type:util.getSessionItem('user','agent_type'),
                auth_account:util.getSessionItem('user','account'),
                upPwd:{
                    name:'',
                    uid:'',
                    password:'',
                },
                upPwdVis:false,
                selectRow:"",
                tokenVis:false,
                Hbs:[],
                imInfo:{},
				activeName:"",
            }
        },
        methods: {
            getIframeSrc(playid){
                return this.imInfo[playid].imdomain+"?"+Object.keys(this.imInfo[playid]).map((key)=> {
                            // body...
                            return encodeURIComponent(key) + "=" + encodeURIComponent(this.imInfo[playid][key]);
                        }).join("&")+'/#/agm_messages/messageChat/'+this.imInfo[playid].channelId
            },
            readerChat(row){
                if(this.imInfo[row.playid]){ 
                    this.activeName = row.playid;
                    this.$root.Event.$emit("showChat",this.imInfo,this.activeName);
                    return;
                }
                let para ={
                    touserid:row.playid
                }
                getChat(para).then(res=>{
                    this.imInfo[row.playid] = res.data;
                    this.imInfo[row.playid].imdomain = res.imdomain;
                    this.imInfo[row.playid].playid = res.playid;
                    this.imInfo[row.playid].toid = res.toid;
                    this.imInfo[row.playid].row = row;
                    this.imInfo[row.playid].src = this.getIframeSrc(row.playid); 
                    this.activeName = row.playid;
                    this.$root.Event.$emit("showChat",this.imInfo,this.activeName);
                }).catch((res)=>{
                    console.log(res)
                    this.$message({
                        message: "聊天室初始化异常",
                        type: 'error'
                    });
                })
            },
             searchtabFilters3Quickly(type){
                if(type == 1){
                    this.tabFilters3.begin_time = moment().startOf('isoWeek').add(0,"hours")
                    this.tabFilters3.end_time = moment().endOf('isoWeek').add(0,"hours")
                }
                if(type == 2){
                    this.tabFilters3.begin_time = moment().isoWeek(moment().isoWeek() - 1).startOf('isoWeek').add(0,"hours")
                    this.tabFilters3.end_time = moment().isoWeek(moment().isoWeek() - 1).endOf('isoWeek').add(0,"hours")
                }
                if(type == 3){
                    this.tabFilters3.begin_time = moment().startOf('month').add(0,"hours")
                    this.tabFilters3.end_time = moment().endOf('month').add(0,"hours")
                }
                if(type == 4){
                    this.tabFilters3.begin_time = moment().month(moment().month() - 1).startOf('month').add(0,"hours")
                    this.tabFilters3.end_time = moment().month(moment().month() - 1).endOf('month').add(0,"hours")
                }
                if(type == 5){
                    this.tabFilters3.begin_time = moment().startOf('days').add(0,"hours")
                    this.tabFilters3.end_time = moment().endOf('days').add(0,"hours")
                }
                if(type == 6){
                    this.tabFilters3.begin_time = moment().subtract('days',1).startOf('days').add(0,"hours")
                    this.tabFilters3.end_time = moment().subtract('days',1).endOf('days').add(0,"hours")
                }
                this.paginationHb.current = 1;
                this.tabsearchParam3.begin_time = this.tabFilters3.begin_time;
                this.tabsearchParam3.end_time = this.tabFilters3.end_time;
                this.getUserHb();
            },
            searchtabFilters2Quickly(type){
                if(type == 1){
                    this.tabFilters2.begin_time = moment().startOf('isoWeek').add(0,"hours")
                    this.tabFilters2.end_time = moment().endOf('isoWeek').add(0,"hours")
                }
                if(type == 2){
                    this.tabFilters2.begin_time = moment().isoWeek(moment().isoWeek() - 1).startOf('isoWeek').add(0,"hours")
                    this.tabFilters2.end_time = moment().isoWeek(moment().isoWeek() - 1).endOf('isoWeek').add(0,"hours")
                }
                if(type == 3){
                    this.tabFilters2.begin_time = moment().startOf('month').add(0,"hours")
                    this.tabFilters2.end_time = moment().endOf('month').add(0,"hours")
                }
                if(type == 4){
                    this.tabFilters2.begin_time = moment().month(moment().month() - 1).startOf('month').add(0,"hours")
                    this.tabFilters2.end_time = moment().month(moment().month() - 1).endOf('month').add(0,"hours")
                }
                if(type == 5){
                    this.tabFilters2.begin_time = moment().startOf('days').add(0,"hours")
                    this.tabFilters2.end_time = moment().endOf('days').add(0,"hours")
                }
                if(type == 6){
                    this.tabFilters2.begin_time = moment().subtract('days',1).startOf('days').add(0,"hours")
                    this.tabFilters2.end_time = moment().subtract('days',1).endOf('days').add(0,"hours")
                }
                this.paginationjifens.current = 1;
                this.tabsearchParam2.begin_time = this.tabFilters2.begin_time;
                this.tabsearchParam2.end_time = this.tabFilters2.end_time;
                this.getDayJifen();
            },
            searchtabFilters1Quickly(type){
                if(type == 1){
                    this.tabFilters1.begin_time = moment().startOf('isoWeek').add(0,"hours")
                    this.tabFilters1.end_time = moment().endOf('isoWeek').add(0,"hours")
                }
                if(type == 2){
                    this.tabFilters1.begin_time = moment().isoWeek(moment().isoWeek() - 1).startOf('isoWeek').add(0,"hours")
                    this.tabFilters1.end_time = moment().isoWeek(moment().isoWeek() - 1).endOf('isoWeek').add(0,"hours")
                }
                if(type == 3){
                    this.tabFilters1.begin_time = moment().startOf('month').add(0,"hours")
                    this.tabFilters1.end_time = moment().endOf('month').add(0,"hours")
                }
                if(type == 4){
                    this.tabFilters1.begin_time = moment().month(moment().month() - 1).startOf('month').add(0,"hours")
                    this.tabFilters1.end_time = moment().month(moment().month() - 1).endOf('month').add(0,"hours")
                }
                if(type == 5){
                    this.tabFilters1.begin_time = moment().startOf('days').add(0,"hours")
                    this.tabFilters1.end_time = moment().endOf('days').add(0,"hours")
                }
                if(type == 6){
                    this.tabFilters1.begin_time = moment().subtract('days',1).startOf('days').add(0,"hours")
                    this.tabFilters1.end_time = moment().subtract('days',1).endOf('days').add(0,"hours")
                }
                this.paginationbets.current = 1;
                this.tabsearchParam1.begin_time = this.tabFilters1.begin_time;
                this.tabsearchParam1.end_time = this.tabFilters1.end_time;
                this.getBetsLists();
            },
             searchtabFiltersQuickly(type){
                if(type == 1){
                    this.tabFilters.begin_time = moment().startOf('isoWeek').add(0,"hours")
                    this.tabFilters.end_time = moment().endOf('isoWeek').add(0,"hours")
                }
                if(type == 2){
                    this.tabFilters.begin_time = moment().isoWeek(moment().isoWeek() - 1).startOf('isoWeek').add(0,"hours")
                    this.tabFilters.end_time = moment().isoWeek(moment().isoWeek() - 1).endOf('isoWeek').add(0,"hours")
                }
                if(type == 3){
                    this.tabFilters.begin_time = moment().startOf('month').add(0,"hours")
                    this.tabFilters.end_time = moment().endOf('month').add(0,"hours")
                }
                if(type == 4){
                    this.tabFilters.begin_time = moment().month(moment().month() - 1).startOf('month').add(0,"hours")
                    this.tabFilters.end_time = moment().month(moment().month() - 1).endOf('month').add(0,"hours")
                }
                if(type == 5){
                    this.tabFilters.begin_time = moment().startOf('days').add(0,"hours")
                    this.tabFilters.end_time = moment().endOf('days').add(0,"hours")
                }
                if(type == 6){
                    this.tabFilters.begin_time = moment().subtract('days',1).startOf('days').add(0,"hours")
                    this.tabFilters.end_time = moment().subtract('days',1).endOf('days').add(0,"hours")
                }
                this.udfenPagination.current = 1;
                this.tabsearchParam.begin_time = this.tabFilters.begin_time;
                this.tabsearchParam.end_time = this.tabFilters.end_time;
                this.getUdfen();
            },
            searchLiushuiQuickly(type){
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
                this.liushuiPagination.current = 1;
                this.liushuiSearchParam.begin_time = this.liushuiFilters.begin_time;
                this.liushuiSearchParam.end_time = this.liushuiFilters.end_time;
                this.getLiushui();
            },
            handleSizeChangeHbs(val){
                this.paginationHb.size = val;
                this.getUserHb();
            },
            handleCurrentChangeHbs(val){
                this.paginationHb.current = val;
                this.getUserHb();
            },
            getUserHb(){
                let para = {
                    pageNumber:this.paginationHb.current,
                    pageSize:this.paginationHb.size,
                    uid:this.currentUser.uid,
                    begin_time:(this.tabsearchParam3.begin_time == "" || this.tabsearchParam3.begin_time == null) ? "": moment(this.tabsearchParam3.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:(this.tabsearchParam3.end_time == "" || this.tabsearchParam3.end_time == null) ? "": moment(this.tabsearchParam3.end_time).format("YYYY-MM-DD HH:mm:ss"),
                
                };
                this.listLoading = true;
                getDayHbPage(para).then((res)=>{
                    this.Hbs = res.data;
                    this.paginationHb.total = res.total;
                    this.Hbs.length>0 && this.Hbs.push(this.plugin.columnFilterFunc(this.Hbs,"uid"))
                    this.listLoading = false;
                    this.autoTableHeight();
                }).catch((res)=>{
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                })
            },
            handleSizeChangejifens(val){
                this.paginationjifens.size = val;
                this.getDayJifen();
            },
            handleCurrentChangejifens(val){
                this.paginationjifens.current = val;
                this.getDayJifen();
            },
            getDayJifen(){
                let para = {
                    pageNumber:this.paginationjifens.current,
                    pageSize:this.paginationjifens.size,
                    uid:this.currentUser.uid,
                    dataType:0,
                    begin_time:(this.tabsearchParam2.begin_time == "" || this.tabsearchParam2.begin_time == null) ? "": moment(this.tabsearchParam2.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:(this.tabsearchParam2.end_time == "" || this.tabsearchParam2.end_time == null) ? "": moment(this.tabsearchParam2.end_time).format("YYYY-MM-DD HH:mm:ss"),
                
                };
                this.listLoading = true;
                getDayJifenPage(para).then((res)=>{
                    this.jifens = res.data.list;
                    this.paginationjifens.total = res.data.list.length;
                    this.jifens.length>0 && this.jifens.push(this.plugin.columnFilterFunc(this.jifens,"uid"))
                    this.listLoading = false;
                    this.autoTableHeight();
                }).catch((res)=>{
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                })
            },
            handleSizeChangebets(val){
                this.paginationbets.size = val;
                this.getBetsLists();
            },
            handleCurrentChangebets(val){
                this.paginationbets.current = val;
                this.getBetsLists();
            },
            //获取下注列表
            getBetsLists() {
                let para = {
                    pageNumber:this.paginationbets.current,
                    pageSize:this.paginationbets.size,
                    game_type:-1,
                    boots_number:"", 
                    room_id:"",
                    ju:"",
                    begin_time:"",
                    end_time:"",
                    agents_account:"",
                    username:this.currentUser.uid,
                    begin_time:(this.tabsearchParam1.begin_time == "" || this.tabsearchParam1.begin_time == null) ? "": moment(this.tabsearchParam1.begin_time).format("YYYY-MM-DD HH:mm:ss"),
                    end_time:(this.tabsearchParam1.end_time == "" || this.tabsearchParam1.end_time == null) ? "": moment(this.tabsearchParam1.end_time).format("YYYY-MM-DD HH:mm:ss"),
                
                };
                this.listLoading = true;
                //NProgress.start();
                getBetsListPage(para).then((res) => {
                    if(res.code == 200){
                        this.paginationbets.total = res.data.total;
                        this.bets = res.data.data;
                        if(this.bets.length){
                            this.bets.push(this.plugin.columnFilterFunc(this.bets,"agents_account"))
                        }
                        
                        this.listLoading = false;
                        this.autoTableHeight();
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
            changeTab(type){
                this.listLoading = true;
                this.tabag = type;
                this.autoTableHeight();
            },
            tranColor(name) {//颜色转换
                var str = '';
                for (var i = 0; i < name.length; i++) {
                    str += parseInt(name[i].charCodeAt(0), 13).toString(16);
                }
                return '#' + str.slice(1, 4);
            },
            getFirstname(name) {
                return name.substr(0, 1)
            },
            readerName(){
                if(JSON.stringify(this.currentUser) != "{}"){
                    if(this.currentUser.head){
                    if(this.currentUser.head.indexOf("http") != -1){
                        return "<img width='80' height='80' src="+this.currentUser.head+">";
                        }else{
                        return "<img  width='80' height='80' src="+localStorage.getItem("head_domain")+this.currentUser.head+">";
                        }
                    
                    }else{
                        return "<div style='font-size: 60px;text-align: center;color: rgba(255,255,255,6);font-family: 微软雅黑;background-color: "+this.tranColor(this.currentUser.name)+"'>"+ this.getFirstname(this.currentUser.name) +"</div>"
                    }
                }
            },
            handleMemberDetail(row){
                this.currentUser = row;
                
                this.liushui = [];
                this.udfen = [];
                this.bets = [];
                this.jifens = [];
                this.Hbs = [];
                this.memberDetailVis = true;
                this.handleUserDetail(row);
                this.handleLiushui(row);
                this.handleudfen(row);
                // this.getBetsLists(row);
                // this.getDayJifen(row);
                // this.getUserHb(row);
            },
            searchRela(account){
                this.filters.agents_account = account;
                this.searchUser();
            },
            levelChange(filter){
                if(isNaN(filter.level)){
                    filter.level = "";
                }
            },
            getToken(row){
                this.token.name = row.name;
                this.tokenVis = true;
                user_token({uid:row.uid}).then((res) => {
                    if(res.code == 200){
                        this.token.tokenurl = res.url;
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
            onChangeSf(data){
                if(data.code == 0){
                     this.$message({
                            message: "操作成功",
                            type: 'success'
                        });
                    if(this.selectRow.usertype == 2){
                        this.selectRow.usertype = 3
                    }else if(this.selectRow.usertype == 3){
                        this.selectRow.usertype = 2
                    }
                }else if(data.code == 500){
                     this.$message({
                            message: "操作失败",
                            type: 'error'
                        });
                }
            },
            setSf(type,row){
                this.selectRow = row;
                var t = type == 1 ? '游客':'会员';

                this.$confirm('确认设 ['+row.name+'] 为'+t+'吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    this.$store.getters.imClient.send(JSON.stringify({
                        "cmd": 4500,
                        'uid': row.uid
                    }))
                })
            },
            upPwdSubmit(){
                this.upPwdLoading = true;
                update_pwd({
                    uid:this.upPwd.uid,
                    password:this.upPwd.password,
                }).then((res) => {
                    this.upPwdLoading = false;
                    if(res.code == 200){
                        this.upPwdVis = false;
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
            },
            handleUpPwd(row){
                this.upPwd.name = row.name;
                this.upPwd.uid = row.uid;
                this.upPwd.password = "";
                this.upPwdVis = true;
            },
            handleAddRobot(){
                this.addFormRobot = {
                    name:"",
                    head:"",
                    score:"",
                }
                this.addFormRobotVisible = true;
            },
            addRobotSubmit(){
                if(this.robotLoading){
                    return;
                }
                this.$refs.addFormRobot.validate((valid) => {
                    if(valid){
                        this.robotLoading = true;
                        addRobot({
                    name:this.addFormRobot.name,
                    head:this.addFormRobot.head,
                    score:this.addFormRobot.score,
                }).then((res) => {
                    this.robotLoading = false;
                    if(res.code == 200){
                        this.addFormRobotVisible = false;
                        this.getUsers();
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
                    }
                })
            },
            triggerUploadRobot(){
                $("#uploadfileRobot").click();
            },
      uploadfileRobot(){
          var that = this;
          $.ajaxFileUpload({
              url: 'v1/user/UploadChatImage?filename=filename',
              type: 'get',
              secureuri: false, //一般设置为fals,
              fileElementId: 'uploadfileRobot', // 上传文件的id、name属性名
              dataType: "json", //返回值类型，一般设置为json、application/json
              success: function (rs) {
                  if (rs.code == 200) {
                      that.addFormRobot.head = rs.data.head;
                      that.$message({
                          showClose: false,
                          message: "头像上传成功。",
                          type: 'success'
                      })
                  } else {
                      that.$message({
                          showClose: false,
                          message: "头像上传失败。",
                          type: 'error'
                      })
                  }
              },
              error: function () {
                  that.$message({
                      showClose: false,
                      message: "头像上传失败。",
                      type: 'error'
                  })
              }
          });
      },

        triggerUploadAdd(){
                $("#uploadfileAdd").click();
            },
      uploadfileAdd(){
          var that = this;
          $.ajaxFileUpload({
              url: 'v1/user/UploadChatImage?filename=filename',
              type: 'get',
              secureuri: false, //一般设置为fals,
              fileElementId: 'uploadfileAdd', // 上传文件的id、name属性名
              dataType: "json", //返回值类型，一般设置为json、application/json
              success: function (rs) {
                  if (rs.code == 200) {
                      that.addForm.head = rs.data.head;
                      that.$message({
                          showClose: false,
                          message: "头像上传成功。",
                          type: 'success'
                      })
                  } else {
                      that.$message({
                          showClose: false,
                          message: "头像上传失败。",
                          type: 'error'
                      })
                  }
              },
              error: function () {
                  that.$message({
                      showClose: false,
                      message: "头像上传失败。",
                      type: 'error'
                  })
              }
          });
      },

            triggerUpload(){
                $("#filename").click();
            },
      uploadfile(){
          var that = this;
          $.ajaxFileUpload({
              url: 'v1/user/UploadChatImage?filename=filename&uid=' + this.editForm.uid,
              type: 'get',
              secureuri: false, //一般设置为fals,
              fileElementId: 'filename', // 上传文件的id、name属性名
              dataType: "json", //返回值类型，一般设置为json、application/json
              success: function (rs) {
                  if (rs.code == 200) {
                      that.editForm.head = rs.data.head;
                      that.$message({
                          showClose: false,
                          message: "修改头像成功。",
                          type: 'success'
                      })
                  } else {
                      that.$message({
                          showClose: false,
                          message: "修改头像失败。",
                          type: 'error'
                      })
                  }
              },
              error: function () {
                  that.$message({
                      showClose: false,
                      message: "修改头像失败。",
                      type: 'error'
                  })
              }
          });
      },
            editXHSliderChange(type){
                if(type == 0){
                    if(this.editForm.zx_max > 1000 * this.editForm.zx_min){
                        this.editForm.zx_max = 1000 * this.editForm.zx_min;
                    }
                } else if(type == 1){
                    if(this.editForm.zx_max > 1000 * this.editForm.zx_min){
                        this.editForm.zx_min = this.editForm.zx_max / 1000;
                    }
                }
            },
            addXHSliderChange(type){
                if(type == 0){
                    if(this.addForm.zx_max > 1000 * this.addForm.zx_min){
                        this.addForm.zx_max = 1000 * this.addForm.zx_min;
                    }
                } else if(type == 1){
                    if(this.addForm.zx_max > 1000 * this.addForm.zx_min){
                        this.addForm.zx_min = this.addForm.zx_max / 1000;
                    }
                }
            },
            addMyMember(row){
                this.currentAgent.agents_name = row.name;
                this.currentAgent.agents_account = row.username;
                this.currentAgent.agents_id = row.uid;
                this.handleAdd()
            },
            getLowerList(row){
                if(!row){
                    this.lowList = [];
                    this.getUsers()
                }else{
                    var lowIndex =this.lowList.findIndex(item => item.agents_id == row.agents_id)
                    if(lowIndex == -1){
                        this.lowList.push({
                            agents_id:row.agents_id,
                            name:row.name,
                        })
                    }else{
                        this.lowList.splice(lowIndex+1,this.lowList.length-1)
                    }
                    this.getUsers(row.agents_id)
                }

            },
            getLowerListClom(row){
                if(!row){
                    this.lowList = [];
                    this.getUsers()
                }else{
                    var lowIndex =this.lowList.findIndex(item => item.agents_id == row.uid)
                    if(lowIndex == -1){
                        this.lowList.push({
                            agents_id:row.uid,
                            name:row.name,
                        })
                    }else{
                        this.lowList.splice(lowIndex+1,this.lowList.length-1)
                    }
                    this.getUsers(row.uid)
                }

            },
            changeXh_config(id) {
                this.xh_config = id;
                this.addForm.xh_config = id;
                this.editForm.xh_config = id;
            },
            changeStatus(){
                this.editForm.status == 1? this.editForm.status = 0 : this.editForm.status = 1
            },
            changeNosay(){
                this.editForm.no_say == 1? this.editForm.no_say = 0 : this.editForm.no_say = 1
            },
            handleForbidden(row,type){
                this.listLoading = true;
                handleForbiddenUser({
                    uid:row.uid,
                    status:type,
                }).then((res) => {
                    this.listLoading = false;
                    if(res.code == 200){
                        row.status = type
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
            },
            handleNo_say(row,type){
                this.listLoading = true;
                handleSayUser({
                    uid:row.uid,
                    status:type,
                }).then((res) => {
                    this.listLoading = false;
                    if(res.code == 200){
                        row.no_say = type
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                    }
                }).catch((res)=>{
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                })
            },
            handleSizeChangeLiushui(val){
                this.liushuiPagination.size = val;
                this.getLiushui();
            },
            handleCurrentChangeLiushui(val){
                this.liushuiPagination.current = val;
                this.getLiushui();
            },
            handleSizeChangeUdfen(val){
                this.udfenPagination.size = val;
                this.getUdfen()
            },
            handleCurrentChangeUdfen(val){
                this.udfenPagination.current = val;
                this.getUdfen()
            },
            handleudfen(row){
                this.udfenFilters = {
                    user:row,
                }
                this.udfenVisible = true;
                // this.getUdfen()
            },
            //获取上下分明细
            getUdfen(){
                let para = {
                    pageNumber:this.udfenPagination.current,
                    pageSize:this.udfenPagination.size,
                    uid:this.udfenFilters.user.uid,
                    begin_time:(this.tabsearchParam.begin_time == "" || this.tabsearchParam.begin_time == null) ? "": moment(this.tabsearchParam.begin_time).unix(),
                    end_time:(this.tabsearchParam.end_time == "" || this.tabsearchParam.end_time == null) ? "": moment(this.tabsearchParam.end_time).unix(),
                };
                this.udfenLoading = true;
                getUdfenPageAgent(para).then((res) => {
                    this.udfenPagination.total = res.total;
                    this.udfen = res.data;
                    if(this.udfen.length){
                        this.udfen.push(this.plugin.columnFilterFunc(this.udfen,"name","score"))
                    }
                    
                    this.udfenLoading = false;
                    this.autoTableHeight();
                });
            },
            onSubmitFen(){
                if(this.handleFenLock){
                    this.$message({
                            message: "网络异常，请刷新页面重试",
                            type: 'error'
                        });
                        return;
                }
                 if(this.fenFilters.value == ''){
                    this.$message({
                            message: "请填写额度",
                            type: 'error'
                        });
                        return;
                }
                var reg = /^\d+(\.\d+)?$/;
                if(!reg.test(this.fenFilters.value)){
                    this.$message({
                            message: "请输入正确的金额",
                            type: 'error'
                        });
                        return;
                }
                // if(this.fenFilters.password == ''){
                //     this.$message({
                //         message: "请填写密码",
                //         type: 'error'
                //     });
                //     return;
                // }
                var typename = this.fenFilters.type == 1 ? '上分': '下分';

                 this.$confirm('确认'+typename+'吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    let para = {
                    uid:this.fenFilters.user.uid,
                    fen:this.fenFilters.value,
                    doType:this.fenFilters.type,
                    password:this.fenFilters.password,
                    do_agent_account:util.getSessionItem('user','account')
                };
                this.handleFenLock = true;//加锁
                

                this.$store.getters.imClient.send(JSON.stringify({
                            "cmd": 4012,
                            'update_uid': this.fenFilters.user.uid,
                            'type':this.fenFilters.type,//上分1 下分2
                            // 'userScore':res.data.userScore,//上分后余额
                            "fen":this.fenFilters.value,
                        }))

                // upDowFenagent(para).then((res) => {
                //     if(res.code == 200){
                        
                //         this.$message({
                //             message: res.msg,
                //             type: 'success'
                //         });
                        
                //         // this.getUsers();
                //     }else{
                //         this.$message({
                //             message: res.msg,
                //             type: 'info'
                //         });
                //     }
                //     this.handleFenLock = false;//解锁
                // }).catch((res)=>{
                //     this.$message({
                //         message: res.msg,
                //         type: 'error'
                //     });
                //     this.handleFenLock = false;//解锁
                //     })
            })   
            },
            onOpFen(res){
                    if(res.code == 0){
                        
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.$emit("getusers",this.agents_id)
                        this.editItems = [];
                        this.editItems.push(this.fenFilters.user.uid);
                        util.setSessionItem('user',['agent_score',res.agentScore])
                        this.fenFilters.value = 0;
                        setTimeout(()=>{
                             this.$root.Event.$emit("onAgentScoreChange")
                        },1000)
                       
                        this.fenVisible = false;
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'info'
                        });
                    }
                    this.handleFenLock = false;//解锁
            },

            handleFen(row,type){
                this.fenFilters = {
                    user:row,
                    type:type,
                    value:"",
                    yufen:"",
                    password:"",
                }
                this.fenVisible = true;
                getUserUpdowinfo({
                    uid:row.uid
                }).then(res =>{
                    if(res.code == 200){
                        this.fenFilters.yufen = res.data
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'info'
                        });
                    }
                }).catch((res)=>{
                    this.addLoading = false;
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                })
            },

            onSubmitjiFen(){
                if(this.handleFenLock){
                    this.$message({
                            message: "网络异常，请刷新页面重试",
                            type: 'error'
                        });
                        return;
                }
                 if(this.jifenFilters.jslx == ''){
                    this.$message({
                            message: "请填写结算类型",
                            type: 'error'
                        });
                        return;
                } 
                if(this.jifenFilters.value == ''){
                    this.$message({
                            message: "请填写额度",
                            type: 'error'
                        });
                        return;
                }
                var reg = /^\d+(\.\d+)?$/;
                if(!reg.test(this.jifenFilters.value)){
                    this.$message({
                            message: "请输入正确的积分",
                            type: 'error'
                        });
                        return;
                }
                // if(this.jifenFilters.password == ''){
                //     this.$message({
                //         message: "请填写密码",
                //         type: 'error'
                //     });
                //     return;
                // }
                var typename = this.jifenFilters.type == 1 ? '上积分': '下积分';

                 this.$confirm('确认'+typename+'吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    let para = {
                    uid:this.jifenFilters.user.uid,
                    integral_exchange:this.jifenFilters.value,
                    countType:this.jifenFilters.jslx,
                    type:this.jifenFilters.type,
                    password:this.jifenFilters.password,
                    do_agent_account:util.getSessionItem('user','account')
                };
                this.handleFenLock = true;//加锁
                upDowjiFen(para).then((res) => {
                    if(res.code == 200){
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.editItems = [];
                        this.editItems.push(this.jifenFilters.user.uid);
                        this.jifenVisible = false;
                        this.getUsers();
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'info'
                        });
                    }
                    this.handleFenLock = false;//解锁
                }).catch((res)=>{
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                    this.handleFenLock = false;//解锁
                    })
            })   
            },

            handleJiFen(row,type){
                this.jifenFilters = {
                    user:row,
                    type:type,
                    value:"",
                    yufen:"",
                    jslx:"0",
                    password:"",
                }
                this.jifenVisible = true;
                getUserUpdowinfo({
                    uid:row.uid
                }).then(res =>{
                    if(res.code == 200){
                        this.jifenFilters.yufen = res.data
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'info'
                        });
                    }
                }).catch((res)=>{
                    this.addLoading = false;
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                })

            },
            searchLiushui(){
                this.liushuiSearchParam.begin_time = this.liushuiFilters.begin_time;
                this.liushuiSearchParam.end_time = this.liushuiFilters.end_time;
                this.liushuiPagination = {
                    current:1,
                    size:50,
                    total:0,
                }
                this.getLiushui()
            },

            searchtabFilters(){
                this.tabsearchParam.begin_time = this.tabFilters.begin_time;
                this.tabsearchParam.end_time = this.tabFilters.end_time;
                this.udfenPagination = {
                    current:1,
                    size:50,
                    total:0,
                }
                this.getUdfen()
            },

            searchtabFilters1(){
                this.tabsearchParam1.begin_time = this.tabFilters1.begin_time;
                this.tabsearchParam1.end_time = this.tabFilters1.end_time;
                this.paginationbets = {
                    current:1,
                    size:50,
                    total:0,
                }
                this.getBetsLists()
            },

            searchtabFilters2(){
                this.tabsearchParam2.begin_time = this.tabFilters2.begin_time;
                this.tabsearchParam2.end_time = this.tabFilters2.end_time;
                this.paginationjifens = {
                    current:1,
                    size:50,
                    total:0,
                }
                this.getDayJifen()
            },

            searchtabFilters3(){
                this.tabsearchParam3.begin_time = this.tabFilters3.begin_time;
                this.tabsearchParam3.end_time = this.tabFilters3.end_time;
                this.paginationHb = {
                    current:1,
                    size:50,
                    total:0,
                }
                this.getUserHb()
            },


            handleUserDetail(row){
                getUserDetail({uid:row.uid}).then((res) => {
                    this.currentUser.winfen = res.winfen == null ? 0 : res.winfen;
                    this.currentUser.upfen = res.upfen == null ? 0 : res.upfen;
                    this.currentUser.downfen = res.downfen == null ? 0 : res.downfen;
                    this.currentUser.integral_total = res.integral_total == null ? 0 : res.integral_total;
                    this.currentUser.integral_exchange = res.integral_exchange == null ? 0 : res.integral_exchange;
                    this.currentUser.user_profit = res.user_profit == null ? 0 : res.user_profit;
                    this.$forceUpdate();
                });
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
                // this.getLiushui()
            },
            handleSizeChange(val){
                this.pagination.size = val;
                this.$emit("getusers",this.agents_id)
            },
            handleCurrentChange(val) {
                this.pagination.current = val;
                this.$emit("getusers",this.agents_id)
            },
            // getUser(){
            //     this.user = []
            //     for(var i = (this.pagination.current-1) * this.pagination.size; i < this.pagination.size * (this.pagination.current);i++ ){
            //         if(this.users[i]){
            //             this.user.push(this.users[i])
            //         }
            //     }
            //     if(this.user.length){
            //         this.user.push(this.plugin.columnFilterFunc(this.user,"uid"))
            //     }

            // },
            searchUser(){
                this.searchParam = this.filters;
                this.pagination.current = 1;
                this.getUsers()
            },
            //获取用户列表
            getUsers(agents_id) {
                var boss_id  = "";
                if(agents_id){
                    boss_id = agents_id
                }else if(this.lowList.length){
                    boss_id = this.lowList[this.lowList.length-1].agents_id
                }else{
                    boss_id = util.getSessionItem("user","agents_id")
                }
                let para = {
                    pageNumber:this.pagination.current,
                    pageSize:this.pagination.size,
                    agents_id:boss_id,
                    username:this.searchParam.username,
                    level:this.searchParam.level,
                    name:this.searchParam.name,
                    search_type:this.searchParam.search_type,
                    user_type:this.searchParam.user_type,
                    agents_account:this.searchParam.agents_account,
                    agents_name:this.searchParam.agents_name,
                };
                this.listLoading = true;
                getUserListPage(para).then((res) => {
                    this.pagination.total = res.data.total;
                    this.user = res.data.users;
                    // if(this.users.length){
                    //     this.users.push(this.plugin.columnFilterFunc(this.users,"username"))
                    // }
                    this.pagination.current = res.data.pageNumber;
                    // this.getUser();
                    this.edited();
                    this.listLoading = false;
                    this.autoTableHeight();
                });
            },
            //获取流水列表
            getLiushui() {
                let para = {
                    pageNumber:this.liushuiPagination.current,
                    pageSize:this.liushuiPagination.size,
                    uid:this.liushuiFilters.user.uid,
                    begin_time:(this.liushuiSearchParam.begin_time == "" || this.liushuiSearchParam.begin_time == null) ? "": moment(this.liushuiSearchParam.begin_time).unix(),
                    end_time:(this.liushuiSearchParam.end_time == "" || this.liushuiSearchParam.end_time == null) ? "": moment(this.liushuiSearchParam.end_time).unix(),
                };
                this.liushuiLoading = true;
                getLiushuiPage(para).then((res) => {
                    this.liushuiPagination.total = res.total;
                    this.liushui = res.data;
                    if(this.liushui.length){
                        this.liushui.push(this.plugin.columnFilterFunc(this.liushui,"name",'score'))
                    }
                    this.liushuiLoading = false;
                    this.autoTableHeight();
                });
            },
            //删除
            handleDelete: function (row) {
                this.$confirm('确认删除该会员吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { uid: row.uid };
                    handleDeleteUser(para).then((res) => {
                        this.listLoading = false;
                        if(res.code == 200){
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.getUsers();
                        }else{
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
                    });
                }).catch((res) => {

                });
            },
            //显示编辑界面
            handleEdit: function (row) {
                this.xh_config = "";
                this.editForm = {
                    uid:row.uid,
                    name: row.name,
                    username: row.username,
                    password: '',
                    agents_id: row.agents_id,
                    agents_account: row.agents_account,
                    agents_name: row.agents_name,
                    xm_rate: row.xm_rate,
                    xm_type: row.xm_type.toString(),
                    agents_share_rate: row.agents_share_rate,
                    user_desc: row.user_desc,
                    head: row.head,
                    agent_score: "",
                    status:row.status,
                    no_say:row.no_say,
                    xh_config:row.xh_config,
                    xh:[],
                    zx_min:row.zx_min,
                    zx_max:row.zx_max,
                    extra_share:row.extra_share,
                    phone:row.phone,
                    wxchat:row.wxchat,
                    qq:row.qq,
                    bankcard:row.bankcard,
                }
                this.xh_config = row.xh_config;
                //获取上级代理余分
                // getAgentsFen({
                //     uid: row.agents_id
                // }).then((res) => {
                //     this.editForm.agents_id = res.data.agents_id;
                //     this.editForm.agents_account = res.data.account;
                //     this.editForm.agents_name = res.data.name;
                //     this.editForm.agent_score = res.data.agent_score;
                // });
                //获取上级代理限红
                // getAgentsXh({
                //     agents_id: row.agents_id
                // }).then((res) => {
                //     this.editForm.xh = res.data;
                // });
                this.$forceUpdate()
                this.editFormVisible = true;
            },
            //显示新增界面
            handleAdd: function () {
                var agents_id = "";
                var agents_account = "";
                var agents_name = "";
                if(this.currentAgent.agents_id){
                    agents_id = this.currentAgent.agents_id;
                    agents_account = this.currentAgent.agents_account;
                    agents_name = this.currentAgent.agents_name;
                }else{
                    agents_id = util.getSessionItem('user','agents_id');
                    agents_account = util.getSessionItem('user','account');
                    agents_name = util.getSessionItem('user','name');
                }
                this.xh_config = '';
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    head: '',
                    username: '',
                    password: '',
                    agents_id: agents_id,
                    agents_account: agents_account,
                    agents_name: agents_name,
                    xm_rate: '0',
                    xm_type: '1',
                    xh_config:"",
                    xh:[],
                    agents_share_rate: '0',
                    user_desc: '',
                    agent_score: "",
                    zx_min:0,
                    zx_max:0,
                    extra_share:0,
                    phone:"",
                    wxchat:"",
                    qq:"",
                    bankcard:"",
                }
                this.xh_config = '';
                //
                //获取代理信息
                getAgentsInfo({
                    agents_id: agents_id
                }).then((res) => {
                    this.addForm.agents_name = res.data.name;
                    this.addForm.agent_score = res.data.agent_score;
                });
                //获取代理限红
                // getAgentsXh({
                //     agents_id: agents_id
                // }).then((res) => {
                //     this.addForm.xh = res.data;
                // });
            },
            //编辑
            editUserSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认修改吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            this.editForm.xh_config = this.xh_config
                            let para = Object.assign({
                                agents_account:util.getSessionItem('user','account')
                            }, this.editForm);
                            delete para.xh;
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                if(res.code == 200){
                                    this.editLoading = false;
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.editItems=[];
                                    this.editItems.push(this.editForm.uid);
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getUsers();
                                    if(para.no_say == 1){
                                        this.$store.getters.imClient.send(JSON.stringify({
                                            "cmd": 4000,
                                            "set": 33,
                                            'update_uid': para.uid,
                                        }))
                                    }else if(para.no_say == 0){
                                        this.$store.getters.imClient.send(JSON.stringify({
                                            "cmd": 4002,
                                            "set": 33,
                                            'update_uid': para.uid,
                                        }))
                                    }

                                    if(para.status == 1){
                                        this.$store.getters.imClient.send(JSON.stringify({
                                            "cmd": 4004,
                                            "set": 33,
                                            'update_uid': para.uid,
                                        }))
                                    }else if(para.status == 0){
                                        this.$store.getters.imClient.send(JSON.stringify({
                                            "cmd": 4006,
                                            "set": 33,
                                            'update_uid': para.uid,
                                        }))
                                    }
                                }else{
                                    this.$message({
                                        message: res.msg,
                                        type: 'info'
                                    });
                                }
                                
                            }).catch(() => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交出现错误',
                                    type: 'error'
                                });
                            });
                        });
                    }
                });
            },
            //新增
            addUserSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交会员吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            this.addForm.xh_config = this.xh_config
                            let para = Object.assign({
                                agents_name:util.getSessionItem('user','name'),
                                agents_account:util.getSessionItem('user','account'),
                            }, this.addForm);
                            delete para.xh;
                            addUser(para).then((res) => {
                                this.addLoading = false;
                                if(res.code == 200){
                                    this.$message({
                                    message: res.msg,
                                    type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getUsers();
                                }else{
                                    this.addLoading = false;
                                    this.$message({
                                    message: res.msg,
                                    type: 'info'
                                });
                                }
                                
                                
                            }).catch(() => {
                                    this.addLoading = false;
                                    this.$message({
                                    message: '提交出现错误',
                                    type: 'error'
                                });
                            });
                        });
                    }
                });
            },
            autoTableHeight(){
                this.$nextTick(() => {
                this.tableHeight = $(".content-container").height() - $(".toptoolbar").height() - 120
                    setTimeout(()=>{
                        for(var i = 0 ; i < $(".tableStyle").length;i++){
                            $(".tableStyle").eq(i).find(".is-scrolling-none").width($(".tableStyle").eq(i).find(".el-table__header").width())
                            $(".tableStyle").eq(i).find(".is-scrolling-left").width($(".tableStyle").eq(i).find(".el-table__header").width())
                        }
                        this.listLoading = false;
                    },0)
             })
           },
           clicked(){
               $(".isEdited").removeClass("isEdited");
           },
            edited(){
                this.$nextTick(()=>{
                    $(".current-row").removeClass("current-row");
                    for(var i =0;i < this.editItems.length;i++){
                        console.log(this.editItems[i]);
                        $("input[value="+this.editItems[i]+"]").parents("tr").addClass("isEdited")
                    }
                })
            }
        },
        watch:{
            "editItems":function() {
                this.edited()
            },
            "addFormVisible":function(val) {
                if(!val){
                    setTimeout(()=>{
                        this.currentAgent = {};
                        this.currentAgent.agents_name = "";
                    },500)
                }
            },
        },
        mounted() {
          //  this.$store.getters.imClient.bindChangeSf(this.onChangeSf)
           // this.$store.getters.imClient.bindOpFenzs(this.onOpFen)
            this.autoTableHeight();
            $(window).resize(()=>{
                this.autoTableHeight();
            })
        }
    }

</script>

<style lang="scss">
    .toolbar-user{
        span{
            margin-right: 10px;
        }
    }
    .contentp{
        text-align: center;
    }
    .el-dialog--small{
        width: 70%;
    }
    .w80{
        width: 80%;
    }
    .detailtop{
        height:100px;
        background-color: #47A4AB;
        position: relative;
        .info{
           margin-left: 120px;
            height: 80px;
            /* margin-top: 10px; */
            position: relative;
            top: 10px;
            line-height: 40px;
            font-size: 23px;
            color: #fff;
        }
    }
    .imgcontent{
      position: absolute;
      left:20px;
      top:10px;
      width:80px;
      height:80px;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .middle{
        height: 100px;
        .item{
            float: left;
            width:120px;
            .key{
                height:50px;
                text-align: center;
                line-height: 50px;
                font-size: 15px;
                color:#000;
            }
            .value{
                height:50px;
                line-height: 50px;
                text-align: center;
                font-size: 18px;
                color:#000;
            }
        }
    }
    .tabag{
        line-height: 40px;
        border-bottom:2px solid #ccc;
        clear: both;
        margin-bottom: 10px;
        font-size: 16px;
        color:#000;
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
</style>
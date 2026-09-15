<template>
  <div>
    <section>
      <el-col :span="24" class="toolbar toptoolbar" style="padding-bottom: 4px;">
        <span style="color: #000;">选择桌子: </span>
        <el-select @change="changeGroup" size="mini" v-model="currentGroup.groupid" placeholder="请选择桌子">
          <el-option
            v-for="(room,index) in rooms"
            :key="index"
            :label="room.groupname"
            :value="room.groupid">
          </el-option>
        </el-select>

        <el-button v-if="videopower[currentGroup.groupid] == 0 && agent_type == 4" size="mini" @click="switchvideopower(1)" type="primary">关闭视频</el-button>
        <el-button v-if="videopower[currentGroup.groupid] == 1 && agent_type == 4" @click="switchvideopower(0)" size="mini" type="primary">开启视频</el-button>
        <el-button @click="clearGroupMsg()"  style="margin-left: 10px;cursor:pointer;" size="mini" type="primary">清空群消息</el-button>
        <el-button v-if="integral_tongji_way > 0" @click="setStartWorkTimeFunc()"   style="margin-left: 10px;cursor:pointer;" size="mini" type="warning">{{ start_work }}</el-button>
        <span  v-if="integral_tongji_way > 0 && start_work_status == 0" style="float: left;color:chocolate;margin-left: 10px;position: absolute;font-size: 15px;font-weight: 700;">(开工时间：{{start_work_time}})</span>
        <el-button @click="setting()" style="margin-right:10px;cursor:pointer;float:right;" size="mini" type="success">房间设置</el-button>
        <el-button @click="settingSystem()" style="margin-right:10px;cursor:pointer;float:right;" size="mini" type="success">系统设置</el-button>
   
      </el-col>
    </section>
    <div class="roomContent">
      <el-row class="h100">
        <el-col class="h100" :span="8" style="position: relative; left: 33.5%;">
          <div class="rightcon" style="border:2px solid #000;">
            <div class="videoContentWrap">
              <div  id="paiControll" class="paiControll" v-show="desktops[currentGroup.groupid]">
                   
                <div @click="checkpai = false" class="xuanpaiWrapper" v-if="checkpai">
                  <div class="checkpai">
                    <ul class="checkpaiul">
                      <li v-for="i in 53" :key="i" :class="{'nor':i%13 == 0}" @click="subPai(i)">{{i}}</li>
                    </ul>
                  </div>
                </div>
                
                <div class="paiju">
                  <div style="margin-left:15px">
                    <span>桌号</span>
                    <input readonly="readonly" style="width: 34px;text-align: center;height:24px;color:#090;font-weight:bold;" type="text" v-model="this.paiControll.roomInfo.room_info.room_id">
                    <span>靴号</span>
                    <input readonly="readonly" style="width: 44px;text-align: center;height:24px;color:#090;font-weight:bold;" type="text" v-model="this.paiControll.roomInfo.room_info.boots_number">
                    <span>局</span>
                    <input readonly="readonly" style="width: 34px;text-align: center;height:24px;color:#090;font-weight:bold;" type="text" v-model="paiControll.roomInfo.room_info.ju">

                  </div>
                </div>
            
                <div v-if="currentGroup.group.game_type == 0" class="paiControllLeft">          
                  <div class="bjlpai">
                    <div class="bjltop">
                       <a   :href="this.videoUrl+currentGroup.group.video_link" target="_blank" rel="noopener noreferrer"><button class="shipingclass" >视 频</button></a>

                      <div class="paibei" @click="chosePai(5)"><img v-if="paiControll.paidian.p5" :src="paiControll.paimian.p5"></div>
                    </div>
                    <div class="bjlbottom">
                       <div class="paibei2">
                        <div class="paibei" @click="chosePai(1)"><img v-if="paiControll.paidian.p1" :src="paiControll.paimian.p1"></div>
                        <div class="paibei" @click="chosePai(2)"><img v-if="paiControll.paidian.p2" :src="paiControll.paimian.p2"></div>
                      </div>
                    </div>
                  </div>
                  <div class="bjltip">闲家 <span style="color:#090;" v-if="paiControll.paidian.p1 || paiControll.paidian.p2 || paiControll.paidian.p5">{{xj_d}}点</span></div>
                </div>
                <div v-if="currentGroup.group.game_type == 0" class="paiControllRight">
                   <button  @click="xue1" class="nextXueJu">进入下靴</button>
                    <button  @click="updateXueJu" class="updateXueJu">修改靴局</button>
                   
                  <div class="bjlpai">
                    <div class="bjltopright">
                      <div class="paibei" @click="chosePai(6)"><img v-if="paiControll.paidian.p6" :src="paiControll.paimian.p6"></div>
                    </div>
                    <div class="bjlbottom">
                      <div class="paibei2">
                        <div class="paibei" @click="chosePai(3)"><img v-if="paiControll.paidian.p3" :src="paiControll.paimian.p3"></div>
                        <div class="paibei" @click="chosePai(4)"><img v-if="paiControll.paidian.p4" :src="paiControll.paimian.p4"></div>
                      </div>
                    </div>
                  </div>
                  <div class="bjltip">庄家 <span style="color:#090;" v-if="paiControll.paidian.p3 || paiControll.paidian.p4 || paiControll.paidian.p6">{{zj_d}}点</span></div>
                </div>
            
                <div v-if="currentGroup.group.game_type == 1" class="paiControllLeft">
                  <div class="bjlpai">
                    <div class="lhtop">
                      <div class="paibei" @click="chosePai(1)"><img v-if="paiControll.paidian.p1" :src="paiControll.paimian.p1"></div>
                    </div>
                  
                  </div>
                  <div class="bjltip">龙 <span style="color:#090;" v-if="paiControll.paidian.p1">{{long_d}}点</span></div>
                </div>
                <div v-if="currentGroup.group.game_type == 1" class="paiControllRight">
                  <div class="bjlpai">
                    <div class="lhtop">
                      <div class="paibei" @click="chosePai(2)"><img v-if="paiControll.paidian.p2" :src="paiControll.paimian.p2"></div>
                    </div>
                  </div>
                  <div class="bjltip">虎 <span style="color:#090;" v-if="paiControll.paidian.p2">{{hu_d}}点</span></div>
                </div>

                <div v-if="currentGroup.group.game_type == 3" class="paiControllLeft">
                  <div class="bjlpai">
                    <div class="bjltop">
                      <div style="width: 140px;height: 100%;margin-left: 25%;"> 
                        <div class="paibei" style="float:left;" @click="chosePai(1)"><img v-if="paiControll.paidian.p1" :src="paiControll.paimian.p1"></div>
                        <div class="paibei" style="float:left;"  @click="chosePai(2)"><img v-if="paiControll.paidian.p2" :src="paiControll.paimian.p2"></div>
                      </div>
                    </div>
                    <div class="bjlbottom">
                       <div class="paibei2" style="width:200px;">
                        <div class="paibei" @click="chosePai(3)"><img v-if="paiControll.paidian.p3" :src="paiControll.paimian.p3"></div>
                        <div class="paibei" @click="chosePai(4)"><img v-if="paiControll.paidian.p4" :src="paiControll.paimian.p4"></div>
                        <div class="paibei" @click="chosePai(5)"><img v-if="paiControll.paidian.p5" :src="paiControll.paimian.p5"></div>
                      </div>
                    </div>
                  </div>
                  <div class="bjltip">黑牛</div>
                </div>
                <div v-if="currentGroup.group.game_type == 3" class="paiControllRight">
                  <div class="bjlpai">
                    <div class="bjltop">
                      <div style="width: 140px;height: 100%;margin-left: 25%;"> 
                        <div class="paibei" style="float:left;" @click="chosePai(6)"><img v-if="paiControll.paidian.p6" :src="paiControll.paimian.p6"></div>
                        <div class="paibei" style="float:left;"  @click="chosePai(7)"><img v-if="paiControll.paidian.p7" :src="paiControll.paimian.p7"></div>
                      </div>
                    </div>
                    <div class="bjlbottom">
                      <div class="paibei2" style="width:200px;">
                        <div class="paibei" @click="chosePai(8)"><img v-if="paiControll.paidian.p8" :src="paiControll.paimian.p8"></div>
                        <div class="paibei" @click="chosePai(9)"><img v-if="paiControll.paidian.p9" :src="paiControll.paimian.p9"></div>
                        <div class="paibei" @click="chosePai(10)"><img v-if="paiControll.paidian.p10" :src="paiControll.paimian.p10"></div>
                      </div>
                    </div>
                  </div>
                  <div class="bjltip">红牛</div>
                </div>
           
                <div class="zjkj">
                    <div id="resultZ" @click="choseRes(1,'resultZ')"  :class="[kaipaiArr.y == 1?'currentZ':'btnZ']" class="btn">庄</div>
                    <div id="resultX" @click="choseRes(2,'resultX')"  :class="[kaipaiArr.y == 2?'currentX':'btnX']"  class="btn">闲</div>
                    <div id="resultH" @click="choseRes(3,'resultH')"  :class="[kaipaiArr.y == 3?'currentH':'btnH']"  class="btn">和</div>
                    <div id="resultZd" @click="choseRes(4,'resultZd')"   :class="[kaipaiArr.zd == 1?'currentZ':'btnZ']"  class="btn ">庄对</div>
                    <div id="resultXd" @click="choseRes(5,'resultXd')" :class="[kaipaiArr.xd == 1?'currentX':'btnX']"  class="btn">闲对</div>
                    <div id="resultXy12"  @click="choseRes(12,'resultXy12')" :class="[kaipaiArr.xy == 12?'currentXy':'btnXy']" v-show="resultXyVisible" class="btn">
                      <div style="height:50%;margin-top:-10px;">幸运</div>
                      <div style="height:50%;">六12</div>
                    </div>
                    <div id="resultXy20" @click="choseRes(20,'resultXy20')" :class="[kaipaiArr.xy == 20?'currentXy':'btnXy']"  v-show="resultXyVisible" class="btn" >
                        <div style="height:50%;margin-top:-10px;">幸运</div>
                      <div style="height:50%;">六20</div>
                    </div>
                 </div>

                <div class="paiControllBottom">

                  <div class="ctrbtn" ><span @click="kaiju()" :class="{'disabled':paiControll.roomInfo.room_info.room_status != 0 && paiControll.roomInfo.room_info.room_status != -1}" class="btn"  >开局</span></div>
                  <div class="ctrbtn"><span @click="tingzhi()" :class="{'disabled':paiControll.roomInfo.room_info.room_status == 0|| paiControll.roomInfo.room_info.room_status == 2 || paiControll.roomInfo.room_info.room_status == -1}" class="btn" >停止下注</span></div>
                  <div class="ctrbtn"><span @click="daojishi()" :class="{'disabled':paiControll.roomInfo.room_info.room_status == 0 || paiControll.roomInfo.room_info.room_status == 2 || paiControll.roomInfo.room_info.room_status == -1}" class="btn">倒计时{{daojishi_second}}秒</span></div>
                  <div class="ctrbtn"><span @click="kaipai()" :class="{'disabled':paiControll.roomInfo.room_info.room_status == 0 || paiControll.roomInfo.room_info.room_status == 1 || paiControll.roomInfo.room_info.room_status == -1}" class="btn" v-loading="kaipailoading">开牌</span></div>
                  <div class="ctrbtn"><span @click="quxiao()" :class="{'disabled':paiControll.roomInfo.room_info.room_status == 0 || paiControll.roomInfo.room_info.room_status == -1}" class="btn" >取消</span></div>
                </div>
              </div>
  
            </div>
            <!-- 报表-->
            <div class="baobiao">
              <div class="baobiao_title">
                <div class="dj_class">当局报表</div>               
                <div class="zy_class"> 结算报表</div>              
              </div>
              <div class="dj_baobiao_class">
                    <div class="dj_content_class">
                      <div class="dj_class">
                        <div style="width:33.3%;height:100%;float:left;text-align: center;">
                          <span v-if="currentGroup.group.game_type !=3" v-html="dj.dc"></span>
                          <br />对冲
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span>{{dj.ws}}</span>
                          <br />尾数
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span v-if="currentGroup.group.game_type != 3" v-html="resder(dj)"></span>
                          <br />推码
                        </div>
                      </div>
                    </div>
                    <div class="dj_content_class">
                      <div class="dj_class">
                        <div style="width:33.3%;height:100%;float:left;text-align: center;border-bottom: 1px dashed rgb(204, 204, 204); ">
                          <span v-if="currentGroup.group.game_type !=3">{{dj.z}}</span>
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">庄注</template>
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;border-bottom: 1px dashed rgb(204, 204, 204);">
                          <span v-if="currentGroup.group.game_type != 3">{{dj.x}}</span>     
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">闲注</template>
                  
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;border-bottom: 1px dashed rgb(204, 204, 204);">
                          <span v-if="currentGroup.group.game_type == 0" >{{dj.h}}</span>
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">和</template>
                        </div>
                      </div>
                    </div>
                    <div class="dj_content_class">
                      <div class="dj_class">
                        <div style="width:33.3%;height:100%;float:left;text-align: center;">
                          <span v-if="currentGroup.group.game_type !=3">{{dj.z_zc}}</span>
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">庄注占成</template>
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span v-if="currentGroup.group.game_type != 3">{{dj.x_zc}}</span>     
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">闲注占成</template>
                  
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span v-if="currentGroup.group.game_type == 0" >{{dj.h_zc}}</span>
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">和注占成</template>
                        </div>
                      </div>
                    </div> 
                    <div class="dj_content_class">
                      <div class="dj_class">
                        <div style="width:33.3%;height:100%;float:left;text-align: center;border-bottom: 1px dashed rgb(204, 204, 204);">
                          <span v-if="currentGroup.group.game_type != 3 && currentGroup.group.game_type != 1">{{dj.zd}}</span>
                          <br />
                          <template v-if="currentGroup.group.game_type == 0 ">庄对</template>
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;border-bottom: 1px dashed rgb(204, 204, 204);">
                          <span v-if="currentGroup.group.game_type != 3 && currentGroup.group.game_type != 1">{{dj.xd}}</span>     
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">闲对</template>
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;border-bottom: 1px dashed rgb(204, 204, 204);">
                          <span v-if="currentGroup.group.game_type != 3 && currentGroup.group.game_type != 1">{{dj.xy}}</span>
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">幸运六</template>
                        </div>
                      </div>
                    </div>
                    <div class="dj_content_class">
                      <div class="dj_class">
                        <div style="width:33.3%;height:100%;float:left;text-align: center;">
                          <span v-if="currentGroup.group.game_type !=3">{{dj.zd_zc}}</span>
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">庄对占成</template>
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span v-if="currentGroup.group.game_type != 3">{{dj.xd_zc}}</span>     
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">闲对占成</template>
                  
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span v-if="currentGroup.group.game_type == 0" >{{dj.xy_zc}}</span>
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">幸运六占成</template>
                        </div>
                      </div>
                  </div>
              </div> 
              
              <div class="jiesuan_baobiao_class">
                    <div class="jiesuan_content_class">
                      <div class="jiesuan_class">
                        <div style="width:33.3%;height:100%;float:left;text-align: center;">
                          <span>{{zy.luckysix_yk}}</span>
                          <br />幸运六盈亏
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span>{{zy.tmcm}}</span>
                          <br />台面筹码
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span>{{zy.wsyk}}</span>
                          <br />尾数盈亏
                        </div>
                      </div>
                    </div>
                    <div class="jiesuan_content_class">
                      <div class="jiesuan_class">
                        <div style="width:33.3%;height:100%;float:left;text-align: center;border-bottom: 1px solid rgb(204, 204, 204); ">
                          <span>{{zy.sbyk}}</span>
                          <br />
                          <template >三宝盈亏</template>
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;border-bottom: 1px solid rgb(204, 204, 204);">
                          <span>{{zy.dcyk}}</span>     
                          <br />
                          <template>对冲盈亏</template>
                  
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;border-bottom: 1px solid rgb(204, 204, 204);">
                          <span >{{zy.dlzy}}</span>
                          <br />
                          <template>代理总赢</template>
                        </div>
                      </div>
                    </div>
                    <div class="jiesuan_content_class">
                      <div class="jiesuan_class">
                        <div style="width:33.3%;height:100%;float:left;text-align: center;">
                          <span>{{zy.zxxm}}</span>
                          <br />
                          <template >庄闲洗码</template>
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span>{{zy.sbxm}}</span>     
                          <br />
                          <template >四宝洗码</template>
                  
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span>{{zy.khyk}}</span>
                          <br />
                          <template>客户盈亏</template>
                        </div>
                      </div>
                    </div> 
                    <div class="jiesuan_content_class">
                      <div class="jiesuan_class">
                        <div style="width:33.3%;height:100%;float:left;text-align: center;">
                          <span>{{zy.zx_zc_yk}}</span>
                          <br />
                          <template>庄闲占成输赢</template>
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span>{{zy.sb_zc_yk}}</span>     
                          <br />
                          <template>四宝占成输赢</template>
                        </div>
                        <div style="width:33.3%;height:100%;float:left;text-align:center;">
                          <span>{{zy.tmzs}}</span>
                          <br />
                          <template v-if="currentGroup.group.game_type == 0">推码总数</template>
                        </div>
                      </div>
                    </div>
              </div> 
              
            </div>
            <!-- ludan-->
            <div class="ludan">
              <div class="title">路单  {{ludan.data.ju}}局   庄{{ludan.data.z}}  闲{{ludan.data.x}} 和{{ludan.data.h}} 庄对{{ludan.data.zd}} 闲对{{ludan.data.xd}} 幸运六{{ludan.data.xy}}
             </div>
              <!--   路单-->
              <div class="ludan">
                <div class="dalu">
                  <div class="bgtext">大路</div>
                  <x-grid ref="xgrid" :options="ludan.option2"></x-grid>
                </div>
                <div v-if="currentGroup.gameType != 2 && currentGroup.gameType != 3" class="silu">
                  <div class="dyz">
                    <div class="bgtext">大眼仔</div>
                    <x-grid ref="xgrid" :options="ludan.option3"></x-grid>
                  </div>
                  <div class="jyl">
                    <div class="bgtext">曱甴路</div>
                    <x-grid ref="xgrid" :options="ludan.option5"></x-grid>
                  </div>
                  <div class="xl">
                    <div class="bgtext">小路</div>
                    <x-grid ref="xgrid" :options="ludan.option4"></x-grid>
                  </div>
                  <div class="sxl">
                    <div class="bgtext">三星路</div>
                    <x-grid ref="xgrid" :options="ludan.option6"></x-grid>
                  </div>
                </div>

                <div v-if="currentGroup.gameType == 2 || currentGroup.gameType == 3" class="silu" style="height:110px;position:relative;margin-top:2px;overflow-x: auto;overflow-y: hidden;">
                  <win-scroll :gametype="currentGroup.gameType" ref="winscroll" :win="xueWin"></win-scroll>
                </div>

                <div class="zzl">
                  <div class="bgtext">珠子路</div>
                  <x-grid ref="xgrid" :gametype="currentGroup.gameType" :options="ludan.option1"></x-grid>
                </div>

                <div
                  class="xjts"
                  style="width: 50%;
    float: left;
    position: relative;
    border: 1px solid rgb(204, 204, 204);
    background-color: rgb(255, 255, 255);
    box-sizing: border-box;
    height: 79px;
    margin-top: 2px;"
                >
                  <div
                    style="width: 100%; float: left; position: relative;  background-color: rgb(255, 255, 255); box-sizing: border-box; height: 100%;"
                  >

                    <div v-if="currentGroup.gameType != 2 && currentGroup.gameType != 3"
                      style="position: absolute; top: 0px; left: 0%; bottom: 0%; width: 10%; border-right: 1px solid rgb(204, 204, 204);"
                    >
                    <div style="color: rgb(67, 144, 211); font-size: 12px; font-weight: bold; text-align: center; line-height: 140%; writing-mode: vertical-lr; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
                        下局提示
                    </div>
                    </div>
                  <div v-if="currentGroup.gameType != 2 && currentGroup.gameType != 3" style="position: absolute; top: 0px; right: 0px; width: 90%; bottom: 0px;">
                    <div class="predict_container">
                      <div
                        class="predict-b"
                        style="display: flex;justify-content: center;align-items: center;border-bottom: 1px solid #ccc;"
                      >
                        <div
                          style="float: left;width: 25%;border-right: 1px solid #ccc;height: 100%;display: flex;justify-content: center;align-items: center;"
                        >
                          <div class="game-stat-red message-red" style="float: left;">
                            <img
                              v-if="currentGroup.gameType == 0"
                              style="margin-top: 20%"
                              width="18px"
                              height="18px"
                              src="../../../static/images/zhuang.png"
                            />
                            <img
                              v-if="currentGroup.gameType == 1"
                              style="margin-top: 20%"
                              width="18px"
                              height="18px"
                              src="../../../static/images/long.png"
                            />
                          </div>
                        </div>
                        <div
                          class="predict predict_be"
                          style="float: left;width: 24%;box-sizing: border-box;border-right: 1px solid #ccc;height: 100%;display: flex;justify-content: center;align-items: center;"
                        >
                          <div v-if="ludan.yc[0].dyz == 1" class="red0"></div>
                          <div v-if="ludan.yc[0].dyz == 2" class="blue0"></div>
                        </div>
                        <div
                          class="predict predict_sr"
                          style="float: left;width: 24%;box-sizing: border-box;border-right: 1px solid #ccc;height: 100%;display: flex;justify-content: center;align-items: center;"
                        >
                          <div v-if="ludan.yc[0].xl == 1" class="red3"></div>
                          <div v-if="ludan.yc[0].xl == 2" class="blue3"></div>
                        </div>
                        <div
                          class="predict predict_cr"
                          style="float: left;width: 27%;padding: 10px;box-sizing: border-box;height: 100%;display: flex;justify-content: center;align-items: center;"
                        >
                          <div v-if="ludan.yc[0].yyl == 1" class="redg"></div>
                          <div v-if="ludan.yc[0].yyl == 2" class="blueg"></div>
                        </div>
                      </div>
                      <div
                        class="predict-p"
                        style="display: flex;justify-content: center;align-items: center;"
                      >
                        <div
                          style="float: left;width: 25%;border-right: 1px solid #ccc;height: 100%;display: flex;justify-content: center;align-items: center;"
                        >
                          <div class="game-stat-blue message-blue">
                            <img
                              v-if="currentGroup.gameType == 0"
                              style="margin-top: 20%"
                              width="18px"
                              height="18px"
                              src="../../../static/images/xian.png"
                            />
                            <img
                              v-if="currentGroup.gameType == 1"
                              style="margin-top: 20%"
                              width="18px"
                              height="18px"
                              src="../../../static/images/hu.png"
                            />
                          </div>
                        </div>

                        <div
                          class="predict predict_be"
                          style="float: left;width: 24%;box-sizing: border-box;border-right: 1px solid #ccc;height: 100%;display: flex;justify-content: center;align-items: center;"
                        >
                          <div v-if="ludan.yc[1].dyz == 1" class="red0"></div>
                          <div v-if="ludan.yc[1].dyz == 2" class="blue0"></div>
                        </div>
                        <div
                          class="predict predict_sr"
                          style="float: left;width: 24%;box-sizing: border-box;border-right: 1px solid #ccc;height: 100%;display: flex;justify-content: center;align-items: center;"
                        >
                          <div v-if="ludan.yc[1].xl == 1" class="red3"></div>
                          <div v-if="ludan.yc[1].xl == 2" class="blue3"></div>
                        </div>
                        <div
                          class="predict predict_cr"
                          style="float: left;width: 27%;padding: 10px;box-sizing: border-box;height: 100%;display: flex;justify-content: center;align-items: center;"
                        >
                          <div v-if="ludan.yc[1].yyl == 1" class="redg"></div>
                          <div v-if="ludan.yc[1].yyl == 2" class="blueg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col class="h100" :span="8">
          <div class="inputArea">
            <Uediter
              id="ue1"
              style="width: 100%;height:150px;overflow: auto; "
              @sendMsg="doSendMessage"
              :value="ueditor.value"
              :config="ueditor.config"
              ref="ue"
            ></Uediter>
          </div>
          <div class="inputBtnArea">
            <div  class="fast_text_con" v-show="fastTextConVisible">
              <div  class="fast_text_con_tit">快捷消息列表<span @click="fastTextConClose()">关闭</span></div>
               <div  class="fast_text_con_con">
                <div @click="fastItemChose(fastTextConItem)" class="fast_item" v-for="(fastTextConItem,index) in fastTextConData" :key="index">{{fastTextConItem}}</div>
               </div>
            </div>
            <div  class="msgtool" style="float: left; margin-top: 8px; margin-left: 5px;">
              <img @click="triggerUploadController()"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACaUlEQVRIS7WVMWgUURCG/3mbFAqWVhIICGIMNgpaiQmCEQsrgxoV73Zn1xBBONRol6QQEdFO4W5nNyfXiAFtBEGQKIIisRIVFEUEK9tDMZB9Iy9cQiKX887LvWp5OzvfPzvz/kfo8KIO5wf5vr/JGLMbwMB6wojodRzHjykMw+uqOg7g2XoCaoKniJlnATwXkcn1BDCzyzdRF+D7/kFjzASAHQBeiMiRVuFrAoIgGCai+wCqqlohomEA70VksBXImgBmdsmHRWRxwpjZNX/W87z+YrH4oVlIowqmieiYiGysAdyEvbHWbk/T9GPbAN/3c8aYaQAPAXwD0A+gT0R6mk1eE7Z2k5k5IiLfWttHRE+NMZdKpdKXegBm3gfgAIAHIvJ2KabhFDWrNAiCi0R0FYBR1e/GmJNxHL/8ZwUrVajq1yRJ7v4NZeYZAEcB3CCiV6paBLDZWjuUpumThhXk8/ldnuc5ZYdqiUsictY9R1G0N8uyGSLqsdbm0zQtu/0wDPeragnANrdvjOmte9DCMBxTVZf8l7X2sDEmBHAOwDtVTYnoFoBPRHQqjuO5lZVFUbTTWisA9gCYWgXIsux2V1fXTVU9rar3kiQ5sfRxEAQjRBQDcKP7aH5+/nilUvlZr1ejo6NbFhYWEgBD7v2yVRDRiKpuVdWxJEnc/1y1crlcb3d3d6qqg6p6J8uyC+Vy+Xc9SKFQ2FCtVi+vrGCAiGattVGSJJ8bTREzXwNwxblvI/toa0ydfXie96ORdbQFaOacMLNz40nXg8Uj3YkLh4jOLzpmzX/ONKOshZg5ERnv/KXfgqL/Cv0DkAdJIEKe1pAAAAAASUVORK5CYII=">
              <input type="file" name="filenameController" id="uploadfileController" style="display: none;">
                        
             </div>
            <div  class="fast_text" @click="fastTextConOpen()">快捷消息</div>
            <span  @click="doSendMessage()" style="border:1px solid #ccc;padding:3px 10px;margin-top:5px;cursor:pointer;float:right;margin-right:5px;" >发送</span>
            <span style="float:right;line-height:40px;">Ctrl+Enter换行,Enter发送消息</span>
          </div>
          <!-- chat -->
          <div class="loadChatText" v-show="loadChatText!=''">{{loadChatText}}</div>
          <div @click="toBottom"  id="toBottom"><img src="../../../static/images/down.png"></div>
          <div class="chat" id="chatcontentmain" style="border:2px solid #000;">
            <div id="messagepannel">
              <div @mouseover="chat.showDelete = 1" @mouseleave="chat.showDelete = 0" class="chatitemwrap" v-for="(chat,index) in chatMsg" :key="index" v-if="chat.msgtype!=2" style="position:relative;">
                <span @click="deletemsg(chat)" v-show="chat.showDelete == 1" v-if="chat.msgtype==0 && chat.error_order!=1" style='position: absolute;right: 2px;top:50%;color:red;cursor:pointer;'>删除</span>
                <div class="chatItem" >
                  
                  <div class="headimage" v-html="readerHeader(chat)"></div>
                  <div class="context">
                    <div class="nameandtime" v-html="readerNameAndTime(chat)"></div>
                    <div v-if="chat.msgtype==0" @click="chat.error_order == 5 && alertError(chat)"  class="text_msgtype0_class"  v-html="chatMessage(chat)"></div>
                    <div v-if="chat.msgtype==5" style ="margin-top: 5px;text-align:center;background-color: red; color: rgb(255, 255, 255);" class="text" >
                      <!--<img height="auto" width="100%" src="../../../static/images/beginBet.png" />-->
                    <!--{{currentGroup.group.mark+'桌'+paiControll.roomInfo.room_info.boots_number+'-'+paiControll.roomInfo.room_info.ju+'局已开局，请下注'}}-->
                    {{chat.message}}
                    </div>
                    <div v-if="chat.msgtype==6" style="margin-top: 5px;text-align:center;background-color: red; color: rgb(255, 255, 255);" class="text" >
                       投注时间倒计时{{daojishi_counttime}}秒
                    </div>
                    <div v-if="chat.msgtype==3 || chat.msgtype==2" style ="margin-top: 5px;text-align:center;background-color: red; color: rgb(255, 255, 255);" class="text">
                      停止下注，线下无效
                    </div>  
                    <div
                      style="margin-top: 5px;text-align: center;position: relative;"
                      v-if="chat.msgtype == 4"
                      :card_game_id="card_game_id(chat)"
               
                    >
                      <img height="auto" width="100%" src="../../../static/images/resnew.png" />
                      <div class="curJuInfo"  v-html="readerCurJuInfo(chat.message)"></div>
                      <div class="resultInfo" v-html="readerResult(chat.message)"></div>
                      <div class="resetclass"   v-html="readerRes(chat.message)"></div>
                    </div>
                    <!--开牌牌型-->
                    <div  v-if="currentGroup.gameType == 0 && chat.msgtype == 4 " class="kaiPaiContentClass">
                          <div  v-html="readerPaiRes(chat.message)"></div>             
                    </div>
                </div>
               </div> 
                <div
                  class="touzhubiao"
                  style="padding: 0 3px;margin-bottom: 5px;"
                  v-if="chat.msgtype == 3 && currentGroup.gameType == 0 "
                >
                  <table class="odds_table">
                    <tr class="odds_title">
                      <th colspan="7">{{readerTZTitle(chat.message)}}</th>
                    </tr>
                    <tr>
                      <td width="22%" class="odds_nickname">昵称</td>
                      <td width="10%" class="odds_x">闲</td>
                      <td width="10%" class="odds_z">庄</td>
                      <td width="14%" class="odds_xd">闲对</td>
                      <td width="14%" class="odds_zd">庄对</td>
                      <td width="10%" class="odds_h">和</td>
                      <td width="20%" class="odds_xy">幸运6</td>
                    </tr>
                    <tr v-for="res in readerTZ(chat.message)" :class="{'zj':res.key == -1}">
                      <td width="22%" class="odds_nickname" v-if="res.key != -1">{{res.name}}</td>
                      <td width="22%" class="odds_nickname" v-if="res.key == -1">总计</td>
                      <td width="10%" class="odds_x">{{res.x}}</td>
                      <td width="10%" class="odds_z">{{res.z}}</td>
                      <td width="14%" class="odds_xd">{{res.xd}}</td>
                      <td width="14%" class="odds_zd">{{res.zd}}</td>
                      <td width="10%" class="odds_h">{{res.h}}</td>
                      <td width="20%" class="odds_xy">{{res.xy}}</td>
                    </tr>
                  </table>
                </div>
                <div
                  class="touzhubiao"
                  style="padding: 0 3px;margin-bottom: 5px;"
                  v-if="chat.msgtype == 3 && currentGroup.gameType == 1 "
                >
                  <table class="odds_table">
                    <tr class="odds_title">
                      <th colspan="7">{{readerTZTitle(chat.message)}}</th>
                    </tr>
                    <tr>
                      <td width="22%" class="odds_nickname">昵称</td>
                      <td width="10%" class="odds_z">龙</td>
                      <td width="10%" class="odds_x">虎</td>
                      <td width="10%" class="odds_h">和</td>
                    </tr>
                    <tr v-for="res in readerTZ(chat.message)" :class="{'zj':res.key == -1}">
                      <td width="22%" class="odds_nickname" v-if="res.key != -1">{{res.name}}</td>
                      <td width="22%" class="odds_nickname" v-if="res.key == -1">总计</td>
                      <td width="10%" class="odds_z">{{res.z}}</td>
                      <td width="10%" class="odds_x">{{res.x}}</td>
                      <td width="10%" class="odds_h">{{res.h}}</td>
                    </tr>
                  </table>
                </div>

                <div
                  class="touzhubiao"
                  style="padding: 0 3px;margin-bottom: 5px;"
                  v-if="chat.msgtype == 3 && currentGroup.gameType == 2 "
                >
                 <table class="odds_table">
            <tr class="odds_title">
              <th colspan="9">{{readerTZTitle(chat.message)}}</th>
            </tr>
            <tr>
              <td width="20%" class="odds_nickname">昵称</td>
              <td width="9%" class="odds_x">龙</td>
              <td width="9%" class="odds_z">凤</td>
               <td width="16%" class="odds_x">幸运一击</td>
              <td width="10%" class="odds_z">顺子</td>
              <td width="10%" class="odds_x">同花</td>
             
              <td width="16%" class="odds_z">同花顺</td>
             
              <td width="10%" class="odds_xy">豹子</td>
            </tr>
            <tr v-for="res in readerTZ(chat.message)" :class="{'zj':res.key == -1}">
              <td width="20%" class="odds_nickname" v-if="res.key != -1">{{res.name}}</td>
              <td width="20%" class="odds_nickname" v-if="res.key == -1">总计</td>
              <td width="9%" class="odds_x">{{res.z}}</td>
              <td width="9%" class="odds_z">{{res.x}}</td>
               <td width="16%" class="odds_x">{{res.d8}}</td>
               <td width="10%" class="odds_z">{{res.zd}}</td>

              <td width="10%" class="odds_x">{{res.xd}}</td>
              
              <td width="16%" class="odds_z">{{res.ths}}</td>
             
              <td width="10%" class="odds_xy">{{res.xy}}</td>
            </tr>
          </table>
                </div>
                <div
                  class="touzhubiao"
                  style="padding: 0 3px;margin-bottom: 5px;"
                  v-if="chat.msgtype == 3 && currentGroup.gameType == 3 "
                >
                 <table class="odds_table">
            <tr class="odds_title">
              <th colspan="9">{{readerTZTitle(chat.message)}}</th>
            </tr>
            <tr>
              <td width="20%" class="odds_nickname">昵称</td>
              <td width="80%" class="odds_nickname">下注明细</td>
            </tr>
            <tr v-for="res in readerTZ(chat.message)" :class="{'zj':res.key == -1}">
              <td width="20%" class="odds_nickname" v-if="res.key != -1">{{res.name}}</td>
              <td width="20%" class="odds_nickname" v-if="res.key == -1">总计</td>
               <td width="80%" class="odds_nickname">{{readerTZbiao(res)}}</td>
            </tr>
          </table>
                </div>
                <div
                  class="yufenbiao"
                  style="padding: 0 3px;margin-bottom: 5px;"
                  v-if="chat.msgtype == 4"
                >
                  <table class="odds_table">
                    <tr class="odds_title">
                      <th colspan="5">{{readerYFTitle(chat.message)}}</th>
                    </tr>
                    <tr>
                      <td width="25%" class="odds_nickname">昵称</td>
                      <td width="25%" class="odds_x">本局得分</td>
                      <td width="25%" class="odds_k">剩余分</td>
                      <td width="25%" class="odds_s">初始分</td>
                    </tr>
                    <tr v-for="res in readerYF(chat.message)" :class="{'zj':res.key == -1}">
                      <td width="22%" class="odds_nickname" v-if="res.key != -1">{{res.name}}</td>
                      <td width="22%" class="odds_nickname" v-if="res.key == -1">总计</td>
                      <td width="25%" v-if="res.win >= 0" class="odds_x">{{res.win}}</td>
                      <td width="25%" v-if="res.win < 0" class="odds_xr">{{res.win}}</td>
                      <td width="25%" class="odds_k">{{res.score}}</td>
                      <td width="25%" class="odds_s">{{res.score_old}}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <!--chat end-->
        </el-col>
         <el-col class="h100" :span="8">
           <!--列表-->
           <div class="tableCon">
             <el-table :row-class-name="plugin.tableRowClassNameUser" size="mini" border :data="userOnlines" highlight-current-row  class="tableStyle tableStyleleft">
            <el-table-column prop="uid" label="ID" min-width="40">
            </el-table-column>
            <el-table-column prop="name" label="昵称" min-width="80">
            </el-table-column>
            <el-table-column prop="yue" label="余分" min-width="50">
            </el-table-column>
            <el-table-column prop="csf" label="初始分" min-width="50">
            </el-table-column>
            <el-table-column v-if="currentGroup.gameType == 0" prop="lei1" label="庄" min-width="50">
              <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei1}}</a>
                </template>
            </el-table-column>
            <el-table-column v-if="currentGroup.gameType == 1" prop="lei1" label="龙" min-width="50">
              <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei1}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="currentGroup.gameType == 2" prop="lei1" label="龙" min-width="50">
              <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei1}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="currentGroup.gameType == 3" prop="lei2" label="黑牛" min-width="50">
              <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei2}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="currentGroup.gameType == 3" prop="lei1" label="红牛" min-width="50">
              <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei1}}</a>
                </template>
            </el-table-column>

             <el-table-column v-if="currentGroup.gameType == 3" prop="lei17" label="黑牛翻倍" min-width="80">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei17}}</a>
                </template>
            </el-table-column>

              <el-table-column v-if="currentGroup.gameType == 3" prop="lei16" label="红牛翻倍" min-width="80">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei16}}</a>
                </template>
            </el-table-column>           
            <el-table-column v-if="currentGroup.gameType == 0" prop="lei2" label="闲" min-width="50">
               <template slot-scope="scope">
                    <a style="color:blue;" >{{scope.row.lei2}}</a>
                </template>
            </el-table-column>
            <el-table-column v-if="currentGroup.gameType == 1" prop="lei2" label="虎" min-width="50">
               <template slot-scope="scope">
                    <a style="color:blue;" >{{scope.row.lei2}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="currentGroup.gameType == 2" prop="lei2" label="凤" min-width="50">
               <template slot-scope="scope">
                    <a style="color:blue;" >{{scope.row.lei2}}</a>
                </template>
            </el-table-column>

            <el-table-column  prop="lei3" label="和" min-width="50">
               <template slot-scope="scope">
                    <a style="color:green;" >{{scope.row.lei3}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="currentGroup.gameType == 0" prop="lei4" label="庄对" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei4}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="currentGroup.gameType == 2" prop="lei4" label="顺子" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei4}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="currentGroup.gameType == 3" prop="lei4" label="牛一" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei4}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="currentGroup.gameType == 3" prop="lei5" label="牛二" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei5}}</a>
                </template>
            </el-table-column>
             <el-table-column v-if="currentGroup.gameType == 3" prop="lei6" label="牛三" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei6}}</a>
                </template>
            </el-table-column>
             <el-table-column v-if="currentGroup.gameType == 3" prop="lei7" label="牛四" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei7}}</a>
                </template>
            </el-table-column>
             <el-table-column v-if="currentGroup.gameType == 3" prop="lei8" label="牛五" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei8}}</a>
                </template>
            </el-table-column>
             <el-table-column v-if="currentGroup.gameType == 3" prop="lei9" label="牛六" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei9}}</a>
                </template>
            </el-table-column>
             <el-table-column v-if="currentGroup.gameType == 3" prop="lei10" label="牛七" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei10}}</a>
                </template>
            </el-table-column>
             <el-table-column v-if="currentGroup.gameType == 3" prop="lei11" label="牛八" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei11}}</a>
                </template>
            </el-table-column>
             <el-table-column v-if="currentGroup.gameType == 3" prop="lei12" label="牛九" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei12}}</a>
                </template>
            </el-table-column>
             <el-table-column v-if="currentGroup.gameType == 3" prop="lei13" label="牛牛" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei13}}</a>
                </template>
            </el-table-column>
            <el-table-column v-if="currentGroup.gameType == 3" prop="lei14" label="双牛牛" min-width="50">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei14}}</a>
                </template>
            </el-table-column>
            <el-table-column v-if="currentGroup.gameType == 3" prop="lei15" label="银牛/金牛/炸弹/五小牛" min-width="150">
               <template slot-scope="scope">
                    <a style="color:red;" >{{scope.row.lei15}}</a>
                </template>
            </el-table-column>
            <el-table-column v-if="currentGroup.gameType == 0" prop="lei5" label="闲对" min-width="50">
               <template slot-scope="scope">
                    <a style="color:blue;" >{{scope.row.lei5}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="currentGroup.gameType == 2" prop="lei5" label="同花" min-width="50">
               <template slot-scope="scope">
                    <a style="color:blue;" >{{scope.row.lei5}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="currentGroup.gameType == 2" prop="lei6" label="豹子" min-width="50">
               <template slot-scope="scope">
                    <a style="color:blue;" >{{scope.row.lei6}}</a>
                </template>
            </el-table-column>
            <el-table-column v-if="currentGroup.gameType == 2" prop="lei7" label="同花顺" min-width="50">
               <template slot-scope="scope">
                    <a style="color:blue;" >{{scope.row.lei7}}</a>
                </template>
            </el-table-column>
             <el-table-column v-if="currentGroup.gameType == 2" prop="lei3" label="幸运一击" min-width="80">
               <template slot-scope="scope">
                    <a style="color:blue;" >{{scope.row.lei3}}</a>
                </template>
            </el-table-column>
            
            <el-table-column v-if="currentGroup.gameType == 0" prop="lei7" label="幸运六" min-width="50">
              <template slot-scope="scope">
                    <a style="color:#9B3AFF;" >{{scope.row.lei7}}</a>
                </template>
            </el-table-column>
        </el-table>
           </div>
          <div class="upludandiv">
            快捷补路单<br/>
                     <div id="buLudanZ" @click="buLudanRes(1,'buLudanZ')"  :class="[buLudanKaipaiArr.y == 1?'currentZ':'btnZ']" class="btn">庄</div>
                    <div id="buLudanX" @click="buLudanRes(2,'buLudanX')"  :class="[buLudanKaipaiArr.y == 2?'currentX':'btnX']"  class="btn">闲</div>
                    <div id="buLudanH" @click="buLudanRes(3,'buLudanH')"  :class="[buLudanKaipaiArr.y == 3?'currentH':'btnH']"  class="btn">和</div>
                    <div id="buLudanZd" @click="buLudanRes(4,'buLudanZd')"   :class="[buLudanKaipaiArr.zd == 1?'currentZ':'btnZ']"  class="btn ">庄对</div>
                    <div id="buLudanXd" @click="buLudanRes(5,'buLudanXd')" :class="[buLudanKaipaiArr.xd == 1?'currentX':'btnX']"  class="btn">闲对</div>
                    <div id="buLudanXy12"  @click="buLudanRes(12,'buLudanXy12')" :class="[buLudanKaipaiArr.xy == 12?'currentXy':'btnXy']" v-show="buLudanXyVisible" class="btn">
                      <div style="height:50%;margin-top:-10px;">幸运</div>
                      <div style="height:50%;">六12</div>
                    </div>
                    <div id="buLudanXy20" @click="buLudanRes(20,'buLudanXy20')" :class="[buLudanKaipaiArr.xy == 20?'currentXy':'btnXy']"  v-show="buLudanXyVisible" class="btn" >
                        <div style="height:50%;margin-top:-10px;">幸运</div>
                      <div style="height:50%;">六20</div>
                    </div>
                    <div style="position: absolute; top: 78px">
                    <button @click="buLudanKaipai()" style="width: 50px; text-align: center; height: 28px; cursor: pointer;">提交</button>
                    </div>
          </div>
           <div class="upfendiv">
             快捷上下余分<br/>
             会员ID:
             <input v-model="upfen.id" type="text" placeholder="会员ID" style="width: 60px; text-align: left; height: 24px; color: rgb(0, 153, 0); font-weight: bold;">
             金额:
             <input v-model="upfen.score" type="text" placeholder="金额 下分为负" style="width: 100px; text-align: left; height: 24px; color: rgb(0, 153, 0); font-weight: bold;"/>
              <button @click="doupfen" style="width: 50px; text-align: center; height: 28px; cursor: pointer;">提交</button>
           </div>

         </el-col>
      </el-row>
    </div>
       <!--修改靴局界面-->
    <el-dialog
      title="修改靴局"
      :visible.sync="updateXueJuVisible"
      :close-on-click-modal="false"
      width="1000px"
    >
    <el-form
        size="small"
        label-width="160px"
        labelWidth="160px"
        :rules="updateXueJuFormRules"
      >
       <el-form-item label="靴号" >
          <el-input id="updateXue" :value="paiControll.roomInfo.room_info.boots_number" placeholder="靴号"></el-input>
        </el-form-item>
        <!--<div style="font-size:14px;color:red;margin-left:130px">* 如需修改靴号，请务必先清空上一靴路单，否则路单会出错</div>-->
         <el-form-item label="局数" >
          <el-input id="updateJu" :value="paiControll.roomInfo.room_info.ju" placeholder="局数"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click.native="updateXueJuVisible = false">取消</el-button>
        <el-button type="primary" @click.native="updateXueJuSubmit" >提交</el-button>
      </div>
   </el-dialog>
   <!--系统设置界面-->
    <el-dialog
      title="系统设置"
      :visible.sync="settingSystemVisible"
      :close-on-click-modal="false"
      width="1000px"
    >
    <el-form
        size="small"
        :model="settingSystemForm"
        label-width="160px"
        labelWidth="160px"
        :rules="settingSystemFormRules"
        ref="settingSystemForm"
      >
       <el-form-item label="群名称" prop="team_title">
          <el-input v-model="settingSystemForm.team_title" placeholder="群名称"></el-input>
        </el-form-item>
         <el-form-item label="群公告" prop="notice">
          <el-input type="textarea" v-model="settingSystemForm.notice" placeholder="群公告"></el-input>
        </el-form-item>
        <el-form-item label="快捷消息" prop="fast_msg">
          <el-input type="textarea" v-model="settingSystemForm.fast_msg" placeholder="快捷消息"></el-input>
          <div style="color: red; font-weight: bold;" >小提示：每条消息之间请用+号隔开，如 祝各位老板一路大红+洗牌结束,天路开启</div>
        </el-form-item>
        <el-form-item label="群内聊天">
          <el-radio-group v-model="settingSystemForm.nosay">
              <el-radio label="1" >允许</el-radio>
              <el-radio label="0" >不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="新客户初始积分比例" prop="integral_rate">
          <el-input v-model="settingSystemForm.integral_rate" placeholder="0"></el-input>
        </el-form-item>
        <el-form-item label="多少流水/1积分" prop="score_rate">
          <el-input v-model="settingSystemForm.score_rate" placeholder="0"></el-input>
        </el-form-item>
        <el-form-item label="游客功能">
          <el-radio-group v-model="settingSystemForm.touristfunc">
              <el-radio label="0" >开启</el-radio>
              <el-radio label="1" >关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="控制台线路切换"  v-show="changeWsShow">
          <el-radio-group v-model="wsDataId" >
              <el-radio   v-for="(wsDataItem,index) in settingSystemForm.wsData.wsDataArr"  :key="index" :label="wsDataItem.id" >{{wsDataItem.note}}</el-radio>
          </el-radio-group>
          <div style="color: red; font-weight: bold;" >小提示：线路修改后，控制台需要退出重新登录，否则将不生效</div>
        </el-form-item>
       <el-form-item label="每日积分统计模式">
          <el-radio-group v-model="settingSystemForm.integral_tongji_way">
              <el-radio label="0" >按自然日</el-radio>
              <el-radio label="1" >按开工时间</el-radio>
          </el-radio-group>
         <div style="color: red; font-weight: bold;" >小提示：按自然日统计，是指按正常24小时统计，过了凌晨12点后，打的流水就会算作新一天的积分。</div>
        <div style="color: red; font-weight: bold;" >        按开工时间统计，是指点击开工按钮后，流水就会一直算作开工当天的积分。</div>
        <div style="color: red; font-weight: bold;" >        选择按开工时间统计提交后，刷新一下页面，控制台会出现开工时间按钮。</div>


        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click.native="settingSystemVisible = false">取消</el-button>
        <el-button type="primary" @click.native="settingSystemSubmit" >提交</el-button>
      </div>
   </el-dialog>
    <!--房间设置界面-->
    <el-dialog
      :title="currentGroup.group.groupname+'桌设置'"
      :visible.sync="settingVisible"
      :close-on-click-modal="false"
      width="1000px"
    >

    <el-tabs class="tbcls" @tab-click="tabcheck" type="border-card">
      <el-tab-pane label="限红设置">
        <el-form
        size="mini"
        :model="settingForm"
        label-width="260px"
        labelWidth="260px"
        :rules="settingFormRules"
        ref="settingForm"
      >
        <el-form-item v-if="currentGroup.gameType == 0" label="庄闲个人单次最小限红" prop="odds_zx_min">
          <el-input v-model="settingForm.odds_zx_min" placeholder="庄闲个人单次最小限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 0" label="庄闲个人当局累计最大限红" prop="odds_zx_max">
          <el-input v-model="settingForm.odds_zx_max" placeholder="庄闲个人当局累计最大限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 1" label="龙虎个人单次最小限红" prop="odds_zx_min">
          <el-input v-model="settingForm.odds_zx_min" placeholder="龙虎个人单次最小限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 1" label="龙虎个人当局累计最大限红" prop="odds_zx_max">
          <el-input v-model="settingForm.odds_zx_max" placeholder="龙虎个人当局累计最大限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 2" label="龙凤个人单次最小限红" prop="odds_zx_min">
          <el-input v-model="settingForm.odds_zx_min" placeholder="龙凤个人单次最小限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 2" label="龙凤个人当局累计最大限红" prop="odds_zx_max">
          <el-input v-model="settingForm.odds_zx_max" placeholder="龙凤个人当局累计最大限红"></el-input>
        </el-form-item>

        <el-form-item v-if="currentGroup.gameType == 3" label="红牛黑牛个人单次最小限红" prop="odds_zx_min">
          <el-input v-model="settingForm.odds_zx_min" placeholder="红牛黑牛个人单次最小限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 3" label="红牛黑牛个人当局累计最大限红" prop="odds_zx_max">
          <el-input v-model="settingForm.odds_zx_max" placeholder="红牛黑牛个人当局累计最大限红"></el-input>
        </el-form-item>
        <el-form-item label="尾数吃码" prop="mantissa">
          <el-input v-model="settingForm.mantissa" placeholder="尾数吃码"></el-input>
        </el-form-item>
        <el-form-item label="单边总额限红" prop="single">
          <el-input v-model="settingForm.single" placeholder="单边总额限红"></el-input>
        </el-form-item>
        
        <el-form-item v-if="currentGroup.gameType == 0" label="三宝累计总额限红" prop="odds_sb_all">
          <el-input v-model="settingForm.odds_sb_all" placeholder="三宝累计总额限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 1" label="龙虎累计总额限红" prop="odds_sb_all">
          <el-input v-model="settingForm.odds_sb_all" placeholder="龙虎累计总额限红"></el-input>
        </el-form-item>
         <!-- <el-form-item v-if="currentGroup.gameType == 2" label="五宝累计总额限红" prop="odds_sb_all">
          <el-input v-model="settingForm.odds_sb_all" placeholder="五宝累计总额限红"></el-input>
        </el-form-item> -->
        <div v-if="currentGroup.gameType == 2">
        <el-form-item  label="顺子个人累计最大限红" prop="odds_zd_max">
          <el-input v-model="settingForm.odds_zd_max" placeholder="顺子个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item label="顺子个人单次最小下注" prop="odds_zd_min">
          <el-input v-model="settingForm.odds_zd_min" placeholder="顺子个人单次最小下注"></el-input>
        </el-form-item>

        <el-form-item label="同花个人累计最大限红" prop="odds_xd_max">
          <el-input v-model="settingForm.odds_xd_max" placeholder="同花个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item label="同花个人单次最小下注" prop="odds_xd_min">
          <el-input v-model="settingForm.odds_xd_min" placeholder="同花个人单次最小下注"></el-input>
        </el-form-item>

        <el-form-item label="豹子个人累计最大限红" prop="odds_superhe_max">
          <el-input v-model="settingForm.odds_superhe_max" placeholder="豹子个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item label="豹子个人单次最小下注" prop="odds_superhe_min">
          <el-input v-model="settingForm.odds_superhe_min" placeholder="豹子个人单次最小下注"></el-input>
        </el-form-item>
        </div>
        <div v-if="currentGroup.gameType == 3">
        <el-form-item  label="牛一~牛九,牛牛个人累计最大限红" prop="odds_zd_max">
          <el-input v-model="settingForm.odds_zd_max" placeholder="牛一~牛九,牛牛个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item label="牛一~牛九,牛牛个人单次最小下注" prop="odds_zd_min">
          <el-input v-model="settingForm.odds_zd_min" placeholder="牛一~牛九,牛牛个人单次最小下注"></el-input>
        </el-form-item>

        <el-form-item label="双牛牛个人累计最大限红" prop="odds_xd_max">
          <el-input v-model="settingForm.odds_xd_max" placeholder="双牛牛个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item label="双牛牛个人单次最小下注" prop="odds_xd_min">
          <el-input v-model="settingForm.odds_xd_min" placeholder="双牛牛个人单次最小下注"></el-input>
        </el-form-item>

        <el-form-item label="银牛金牛炸弹五小牛个人累计最大限红" prop="odds_superhe_max">
          <el-input v-model="settingForm.odds_superhe_max" placeholder="银牛金牛炸弹五小牛个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item label="银牛金牛炸弹五小牛个人单次最小下注" prop="odds_superhe_min">
          <el-input v-model="settingForm.odds_superhe_min" placeholder="银牛金牛炸弹五小牛个人单次最小下注"></el-input>
        </el-form-item>
        </div>


        <el-form-item v-if="currentGroup.gameType == 0" label="三宝个人累计最大限红" prop="odds_sb_max">
          <el-input v-model="settingForm.odds_sb_max" placeholder="三宝个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 0" label="三宝个人单次最小下注" prop="odds_sb_min">
          <el-input v-model="settingForm.odds_sb_min" placeholder="三宝个人单次最小下注"></el-input>
        </el-form-item>

        <el-form-item v-if="currentGroup.gameType == 2" label="幸运一击个人累计最大限红" prop="odds_sb_max">
          <el-input v-model="settingForm.odds_sb_max" placeholder="幸运一击个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 2" label="幸运一击个人单次最小下注" prop="odds_sb_min">
          <el-input v-model="settingForm.odds_sb_min" placeholder="幸运一击个人单次最小下注"></el-input>
        </el-form-item>

        <el-form-item v-if="currentGroup.gameType == 0" label="幸运六个人累计最大限红" prop="odds_lucky_max">
          <el-input v-model="settingForm.odds_lucky_max" placeholder="幸运六个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 0" label="幸运六个人单次最小下注" prop="odds_lucky_min">
          <el-input v-model="settingForm.odds_lucky_min" placeholder="幸运六个人单次最小下注"></el-input>
        </el-form-item>

        <el-form-item v-if="currentGroup.gameType == 2" label="同花顺个人累计最大限红" prop="odds_lucky_max">
          <el-input v-model="settingForm.odds_lucky_max" placeholder="同花顺个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 2" label="同花顺个人单次最小下注" prop="odds_lucky_min">
          <el-input v-model="settingForm.odds_lucky_min" placeholder="同花顺个人单次最小下注"></el-input>
        </el-form-item>

         <el-form-item v-if="currentGroup.gameType == 3" label="下注和个人累计最大限红" prop="odds_lucky_max">
          <el-input v-model="settingForm.odds_lucky_max" placeholder="下注和个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 3" label="下注和个人单次最小下注" prop="odds_lucky_min">
          <el-input v-model="settingForm.odds_lucky_min" placeholder="下注和个人单次最小下注"></el-input>
        </el-form-item>

         <el-form-item v-if="currentGroup.gameType == 3" label="红黑牛翻倍个人累计最大限红" prop="odds_fanbei_max">
          <el-input v-model="settingForm.odds_fanbei_max" placeholder="红黑牛翻倍个人累计最大限红"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 3" label="红黑牛翻倍个人单次最小下注" prop="odds_fanbei_min">
          <el-input v-model="settingForm.odds_fanbei_min" placeholder="红黑牛翻倍个人单次最小下注"></el-input>
        </el-form-item>

      </el-form>
      </el-tab-pane>


      <el-tab-pane label="赔率设置">
        <el-form
        size="mini"
        :model="settingForm"
        label-width="260px"
        labelWidth="260px"
        :rules="settingFormRules"
        ref="settingForm"
      >
        <el-form-item v-if="currentGroup.gameType == 0" label="庄" prop="zhuang">
          <el-input v-model="settingForm.zhuang" placeholder="庄"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 0" label="闲" prop="xian">
          <el-input v-model="settingForm.xian" placeholder="闲"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 0" label="和" prop="he">
          <el-input v-model="settingForm.he" placeholder="和"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 0" label="庄对" prop="zhuang_dui">
          <el-input v-model="settingForm.zhuang_dui" placeholder="庄对"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 0" label="闲对" prop="xian_dui">
          <el-input v-model="settingForm.xian_dui" placeholder="闲对"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 0" label="幸运六12倍" prop="lucky_six_12">
          <el-input v-model="settingForm.lucky_six_12" placeholder="幸运六12倍"></el-input>
        </el-form-item>
        <el-form-item v-if="currentGroup.gameType == 0" label="幸运六20倍" prop="lucky_six_20">
          <el-input v-model="settingForm.lucky_six_20" placeholder="幸运六20倍"></el-input>
        </el-form-item>

         <el-form-item v-if="currentGroup.gameType == 1" label="龙" prop="zhuang">
          <el-input v-model="settingForm.zhuang" placeholder="龙"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 1" label="虎" prop="xian">
          <el-input v-model="settingForm.xian" placeholder="虎"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 1" label="和" prop="he">
          <el-input v-model="settingForm.he" placeholder="和"></el-input>
        </el-form-item>

         <el-form-item v-if="currentGroup.gameType == 2" label="龙" prop="zhuang">
          <el-input v-model="settingForm.zhuang" placeholder="zhuang"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 2" label="凤" prop="xian">
          <el-input v-model="settingForm.xian" placeholder="凤"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 2" label="顺子" prop="zhuang_dui">
          <el-input v-model="settingForm.zhuang_dui" placeholder="顺子"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 2" label="同花" prop="xian_dui">
          <el-input v-model="settingForm.xian_dui" placeholder="同花"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 2" label="豹子" prop="super_he">
          <el-input v-model="settingForm.super_he" placeholder="豹子"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 2" label="同花顺" prop="lucky_six">
          <el-input v-model="settingForm.lucky_six" placeholder="同花顺"></el-input>
        </el-form-item>

         <el-form-item v-if="currentGroup.gameType == 3" label="红牛" prop="zhuang">
          <el-input v-model="settingForm.zhuang" placeholder="红牛"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 3" label="黑牛" prop="xian">
          <el-input v-model="settingForm.xian" placeholder="黑牛"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 3" label="和" prop="he">
          <el-input v-model="settingForm.he" placeholder="和"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 3" label="牛1-9,牛牛" prop="zhuang_dui">
          <el-input v-model="settingForm.zhuang_dui" placeholder="牛1-9,牛牛"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 3" label="双牛牛" prop="xian_dui">
          <el-input v-model="settingForm.xian_dui" placeholder="双牛牛"></el-input>
        </el-form-item>
         <el-form-item v-if="currentGroup.gameType == 3" label="银牛/金牛/炸弹/五小牛" prop="super_he">
          <el-input v-model="settingForm.super_he" placeholder="银牛/金牛/炸弹/五小牛"></el-input>
        </el-form-item>
        
      </el-form>
      </el-tab-pane>

      <el-tab-pane label="机器人设置">
        <el-form
        size="mini"
        :model="settingForm"
        label-width="200px"
        labelWidth="200px"
        :rules="setting1FormRules"
        ref="setting1Form"
      >
        <el-form-item label="开启关闭">
          <el-select v-model="settingForm.ai_state" placeholder="请选择">
                        <el-option label="开启" value="0"></el-option>
                        <el-option label="关闭" value="1"></el-option>
                    </el-select>
         
        </el-form-item>
        <el-form-item label="随机秒数" prop="ai_time">
          <el-input v-model="settingForm.ai_time" placeholder="随机秒数"></el-input>
        </el-form-item>
        <el-form-item label="最大虚拟下注人数" prop="ai_num">
          <el-input v-model="settingForm.ai_num" placeholder="最大虚拟下注人数"></el-input>
        </el-form-item>
        <el-form-item label="上分字符" prop="ai_upfen">
          <el-input v-model="settingForm.ai_upfen" placeholder="上分字符"></el-input>
          <div style="color: red; font-weight: bold;">小提示：每个字符之间请用+号隔开，如 2000+3000</div>
        </el-form-item>
        <el-form-item label="下注字符" prop="ai_text">
          <el-input type="textarea" v-model="settingForm.ai_text" placeholder="下注字符"></el-input>
          <div style="color: red; font-weight: bold;">小提示：每个字符之间请用+号隔开，如 庄100+闲100</div>
        </el-form-item>
      </el-form>
      </el-tab-pane>
      <el-tab-pane label="其他设置">
        <el-form
        size="mini"
        :model="settingForm"
        label-width="200px"
        labelWidth="200px"
        :rules="setting2FormRules"
        ref="setting2Form"
      >
      <el-form-item label="房间名称" prop="groupname">
          <el-input v-model="settingForm.groupname" placeholder="房间名称"></el-input>
        </el-form-item> 
         <el-form-item label="台号" prop="mark">
          <el-input v-model="settingForm.mark" placeholder="台号"></el-input>
        </el-form-item> 
        <el-form-item label="管理员头像">
          <input style="display:none;"  type="file" name="filenamegl" id="uploadfileAddgl">  
          <div style="width:100px;" @click="triggerUploadAddgl()" v-html="readerNameBianJi()">
          </div> 
        </el-form-item>

         <el-form-item label="管理员名称" prop="adminname">
          <el-input v-model="settingForm.adminname" placeholder="管理员名称"></el-input>
        </el-form-item> 
        <el-form-item label="直播地址" prop="video_link">
          <el-input v-model="settingForm.video_link" placeholder="直播地址"></el-input>
        </el-form-item>
        <el-form-item label="倒计时秒数" prop="counttime">
          <el-input v-model="settingForm.counttime" placeholder="倒计时秒数"></el-input>
        </el-form-item>
      </el-form>
      </el-tab-pane>
    </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="settingVisible = false">取消</el-button>
        <el-button type="primary" @click.native="settingSubmit" >提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import { imClient } from "@/client/im_client";
import XGrid from "@/components/xgrid";
import WinScroll from "@/components/winscroll";
import {cancelGame, getFastText,updateTeamConfig,getTeamConfig,getRoomLists, roomConfig, roomConfigUpdateKeep1,upDowFen,deletechatmsg ,getUserInfo,setStartWorkTime} from "../../api/api";
import moment, { duration } from "moment";
import $ from "jquery";
import { NodePlayer } from "../../../static/js/NodePlayer.v3.min";
import Uediter from "@/components/ue.vue";
export default {
  data() {
    return {
      start_work:'开  工', //0已开工  默认 开  工
      start_work_time:'',
      start_work_status: 1,
      integral_tongji_way:0,
      daojishimsgHis:0,
      daojishimsg:0,
      wsDataId :0, //ws线路ID
      changeWsShow :0,//切换线路显示 0不显示 1显示
      openCardsType :0,//开牌方式：1选择牌型 2 直接结果开奖 
      videoUrl:'http://27.124.44.146:8666/kkw.html?link=',
      fastTextConVisible:false,//快捷消息窗口是否显示
      fastTextConData :[],
      kaipaiArr:{
         "cmd":3003, // 固定值
        "set":7,
        "boots_number":0, // 靴号
        "ju":0,  // 局数
        "groupid":0, // 桌子/房间号
        "room_id":0, 
        'y':0,
        'zd':0,
        'xd':0,
        'xy':0,
        "lq":0,
        "fb":0,
        "super_he":0
      },
      resultArr:{
        'resultZ1':{'current':'currentZ','btnname':'btnZ','name':'y','number':1},
        'resultX2':{'current':'currentX','btnname':'btnX','name':'y','number':2},
        'resultH3':{'current':'currentH','btnname':'btnH','name':'y','number':3},
        'resultZd4':{'current':'currentZ','btnname':'btnZ','name':'zd','number':1},
        'resultXd5':{'current':'currentX','btnname':'btnX','name':'xd','number':1},
        'resultXy1212':{'current':'currentXy','btnname':'btnXy','name':'xy','number':12},
        'resultXy2020':{'current':'currentXy','btnname':'btnXy','name':'xy','number':20},
      },
      idname:'',
      resultNumber:0,
      resultXyVisible:false,
      updateXueJuVisible:false,
      daojishi_second :0, //倒计时变化秒数
      daojishi_counttime :0,//倒计时总秒杀数
      daojishiIntval:false,
      gameControllerLock:false,
      buLudanLock:false,
      kaipailoading :false,
      buLudanKaipaiArr:{
         "cmd":4210, // 固定值
        "set":7,
        "groupid":0, // 桌子/房间号
        "room_id":0, 
        'y':0,
        'zd':0,
        'xd':0,
        'xy':0,
        "lq":0,
        "fb":0,
        "super_he":0
      },
      buLudanArr:{
        'buLudanZ1':{'current':'currentZ','btnname':'btnZ','name':'y','number':1},
        'buLudanX2':{'current':'currentX','btnname':'btnX','name':'y','number':2},
        'buLudanH3':{'current':'currentH','btnname':'btnH','name':'y','number':3},
        'buLudanZd4':{'current':'currentZ','btnname':'btnZ','name':'zd','number':1},
        'buLudanXd5':{'current':'currentX','btnname':'btnX','name':'xd','number':1},
        'buLudanXy1212':{'current':'currentXy','btnname':'btnXy','name':'xy','number':12},
        'buLudanXy2020':{'current':'currentXy','btnname':'btnXy','name':'xy','number':20},
      },
      buLudanIdname:'',
      buLudanResultNumber:0,
      buLudanXyVisible:false,
      agent_type:util.getSessionItem('user','agent_type'),
      logourl:util.getSessionItem('user','logourl'),
      videopower:{},
      upfen:{
        id:"",
        score:"",
      },
      checkpai:false,
      userOnlines: [],
      xueWin:[],
      loadChatText: "",  
      settingSystemForm: {
        team_title:"",
        notice:"",
        fast_msg: "",
        integral_rate: 0,
        score_rate: 0,
        nosay:"1",
        wsDataId: 0,
        wsData:[],
        touristfunc:"0",
        integral_tongji_way :"0"
      },
      settingForm: {
        id: 0,
        num: 0,
        odds_zx_min: 0,
        odds_zx_max: 0,
        odds_zd_min: 0,
        odds_zd_max: 0,
        odds_xd_min: 0,
        odds_xd_max: 0,
        odds_superhe_min: 0,
        odds_superhe_max: 0,
        capital: 0,
        mantissa: 0,
        single: 0,
        odds_sb_all: 0,
        ai_state: "0",
        ai_time: "",
        ai_num: 0,
        ai_text: "",
        zhuang: "0",
        xian: "0",
        zhuang_dui: "0",
        xian_dui: "0",
        he: "0",
        ai_auto_fen: 0,
        fast_msg: "",
        ai_upfen: "",
        odds_sb_min: 0,
        counttime: 3,
        odds_sb_max: 0,
        integral_rate: 0,
        odds_lucky_min: 0,
        odds_lucky_max: 0,
        video_link: "",
        counttime:0,
        ps_name: "",
        mark: "",
        groupname: "",
        userhead: "",
        adminname: "",
        xstate: 0,
        admin_uid: "0",
        groupid: 0,
        createtime: null,
        game_type: 0,
        type: 0,
        game_rule: "",
        state: 0,
        odds_fanbei_min:"",
        odds_fanbei_max:"",
      },
      updateXueJuFormRules: {
        updateXue: [
          { required: true, message: "请输入靴号", trigger: "blur" }
        ],
        updateJu: [
          { required: true, message: "请输入局数", trigger: "blur" }
        ],
      },
      settingFormRules: {
        odds_zx_min: [
          {
            required: true,
            message: "请输入个人单次最小限红",
            trigger: "blur"
          }
        ],
        odds_zx_max: [
          {
            required: true,
            message: "个人当局累计最大限红",
            trigger: "blur"
          }
        ],
         adminname: [
          { required: true, message: "请输入管理员名称", trigger: "blur" }
        ],
         odds_zd_min: [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
         odds_zd_max: [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
         odds_xd_min: [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
         odds_xd_max: [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
         odds_superhe_min: [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
         odds_superhe_max: [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        odds_fanbei_min: [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        odds_fanbei_max: [
          { required: true, message: "请输入值", trigger: "blur" }
        ],     
        capital: [
          { required: true, message: "请输入台面本金", trigger: "blur" }
        ],
        mantissa: [
          { required: true, message: "请输入尾数吃码", trigger: "blur" }
        ],
        single: [
          { required: true, message: "请输入单边总额限红", trigger: "blur" }
        ],
        odds_sb_all: [
          { required: true, message: "请输入三宝累计总额限红", trigger: "blur" }
        ],
         zhuang: [
          { required: true, message: "请输入赔率", trigger: "blur" }
        ],
         xian: [
          { required: true, message: "请输入赔率", trigger: "blur" }
        ],
         he: [
          { required: true, message: "请输入赔率", trigger: "blur" }
        ],
         zhuang_dui: [
          { required: true, message: "请输入赔率", trigger: "blur" }
        ],
         xian_dui: [
          { required: true, message: "请输入赔率", trigger: "blur" }
        ],
         super_he: [
          { required: true, message: "请输入赔率", trigger: "blur" }
        ],
         lucky_six_12: [
          { required: true, message: "请输入赔率", trigger: "blur" }
        ],
        lucky_six_20: [
          { required: true, message: "请输入赔率", trigger: "blur" }
        ],
        
        odds_sb_max: [
          {
            required: true,
            message: "请输入三宝个人累计最大限红",
            trigger: "blur"
          }
        ],
        odds_sb_min: [
          {
            required: true,
            message: "请输入三宝个人单次最小下注",
            trigger: "blur"
          }
        ],
        odds_lucky_max: [
          {
            required: true,
            message: "请输入幸运六个人累计最大限红",
            trigger: "blur"
          }
        ],
        odds_lucky_min: [
          {
            required: true,
            message: "请输入幸运六个人单次最小下注",
            trigger: "blur"
          }
        ],
      },
      setting1FormRules: {
        ai_time: [
          { required: true, message: "请输入随机秒数", trigger: "blur" }
        ],
        ai_num: [
          { required: true, message: "请输入最大虚拟下注人数", trigger: "blur" }
        ],
        ai_upfen: [
          { required: true, message: "请输入上分字符", trigger: "blur" }
        ],
        ai_text: [
          { required: true, message: "请输入下注字符", trigger: "blur" }
        ],

      },
      setting2FormRules: {
         adminname: [
          { required: true, message: "请输入管理员名称", trigger: "blur" }
        ],
        mark: [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
         groupname: [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        video_link1: [
          { required: true, message: "请输入直播地址", trigger: "blur" }
        ],
      },
      settingSystemFormRules: {
        team_title: [
          { required: true, message: "请输入群名称", trigger: "blur" }
        ],   
        nosay: [
          { required: true,trigger: "blur" }
        ],  
        touristfunc: [
          { required: true,trigger: "blur" }
        ], 
        integral_tongji_way: [
          { required: true,trigger: "blur" }
        ], 
        integral_rate: [
          {required: true, trigger: "blur" }
        ],  
        score_rate: [
          { required: true,trigger: "blur" }
        ],  
      },
      currentGroup: {
        gameType: 0,
        groupid: "",
        toTime: "",
        group: {
          userhead:"",
          adminname:"",
          ai_auto_fen: 0,
          groupid: 0,
          xstate: 1,
          game_type: 0,
          groupname: "",
          video_link:"",
          ps_name:"",
          ai_num: 20,
          headimgurl:"",
          id: 1,
          state: 0,
          ai_upfen: "",
          ai_state: 0,
          mark: "",
          ai_time: ""
        }
      },
      dj: {
        z: "...",
        z_zc:"...",
        x: "...",
        x_zc:"...",
        h: "...",
        h_zc:"...",
        ws: "...",
        tm: "...",
        zd: "...",
        zd_zc:"...",
        xd: "...",
        xd_zc:"...",
        xy: "...",
        xy_zc:"...",
        He: "...",
        HeiNiu: "...",
        HongNiu: "...",
        Niu1: "...",
        Niu2: "...",
        Niu3: "...",
        Niu4: "...",
        Niu5: "...",
        Niu6: "...",
        Niu7: "...",
        Niu8: "...",
        Niu9: "...",
        NiuNiu: "...",
        ShuangNiu: "...",
        SuperNius: "...",
        bei5: "...",
        bei100: "...",
        bei120: "...",
        dc: "...",
        mantissa: "...",
        HongNFB:"...",
        HeiNFB:"...",
      },
      zy: {
        tmzs: "...",//推码总数
        tmbj: "...",
        tmcm: "...",
        wsyk: "...",
        sbyk: "...",
        dcyk: "...",
        dlzy: "...",
        zxxm: "...",
        sbxm: "...",
        khyk: "...",
        luckysix_yk:"...",
        gbyk:"...",
        dzxxm:"...",
        zx_zc_yk: "...",
        sb_zc_yk: "...",
      },
      player: "",
      rooms: [],
      roomsDjs: [],//房间倒计时信息
      currentRoom: 0,
      ludan: {
        data: {},
        yc: [
          { dyz: "", xl: "", yyl: "" },
          { dyz: "", xl: "", yyl: "" }
        ],
        option1: {
          id: "zhuzilu",
          wh: [14, 6],
          data: []
        },
        option2: {
          id: "dalu",
          wh: [40, 6],
          data: []
        },
        option3: {
          id: "dyz",
          wh: [20, 3],
          data: []
        },
        option4: {
          id: "xl",
          wh: [20, 3],
          data: []
        },
        option5: {
          id: "jy",
          wh: [20, 3],
          data: []
        },
        option6: {
          id: "sx",
          wh: [20, 3],
          data: []
        }
      },
      desktops:{},
      paiControll:{
        roomInfo:{
          "uid":0,
          "createtime":0,
          "groupid":0,
          "room_info":{"odds_last_time":0,"room_id":0,"boots_number":0,"admin_id":0,"card_game_id":0,"ju":0,"counttime":0,"room_status":0},
          "cmd":3087,
          "msg_id":0,
          "group":{"video_link":"","admin_id":0,"groupid":0,"headimgurl":"","xstate":0,"admin_headimg":"","admin_name":"","game_type":0,"state":0,"groupname":"","mark":""}
        },
        paidian:{
          p1:"",
          p2:"",
          p3:"",
          p4:"",
          p5:"",
          p6:"",
          p7:"",
          p8:"",
          p9:"",
          p10:"",
        },
        paimian:{
          p1:"",
          p2:"",
          p3:"",
          p4:"",
          p5:"",
          p6:"",
          p7:"",
          p8:"",
          p9:"",
          p10:"",
        },
      },
      hasGroupinit: false,
      chatpage: 0,
      chatMsg: [],
      cacheSendMsg: [],
      settingVisible: false,
      settingSystemVisible: false,
      ueditor: {
        value: "",
        config: {}
      },
      message: "",
      settingIndex:0,
      isFirstGetHis:true,
      currentPai:"",
      handleFenLock:false,
    };
  },
  computed:{
    long_d(){
      var dian = "";
       if(this.paiControll.paidian.p1 != 0){
        dian = this.paiControll.paidian.p1 % 13 == 0 ? 13 : this.paiControll.paidian.p1 % 13;
        }else{
           dian = 0;
        }
        return dian;
    },
    hu_d(){
      var dian = "";
      if(this.paiControll.paidian.p2 != 0){
          dian = this.paiControll.paidian.p2 % 13 == 0 ? 13 : this.paiControll.paidian.p2 % 13;
      }else{
          dian = 0;
      }
      return dian;
    },
    xj_d(){
      var p1 = this.paiControll.paidian.p1 || 0;
      var p2 = this.paiControll.paidian.p2 || 0; 
      var p5 = this.paiControll.paidian.p5 || 0;

      var xp1 = p1 % 13 > 9 ? 0 : (p1 ? p1 % 13 : 0);
      var xp2 = p2 % 13 > 9 ? 0 : (p2 ? p2 % 13 : 0);
      var xp5 = p5 % 13 > 9 ? 0 : (p5 ? p5 % 13 : 0);

    return (xp1 + xp2 + xp5) % 10;
    },
    zj_d(){
      var p3 = this.paiControll.paidian.p3 || 0;
      var p4 = this.paiControll.paidian.p4 || 0;
      var p6 = this.paiControll.paidian.p6 || 0;

      var xp3 = p3 % 13 > 9 ? 0 : (p3 ? p3 % 13 : 0);
      var xp4 = p4 % 13 > 9 ? 0 : (p4 ? p4 % 13 : 0);
      var xp6 = p6 % 13 > 9 ? 0 : (p6 ? p6 % 13 : 0);

      return (xp3 + xp4 + xp6) % 10;
    }
  },
  methods: {
    //设置开工时间
    setStartWorkTimeFunc(){
      this.$confirm('确认开工吗?', '提示', {
              type: 'info'
          }).then(() => {
            setStartWorkTime({ tid: this.currentGroup.group.tid}).then(res => {
                if (res.code == 200) {
                    this.start_work = '已开工';
                    this.start_work_time = res.start_work_time;
                    this.start_work_status = res.start_work_status;   
                    this.$message({
                          showClose: false,
                          message: "设置开工时间，操作成功",
                          type: 'success',
                          duration: 3000,                                       
                      })
                }
            })
          })
    },
    get_integral_tongji_way(){
    //积分统计方式：0按自然日1按开工时间
      getTeamConfig({ tid: this.currentGroup.group.tid}).then(res => {
          if (res.code == 200) {//'http://27.124.44.146:8666/kkwvideo.html?link=',
              this.integral_tongji_way = res.data.integral_tongji_way;
              this.videoUrl = 'http://'+res.data.remote_ip+':8666/kkw.html?link=';
              if(res.data.start_work_status == 0) {
                this.start_work = '已开工';
                this.start_work_time = res.data.start_work_time;
                this.start_work_status = res.data.start_work_status;
              }
          }
      })
    },
    switchvideopower(item){
      var op = '开启';
      if(item == 1){
        op = '关闭';
      }
      this.$confirm('确认'+op+'视频吗?', '提示', {
          type: 'info'
      }).then(() => {
        if(item == 0){
            this.videopower[this.currentGroup.groupid] = 0;
          }else{
            this.videopower[this.currentGroup.groupid] = 1;
          }
          this.$forceUpdate();
          //发ws
          this.$store.getters.imClient.send(JSON.stringify({
              "cmd": 4503,
              groupid:this.currentGroup.groupid,
              video_power:item,
          }))
      })
    },
    alertError(chat){
      this.$alert("该消息由于您网络原因，发送失败", '提示', {
        confirmButtonText: '确定',
        callback: action => {

        }
      })
    },
    deletemsg(chat){
       this.$confirm('确认删除消息吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    deletechatmsg({
                        game_type:this.currentGroup.group.game_type,
                        msg_id:chat.msg_id || chat.id,
                      }).then((res) => {
                        if(res.code == 200){
                              this.$store.getters.imClient.send(JSON.stringify({
                                  "cmd": 4502,
                                  game_type:this.currentGroup.group.game_type,
                                  msg_id:chat.msg_id || chat.id,
                              }))
                              this.$message({
                                  message: res.msg,
                                  type: 'success'
                              });
                          var index = this.chatMsg.findIndex(item => {
                            var id = "";
                            if(item.msg_id){
                              id = item.msg_id;
                            }else{
                              id = item.id;
                            }
                            return id == (chat.msg_id || chat.id);
                          });
                          this.chatMsg.splice(index,1);
                          }else{
                              this.$message({
                                  message: res.msg,
                                  type: 'info'
                              });
                          }
                      })
                })
    },

      triggerUploadAddgl(){
                $("#uploadfileAddgl").trigger("click");
      },
      uploadfileAddgl(){
          var that = this;
          $.ajaxFileUpload({
              url: 'v1/user/UploadChatImage?filename=filenamegl',
              type: 'get',
              secureuri: false, //一般设置为fals,
              fileElementId: 'uploadfileAddgl', // 上传文件的id、name属性名
              dataType: "json", //返回值类型，一般设置为json、application/json
              success: function (rs) {
                  if (rs.code == 200) {
                      that.settingForm.userhead = rs.data.head;
                      that.$forceUpdate();
                      that.$message({
                          showClose: false,
                          message: "图片上传成功。",
                          type: 'success'
                      })
                  } else {
                      that.$message({
                          showClose: false,
                          message: "图片上传失败。",
                          type: 'error'
                      })
                  }
              },
              error: function () {
                  that.$message({
                      showClose: false,
                      message: "上传失败。",
                      type: 'error'
                  })
              }
          });
      },

      //控制台发送图片
      triggerUploadController(){
        $("#uploadfileController").trigger("click");
      },
      uploadfileControllerFunc(){
          var that = this;
          $.ajaxFileUpload({
              url: 'v1/user/UploadChatImage?filename=filenameController',
              type: 'get',
              secureuri: false, //一般设置为false,
              fileElementId: 'uploadfileController', // 上传文件的id、name属性名
              dataType: "json", //返回值类型，一般设置为json、application/json
              success: function (res) {       
                  if (res.code == 200) {
                    var imgstr = "<img src='"+res.data.head+"' />";
                      that.$refs.ue.insertHtml(imgstr);
                      that.$forceUpdate();
                      that.$message({
                          showClose: false,
                          message: "图片上传成功。",
                          type: 'success'
                      })
                  } else {
                      that.$message({
                          showClose: false,
                          message: "图片上传失败。",
                          type: 'error'
                      })
                  }
              },
              error: function () {
                  that.$message({
                      showClose: false,
                      message: "上传失败。",
                      type: 'error'
                  })
              }
          });
      },
    readerTZbiao(res){
        var text = "/";
        if(res.HeiNiu != 0){
          text +="黑牛"+res.HeiNiu+"/";
        }
        if(res.HongNiu != 0){
          text +="红牛"+res.HongNiu+"/";
        }
        if(res.He != 0){
          text +="和"+res.He+"/";
        }

        if(res.Niu1 != 0){
          text +="牛一"+res.Niu1+"/";
        }
        if(res.Niu2 != 0){
          text +="牛二"+res.Niu2+"/";
        }
        if(res.Niu3 != 0){
          text +="牛三"+res.Niu3+"/";
        }
        if(res.Niu4 != 0){
          text +="牛四"+res.Niu4+"/";
        }
        if(res.Niu5 != 0){
          text +="牛五"+res.Niu5+"/";
        }
        if(res.Niu6 != 0){
          text +="牛六"+res.Niu6+"/";
        }
        if(res.Niu7 != 0){
          text +="牛七"+res.Niu7+"/";
        }
        if(res.Niu8 != 0){
          text +="牛八"+res.Niu8+"/";
        }
        if(res.Niu9 != 0){
          text +="牛九"+res.Niu9+"/";
        }
        if(res.NiuNiu != 0){
          text +="牛牛"+res.NiuNiu+"/";
        }
        if(res.ShuangNiu != 0){
          text +="双牛牛"+res.ShuangNiu+"/";
        }
        if(res.HongNFB != 0){
          text +="红牛翻倍"+res.HongNFB+"/";
        }
        if(res.HeiNFB != 0){
          text +="黑牛翻倍"+res.HeiNFB+"/";
        }
         if(res.SuperNius != 0){
          text +="银牛金牛炸弹五小牛"+res.SuperNius+"/";
        }

        text = text.substr(1);
        text = text.substring(0,text.length-1)
        return text;
      },
    doupfen(){
      if(this.handleFenLock){
          this.$message({
                  message: "网络异常，请刷新页面重试",
                  type: 'error'
              });
              return;
      }
      if(!this.upfen.id){
        this.$message({
                message: "请输入编号",
                type: 'error'
            });
            return;
      }
      if(!this.upfen.score){
        this.$message({
                message: "请输入金额",
                type: 'error'
            });
            return;
      }
      
      
      var fentype = 2;
      var fentext = '下分'+this.upfen.score;
      var fencolor = 'red';
      if(this.upfen.score > 0){//上分
        fentype = 1;
        fentext = '上分'+this.upfen.score;
        fencolor = 'blue';       
      }
      var fen = Math.abs(this.upfen.score);
      var reg = /^\d+(\.\d+)?$/;
      if(!reg.test(fen) || fen == 0){
         this.$message({
             message: "请输入正确的金额",
             type: 'error'
          });
          return;
      }

        getUserInfo({'uid':this.upfen.id}).then((res) => {
           //console.log('res.user.name',res.user);
           if(res.code == 500){
                 this.$message({
                  message: res.msg,
                  type: 'error'
                 });
                 return;
           }else if(res.code == 200){
                var usertype = '会员';
                if(res.user.ai==1){
                    usertype = '机器人';
                }else if(res.user.ai == 0 && res.user.tourist == 1){
                    usertype = '游客';
                }
                const h = this.$createElement;
                this.$msgbox({
                  title: '快捷上下分',
                  message: h('p', null, [
                    h('span', { style: 'font-size:16px' }, '确认给'+usertype+'[ '),
                    h('span', { style: 'color: teal;font-size:16px' }, res.user.name+',ID：'+this.upfen.id+']  '),
                    h('span', { style: 'font-size:16px;color:'+fencolor}, fentext)
                  ]),
                  showCancelButton: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {                 
                      this.handleFenLock = true;//加锁
                      this.$store.getters.imClient.send(JSON.stringify({
                                  "cmd": 4011,
                                  'update_uid': this.upfen.id,
                                  'type':fentype,//上分1 下分2           
                                  "fen":fen
                              }))                       
                      done();

                    } else {
                      done();
                    }
                  }
                })
           }
        }).catch((res)=>{
          this.$message({
                  message: res.msg,
                  type: 'error'
          });
				}) 
    },
     onOpFen(res){
                    if(res.code == 0){
                         this.upfen.id = "";
                         this.upfen.score = "";
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        /*
                        util.setSessionItem('user',['agent_score',res.agentScore])
                        setTimeout(()=>{
                             this.$root.Event.$emit("onAgentScoreChange")
                        },1000)*/
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'info'
                        });
                    }
                    this.handleFenLock = false;//解锁
            },

      //修改靴局
      updateXueJu(){
      // console.log('this.paiControll.roomInfo.room_info.room_status',this.paiControll.roomInfo.room_info);
        if(this.paiControll.roomInfo.room_info.room_status != 0 && this.paiControll.roomInfo.room_info.room_status != -1){
            this.$message({
                              message: '开局中，禁止操作',
                              type: 'error'
                          });
              return;
        }
        this.updateXueJuVisible = true;
        
      },    
      updateXueJuSubmit(){
        if(this.paiControll.roomInfo.room_info.room_status != 0 && this.paiControll.roomInfo.room_info.room_status != -1){
            this.$message({
                              message: '开局中，禁止操作',
                              type: 'error',
                              duration:3000
                          });
              return;
        }
        if($('#updateXue').val() == 0 || $('#updateJu').val() == 0){
                 this.$message({
                              message: '靴号或局数不能为零',
                              type: 'error',
                              duration:3000
                          });
              return;
        }
          this.paiControll.roomInfo.room_info.boots_number = $('#updateXue').val();
          this.paiControll.roomInfo.room_info.ju = $('#updateJu').val();
          this.updateXueJuVisible = false;
      },
      //进入下靴
      xue1(){
        if(this.paiControll.roomInfo.room_info.room_status != 0){
            this.$message({
                              message: '开局中，禁止操作',
                              type: 'info'
                          });
              return;
        }
        this.$confirm('确认进入下一靴吗?', '提示', {
            type: 'info'
        }).then(() => {
          this.$store.getters.imClient.send(
            JSON.stringify({
                "cmd":4210, // 固定值
                "set":102,
                "boots_number":++this.paiControll.roomInfo.room_info.boots_number, // 靴号
                "ju":1,  // 新局数是从1开始累加
                "groupid":this.currentGroup.group.groupid // 桌子/房间号
            })
          );
        })
      },
    kaiju(){
      if(this.paiControll.roomInfo.room_info.boots_number == 0 || this.paiControll.roomInfo.room_info.ju == 0){
           this.$message({
                              message: '靴号和局数不能为0',
                              type: 'error',
                              duration:3000,
                          });
              return;
      }
      this.gameControllerLockFunc();
      if(this.paiControll.roomInfo.room_info.room_status == 0 || this.paiControll.roomInfo.room_info.room_status == -1){//未开局状态才允许点击
      this.gameControllerLock = true;
      this.$store.getters.imClient.send(
          JSON.stringify({
              "cmd":4210, // 固定值
              "set":1,  // 固定值
              "qi":"",  // 暂时未启，可忽略
              "room_id":this.currentGroup.group.groupid,  // 桌号
              "boots_number":this.paiControll.roomInfo.room_info.boots_number, // 靴号
              "ju":this.paiControll.roomInfo.room_info.ju, // 局数
              "xj":0, // 暂时未启用，可忽略
              "msgtype":0, // 暂时未启用，可忽略
              "counttime":this.paiControll.roomInfo.group.counttime, // 自动停止投注时的倒计时器的秒数
              "groupid":this.currentGroup.group.groupid // 桌子/房间号
          })
        );
      }
    },
    tingzhi(){
      this.gameControllerLockFunc();
      if(this.paiControll.roomInfo.room_info.room_status == 1){//开局状态才允许点击
        this.gameControllerLock = true;
        this.$store.getters.imClient.send(
          JSON.stringify({
            cmd: 4210,
            set: 3,
            groupid: this.currentGroup.group.groupid
          })
        );
      }
    },
    //倒计时30秒
    daojishi(){
      //console.log('this.paiControll.roomInfo.room_info',this.paiControll.roomInfo.room_info);
      this.gameControllerLockFunc();
      if(this.daojishiIntval){
                 this.$message({
                              message: '请勿重复提交',
                              type: 'error'
                          });
              return;
      }   
      if(this.paiControll.roomInfo.room_info.room_status == 1){//开局状态才允许点击
        this.gameControllerLock = true;
        this.$store.getters.imClient.send( 
          JSON.stringify({
            cmd: 4210,
            set: 2,
            second:this.daojishi_counttime,
            groupid: this.currentGroup.group.groupid
          })
        );
      }
    },
    //开牌
    kaipai(){
      if(this.openCardsType == 0){
          this.$message({
              message: "请选择开奖结果",
              type: 'error'
          });
        return;
      }
      this.daojishimsg = 0;
      if(this.openCardsType == 1){//选择牌型开奖
        this.xuanPaiJieSuan();
      }
      if(this.openCardsType == 2){//直接结果开奖
        this.resultkaipai();
      }
    },
    //直接结果开牌
    resultkaipai(){
      this.gameControllerLockFunc();
      if(this.paiControll.roomInfo.room_info.room_status != 2){
        this.$message({
              message: "停止投注才可以选择",
              type: 'error'
          });
        return;
      }
      if(this.kaipaiArr.y == 0){
               this.$message({
              message: "请选择庄闲和",
              type: 'error'
          });
        return;
      }
      this.kaipailoading = true;
      this.gameControllerLock = true;
      this.kaipaiArr.boots_number = this.paiControll.roomInfo.room_info.boots_number;
      this.kaipaiArr.ju = this.paiControll.roomInfo.room_info.ju;
      this.kaipaiArr.room_id = this.paiControll.roomInfo.room_info.room_id;
      this.kaipaiArr.groupid = this.currentGroup.group.groupid;
      this.$store.getters.imClient.send(
            JSON.stringify(this.kaipaiArr)
      );
    },
    //补路单开牌
    buLudanKaipai(){
      if(this.paiControll.roomInfo.room_info.room_status != 0 && this.paiControll.roomInfo.room_info.room_status != -1){
        this.$message({
              message: "未开局状态下才能操作",
              type: 'error'
          });
        return;
      }
      if(this.buLudanKaipaiArr.y == 0){
          this.$message({
              message: "请选择庄闲和",
              type: 'error'
          });
          return;
      }
      if(this.buLudanLock){
          this.$message({
              message: "网络错误，请刷新重试",
              type: 'error'
          });
          return;
      }
      this.$root.Event.$emit("showWindowsLoading")
      this.buLudanLock = true;
      this.buLudanKaipaiArr.room_id = this.paiControll.roomInfo.room_info.room_id;
      this.buLudanKaipaiArr.groupid = this.currentGroup.group.groupid;
      this.$store.getters.imClient.send(
            JSON.stringify(this.buLudanKaipaiArr)
      );
    },
    quxiao(){
      this.daojishimsg = 0;
      this.gameControllerLockFunc();
      if(this.paiControll.roomInfo.room_info.room_status != 0){//不在未开局状态才允许点击
        this.$confirm('确认取消本局吗?', '提示', {
          type: 'info'
        }).then(() => {

          this.gameControllerLock = true;
          this.$store.getters.imClient.send(
          JSON.stringify({
            cmd: 4210,
            set: 5,
            groupid: this.currentGroup.group.groupid
          })
         );

        })
      }
    },
    gameControllerLockFunc(){
      if(this.gameControllerLock){
         this.$message({
                message: "重复提交，请刷新重试",
                type: 'error'
            });
            return;
      }
    },
    //选牌结算
    xuanPaiJieSuan(){
     if(this.paiControll.roomInfo.room_info.room_status != 2){
        this.$message({
              message: "停止投注才可以选择",
              type: 'error'
          });
        return;
      }
      if(this.paiControll.roomInfo.room_info.room_status == 2){//停止状态才允许点击
     //先判断游戏类型
        if(this.currentGroup.group.game_type ==0){
          if(this.paiControll.paidian.p1 == "" ||this.paiControll.paidian.p2 == "" || this.paiControll.paidian.p3 == "" || this.paiControll.paidian.p4 == ""){
            this.$message({
                message: "请先开底牌",
                type: 'error'
            });
            return;
          }
        }
        if(this.currentGroup.group.game_type == 1){
          if(this.paiControll.paidian.p1 == "" ||this.paiControll.paidian.p2 == ""){
            this.$message({
                message: "请先开牌",
                type: 'error'
            });
            return;
          }
        }

        if(this.currentGroup.group.game_type ==2){
          if(this.paiControll.paidian.p1 == "" ||this.paiControll.paidian.p2 == "" || this.paiControll.paidian.p3 == "" || this.paiControll.paidian.p4 == ""|| this.paiControll.paidian.p5 == ""|| this.paiControll.paidian.p6 == ""){
            this.$message({
                message: "请先开牌",
                type: 'error'
            });
            return;
          }
        }

        if(this.currentGroup.group.game_type ==3){
          if(this.paiControll.paidian.p1 == "" ||this.paiControll.paidian.p2 == "" || this.paiControll.paidian.p3 == "" || this.paiControll.paidian.p4 == ""|| this.paiControll.paidian.p5 == ""|| this.paiControll.paidian.p6 == ""|| this.paiControll.paidian.p7 == ""|| this.paiControll.paidian.p8 == ""|| this.paiControll.paidian.p9 == ""|| this.paiControll.paidian.p10 == ""){
            this.$message({
                message: "请先开牌",
                type: 'error'
            });
            return;
          }
        }

        this.$store.getters.imClient.send(
          JSON.stringify({
              "p1":this.paiControll.paidian.p1, // 闲家的第一张牌点
              "p2":this.paiControll.paidian.p2,  // 闲家的第二张牌点
              "p3":this.paiControll.paidian.p3 ||0,   // 庄家的第一张牌点
              "p4":this.paiControll.paidian.p4||0,  // 庄家的第二张牌点
              "p5":this.paiControll.paidian.p5 || 0,  // 闲家的第三张牌点
              "p6":this.paiControll.paidian.p6 || 0,   // 庄家的第三张牌点
              "p7":this.paiControll.paidian.p7 || 0,   // 庄家的第三张牌点
              "p8":this.paiControll.paidian.p8 || 0,   // 庄家的第三张牌点
              "p9":this.paiControll.paidian.p9 || 0,   // 庄家的第三张牌点
              "p10":this.paiControll.paidian.p10 || 0,   // 庄家的第三张牌点
              "x":1,  // 暂时未启用，可忽略
              "z":7,  // 暂时未启用，可忽略
              "q":"",  // 暂时未启用，可忽略
              "set":4,  // 固定值
              "type":1,  // 暂时未启用，可忽略
              "cmd":4210,
              "groupid":this.currentGroup.group.groupid
          })
        );
      this.kaipailoading = true;
      this.gameControllerLock = true;
      }
    },
    //牌点和牌面
    subPai(i){
      if(i == 53) i = "";
      this.paiControll.paidian[this.currentPai] = i;
      this.paiControll.paimian[this.currentPai] = this.transPoker(i);
      this.checkpai = false;
    },
    transPoker(dian) {
      return '../../../static/images/poker/'+ dian+'.png'
    },
    //直接结果开奖
    choseRes(result_number,idname){
      var resultArrKey = idname+result_number;
      if(this.paiControll.roomInfo.room_info.room_status != 2){
        this.$message({
              message: "停止投注状态下才可以选择",
              type: 'error'
          });
        return;
      }
      //盖上牌面
      this.paiControll.paidian.p1 = "";
      this.paiControll.paidian.p2 = "";
      this.paiControll.paidian.p3 = "";
      this.paiControll.paidian.p4 = "";
      this.paiControll.paidian.p5 = "";
      this.paiControll.paidian.p6 = "";
      this.paiControll.paidian.p7 = "";
      this.paiControll.paidian.p8 = "";
      this.paiControll.paidian.p9 = "";
      this.paiControll.paidian.p10 = "";
      if(result_number <=3){
          if( $("#"+idname).hasClass(this.resultArr[resultArrKey].current)){
            this.resultNumber = 0;
            this.kaipaiArr.y = 0;
            this.idname = '';
            this.resultXyVisible = false;
            this.kaipaiArr.xy = 0; 
          }else{
            this.resultNumber = result_number;
            this.kaipaiArr.y = result_number;
            this.idname = idname;

            if(result_number == 1){
                this.resultXyVisible = true;
            }else{
                this.resultXyVisible = false;
                this.kaipaiArr.xy = 0; 
            }     
          }   
      }     
      if(result_number >3){
          if(this.kaipaiArr[this.resultArr[resultArrKey].name] == this.resultArr[resultArrKey].number){
            this.kaipaiArr[this.resultArr[resultArrKey].name] =  0;
          }else{
            this.kaipaiArr[this.resultArr[resultArrKey].name] =  this.resultArr[resultArrKey].number;
          }  
      } 
      this.openCardsType =2;     
    },
    //快捷补路单
    buLudanRes(result_number,idname){
      var  buLudanArrKey = idname+result_number;
      if(this.paiControll.roomInfo.room_info.room_status != 0 && this.paiControll.roomInfo.room_info.room_status != -1){
        this.$message({
              message: "未开局状态下才能操作",
              type: 'error'
          });
        return;
      }
      if(result_number <=3){
          if( $("#"+idname).hasClass(this. buLudanArr[buLudanArrKey].current)){
            this.buLudanResultNumber = 0;
            this.buLudanKaipaiArr.y = 0;
            this. buLudanIdname = '';
            this. buLudanXyVisible = false;
            this.buLudanKaipaiArr.xy = 0; 
          }else{
            this.buLudanResultNumber = result_number;
            this.buLudanKaipaiArr.y = result_number;
            this.buLudanIdname = idname;

            if(result_number == 1){
                this.buLudanXyVisible = true;
            }else{
                this.buLudanXyVisible = false;
                this.buLudanKaipaiArr.xy = 0; 
            }     
          }   
      }     
      if(result_number >3){
          if(this.buLudanKaipaiArr[this.buLudanArr[buLudanArrKey].name] == this.buLudanArr[buLudanArrKey].number){
            this.buLudanKaipaiArr[this.buLudanArr[buLudanArrKey].name] =  0;
          }else{
            this.buLudanKaipaiArr[this.buLudanArr[buLudanArrKey].name] =  this.buLudanArr[buLudanArrKey].number;
          }  
      }      
    },

    //选牌
    chosePai(p){
      if(this.paiControll.roomInfo.room_info.room_status != 2){
        this.$message({
              message: "停止投注才可以选牌",
              type: 'error'
          });
        return;
      }
      
      if(this.currentGroup.gameType !=3){
        if(p == 5 &&(this.paiControll.paidian.p1 == "" || this.paiControll.paidian.p2 == "")){
          this.$message({
                message: "请先开底牌",
                type: 'error'
            });
            return;
        }
        if(p == 6 &&(this.paiControll.paidian.p3 == "" || this.paiControll.paidian.p4 == "")){
          this.$message({
                message: "请先开底牌",
                type: 'error'
            });
            return;
        }
      }
      this.kaipaiArr.y=0;
      this.kaipaiArr.zd=0;
      this.kaipaiArr.xd=0;
      this.kaipaiArr.xy=0;
      this.idname='';
      this.resultNumber=0;
      this.resultXyVisible = false;
      this.currentPai = 'p'+p;
      this.checkpai = true;
      this.openCardsType = 1;
    },
    autoTableHeight(){
                this.$nextTick(() => {
                        setTimeout(()=>{
                            for(var i = 0 ; i < $(".tableStyle").length;i++){
                                $(".tableStyle").eq(i).find(".is-scrolling-left").width($(".tableStyle").eq(i).find(".el-table__header").width())
                            }
                        },500)

             })
           },
    tabcheck(data){
      this.settingIndex = data.index;
    },
      escape2Html(str) {
      var str = str.replace(/<(?!(img|br|p)).*?>/g, "");
      var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
      return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
    },
    //限红设置
    settingIndex0(){
      this.$refs.settingForm.validate(valid => {
        if (valid) {
          var param = {
            keep: 1,
            id: this.settingForm.id,
            odds_zx_min: this.settingForm.odds_zx_min,
            odds_zx_max: this.settingForm.odds_zx_max,
            capital: this.settingForm.capital,
            mantissa: this.settingForm.mantissa,
            single: this.settingForm.single,
            odds_sb_all: this.settingForm.odds_sb_all,
            odds_sb_max: this.settingForm.odds_sb_max,
            odds_sb_min: this.settingForm.odds_sb_min,
            odds_lucky_max: this.settingForm.odds_lucky_max,
            odds_lucky_min: this.settingForm.odds_lucky_min,            
            odds_zd_min: this.settingForm.odds_zd_min,
            odds_zd_max: this.settingForm.odds_zd_max,
            odds_xd_min: this.settingForm.odds_xd_min,
            odds_xd_max: this.settingForm.odds_xd_max,
            odds_superhe_min: this.settingForm.odds_superhe_min,
            odds_superhe_max: this.settingForm.odds_superhe_max,
            odds_fanbei_min: this.settingForm.odds_fanbei_min,
            odds_fanbei_max: this.settingForm.odds_fanbei_max,
          };
          roomConfigUpdateKeep1(param)
            .then(res => {
              this.settingVisible = false;
              if (res.code == 200) {
                //ws通知
                this.$store.getters.imClient.send(
                  JSON.stringify({
                    cmd: 4202,
                    groupid: this.currentGroup.group.groupid
                  })
                );
                this.$message({
                  message: res.msg,
                  type: "success"
                });
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
        }
      });
    },
    //赔率设置
    settingIndex1(){
      this.$refs.settingForm.validate(valid => {
        if (valid) {
          var param = {
            keep: 5,
            id: this.settingForm.id,
            zhuang:this.settingForm.zhuang,
            xian:this.settingForm.xian,
            he:this.settingForm.he,
            zhuang_dui:this.settingForm.zhuang_dui,
            xian_dui:this.settingForm.xian_dui,
            lucky_six_12:this.settingForm.lucky_six_12,
            lucky_six_20:this.settingForm.lucky_six_20,
          };
          roomConfigUpdateKeep1(param)
            .then(res => {
              this.settingVisible = false;
              if (res.code == 200) {
                //ws通知
                this.$store.getters.imClient.send(
                  JSON.stringify({
                    cmd: 4202,
                    groupid: this.currentGroup.group.groupid
                  })
                );
                this.$message({
                  message: res.msg,
                  type: "success"
                });
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
        }
      });
    },
    //机器人设置
    settingIndex2(){
      this.$refs.setting1Form.validate(valid => {
        if (valid) {
          var param = {
            keep: 2,
            id: this.settingForm.id,
            ai_state: this.settingForm.ai_state,
            ai_time: this.settingForm.ai_time,
            ai_num: this.settingForm.ai_num,
            ai_text: this.settingForm.ai_text,
            ai_upfen: this.settingForm.ai_upfen,
          };
          roomConfigUpdateKeep1(param)
            .then(res => {
              this.settingVisible = false;
              if (res.code == 200) {
                //ws通知
                this.$store.getters.imClient.send(
                  JSON.stringify({
                    cmd: 4202,
                    groupid: this.currentGroup.group.groupid
                  })
                );
                this.$message({
                  message: res.msg,
                  type: "success"
                });
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
        }
      });
    },
    //其他设置
    settingIndex3(){
      this.$refs.setting2Form.validate(valid => {
        if (valid) {
          var param = {
            keep: 4,
            id: this.settingForm.id,
            headimage: this.settingForm.userhead,
            ps_name: this.settingForm.adminname,
            video_link: this.settingForm.video_link,
            counttime:this.settingForm.counttime,
            groupname: this.settingForm.groupname,
            mark: this.settingForm.mark,
            has_luckysix:1,
          };
          roomConfigUpdateKeep1(param)
            .then(res => {
              this.settingVisible = false;
              if (res.code == 200) {
                //ws通知
                this.$store.getters.imClient.send(
                  JSON.stringify({
                    cmd: 4202,
                    groupid: this.currentGroup.group.groupid
                  })
                );
                this.$message({
                  message: res.msg,
                  type: "success"
                });
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
        }
      });
    },
    settingSubmit() {
      if(this.settingIndex == 0){
        this.settingIndex0();
      }else if(this.settingIndex == 1){
        this.settingIndex1();
      }else if(this.settingIndex == 2){
        this.settingIndex2();
      }else if(this.settingIndex == 3){
        this.settingIndex3();
      }
    },
    //修改系统设置
    settingSystemSubmit() {
       let updateSystemForm = {
         team_title : this.settingSystemForm.team_title,
         notice : this.settingSystemForm.notice,
         fast_msg : this.settingSystemForm.fast_msg,
         integral_rate : this.settingSystemForm.integral_rate,
         score_rate : this.settingSystemForm.score_rate,
         nosay : this.settingSystemForm.nosay,
         touristfunc : this.settingSystemForm.touristfunc,
         integral_tongji_way :this.settingSystemForm.integral_tongji_way,
         wsDataId : this.wsDataId,
         tid: this.currentGroup.group.tid
       };

       updateTeamConfig(updateSystemForm).then(res=>{
         if (res.code == 200) {
              this.settingSystemVisible = false;      
         }
        this.$message({
          message: res.msg,
          type: "success"
        });
       })
    }, 
    //获取系统设置
    settingSystem() {
      this.settingSystemVisible = true;
      getTeamConfig({ tid: this.currentGroup.group.tid}).then(res => {
          if (res.code == 200) {
            this.settingSystemForm = res.data;
            if(res.data.nosay == 1){
               this.settingSystemForm.nosay ="1";
            }else{
               this.settingSystemForm.nosay ="0";
            }
            if(res.data.touristfunc > 0){
               this.settingSystemForm.touristfunc ="1";
            }else{
               this.settingSystemForm.touristfunc ="0";
            }
            if(res.data.integral_tongji_way > 0){
               this.settingSystemForm.integral_tongji_way ="1";
            }else{
               this.settingSystemForm.integral_tongji_way ="0";
            }
            if(res.data.wsData.wsDataArr.length > 0){
              this.changeWsShow = 1;
              this.wsDataId = res.data.wsData.currentWsId;
              //console.log('this.wsDataId',this.wsDataId);
            }
            this.$message({
              message: res.msg,
              type: "success"
            });
          }else {
            this.$message({
              message: res.msg,
              type: "info"
            });
          }
      })
    },
    //房间设置
    setting() {
      this.settingVisible = true;
      //请求接口
      roomConfig({ groupid: this.currentGroup.group.groupid })
        .then(res => {
          if (res.code == 200) {
            res.data.list.ai_state = res.data.list.ai_state.toString()
            this.settingForm = res.data.list;
            this.settingForm.userhead = res.data.list.headimage;
            this.settingForm.adminname = res.data.list.ps_name;
           /* setTimeout(()=>{
              this.$refs.ue2.setUEContent(this.settingForm.game_rule);
            },1000)*/
            this.$message({
              message: res.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "info"
            });
          }
        })
    },
    //清空群消息
    clearGroupMsg(){
             this.$confirm('确认清空房间['+this.currentGroup.group.groupname+']的群消息吗？', '提示', {}).then(() => {
                this.$store.getters.imClient.send(JSON.stringify({
                                  "cmd": 7010,
                                  "groupid":this.currentGroup.group.groupid,
                              }))
             })

    },
    onClearGroupMsg(){
       this.chatMsg =[];
    },
     //读取牌型
      readerPaiRes(data){
        var htmlvar ="";
        var msg = JSON.parse(data).vo3094;       
        //msg.x_Img="<img src='../../../static/images/poker/1.png' /><img src='../../../static/images/poker/2.png' /><img src='../../../static/images/poker/3.png' />";    
       // msg.z_Img="<img src='../../../static/images/poker/11.png' /><img src='../../../static/images/poker/12.png' /><img src='../../../static/images/poker/13.png' />";    
        if(!msg.x_Img || !msg.z_Img){
           return htmlvar;
        }
        htmlvar +=  "<div>";               
        htmlvar +=  "<div style='float:left;font-size: 16px;color: blue;font-weight: bold; position: relative;top: 33px;'>闲家：<span style='color:green'>"+msg.x_Point+"点</span></div>";
        htmlvar +=  "<div class='resultpoker' style='float:right;width: 80%;' >"+msg.x_Img+"</div></div>";
        htmlvar +=  "<div>";               
        htmlvar +=  "<div style='float:left;font-size: 16px;color: red;font-weight: bold; position: relative;top: 33px;'>庄家：<span style='color:green'>"+msg.z_Point+"点</span></div>";
        htmlvar +=  "<div class='resultpokerZ' style='float:right;width: 80%;' >"+msg.z_Img+"</div></div>";
        return htmlvar;
      },
        //读取当局靴局数
      readerCurJuInfo(data){
        var msg = JSON.parse(data);
        var curJuInfo = this.currentGroup.group.mark +'桌 '+ msg.room_info.boots_number+"-"+msg.room_info.ju+'局';
        return curJuInfo;
      },
      //读取重新结算
      readerRes(data){
        var msg = JSON.parse(data);
        var htmlStr = "";
          if(msg.resettlement && msg.resettlement == 1){
            htmlStr += "<span>(重新结算)</span>"
          }
        return htmlStr;
      },
      //读取开牌结果
    readerResult(data) {
      var msg = JSON.parse(data);
      if (this.currentGroup.gameType == 0) {
        var fontsize = 30;
        if(msg.lucky_six > 0){
          fontsize = 22;
        }
        var htmlStr = "";
        if (msg.zxh == 1) {
          htmlStr += "<span style='color:red;font-size:"+fontsize+"px;'>庄赢</span>";
        } else if (msg.zxh == 2) {
          htmlStr += "<span style='color:rgb(61, 134, 228);font-size:"+fontsize+"px;'>闲赢</span>";
        } else if (msg.zxh == 3) {
          htmlStr += "<span style='color:#5AAD3E;font-size:"+fontsize+"px;'>和局</span>";
        }

        htmlStr += " ";
        var dui = "";
        if (msg.zhuang_dui > 0) {
          dui = "<span style='color: #B7442B;font-size:"+fontsize+"px;'>庄对</span>";
        }
        if (msg.xian_dui > 0) {
          dui = "<span style='color: #508CD1;font-size:"+fontsize+"px;'>闲对</span>";
        }
        if (msg.zhuang_dui == 0 && msg.xian_dui == 0) {
          dui = "<span style='color: #E6C780;font-size:"+fontsize+"px;'>无对</span>";
        }
        if (msg.zhuang_dui > 0 && msg.xian_dui > 0) {
          dui = "<span style='color: #E6C780;font-size:"+fontsize+"px;'>双对</span>";
        }
        htmlStr += dui;
        htmlStr += " ";
        if (msg.lucky_six == 6) {
          htmlStr +=
            "<span style='color: #BA4079;font-size:"+fontsize+"px;'>幸运六12倍</span>";
        }
        if (msg.lucky_six == 7) {
          htmlStr +=
            "<span style='color: #D14CEA;font-size:"+fontsize+"px;'>幸运六20倍</span>";
        }
      } else if (this.currentGroup.gameType == 1) {
        var htmlStr = "";
        if (msg.zxh == 1) {
          htmlStr += "<span style='color:#D84433;font-size: 38px;'>龙赢</span>";
        } else if (msg.zxh == 2) {
          htmlStr += "<span style='color:#5692D1;font-size: 38px;'>虎赢</span>";
        } else if (msg.zxh == 3) {
          htmlStr +=
            "<span style='color: #5AAD3E;font-size: 38px;'>和局</span>";
        }
      }else if(this.currentGroup.gameType ==2){
          var msg = JSON.parse(data).vo3094;
              var htmlStr = "";
              if (msg.resultWin == "龙赢") {
                  htmlStr += "<span style='color:#5692D1;font-size: 38px;'>龙赢</span>"
              } else if (msg.resultWin == "凤赢") {
                  htmlStr += "<span style='color:#D84433;font-size: 38px;'>凤赢</span>"
              } else {
                  htmlStr += "<span style='color: #5AAD3E;font-size: 38px;'>和局</span>"
              }
          htmlStr += "<div style='margin-top: 0px;'></div><span style='color: #D9CFA0; font-size: 14px;cursor: pointer'>龙:"+msg.l_msg+"&nbsp;&nbsp;&nbsp;&nbsp;凤:"+msg.f_msg+"</span>";
          // htmlStr += "<div style='margin-top: 0px;'></div><span style='color: #D9CFA0; font-size: 14px;cursor: pointer'>点击查看牌点</span>";
          return htmlStr;
        }else if(this.currentGroup.gameType ==3){
          var msg = JSON.parse(data).vo3094;
              var htmlStr = "";
              if (msg.resultWin == "红牛赢") {
                  htmlStr += "<span style='color:#D84433;font-size: 38px;'>红牛赢</span>"
              } else if (msg.resultWin == "黑牛赢") {
                  htmlStr += "<span style='color:#5692D1;font-size: 38px;'>黑牛赢</span>"
              } else {
                  htmlStr += "<span style='color: #5AAD3E;font-size: 38px;'>和局</span>"
              }
          htmlStr += "<div style='margin-top: 0px;'></div><span style='color: #D9CFA0; font-size: 14px;cursor: pointer'>黑牛:"+msg.f_msg+"&nbsp;&nbsp;&nbsp;&nbsp;红牛:"+msg.l_msg+"</span>";
          // htmlStr += "<div style='margin-top: 0px;'></div><span style='color: #D9CFA0; font-size: 14px;cursor: pointer'>点击查看牌点</span>";
          return htmlStr;
        }
      // htmlStr +=
      //   "<div style='margin-top: 0px;'></div><span style='color: #E6C780; font-size: 14px;cursor: pointer'>点击查看牌点</span>";
      return htmlStr;
    },
    readerNameAndTime(chatItem) {
      if (JSON.parse(chatItem.fromuser) != null) {
        if (chatItem.fromuid != localStorage.getItem("uid")) {
          return (
            "<span style='color:" +
            this.tranColor(JSON.parse(chatItem.fromuser).name) +
            "'>" +
            JSON.parse(chatItem.fromuser).name +
            " " +
            chatItem.createtime +
            "</span>"
          );
        } else {
          return (
            "<span style='color:" +
            this.tranColor(JSON.parse(chatItem.fromuser).name) +
            "'>" +
            chatItem.createtime +
            " " +
            JSON.parse(chatItem.fromuser).name +
            "</span>"
          );
        }
      }
    },
    chatMessage(chat) {
      if (chat.iscache) {
        return (
          "" +
          chat.message
        );
      } else {
        if (chat.error_order == 1) {
          return (
            chat.message +
             "<img style='width: 12px;height: 12px;margin-left: 5px;' src='../static/images/chouma.png'>"
          );
        }else if(chat.error_order == 5){
            
              return chat.message + "<img class='loadingImg2' src='../static/images/errormsg.png'>";
            
          } else {
          return chat.message + "";
        }
      }
    },
    readerTZTitle(data) {
      return (
        JSON.parse(data)[3] +
        "桌" +
        JSON.parse(data)[1] +
        "-" +
        JSON.parse(data)[2] +
        "局 投注表"
      );
    },
    readerTZ(data) {
      return JSON.parse(data)[0];
    },
    readerYF(data) {
      return JSON.parse(data).data;
    },
    readerYFTitle(data) {
      var msg = JSON.parse(data);
      return (
        msg.room_info.room_id +
        "桌" +
        msg.room_info.boots_number +
        "-" +
        msg.room_info.ju +
        "局 余分表"
      );
    },
    readerNameBianJi(){
          if(this.settingForm.userhead){
                  return "<img width='60' height='60' src="+this.settingForm.userhead+">";
          }else{
            if(this.settingForm.adminname){
                return "<div style='width:60px;heght:60px;line-height:60px;font-size: 30px;text-align: center;color: rgba(255,255,255,6);font-family: 微软雅黑;background-color: "+this.tranColor(this.settingForm.adminname)+"'>"+ this.getFirstname(this.settingForm.adminname) +"</div>";
            }
          }
    },
    tranColor(name) {
      //颜色转换
      var str = "";
      for (var i = 0; i < name.length; i++) {
        str += parseInt(name[i].charCodeAt(0), 13).toString(16);
      }
      return "#" + str.slice(1, 4);
    },
    getFirstname(name) {
      return name.substr(0, 1);
    },
    card_game_id(chat) {
      return JSON.parse(chat.message).room_info.card_game_id;
    },
    readerHeader(chatItem) {
      if (chatItem.fromuid != localStorage.getItem("uid")) {
        //对方
        if (JSON.parse(chatItem.fromuser) != null) {
          if (JSON.parse(chatItem.fromuser).head) {
            if (JSON.parse(chatItem.fromuser).head.indexOf("http") != -1) {
              return (
                "<img width='32' height='32' src=" +
                JSON.parse(chatItem.fromuser).head +
                ">"
              );
            } else {
              return (
                "<img width='32' height='32' src=" +
                localStorage.getItem("head_domain") +
                JSON.parse(chatItem.fromuser).head +
                ">"
              );
            }
          } else {
            return (
              "<div style='background-color: " +
              this.tranColor(JSON.parse(chatItem.fromuser).name) +
              "'>" +
              this.getFirstname(JSON.parse(chatItem.fromuser).name) +
              "</div>"
            );
          }
        }
      } else {
        if (this.$store.getters.userInfo.head) {
          if (this.$store.getters.userInfo.head.indexOf("http") != -1) {
            return (
              "<img  width='32' height='32' src=" +
              this.$store.getters.userInfo.head +
              ">"
            );
          } else {
            return (
              "<img  width='32' height='32' src=" +
              localStorage.getItem("head_domain") +
              this.$store.getters.userInfo.head +
              ">"
            );
          }
        } else {
          return (
            "<div style='background-color: " +
            this.tranColor(JSON.parse(chatItem.fromuser).name) +
            "'>" +
            this.getFirstname(JSON.parse(chatItem.fromuser).name) +
            "</div>"
          );
        }
      }
    },
    changeGroup(id) {
      for (var i = 0; i < this.$store.getters.groups.length; i++) {
        if (this.$store.getters.groups[i].groupid == id) {
          //更改当前房间信息
          this.currentGroup = JSON.parse(JSON.stringify(this.$store.getters.groups[i]));
          //获取倒计时
       /* roomConfig({ groupid: this.currentGroup.group.groupid })
        .then(res => {
          if (res.code == 200) {          
            this.daojishi_second = res.data.list.counttime;
            this.daojishi_counttime = res.data.list.counttime;
          } 
        })*/
         // console.log("当前房间信息",this.currentGroup);
        // this.daojishi_second =   this.currentGroup.counttime
          this.isFirstGetHis = true;
          this.userOnlines = [];
          this.paiControll.paidian={
          p1:"",
          p2:"",
          p3:"",
          p4:"",
          p5:"",
          p6:"",
          p7:"",
          p8:"",
          p9:"",
          p10:"",
        };
        this.paiControll.paimian = {
          p1:"",
          p2:"",
          p3:"",
          p4:"",
          p5:"",
          p6:"",
          p7:"",
          p8:"",
          p9:"",
          p10:"",
        };
          this.ludan = {
            data: {},
            yc: [
              { dyz: "", xl: "", yyl: "" },
              { dyz: "", xl: "", yyl: "" }
            ],
            option1: {
              id: "zhuzilu",
              wh: [14, 6],
              data: []
            },
            option2: {
              id: "dalu",
              wh: [40, 6],
              data: []
            },
            option3: {
              id: "dyz",
              wh: [20, 3],
              data: []
            },
            option4: {
              id: "xl",
              wh: [20, 3],
              data: []
            },
            option5: {
              id: "jy",
              wh: [20, 3],
              data: []
            },
            option6: {
              id: "sx",
              wh: [20, 3],
              data: []
            }
          };
          this.dj = {
            z: "...",
            x: "...",
            h: "...",
            ws: "...",
            tm: "...",
            zd: "...",
            xd: "...",
            xy: "...",
            He: "...",
        HeiNiu: "...",
        HongNiu: "...",
        Niu1: "...",
        Niu2: "...",
        Niu3: "...",
        Niu4: "...",
        Niu5: "...",
        Niu6: "...",
        Niu7: "...",
        Niu8: "...",
        Niu9: "...",
        NiuNiu: "...",
        ShuangNiu: "...",
        SuperNius: "...",
        bei5: "...",
        bei100: "...",
        bei120: "...",
        dc: "...",
        mantissa: "...",
          };
          this.zy = {
            tmbj: "...",
            tmcm: "...",
            wsyk: "...",
            sbyk: "...",
            dcyk: "...",
            dlzy: "...",
            zxxm: "...",
            sbxm: "...",
            khyk: "...",
            luckysix_yk:"",
            gbyk:"..."
          };
          (this.chatpage = 0),
            (this.chatMsg = []),
            this.$store.getters.imClient.send(
              JSON.stringify({
                cmd: 4200,
                groupid: id
              })
            );
          
          this.$store.getters.imClient.send(
              JSON.stringify({
                cmd: 4211,
                groupid: id
              })
            );

         // this.showVideo();
          this.autoTableHeight();
          this.getHistory(0);
          return;
        }
      }
     /* this.$message({
        message: "该桌暂未开放",
        type: "error"
      });*/
      //未开放的桌子
    },
    getHistory(chatpage){
        this.$store.getters.imClient.send(JSON.stringify({"cmd": 4204, "groupid": this.currentGroup.groupid, "startpage": chatpage}));
    },
    guiling() {
      this.$confirm(
        "本操作后，自营报表将被清空,且不可恢复，确认归零吗?",
        "提示",
        {
          type: "warning"
        }
      ).then(() => {
        this.$store.getters.imClient.send(
          JSON.stringify({ cmd: 4201, set: 104, groupid: this.currentGroup.group.groupid })
        );
      });
    },
    resder(dj) {
        if(dj.z-dj.z_zc > dj.x-dj.x_zc){
            return "<span class='z'>"+dj.tm+"</span>";
        }else{
            return "<span class='x'>"+dj.tm+"</span>";
        }
    },
    onShowRoomLudan(message) {
      if (this.currentGroup.group.groupid != message.groupid) {
        return;
      }
      this.ludan.data = message.ludan_data;
      this.ludan.yc = message.ludan_yc;
      //珠子路
      var zhuzilu = message.ludan_zz;
      //得到这一靴所有输赢
        this.xueWin = [];
        for(var i = 0;i < zhuzilu.length; i++){
          this.xueWin.push(zhuzilu[i].text);
        }
        
      this.ludan.option1.data = [];
      var count = this.ludan.option1.wh[0] * this.ludan.option1.wh[1];
      var zhuziluBegin = zhuzilu.length > count ? zhuzilu.length - count : 0;
      for (var i = zhuziluBegin; i < zhuzilu.length; i++) {
        this.ludan.option1.data.push({
          type: zhuzilu[i].y,
          red1: zhuzilu[i].zd,
          blue1: zhuzilu[i].xd,
          data: zhuzilu[i].text
        });
      }
      //大路
      var dalu = message.ludan_da;
      this.ludan.option2.data = [];
      var count = this.ludan.option2.wh[0] * this.ludan.option2.wh[1];
      var daluBegin = dalu.length > count ? dalu.length - count : 0;
      for (var i = daluBegin; i < dalu.length; i++) {
        if(this.currentGroup.group.game_type == 2 || this.currentGroup.group.game_type == 3){
          this.ludan.option2.data.push({
            blue0: dalu[i].y == 1,
            blue2: false,
            red0: dalu[i].y == 2,
            red2: false,
            num: dalu[i].num
          });
        }else{
          this.ludan.option2.data.push({
          blue0: dalu[i].y == 2,
          blue2: dalu[i].xd == 1,
          red0: dalu[i].y == 1,
          red2: dalu[i].zd == 1,
          num: dalu[i].num
        });
        }
      }
      //大眼仔
      var dyz = message.ludan_dyz;
      var dyzSort = [];
      var dylen = Math.ceil(dyz.length / 4) + 1;
      for (var j = 0; j < dylen; j++) {
        dyzSort.push([]);
      }
      for (var i = 0; i < dyz.length; i++) {
        var lie = parseInt(i / 12);
        var yu = (i + 1) % 6 == 0 ? 6 : (i + 1) % 6;
        if (yu % 2 == 0) {
          var hang = parseInt(yu / 2) - 1;
        } else {
          var hang = parseInt((yu + 1) / 2) - 1;
        }
        dyzSort[lie * 3 + hang].push(dyz[i].y);
      }
      this.ludan.option3.data = [];
      var count = this.ludan.option3.wh[0] * this.ludan.option3.wh[1];
      var dyzBegin = dyzSort.length > count ? dyzSort.length - count : 0;
      for (var i = dyzBegin; i < dyzSort.length; i++) {
        this.ludan.option3.data.push({
          d1: dyzSort[i][0],
          d2: dyzSort[i][1],
          d3: dyzSort[i][2],
          d4: dyzSort[i][3]
        });
      }
      //小路
      var xl = message.ludan_xiao;
      var xlSort = [];
      var xllen = Math.ceil(xl.length / 4) + 1;
      for (var j = 0; j < xllen; j++) {
        xlSort.push([]);
      }
      for (var i = 0; i < xl.length; i++) {
        var lie = parseInt(i / 12);
        var yu = (i + 1) % 6 == 0 ? 6 : (i + 1) % 6;
        if (yu % 2 == 0) {
          var hang = parseInt(yu / 2) - 1;
        } else {
          var hang = parseInt((yu + 1) / 2) - 1;
        }
        xlSort[lie * 3 + hang].push(xl[i].y);
      }
      this.ludan.option4.data = [];
      var count = this.ludan.option4.wh[0] * this.ludan.option4.wh[1];
      var xlBegin = xlSort.length > count ? xlSort.length - count : 0;
      for (var i = xlBegin; i < xlSort.length; i++) {
        this.ludan.option4.data.push({
          e1: xlSort[i][0],
          e2: xlSort[i][1],
          e3: xlSort[i][2],
          e4: xlSort[i][3]
        });
      }
      //甲由路
      var jy = message.ludan_jy;
      var jySort = [];
      var jylen = Math.ceil(jy.length / 4) + 1;
      for (var j = 0; j < jylen; j++) {
        jySort.push([]);
      }
      for (var i = 0; i < jy.length; i++) {
        var lie = parseInt(i / 12);
        var yu = (i + 1) % 6 == 0 ? 6 : (i + 1) % 6;
        if (yu % 2 == 0) {
          var hang = parseInt(yu / 2) - 1;
        } else {
          var hang = parseInt((yu + 1) / 2) - 1;
        }
        jySort[lie * 3 + hang].push(jy[i].y);
      }
      this.ludan.option5.data = [];
      var count = this.ludan.option5.wh[0] * this.ludan.option5.wh[1];
      var jyBegin = jySort.length > count ? jySort.length - count : 0;
      for (var i = jyBegin; i < jySort.length; i++) {
        this.ludan.option5.data.push({
          f1: jySort[i][0],
          f2: jySort[i][1],
          f3: jySort[i][2],
          f4: jySort[i][3]
        });
      }
      //三星
      var sanxinglu = message.ludan_sx;
      this.ludan.option6.data = [];
      var count = this.ludan.option6.wh[0] * this.ludan.option6.wh[1];
      var sanxingluBegin =
        sanxinglu.length > count ? sanxinglu.length - count : 0;
      for (var i = sanxingluBegin; i < sanxinglu.length; i++) {
        this.ludan.option6.data.push({
          g1: sanxinglu[i].y,
          blue3: sanxinglu[i].xd == 1,
          red3: sanxinglu[i].zd == 1
        });
      }
    },
    goTopBottom(type, height) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (type == "b") {
            if (this.isFirstGetHis) {
              this.isFirstGetHis = false;
              if ($("#chatcontentmain").get(0)) {
                $("#chatcontentmain").scrollTop(
                  $("#chatcontentmain").get(0).scrollHeight
                );
              }
            } else {
              if (height < 200) {
                if ($("#chatcontentmain").get(0)) {
                  $("#chatcontentmain").scrollTop(
                    $("#chatcontentmain").get(0).scrollHeight
                  );
                }
              }
            }
          }
        }, 100);
      });
    },
    getRoomListsAll() {
      getRoomLists({type:1})
        .then(res => {
          if (res.code == 200) {
            this.rooms = res.data.rooms;
           
            this.desktops = {};
            this.videopower = {};
            for(var i =0 ;i <this.rooms.length;i++){
              this.roomsDjs['group'+this.rooms[i].groupid] =this.rooms[i];
              if(this.rooms[i].desktop){
                this.desktops[this.rooms[i].groupid] = 1;
              }else{
                this.desktops[this.rooms[i].groupid] = 0;
              }

              if(this.rooms[i].video_power == 1){ 
                this.videopower[this.rooms[i].groupid] = 1;
              }else if(this.rooms[i].video_power == 0){
                this.videopower[this.rooms[i].groupid] = 0;//kaiqi
              }
            }
           console.log('this.roomsthis.rooms',this.roomsDjs);
           /* this.hasGroupinit = setInterval(() => {
              if (this.$store.getters.groups.length) {
                clearInterval(this.hasGroupinit);
                this.changeGroup(this.$store.getters.groups[0].group.groupid);
              }
            }, 500);*/

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
    showVideo() {
      this.player && this.player.stop();
      this.$nextTick(() => {
        var canvas = document.getElementById("videoCanvas");
        var paiControll = document.getElementById("paiControll");
        var width = $(".rightcon").width() - 2;
        var height = (width * 108) / 192;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        paiControll.style.width = width + "px";
        paiControll.style.height = height + "px";

        $(".videoContentWrap").height(height);
        this.player = new NodePlayer();
        this.player.setView("videoCanvas");
        this.player.setScaleMode(0);
        this.player.setBufferTime(1000);
        this.player.skipLoopFilter(32);
        this.player.on("start", () => {});
        this.player.on("error", e => {});
        this.player.on("stop", () => {});
        this.player.start(this.currentGroup.group.video_link.split("+")[0]);
      });
    },
    //im快捷补路单
    onBuLudan(data){
      this.buLudanLock = false;
      this.$root.Event.$emit("hideWindowsLoading");
      if(data.code && data.code==500){
       this.$message({
            message: data.msg,
            type: "error"
          });
        return;
      }
      this.buLudanKaipaiArr.y=0;
      this.buLudanKaipaiArr.zd=0;
      this.buLudanKaipaiArr.xd=0;
      this.buLudanKaipaiArr.xy=0;
      this.buLudanIdname='';
      this.buLudanResultNumber=0;
      this.buLudanXyVisible = false;

    },
    //取消此局
    onCancalGame(data){
         console.log('取消此局',data);
         cancelGame({card_game_id:data.card_game_id})
    },
    initCONClient(groupid) {
      this.$store.getters.imClient.bindShowRoomLudan(this.onShowRoomLudan);
      this.$store.getters.imClient.bindRoomDj(this.onRoomDj);//当局报表数据
      this.$store.getters.imClient.bindRoomZy(this.onRoomZy);//自营报表数据
      this.$store.getters.imClient.bindRealTimeMsg(this.onRealTimeMsg);
      this.$store.getters.imClient.bindShowHistory(this.onShowHistory);
      this.$store.getters.imClient.bindRoomInfo(this.onRoomInfo);
      this.$store.getters.imClient.bindOpFen(this.onOpFen);
      this.$store.getters.imClient.bindClearGroupMsg(this.onClearGroupMsg);
      this.$store.getters.imClient.bindDaojishiSecond(this.onDaojishiSecond);//倒计时
      this.$store.getters.imClient.bindBuLudan(this.onBuLudan);//快捷补路单
      this.$store.getters.imClient.bindCancalGame(this.onCancalGame);//取消此局
      this.$store.getters.imClient.bindDjs(this.onDjs);//房间倒计时
    },
     onDaojishiSecond(data){
      if (data.groupid == this.currentGroup.groupid) {
        if(data.cmd==3087){
          this.daojishi_second = data.room_info.counttime;
        }

        this.$store.getters.imClient.heartCheckUtil.start();
       /*  clearInterval(this.daojishiIntval);
         this.daojishiIntval =  setInterval(() => {
               this.daojishi_second--;
               if(this.daojishi_second <=0 || this.paiControll.roomInfo.room_info.room_status == 0 || this.paiControll.roomInfo.room_info.room_status == 2 || this.paiControll.roomInfo.room_info.room_status == -1 ){
                 clearInterval(this.daojishiIntval);
                 this.daojishiIntval = false;
                 this.daojishi_second = this.daojishi_counttime;
               }
            }, 1000);*/
      }
    },
    //倒计时
      onDjs(data){
       if(data){
         var counttime = data.counttime;
         var closeHeartCheckUtil = true;
         for(var key in counttime){
           this.roomsDjs['group'+key] && (this.roomsDjs['group'+key].counttime = counttime[key]);
           if(counttime[key] > 0){
            closeHeartCheckUtil = false;
           }
          }
          if(this.roomsDjs['group'+this.currentGroup.groupid].counttime >0){
            this.daojishi_second = this.roomsDjs['group'+this.currentGroup.groupid].counttime;
          }else{
            this.daojishi_second = this.daojishi_counttime;
          }
          if(closeHeartCheckUtil){
            this.$store.getters.imClient.heartCheckUtil.stop();
          }
          this.$forceUpdate();
         // console.log('counttimecounttimecounttimecounttime',this.roomsDjs)
        }
      },
      onRoomInfo(data){
      if(data.groupid == this.currentGroup.groupid){
        this.paiControll.roomInfo = data;
        this.daojishi_counttime = data.group.counttime;
        this.daojishi_second = data.group.counttime;
        //console.log("onRoomInfoonRoomInfo",data);
       // this.onDaojishiSecond(data);
      }
    },
    onShowHistory(data){
          if(data.groupid == this.currentGroup.groupid && JSON.stringify(data.msg) != '{}'){
              this.loadChatText = "消息加载成功";
              setTimeout(()=>{
                  this.loadChatText = "";
              },1000)
              var hisdata = data.msg;

              for(var i =0;i < hisdata.length;i++){
                  hisdata[i].showDelete = 0;
                hisdata[i].group = hisdata[i].group_info;
                if(hisdata[i].msgtype == 2){
                  var index = this.chatMsg.findIndex(item => (item.card_game_id == hisdata[i].card_game_id && item.msgtype == 3))
                  hisdata[i].message = this.chatMsg[index].message;
                  hisdata[i].fabiao = 1;
                }
                var index = this.chatMsg.findIndex(item => (item.card_game_id == hisdata[i].card_game_id && (hisdata[i].msgtype == item.msgtype && item.msgtype == 2)))
                var index2 = this.chatMsg.findIndex(item => (item.card_game_id == hisdata[i].card_game_id && (hisdata[i].msgtype == item.msgtype && item.msgtype == 4)))
                  if(index == -1 && index2 == -1){
                    if(hisdata[i].msgtype == 4){                     
                        hisdata[i].winsocre = 0;
                        var __data = JSON.parse(hisdata[i].message).data;
                        for(var w = 0; w < __data.length;w++){
                          if((__data[w].key != -1 && __data[w].win >=0) && hisdata[i].winsocre <= __data[w].win){
                            hisdata[i].winsocre = __data[w].win;
                          }
                        }
                    }
                     if(hisdata[i].msgtype == 6){
                      if( this.daojishimsgHis != hisdata[i].card_game_id+hisdata[i].msgtype){
                        this.daojishimsgHis = hisdata[i].card_game_id+hisdata[i].msgtype;
                        this.chatMsg.unshift(hisdata[i]);
                      }  
                     }else{
                      this.chatMsg.unshift(hisdata[i])
                     }  
                  
                  }else{
                    console.log("发现历史消息重复："+data);
                  }
              }
              // this.chatMsg.unshift(...data.msg.reverse());
              this.chatpage = data.startpage;
              this.goTopBottom("b");
              setTimeout(()=>{
                this.goTopBottom("b");
              },200)
          }
          if(data.groupid == this.currentGroup.groupid && JSON.stringify(data.msg) == '{}'){
              this.loadChatText = "消息加载成功";
              setTimeout(()=>{
                  this.loadChatText = "";
              },1000)
          }
    },
    onRealTimeMsg(data) {
      if (data.groupid == this.currentGroup.groupid) {   
        //1 开局 2倒计时30秒 3停止下注 4开牌 5 取消此局 
        if(data.set >= 1 ||  data.set <= 5){
          this.gameControllerLock = false;
        }   
        if(data.room_status != undefined){
          this.paiControll.roomInfo.room_info.room_status = data.room_status;
          if(data.set == 5 && data.cmd == 3004){//取消 局+1
            this.paiControll.paidian.p1 = "";
            this.paiControll.paidian.p2 = "";
            this.paiControll.paidian.p3 = "";
            this.paiControll.paidian.p4 = "";
            this.paiControll.paidian.p5 = "";
            this.paiControll.paidian.p6 = "";
            this.paiControll.paidian.p7 = "";
            this.paiControll.paidian.p8 = "";
            this.paiControll.paidian.p9 = "";
            this.paiControll.paidian.p10 = "";
            this.kaipaiArr.y=0;
            this.kaipaiArr.zd=0;
            this.kaipaiArr.xd=0;
            this.kaipaiArr.xy=0;
            this.idname='';
            this.resultNumber=0;
            this.resultXyVisible = false;
            //this.paiControll.roomInfo.room_info.ju++;
          }
          if(data.set == 4 && data.room_status == 0){ //开牌
          this.kaipailoading =false;
            this.paiControll.paidian.p1 = "";
            this.paiControll.paidian.p2 = "";
            this.paiControll.paidian.p3 = "";
            this.paiControll.paidian.p4 = "";
            this.paiControll.paidian.p5 = "";
            this.paiControll.paidian.p6 = "";
            this.paiControll.paidian.p7 = "";
            this.paiControll.paidian.p8 = "";
            this.paiControll.paidian.p9 = "";
            this.paiControll.paidian.p10 = "";
            this.kaipaiArr.y=0;
            this.kaipaiArr.zd=0;
            this.kaipaiArr.xd=0;
            this.kaipaiArr.xy=0;
            this.idname='';
            this.resultNumber=0;
            this.resultXyVisible = false;
            //this.paiControll.roomInfo.room_info.ju++;
          }
        }
        if(data.set == 31){//在线用户
        //先排序 
          var D = data.data.sort((a,b)=>{return b.yue - a.yue})
          for (var i = 0; i < D.length; i++) {
            if (D[i].isfalse == 0) {
                var key = D[i];
                D.splice(i, 1);
                D.unshift(key);
            }
          }
          this.userOnlines = D;
          return;
        }
        if (data.error_order == 4) {
          // this.$alert(data.msg, "提示", {
          //   confirmButtonText: "确定",
          //   callback: action => {}
          // });
          return;
        }
        data.message = data.msg;
        data.createtime = data.cur_time;
        data.fromuid = data.uid;
        data.fromuser.name = data.name;
        data.fromuser.head = data.fromuser.admin_headimg || data.fromuser.head;
        data.fromuser = JSON.stringify(data.fromuser);

        if (data.counttime != null && data.counttime != "undefined") {
          this.currentGroup.counttime = data.counttime;
        }
        if (data.room_status != null && data.room_status != "undefined") {
          this.currentGroup.room_status = data.room_status;
        }
        if ($("#chatcontentmain").get(0)) {
          this.goTopBottom(
            "b",
            $("#chatcontentmain").get(0).scrollHeight -
              $("#chatcontentmain").scrollTop() -
              $("#chatcontentmain").height()
          );
        }
        if (data.uuid && this.cacheSendMsg[data.uuid]) {
          var index = this.chatMsg.findIndex(item => item.uuid == data.uuid);
          this.chatMsg[index] = data;
          delete this.cacheSendMsg[data.uuid];
        } else {
          data.showDelete = 0;
          if (data.msgtype == 6) {
            if( this.daojishimsg  !=  this.currentGroup.group.groupid+this.paiControll.roomInfo.room_info.boots_number+this.paiControll.roomInfo.room_info.ju){
              this.chatMsg.push(data);
              this.daojishimsg =  this.currentGroup.group.groupid+this.paiControll.roomInfo.room_info.boots_number+this.paiControll.roomInfo.room_info.ju;
            }
          }else {
            this.chatMsg.push(data);
          }
          if (data.msgtype == 2) {
           // this.keyBoardVis = false;
          }
        }
        this.$forceUpdate();
      }
    },
    onRoomDj(data) {
      if(data.groupid == this.currentGroup.group.groupid){
        if (data.data) {
        this.dj = data.data;
      } else {
        this.dj = {};
      }
      }
    },
    onRoomZy(data) {
      if(data.groupid == this.currentGroup.group.groupid){
        if (data.data) {
        this.zy = data.data;
      } else {
        this.zy = {};
      }
      }
    },
    toBottom(){
          var speed = 1000;//自定义滚动速度
          var windowHeight = parseInt($("#messagepannel").css("height"));//整个页面的高度
          $("#chatcontentmain").animate({"scrollTop": windowHeight}, speed);
      },
    //打开快捷消息窗口
    fastTextConOpen(){
       this.fastTextConVisible = !this.fastTextConVisible;   
       if(this.fastTextConVisible){
        getFastText().then(res => {
                    if (res.code == 200) {
                       this.fastTextConData = res.data.fast_msg                         
                    }else {
                      this.$message({
                        message: res.msg,
                        type: "info"
                      });
                    }
                })
       }        
    },
    //关闭快捷消息窗口
    fastTextConClose(){
      this.fastTextConVisible = false;
    },
    //选中快捷消息
    fastItemChose(data){
          this.$refs.ue.setUEContent(data);
          this.fastTextConVisible = false;
    },
    doSendMessage() {
      this.message = this.$refs.ue.getUEContent();
      this.message = this.escape2Html(this.message);
      this.message = this.message.replace(/<p><br\/>/gm, "");
      for (var i = 0; i < 10; i++) {
        this.message = this.message.replace(/<br\/><br\/>/gm, "<br/>");
        this.message = this.message.replace(/<br><br>/gm, "<br>");
      }
      if (this.message.trim() === "") {
        return;
      }
      var uuid = Math.round(Math.random() * 100000);
      var contend = {
        cmd: 4203,
        msg: this.message,
        groupid: this.currentGroup.group.groupid,
        msgtype: 0,
        error_order: 3,
        uuid: uuid
      };
      this.$store.getters.imClient.send(JSON.stringify(contend));
      this.$nextTick(() => {
        if ($("#chatcontentmain").get(0)) {
          $("#chatcontentmain").scrollTop(
            $("#chatcontentmain").get(0).scrollHeight
          );
        }
      });

      this.message = "";
      this.$refs.ue.clear();
    },
  //选择当前主持的桌子
  choseZhuChiGroup(){
    
      if(sessionStorage.getItem("user")){
          if(JSON.parse(sessionStorage.getItem("user"))['agent_group_id'] >0){
            this.changeGroup(JSON.parse(sessionStorage.getItem("user"))['agent_group_id']);
             this.hasGroupinit = setInterval(() => {
              if (this.$store.getters.groups.length) {
                clearInterval(this.hasGroupinit);
                 this.changeGroup(JSON.parse(sessionStorage.getItem("user"))['agent_group_id']);
              }
            }, 500);
          }else{
             this.hasGroupinit = setInterval(() => {
              if (this.$store.getters.groups.length) {
                clearInterval(this.hasGroupinit);      
                this.changeGroup(this.rooms[0].groupid);
              }
            }, 500);
          };
      }
  },
  },
  mounted() {
    $('body').on('change','#uploadfileAdd',() =>{
      this.uploadfileAdd();
    })
    $('body').on('change','#uploadfileAddgl',() =>{
      this.uploadfileAddgl();
    })
    $('body').on('change','#uploadfileController',() =>{
       this.uploadfileControllerFunc();
    })
    this.autoTableHeight();
            $(window).resize(()=>{
                this.autoTableHeight();
            })
    this.initCONClient();
    this.getRoomListsAll();
    this.choseZhuChiGroup();
    this.get_integral_tongji_way();
    var that = this;
        this.$nextTick(()=>{
            $("#chatcontentmain").scroll(function () {
                if ($("#chatcontentmain").scrollTop() == 0 && !that.isFirstGetHis) {
                    //加载聊天消息
                    that.loadChatText = "加载历史消息...";
                    that.getHistory(that.chatpage)
                }
            });
        });
  },
  components: {
    XGrid,
    WinScroll,
    Uediter
  }
};
</script>
<style lang="scss" scoped>
.page-container {
  font-size: 20px;
  text-align: center;
  color: rgb(192, 204, 218);
}
.roomContent {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 60px;
  .h100 {
    height: 100%;
  }
  .leftcon,
  .rightcon {
    height: 100%;
  }
  .videoContentWrap {
     width: 450px !important;
     height:350px !important;
  }
  .baobiao {
    .dj_baobiao_class{
        float: left;
        width: 45%;
    }
    .jiesuan_baobiao_class{
        float: right;
        width: 55%;
    }
    .baobiao_title {
      width: 99.9%;
      height: 20px;
      line-height: 20px;
      .dj_class {
        box-sizing: border-box;
        background-color: #dbdbdb;
        float: left;
        width: 45%;
        font-size: 12px;
      }
      .zy_class {
        border-left: 1px solid #ccc;
        width: 55%;
        box-sizing: border-box;
        background-color: #dbdbdb;
        float: right;
        font-size: 12px;
      }
    }
    .dj_content_class {
      width: 99%;
      height: 40px;
      .dj_class {
        box-sizing: border-box;
        background-color: #fff;
        width: 100%;
        height: 100%;
        font-size: 12px;
        color: #1e9fff;
        span {
          color: #000;
          font-size: 16px;
        }
        div {
          border-bottom: 1px solid #ccc;
          box-sizing: border-box;
          border-right: 1px solid #ccc;
        }
      }
      .zy {
        width: 55%;
      }
    }
    .jiesuan_content_class {
      width: 99%;
      height: 50px;
      .jiesuan_class {
        box-sizing: border-box;
        background-color: #fff;
        width: 100%;
        height: 100%;
        font-size: 12px;
        color: #1e9fff;
        span {
          color: #000;
          font-size: 16px;
        }
        div {
          border-bottom: 1px solid #ccc;
          box-sizing: border-box;
          border-right: 1px solid #ccc;
        }
      }
    }
  }
  .ludan {
    position: relative;
    overflow: hidden;
    width: 99%;
    background: #fff;
    .title {
      width: 100%;
      height: 20px;
      line-height: 20px;
      background-color: #dbdbdb;
      font-size: 12px;
    }
  }
  .dalu {
    position: relative;
    z-index: 1;
  }
  .silu {
    overflow: hidden;
  }
  .dyz,
  .jyl,
  .xl,
  .sxl {
    float: left;
    width: 50%;
    margin-top: 2px;
    position: relative;
    z-index: 1;
  }
  .zzl {
    float: left;
    width: 50%;
    margin-top: 2px;
    position: relative;
    z-index: 1;
  }
  .xjts {
    float: left;
    width: 50%;
    margin-top: 2px;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }
  .bgtext {
    position: absolute;
    z-index: -1;
    right: 0px;
    bottom: 0px;
    color: #ccc;
    font-size: 12px;
  }
  .ludanHidden {
    z-index: -999;
  }
  .red0 {
    width: 13px;
    height: 13px;
    border: 2px solid red;
    border-radius: 8px;
  }
  .blue0 {
    width: 13px;
    height: 13px;
    border: 2px solid blue;
    border-radius: 8px;
  }
  .red3 {
    width: 13px;
    height: 13px;
    border: 2px solid red;
    background-color: red;
    border-radius: 8px;
  }
  .blue3 {
    width: 13px;
    height: 13px;
    border: 2px solid blue;
    background-color: blue;
    border-radius: 8px;
  }
  .redg {
    width: 3px;
    height: 13px;
    background-color: red;
    transform: translateX(1px) rotate(30deg);
  }
  .blueg {
    width: 3px;
    height: 13px;
    background-color: blue;
    transform: translateX(1px) rotate(30deg);
  }
}
.chat {
  position: absolute;
  top: 0px;
  left: 0;
  width: inherit;
  bottom: 190px;
  background-color: #eeeeee;
  overflow-y: auto;
  .chatItem {
    overflow: hidden;
    margin-bottom: 10px;
    margin-right: 50px;
    .headimage {
      float: left;
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      color: #fff;
      border-radius: 10%;
      margin: 3px 0 0 3px;
      border-radius: 5px;
      overflow: hidden;
    }
    .context {
      margin-left: 50px;
      .nameandtime {
        height: 20px;
        line-height: 20px;
        font-size: 15px;
        font-family: 微软雅黑;
        color: #0b7;
      }
      .text {
        background-color: #fff;
        float: left;
        margin-top: 5px;
        padding: 10px;
        font-size: 16px;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          left: -10px;
          top: 13px;
          width: 0;
          height: 0;
          border-style: solid dashed dashed;
          border-color: red transparent transparent;
          overflow: hidden;
          border-width: 10px;     
        }
      }

      .text_msgtype0_class {
        background-color: #fff;
        float: left;
        margin-top: 5px;
        padding: 10px;
        font-size: 16px;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          left: -10px;
          top: 13px;
          width: 0;
          height: 0;
          border-style: solid dashed dashed;
          border-color: #fff transparent transparent;
          overflow: hidden;
          border-width: 10px;     
        }
      }
    }
  }
  .chatItemright {
    margin-right: 0px;
    margin-left: 50px;
    .headimage {
      float: right;
      margin: 3px 3px 0px 0px;
    }
    .context {
      margin-left: 0px;
      margin-right: 50px;
      .nameandtime {
        text-align: right;
      }
      .text {
        float: right;
        &:before {
          display: none;
        }
        &:after {
          content: "";
          position: absolute;
          right: -10px;
          top: 13px;
          width: 0;
          height: 0;
          border-style: solid dashed dashed;
          border-color: #fff transparent transparent;
          overflow: hidden;
          border-width: 10px;
        }
      }
    }
  }
}
.resultInfo{
  font-size: 18px;
  font-weight: bold;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 50%;
  cursor: pointer;
}
.curJuInfo{
  font-size: 18px;
  font-weight: bold;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 12%;
  cursor: pointer;
  color:blanchedalmond;
}
.readerPaiClass{
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 40%;
  cursor: pointer;
  color:red;
}
.resetclass{
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 80%;
  cursor: pointer;
  color:red;
}
.odds_xr {
  font-size: 12px;
  color: red;
}
.odds_s {
  font-size: 12px;
  color: rgba(252, 0, 6, 6);
}
.odds_k {
  font-size: 12px;
  color: #000;
}
.odds_x,
.odds_xd {
  font-size: 12px;
  color: rgba(18, 0, 255, 6);
}
.odds_z,
.odds_zd {
  font-size: 12px;
  color: rgba(252, 0, 6, 6);
}
.odds_h {
  font-size: 12px;
  color: rgba(15, 111, 45, 6);
}
.odds_xy {
  font-size: 12px;
  color: rgba(251, 0, 255, 6);
}
.odds_table {
  width: 100%;
  min-height: 12px;
  line-height: 12px;
  text-align: center;
  border-collapse: collapse;
  font-size: 12px;
  .odds_title {
    font-size: small;
    color: #000;
    text-align: center;
    font-weight: bold;
    border: none;
  }
  tr {
    background-color: rgba(255, 255, 255, 0.5);
  }
  th {
    box-sizing: content-box;
    padding: 5px;
    border: 1px solid rgba(179, 179, 179, 0.6);
    text-align: center;
    font-weight: normal;
  }
  td {
    box-sizing: content-box;
    padding: 5px;
    border: 1px solid rgba(179, 179, 179, 0.6);
    text-align: center;
    font-weight: normal;
  }
  .zj {
    background-color: rgba(48, 97, 94, 6);
    color: #fff;
    td {
      color: #fff;
    }
  }
}
.inputArea {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: inherit;
  height: 150px;
  background-color: #fff;
  z-index: 2;
  border-left: 2px solid #000;
  border-right: 2px solid #000;
}
.inputBtnArea {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: inherit;
  height: 40px;
  background-color: #fff;
  z-index: 2;
  border-left: 2px solid #000;
  border-top: 1px solid #ccc;
  border-bottom: 2px solid #000;
  border-right: 2px solid #000;
}
#toBottom{
    position: absolute;
    bottom: 200px;
    left: 0;
    opacity: .8;
    border-radius: 5px;
    font-size: 12px;
    background: #444;
    cursor: pointer;
    text-align: center;
    padding-top: 5px;
    width: 20px;
    height: 35px;
    z-index:2;
    img{
      margin-top: 5px;
    }
}
.loadChatText{
    position: absolute;
  top: 0px;
  left: 0;
  width: inherit;
    height: 14px;
    text-align: center;
    z-index: 2;
    font-size: 12px;
    background: rgba(0,0,0,0.4);
    color: #fff;
    line-height: 14px;
  }
  .tableCon{
    position: absolute;
    top: 0px;
    left: 66.6%;
    width: inherit;
    bottom:50px;
    overflow:auto;
    background-color: #fff;
    .tableStyleleft{
      tr td{
        text-align: center;
      }
    width: 100%;
  }
  }
  .upfendiv{
    position: absolute;
    left: 66.6%;
    width: inherit;
    height:50px;
    bottom:0px;
    background-color: #fff;
    border-top:1px solid #ccc;
  }
  .upludandiv {
    height: 110px;
    bottom: 51px;
    position: absolute;
    left: 66.6%;
    width: inherit;
    background-color: #fff;
    border-top:1px solid #ccc;
    .btn {
      line-height: 40px;
      margin-top: 10px;
      cursor: pointer;
      border-radius: 20px;
      float: left;
      width: 40px;
      height: 40px;
      color: #555;
      border: 1px solid #555;
      margin-right: 13px;
      text-align: center;
      font-size: 14px;
      background-color: #fff;
      font-weight: 700;
   }
   .btnZ{
     color: #dd0d0d;
   }
   .btnX {
     color: blue;
   }
   .btnH {
    color: green;
   }
   .btnXy {
    color: #fb00ff;
   }
  .currentZ {
    background-color: #e6cc84;
    color: #dd0d0d;
    border: 1px solid #f7d332;
  }
   .currentZ:hover {
    background-color: #e6cc84;
    color: #dd0d0d;
    border: 1px solid #f7d332;
  }
  .currentX {
      background-color: #e6cc84;
      color: blue;
      border: 1px solid #f7d332;
  }
  .currentH {
    background-color: #e6cc84;
    color: green;
    border: 1px solid #f7d332;
  }
  .currentXy {
    background-color: #e6cc84;
    color: #fb00ff;
    border: 1px solid #f7d332;
  }
  .btnZ:hover {
    background-color: #f0ecec;
  }
  .btnX:hover {
    background-color: #f0ecec;
  }
  .btnH:hover {
    background-color: #f0ecec;
  }
  .btnXy:hover {
    background-color: #f0ecec;
  }
  .xiajuTips{
    width: 50%;
    float: left;
    position: relative;
    border: 1px solid rgb(204, 204, 204); 
    background-color: rgb(255, 255, 255);
    box-sizing: border-box; 
    height: 59.5px;
    margin-top: 2px;
  }

  }
  
  .chatitemwrap{
    padding:2px 0px;
    &:hover{
      background-color: #ccc;
    }
  }

  .zjkj {
    left: 0;
    height: 60px;
    bottom: 40px;
    position: absolute;
   // border-top: 1px solid #ccc;
    line-height: 40px;
    .btn {
      line-height: 40px;
      margin-top: 10px;
      cursor: pointer;
      border-radius: 20px;
      float: left;
      width: 40px;
      height: 40px;
      color: #555;
      border: 1px solid #555;
      margin-right: 13px;
      text-align: center;
      font-size: 14px;
      background-color: #fff;
      font-weight: 700;
   }
   .btnZ{
     color: #dd0d0d;
   }
   .btnX {
     color: blue;
   }
   .btnH {
    color: green;
   }
   .btnXy {
    color: #fb00ff;
   }
  .currentZ {
    background-color: #e6cc84;
    color: #dd0d0d;
    border: 1px solid #f7d332;
  }
   .currentZ:hover {
    background-color: #e6cc84;
    color: #dd0d0d;
    border: 1px solid #f7d332;
  }
  .currentX {
      background-color: #e6cc84;
      color: blue;
      border: 1px solid #f7d332;
  }
  .currentH {
    background-color: #e6cc84;
    color: green;
    border: 1px solid #f7d332;
  }
  .currentXy {
    background-color: #e6cc84;
    color: #fb00ff;
    border: 1px solid #f7d332;
  }
  .btnZ:hover {
    background-color: #f0ecec;
  }
  .btnX:hover {
    background-color: #f0ecec;
  }
  .btnH:hover {
    background-color: #f0ecec;
  }
  .btnXy:hover {
    background-color: #f0ecec;
  }
  .xiajuTips{
    width: 50%;
    float: left;
    position: relative;
    border: 1px solid rgb(204, 204, 204); 
    background-color: rgb(255, 255, 255);
    box-sizing: border-box; 
    height: 59.5px;
    margin-top: 2px;
  }
}
.fast_text {
    float: left;
    margin-left: 10px;
    border: 1px solid #ccc;
    padding: 3px 10px;
    margin-top: 5px;
    cursor: pointer;
}
.fast_text_con {
    position: absolute;
    bottom: 40px;
    left: 0;
    opacity: .9;
    border-radius: 5px;
    font-size: 12px;
    background: #fff;
    width: 250px;
    height: 300px;
    z-index: 2;
    color: #000;
    text-align: left;
    padding: 5px;
    z-index: 3;
}
.fast_text_con_tit {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    background-color: #777;
    color: #fff;
    padding: 0 5px;
    span {
      float: right;
      font-size: 18px;
      cursor: pointer;
    }
}
.fast_text_con_con {
    position: absolute;
    top: 35px;
    left: 5px;
    right: 5px;
    bottom: 0;
    overflow: auto;
}
.fast_item {
    border-bottom: 1px solid #ccc;
    font-size: 16px;
    padding: 5px;
    cursor: pointer;
}

.shipingclass{
  position: relative;
  margin-top: 5px;
  margin-left: -135px;
  text-align: center;
  height:28px;
  width: 50px;
  cursor:pointer;
}
.nextXueJu{
  position: relative;
  text-align: center;
  height:28px;
  width: 70px;
  cursor:pointer;
    float:right;
   z-index: 100;
   top:-35px;
   right:5px;
}
.updateXueJu{
  z-index: 100;
  position: relative;
  text-align: center;
  height:28px;
  width: 70px;
  cursor:pointer;
  float:right;
  top:-35px;
  right:20px;
}
.kaiPaiContentClass{
    margin-top:10px;
   .kaiPaiXianClass{
      margin-top:10px;
      margin-bottom:10px;
      text-align: center;
      font-size: 16px;
      color: blue;
      font-weight: bold;
      span{
        color:green;
      }
   }
    .kaiPaiZhuangClass{
      margin-top:10px;
      margin-bottom:10px;
      text-align: center;
      font-size: 16px;
      color: red;
      font-weight: bold;
      span{
        color:green;
      }
   }
}

</style>
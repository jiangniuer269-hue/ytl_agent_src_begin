<template>
	<el-row class="container showWindowsLoading" v-loading="showWindowsLoading"
	element-loading-text="正在处理，请稍等"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
	>
		<el-col :span="24" class="header">
			<el-col @click.native="gotoboard" :span="8" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			
			<el-col :span="6" >
				<div class="teamTile" >
					{{ teamTitle }}<span v-show="this.use_end_time_notify_show">(软件使用截至日期：{{ useEndTime }})</span>
				</div>
			</el-col>

			<el-col :span="14" class="userinfo">		
				<span style="font-size:16px;font-weight: 500;" >当前登录账号：{{sysUserAccount}}</span>  &nbsp;&nbsp;
				<span style="cursor:pointer;font-size:16px;font-weight: 500;color: #009688;" @click="myInfo(1)">个人信息</span>  &nbsp;&nbsp;
				<span style="cursor:pointer;font-size:16px;font-weight: 500;color: #E6A23C;" @click="logout">退出登录</span>  &nbsp;&nbsp;

			</el-col>
		</el-col>
		 <!--详情弹框-->
        <el-dialog  title="个人信息" :visible.sync="myInfoVisible" :close-on-click-modal="false" width="1000px">
            <!--table-->
			<div class="el-table el-table--fit el-table--border  el-table--enable-row-transition" style="margin-top:20px;">
          <el-form size="mini" >
                    <table  cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                        <tr class="el-table__row">
                            <td width="200px">
                                <el-form-item style="margin:0px 5px;" label="代理名称:">
                                    {{agentsInfo.name}}
                                </el-form-item>
                            </td>
                            <td  width="200px" colspan="2">
                                <el-form-item style="margin:0px 5px;" label="登录账号:">
                                    {{agentsInfo.account}}
                                </el-form-item>
                            </td>
                        </tr>
	
						<tr class="el-table__row">
							<td  width="200px">
								<el-form-item style="margin:0px 5px;font-size: 18px;font-weight: 500;" label-width="100" label="微信扫码登录二维码:"></el-form-item>
							</td>
							<td colspan="3">
								<QRCanvas class="qrcanvas"  id="qrcode1" :options="qrcode1"/>
							</td>
							<td  width="200px">
								<el-form-item style="margin:0px 5px;font-size: 18px;font-weight: 500;" label-width="100" label="清缓存二维码:"></el-form-item>
							</td>
							<td colspan="3">
								<QRCanvas class="qrcanvas"  id="qrcode3" :options="qrcode3"/>
							</td>
						</tr>

						<tr class="el-table__row">
							<td  width="200px">
								<el-form-item  class="qrcanvas"  label-width="100" label="账号密码登录二维码:"></el-form-item>
							</td>
							<td colspan="3">
								<QRCanvas style="margin-left:10px;margin-top:10px;width: 200px;height: 200px;" id="qrcode2" :options="qrcode2"/>
							</td>
						</tr>

                    </table>
          </el-form>
                </div>
            <!--列表-->       
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="myInfoVisible = false">关闭</el-button>
            </div>
        </el-dialog>
		<el-col v-if="settimeout200" :span="24" class="main">
			<el-aside  :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<!-- <div v-if="agent_type == 3 || agent_type==4" class="databoard" @click="gotoboard" :class="{'current':$route.name == '数据面板'}">数据面板</div> -->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!Auth(item.hidden)">
					<!--<el-submenu class="el-submenu" :index="index+''" v-if="!item.leaf">-->
							<!-- <template  slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>-->
							<el-menu-item   v-for="child in item.children" :index="child.path" :key="child.path" v-if="!Auth(child.hidden)">
								<span @click="addTab(child.name,child.path)">{{child.name}}</span>
							</el-menu-item>
						<!--</el-submenu>-->
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!Auth(item.hidden)" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="child in item.children" v-if="!Auth(child.hidden)" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 1px;height: 40px;line-height: 40px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</el-aside>
			  <el-dialog class="imchat" v-if="chatVisible" title="聊天" :visible.sync="chatVisible" :close-on-click-modal="false" width="800px">
                <el-tabs v-model="activeName" @tab-click="handleClickTab">
                    <el-tab-pane style="height:500px;" :key="index" v-for="(item,index) in imInfo" :label="item.row.name" :name="item.row.playid">
                        <iframe :src="item.src" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
                    </el-tab-pane>
                </el-tabs>
         </el-dialog>


			<section class="content-container">
				<div class="grid-content bg-purple-light" style="height:100%;position:relative;">
				<el-col :span="24" class="breadcrumb-container" >
					<el-tabs  v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="handleClick">
						<el-tab-pane 
							v-for="item in editableTabs"
							:key="item.name"
							:label="item.title"
							:name="item.name"
						>
						<a>{{item.path}}</a>	
						</el-tab-pane>
					</el-tabs>
				</el-col>
					<el-col :span="24" class="content-wrapper" style="position:absolute;top:40px;bottom:0px;">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import $ from 'jquery'
    window.$ = window.jQuery = $
	import  moment from 'moment'
	import util from '../common/js/util'
	import { getAgentsInfo,getRoomLists } from '../api/api';
	import { IMClient } from '@/client/im_client'
	import { QRCanvas } from 'qrcanvas-vue';
	export default {
		components: {
			// VueQr
			QRCanvas
		},
		data() {
			return {
				use_end_time_notify_show:false,
				imInfo:{},
				activeName:"",
                chatVisible:false,
				showWindowsLoading:false,
				auth_type:util.getSessionItem('user','auth_type'),
				agent_type:util.getSessionItem('user','agent_type'),
				sysName:'代理后台',
				collapsed:false,
				myInfoVisible:false,
				yufen:util.getSessionItem('user','agent_score'),
				agentsInfo:{},
				listLoading:false,
				sysUserName: '',
				sysUserAccount: '',
				sysUserAvatar: '',
				teamTitle: '',
				useEndTime : '',
				qrcode1:'',
				qrcode2:'',
				qrcode3:'',
				settimeout200:false,
				videoroad:0,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				editableTabsValue: '',
				editableTabsExist:[],
				editableTabs: [],
				tabIndex: 0
			
			}
		},
		computed:{
			
		},
		watch:{
		    "collapsed":function () {
                if(!this.collapsed){
                    $(".el-menu-vertical-demo").width("100%")
                }
            },

		},
		methods: {
			//增加菜单栏标签
			addTab(targetName,path) {
				//console.log(this.editableTabsExist);
				//console.log(this.editableTabs);
               if(this.editableTabsExist.indexOf(targetName) == -1){

					this.editableTabsExist.push(targetName);
					//let newTabName = ++this.tabIndex + '';
					//console.log('newTabName',targetName);
					this.editableTabs.push({
						title: targetName,
						name: targetName,
						content: targetName,
						path:path
					});		
					this.editableTabsValue = targetName;
			   }else{
				    this.editableTabsValue = targetName;
			   };
			
			},
			//移除菜单栏标签
			removeTab(targetName) {
				let tabs = this.editableTabs;
				let activeName = this.editableTabsValue;
				if (activeName === targetName) {
				tabs.forEach((tab, index) => {
					if (tab.name === targetName) {
					let nextTab = tabs[index + 1] || tabs[index - 1];
					if (nextTab) {
						activeName = nextTab.name;
					}
					}
				});
				}
				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.name !== targetName);
     		 },
		    handleClick(tab,event){
				//console.log(this.editableTabs[tab.index].path);
				this.$router.push({path:this.editableTabs[tab.index].path});
				
			},		
			  getIframeSrc(playid){
                return this.imInfo[playid].imdomain+"?"+Object.keys(this.imInfo[playid]).map((key)=> {
                            // body...
                            return encodeURIComponent(key) + "=" + encodeURIComponent(this.imInfo[playid][key]);
                        }).join("&")+'/#/agm_messages/messageChat/'+this.imInfo[playid].channelId
            },
			gotoboard(){
				// if(agent_type != 3 && agent_type!=4){
				// 	return;
				// }
				this.$router.push({ path: '/board' });
			},
			Auth(tp){
				if(tp=="yard" || tp=="settlement-log" || tp == "ziying-log"|| tp=='room-controller' || tp == "room-lists" ||  tp == 'agent-share' || tp == 'agent-share' || tp == 'employee-lists' ||tp == 'operation-log' ||tp == 'xm-log' ||tp == 'game-lists' ||tp == 'user-score-log') {
					return !(JSON.parse(sessionStorage.getItem("user")) && (JSON.parse(sessionStorage.getItem("user"))['agent_type'] == 2 || JSON.parse(sessionStorage.getItem("user"))['agent_type'] == 3))
				}if(tp == 'zhuguan'){
					return !(JSON.parse(sessionStorage.getItem("user")  && JSON.parse(sessionStorage.getItem("user"))['agent_type'] == 2))
				}else if(tp =='hongbao'){
					return JSON.parse(sessionStorage.getItem("user")) && (JSON.parse(sessionStorage.getItem("user"))['agent_type'] != 3 || JSON.parse(sessionStorage.getItem("user"))['hashb'] == 0)
				}
				else if(tp =='hongbaohis'){
					return JSON.parse(sessionStorage.getItem("user")) && JSON.parse(sessionStorage.getItem("user"))['hashb'] == 0
				}
				else if(tp == 'sess'){
					return true;
				}else{
					return false;
				}
			},
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			myInfo(flag){
				flag == 1 && (this.myInfoVisible = true);
				let para = {
                    agents_id:util.getSessionItem('user','agents_id'),
                };
                this.listLoading = true;
                //NProgress.start();
                getAgentsInfo(para).then((res) => {
                    if(res.code == 200){
						this.agentsInfo = res.data;
						/*this.videoroad = res.videoroad;
						util.setSessionItem('user',['agent_score',res.data.agent_score])
						util.setSessionItem('user',['logourl',res.logourl])
						setTimeout(()=>{
							this.$root.Event.$emit("onAgentScoreChange")
						},1000)*/
						//二维码
						var that = this;
						var origin = "http://"+res.data.qrdomain;
						var qrcode1_url = origin+"/v1/login/wx_login_quick?r="+moment().millisecond()+"&clearUser=0&agent_id="+ util.getSessionItem('user','agents_id');
						var qrcode2_url = origin;
						var qrcode3_url = origin+"/v1/login/wx_login_quick?r="+moment().millisecond()+"&clearUser=1&agent_id="+ util.getSessionItem('user','agents_id');
						that.qrcode1 = {
							data: qrcode1_url,
							cellSize: 6,
							size: 600,
						}						
						that.qrcode2 = {
							data: qrcode2_url,
							cellSize: 6,
							size: 600,
						}		
					    that.qrcode3 = {
							data: qrcode3_url,
							cellSize: 6,
							size: 600,
						}						
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
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.clear();
					localStorage.clear();
					window.location.href = "/";
				}).catch(() => {

				});


			},
		
			showMenu(i,status){
				if(status){
					$(".el-aside").css({"overflow":"initial"})
				}else{
					$(".el-aside").css({"overflow":"hidden"})
				}
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			initIMClient() {
				console.log("connecting...");
				let wsUrl = util.getSessionItem("user","wsurl");
				// if(window.location.hostname == "localhost"){
				// 	wsUrl = "ws://192.168.31.116:9527";
				// }else{
				// 	wsUrl = localStorage.getItem("wsurl");
				// }
				const imClient = new IMClient(wsUrl, 1000)
				this.$store.dispatch('setIMClient', imClient)

				imClient.connect(() => {
					imClient.send(JSON.stringify({ cmd: 11,
						ip: util.getSessionItem("user","ip"),
						ip_info: util.getSessionItem("user","ip_info"),
						time: localStorage.getItem("mdtime"),
						user_type: 2,
						token: util.getSessionItem("user","token"),
						username: util.getSessionItem('user','account')}));

					if(this.$route.name == "日红包群"){
						this.$store.getters.imClient.send(//获取红包群
							JSON.stringify({
							cmd: 4602,
							type:1,
							})
						);	
					}else if(this.$route.name == "月红包群"){
						this.$store.getters.imClient.send(//获取红包群
							JSON.stringify({
							cmd: 4602,
							type:2,
							})
						);	
					}

					 
				});
				imClient.bindUserJY(this.onUserJY)
				imClient.bindLoginSuccess(this.onLoginSuccess)
				imClient.bindUserOnline(this.onUserOnline)
				imClient.bindAUserOnline(this.onAUserOnline)
				imClient.bindAUserOffline(this.onAUserOffline)
				imClient.bindReconnectSuccessed(this.onReconnected)
				imClient.bindOtherLogin(this.onOtherLogin)
				imClient.bindAlert(this.onAlert)
				imClient.handleDeleteAg(this.onDeleteAg)
				
			},
			onDeleteAg(data){
				if(data.update_aid == util.getSessionItem('user','agents_id')){
					sessionStorage.setItem('setOtherLoginFlag',1);
					localStorage.clear()
					sessionStorage.clear()
					this.$alert('您的账户已被强制下线！', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							localStorage.clear()
							sessionStorage.clear()
							window.location.href = "/"
						}
					})
				}
			},
			onAlert(data){
				this.$alert(data.msg, data.groupid+':提示', {
					confirmButtonText: '确定',
					callback: action => {
						
					}
				})
			},
			onOtherLogin(data){
				sessionStorage.setItem('setOtherLoginFlag',1);
				localStorage.clear()
				sessionStorage.clear()
				this.$alert('您的账户已在其它地方登录，如非本人操作，请及时修改密码', '提示', {
					confirmButtonText: '确定',
					callback: action => {
						localStorage.clear()
						sessionStorage.clear()
						window.location.href = "/"
					}
				})
			},
			onReconnected() {
				console.log('重连成功！！！')
				this.$store.getters.imClient.send(JSON.stringify({ cmd: 11,
						time: localStorage.getItem("mdtime"),
						ip: util.getSessionItem("user","ip"),
						ip_info: util.getSessionItem("user","ip_info"),
						user_type: 2,
						token: util.getSessionItem("user","token"),
						username: util.getSessionItem('user','account')}));
			},
			onUserOnline(data){
				this.$store.dispatch('setUserOnline', data.data.users);
				this.$store.dispatch('setUserOnlineTotal', {
					odds_sum:data.data.odds_sum,
					online_count:data.data.online_count,
					score_sum:data.data.score_sum
				});
			},
			onAUserOnline(data){
				var flag = true;
				var onlineUser = this.$store.getters.userOnline;
				for(var i = 0 ; i < onlineUser.length;i++){
					if(onlineUser[i].uid == data.users[0].uid){
						onlineUser[i].boots_number =  data.users[0].boots_number
						onlineUser[i].card_game_id =  data.users[0].card_game_id
						onlineUser[i].cur_online =  data.users[0].cur_online
						onlineUser[i].ip =  data.users[0].ip
						onlineUser[i].ip_address =  data.users[0].ip_address
						onlineUser[i].ju= data.users[0].ju
						onlineUser[i].last_odds_sum= data.users[0].last_odds_sum
						onlineUser[i].last_odds_text= data.users[0].last_odds_text
						onlineUser[i].last_odds_time= data.users[0].last_odds_time
						onlineUser[i].name= data.users[0].name
						onlineUser[i].relationship= data.users[0].relationship
						onlineUser[i].room_id= data.users[0].room_id
						onlineUser[i].score= data.users[0].score
						flag = false;
					}
				}
				if(flag){
					onlineUser.unshift(data.users[0])
				}
				this.$store.dispatch('setUserOnline', onlineUser);
			},
			onAUserOffline(data){
				var onlineUser = this.$store.getters.userOnline;
				for(var i = 0 ; i < onlineUser.length;i++){
					if(onlineUser[i].uid == data.uid){
						onlineUser.splice(i, 1)
					}
				}
				this.$store.dispatch('setUserOnline', onlineUser);
			},
			onLoginSuccess(data){
				this.$store.getters.imClient.send(JSON.stringify({ cmd: 4007}));
				//console.log('房间信息',data.group);	
				//保存房间信息
				this.$store.dispatch('setGroups', data.group);
			},
			onUserJY(data){

			},
			use_end_time_notify() {
				localStorage.setItem('end_time_near',0);
				this.$confirm('您的软件即将到期，如还需使用，请及时续费，以免停服影响运营。', '提示', {
						confirmButtonText: '关闭',
						type: 'warning',
						center: true,
						showCancelButton:false,
			    });
				
			},
		},
		mounted() {
			var userinfo =  sessionStorage.getItem('user');
			if (userinfo) {
				userinfo = JSON.parse(userinfo);
				if(userinfo.agent_type == 2 || userinfo.agent_type == 3){//后台账户
				    this.initIMClient();
					this.use_end_time_notify_show = true;
					if(localStorage.getItem('end_time_near') > 0 ){
					   this.use_end_time_notify();
					}
				}
			}else{
				this.logout();
			}

           // console.log('use_end_time_notify_show',this.use_end_time_notify_show);		
			//ws初始化
		
	        this.addTab(this.$route.name,this.$route.path);
			this.myInfo(0);
			this.$root.Event.$on("showWindowsLoading",()=>{
				this.showWindowsLoading = true;
			})
			this.$root.Event.$on("hideWindowsLoading",()=>{
				this.showWindowsLoading = false;
			})
		/*
			this.$root.Event.$on("onAgentScoreChange",()=>{
				this.yufen = util.getSessionItem('user','agent_score');
			})*/
			setTimeout(()=>{
				this.settimeout200 = true;
				this.$forceUpdate();
			},200)
			
			this.$root.Event.$on("showChat",(imInfo,activeName)=>{
				this.imInfo = imInfo;
				this.activeName = activeName;
				this.chatVisible = true; 
			});

			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
				this.sysUserAccount = user.account || '';
				this.sysUserAvatar = user.avatar || '';
				this.teamTitle = user.team_title || '';
				this.useEndTime = user.use_end_time || '';
			}

		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.videoroad{
		padding: 2px 10px;
    	cursor: pointer;
	}
	.currentvideoroad{
		background: #ff6d00;
	}
	.databoard{
		height:40px;
		background-color: #4a5054;
		box-sizing: border-box;
		cursor: pointer;
		line-height: 40px;
		padding-left: 22px;
		font-size: 14px;
		color:#fff;
		&:hover{
			background-color: #4C5C6B;
		}
	}
	.databoard.current{
		background-color: #4C5C6B;
	}
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 40px;
			line-height: 40px;
			//background: $color-primary;
			//color:$font-color;
			border-bottom:1px solid #ccc;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				// width: 300px;
				.userinfo-inner {
					cursor: pointer;
					color:$font-color;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				background: $color-primary;
				color: $font-color;
				height:60px;
				font-size: 22px;
				padding-left:5px;
				padding-right:5px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				cursor: pointer;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:$font-color;
				}
			}
			.logo-width{
				width:110px;
			}
			.logo-collapse-width{
				width:60px
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 40px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 180px;
				width: 180px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
			
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 110px;
				width: 110px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: auto;
				//padding: 10px 20px 20px 20px;
				background-color: $content-container;
				.breadcrumb-container {				
					height: 44px;
					background-color: $font-color;
					line-height: 40px;
					box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
					margin-bottom: 10px;
					color: $font-color;
					.title {
						width: 200px;
						float: left;
						color: $font-color;
					}
					.breadcrumb-inner {
						float: right;
						color: $font-color;
					}
				}
				.content-wrapper {
					background-color: $content-container;
					box-sizing: border-box;
				}
			}
		}
	}
	.teamTile{
		position: absolute;
		left: 120px;
		font-size: 16px;
		color: rgb(255, 109, 0);
		font-weight: bold;
	}
	.qrcanvas{
		margin-left:10px;
		margin-top:10px;
		width: 200px;
		height: 200px;
	}

</style>
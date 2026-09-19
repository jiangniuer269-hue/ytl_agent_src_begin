import axios from 'axios';
import qs from 'qs'

// 添加响应拦截器
axios.interceptors.request.use(
	config => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        if (!user && (window.location.hash != '#/login' && window.location.hash != '#/employee-login')) {
            window.location.href = "/";
        }
		if (config.method === 'post') {
			config.data = qs.stringify(config.data)
		}
		return config
	},
	error => {
		console.log(error)
		Promise.reject(error)
	}
)

// http response 响应拦截器
axios.interceptors.response.use(response => {
    if(response.status == 400 || response.data.code == 400){
        sessionStorage.clear();
        window.location.href = "/";
    }
    return response;
},error => {
    if (error.response) {
       switch (error.response.status) {
           // 返回401，清除token信息并跳转到登录页面
           case 400:
               sessionStorage.clear();
               window.location.href = "/";
       }
       // 返回接口返回的错误信息
       return Promise.reject(error.response.data);
   }
});

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

//let base = 'http://47.86.246.4:7192/v1/';
let base = 'v1';
//取消此局回调验证
export const cancelGame = params => { return axios.post(`${base}/game/cancelGame`, params).then(res => res.data); };

export const requestLogin = params => { return axios.post(`${base}/login/doLogin`, params).then(res => res.data); };
export const requestEmployeeLogin = params => { return axios.post(`${base}/login/doEmpLogin`, params).then(res => res.data); };
export const requestisEmp3 = params => { return axios.post(`${base}/login/isEmp3`, params).then(res => res.data); };
export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };
export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };
//会员
export const getUserListPage = params => { return axios.post(`${base}/user/list`, params ).then(res => res.data); };
export const addUser = params => { return axios.post(`${base}/do/user/add`, params ).then(res => res.data); };
export const editUser = params => { return axios.post(`${base}/user/updateUserInfo`, params).then(res => res.data);};
export const handleForbiddenUser = params => { return axios.post(`${base}/user/forbidden`, params).then(res => res.data);};
export const handleDeleteUser = params => { return axios.post(`${base}/user/delete`, params).then(res => res.data);};
export const handleSayUser = params => { return axios.post(`${base}/user/say`, params).then(res => res.data);; };
export const getUserInfo = params => { return axios.post(`${base}/user/getUserInfo`, params).then(res => res.data); };
export const handleUpdateZc = params => { return axios.post(`${base}/user/updateZc`, params).then(res => res.data); };//批量修改占成
export const handleUpdateInteRate = params => { return axios.post(`${base}/user/updateInteRate`, params).then(res => res.data); };//批量修改积分比例

export const getLiushuiPage = params => { return axios.post(`${base}/score/userScoreLog`, params ).then(res => res.data); };
//下注

export const getBetsListPage = params => { return axios.post(`${base}/bet/list`, params ).then(res => res.data); };

//牌局
export const getGamesListPage = params => { return axios.post(`${base}/game/list`, params ).then(res => res.data); };
export const getGamesChat = params => { return axios.post(`${base}/game/chat`, params ).then(res => res.data); };

//余分流水
export const getScoreListPage = params => { return axios.post(`${base}/score/list`, params ).then(res => res.data); };

//上下分
export const getFenListPage = params => { return axios.post(`${base}/fen/list`, params ).then(res => res.data); };
export const upDowFen = params => { return axios.post(`${base}/user/upDowFen`, params ).then(res => res.data); };
export const upDowFenagent = params => { return axios.post(`${base}/agents/upDowFenUser`, params ).then(res => res.data); };
export const getUdfenPage = params => { return axios.post(`${base}/user/updowFenLog`, params ).then(res => res.data); };
export const getUdfenPageAgent = params => { return axios.post(`${base}/agents/userupdowFenLog`, params ).then(res => res.data); };

//代理
export const getAgentLists = params => { return axios.post(`${base}/agents/list`, params).then(res => res.data); };
export const getAgentUserLists = params => { return axios.post(`${base}/agents/user`, params).then(res => res.data); };
export const getEmpAgentLists = params => { return axios.post(`${base}/agents/emplist`, params).then(res => res.data); };
export const addAgents = params => { return axios.post(`${base}/do/agents/add`, params).then(res => res.data); };
export const addEmpAgents = params => { return axios.post(`${base}/do/agents/addemp`, params).then(res => res.data); };
export const editAgents = params => { return axios.post(`${base}/agents/updateAgentInfo`, params).then(res => res.data); };
export const removeAgent = params => { return axios.post(`${base}/do/agents/delete`, params).then(res => res.data); };
export const changeAgentStatus = params => { return axios.post(`${base}/do/agents/stop`, params).then(res => res.data); };
export const upDowFenAgent = params => { return axios.post(`${base}/agents/upDowFen`, params).then(res => res.data); };
export const groupupDowFenAgent = params => { return axios.post(`${base}/agents/groupupDowFen`, params).then(res => res.data); };
export const getUdfenAgentPage = params => { return axios.post(`${base}/score/agentScoreLog`, params).then(res => res.data); };

//代理占成
export const getShareListPage = params => { return axios.post(`${base}/bet/share`, params).then(res => res.data); };

//操作记录
export const getLogListPage = params => { return axios.post(`${base}/system/systemLog`, params).then(res => res.data); };
export const doClearSystemLog = params => { return axios.post(`${base}/system/clearSystemLog`, params).then(res => res.data); };

//额度调整记录
export const getScoreLogListPage = params => { return axios.post(`${base}/agents/scorelog`, params).then(res => res.data); };
export const getScoreLogListPageAgents = params => { return axios.post(`${base}/agents/agentsscorelog`, params).then(res => res.data); };

//会员输赢
export const getWinsListPage = params => { return axios.post(`${base}/user/userLoseWin`, params).then(res => res.data); };

//代理输赢 jifen
export const getDLWinsListPage = params => { return axios.post(`${base}/agents/agentsLoseWin`, params).then(res => res.data); };
export const getDLWinsUserListPage = params => { return axios.post(`${base}/agents/userLoseWin`, params).then(res => res.data); };
export const getDLIntegralListPage = params => { return axios.post(`${base}/agents/profit`, params).then(res => res.data); };
export const getAgentsLiushuiPage = params => { return axios.post(`${base}/agents/profitDetail`, params).then(res => res.data); };


//庄退水
export const getTsListPage = params => { return axios.post(`${base}/agents/agentzts`, params).then(res => res.data); };
export const getTsDetailListPage = params => { return axios.post(`${base}/game/zts_detail`, params).then(res => res.data); };

//对冲
export const getDanXmListPage = params => { return axios.post(`${base}/bet/danXm`, params).then(res => res.data); };
export const getDanXmDataListPage = params => { return axios.post(`${base}/bet/danXmData`, params).then(res => res.data); };


//会员上线下
export const getOnlineListPage = params => { return axios.post(`${base}/user/logininfo`, params).then(res => res.data); };
export const doClearLoginLog = params => { return axios.post(`${base}/user/clearLoginLog`, params).then(res => res.data); };


//查询代理,会员余分信息
export const getUserUpdowinfo = params => { return axios.post(`${base}/user/updowinfo`, params).then(res => res.data); };
export const getAgentUpdowinfo = params => { return axios.post(`${base}/agents/updowinfo`, params).then(res => res.data); };

//个人信息
export const getAgentsInfo = params => { return axios.post(`${base}/agents/agentinfo`, params).then(res => res.data); };
export const getAgentsFen = params => { return axios.post(`${base}/user/useragent`, params).then(res => res.data); };

//限红
export const getAgentsXh = params => { return axios.post(`${base}/agents/agentxh`, params).then(res => res.data); };

//修改密码
export const changePwd = params => { return axios.post(`${base}/do/agents/password/update`, params).then(res => res.data); };


export const getRoomLists = params => { return axios.post(`${base}/room/list`, params).then(res => res.data); };


//会员积分
export const getIntegralListPage = params => { return axios.post(`${base}/integral/integralDate`, params).then(res => res.data); };
export const getIntegralDetailListPage = params => { return axios.post(`${base}/integral/integralLog`, params).then(res => res.data); };

//上下积分
export const upDowjiFen = params => { return axios.post(`${base}/integral/exchange`, params).then(res => res.data); };
export const getUserJifen = params => { return axios.post(`${base}/integral/exchange`, params).then(res => res.data); };


export const getZiyingLogListPage = params => {
    if(params.type == 0){
        return axios.post(`${base}/profit/winlose`, params).then(res => res.data);
    }else if(params.type == 1){
        return axios.post(`${base}/profit/history`, params).then(res => res.data);
    } 
};

export const setZiyingGuiling = params => { return axios.post(`${base}/profit/guiling`, params).then(res => res.data); };
export const getYardListPage = params => { return axios.post(`${base}/yard/list`, params).then(res => res.data); };
export const yardCount = params => { return axios.post(`${base}/yard/count`, params).then(res => res.data); };
//获取系统设置
export const getTeamConfig = params => { return axios.post(`${base}/teamconfig/get`, params).then(res => res.data); };
//获取快捷消息
export const getFastText = params => { return axios.post(`${base}/room/getfasttext`, params).then(res => res.data); };

//修改系统设置
export const updateTeamConfig = params => { return axios.post(`${base}/teamconfig/update`, params).then(res => res.data); };
export const roomConfig = params => { return axios.post(`${base}/room/config`, params).then(res => res.data); };
export const roomConfigUpdateKeep1 =  params => { return axios.post(`${base}/room/update`, params).then(res => res.data); };
export const zyReport =  params => { return axios.post(`${base}/zy/report`, params).then(res => res.data); };
export const addRobot =  params => { return axios.post(`${base}/user/addRobot`, params).then(res => res.data); };
export const dodeleteGame =  params => { return axios.post(`${base}/game/delete`, params).then(res => res.data); };
export const addGame =  params => { return axios.post(`${base}/game/add`, params).then(res => res.data); };
export const editGame =  params => { return axios.post(`${base}/game/update`, params).then(res => res.data); };
export const getDomain =  params => { return axios.post(`${base}/domain/list`, params).then(res => res.data); };
export const getBossList =  params => { return axios.post(`${base}/agents/bossList`, params).then(res => res.data); };
export const deleteDomain =  params => { return axios.post(`${base}/domain/forbid`, params).then(res => res.data); };
export const update_pwd =  params => { return axios.post(`${base}/user/update_pwd`, params).then(res => res.data); };
export const user_token =  params => { return axios.post(`${base}/user/token`, params).then(res => res.data); };
export const deletechatmsg =  params => { return axios.post(`${base}/game/deletechatmsg`, params).then(res => res.data); };
export const getGroupAgentUpdowinfo =  params => { return axios.post(`${base}/agents/groupupdowinfo`, params).then(res => res.data); };
export const setStartWorkTime =  params => { return axios.post(`${base}/teamconfig/setStartWorkTime`, params).then(res => res.data); };



export const listAgentsUser =  params => { return axios.post(`${base}/board/listAgentsUser`, params).then(res => res.data); };
export const listUserWinLostRank =  params => { return axios.post(`${base}/board/listUserWinLostRank`, params).then(res => res.data); };
export const listshuyinguser =  params => { return axios.post(`${base}/board/listshuyinguser`, params).then(res => res.data); };
export const upfenlistchat =  params => { return axios.post(`${base}/board/upfenlistchat`, params).then(res => res.data); };
export const downfenlistchat =  params => { return axios.post(`${base}/board/downfenlistchat`, params).then(res => res.data); };
export const xmlistchat =  params => { return axios.post(`${base}/board/xmlistchat`, params).then(res => res.data); };
export const listUserByJifen =  params => { return axios.post(`${base}/user/listUserByJifen`, params).then(res => res.data); };
export const listUserByJId =  params => { return axios.post(`${base}/user/listUserByJId`, params).then(res => res.data); };
export const getLastHbSetting =  params => { return axios.post(`${base}/user/getLastHbSetting`, params).then(res => res.data); };
export const getHbHis =  params => { return axios.post(`${base}/user/getHbHis`, params).then(res => res.data); };
export const getHbDetail =  params => { return axios.post(`${base}/user/getHbDetail`, params).then(res => res.data); };
export const getUserDetail =  params => { return axios.post(`${base}/user/getUserDetail`, params).then(res => res.data); };
export const getDayJifenPage =  params => { return axios.post(`${base}/integral/integralDate`, params).then(res => res.data); };
export const getDayHbPage =  params => { return axios.post(`${base}/user/getHbHisByUid`, params).then(res => res.data); };
export const dojiesuanagentprofit =  params => { return axios.post(`${base}/agents/countProfit`, params).then(res => res.data); };
export const videoroad =  params => { return axios.post(`${base}/room/videoroad`, params).then(res => res.data); };
export const getChat =  params => { return axios.post(`${base}/chat/getchat`, params).then(res => res.data); };
export const getChatKf =  params => { return axios.post(`${base}/chat/getchatkf`, params).then(res => res.data); };
export const getChatSx =  params => { return axios.post(`${base}/chat/getchatsx`, params).then(res => res.data); };
export const getUnreadMessage =  params => { return axios.post(`${base}/chat/getunreadmessage`, params).then(res => res.data); };
export const requestqrcode =  params => { return axios.post(`${base}/login/getqrcode`, params).then(res => res.data); };
export const requestqrcodeemp =  params => { return axios.post(`${base}/login/getqrcodeemp`, params).then(res => res.data); };
export const getQunTitle =  params => { return axios.post(`${base}/login/getQunTitle`, params).then(res => res.data); };


export const setdomains =  params => { return axios.post(`${base}/domains/setdomains`, params).then(res => res.data); };
export const getDomainset =  params => { return axios.post(`${base}/domains/getdomains`, params).then(res => res.data); };
export const deleteDomainset =  params => { return axios.post(`${base}/domains/deletedomains`, params).then(res => res.data); };
export const appDomainset =  params => { return axios.post(`${base}/domains/appDomainset`, params).then(res => res.data); };
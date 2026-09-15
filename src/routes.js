import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import util from './common/js/util'

import MemberLists from './views/pages/memberLists.vue'
import GameLists from './views/pages/gameLists.vue'
import UserScoreLog from './views/pages/userScoreLog.vue'
import FenLists from './views/pages/fenLists.vue'
import BetLists from './views/pages/betLists.vue'
import AgentsWin from './views/pages/agentsWin.vue'
import AgentsIntegral from './views/pages/AgentsIntegral.vue'
import MemberWin from './views/pages/memberWin.vue'
import ZhuangTs from './views/pages/zhuangts.vue'
import XmLog from './views/pages/xmLog.vue'
import MemberOnline from './views/pages/memberOnline.vue'
import Hongbao from './views/pages/hongbao.vue'
import HongbaoY from './views/pages/hongbaoy.vue'
import HongbaoHis from './views/pages/hongbaohis.vue'
import AgentShare from './views/pages/agentshare.vue'
import AgentLists from './views/pages/agentLists.vue'
import GamePwd from './views/pages/gamePwd.vue'
import OperationLog from './views/pages/operationLog.vue'
import Domain from './views/pages/domain.vue'
import Domains from './views/pages/domains.vue'
import Boss from './views/pages/boss.vue'
import Scorelog from './views/pages/scoreLog.vue'
import AgentsScorelog from './views/pages/agentsscorelog.vue'
import MyInfo from './views/pages/myInfo.vue'
import ChangeMyPwd from './views/pages/changeMyPwd.vue'
import OperateLists from './views/pages/operateLists.vue'
import OperateListsTotal from './views/pages/operateListsTotal.vue'
import PointLists from './views/pages/pointLists.vue'
import PointFlow from './views/pages/pointFlow.vue'
import RoleLists from './views/pages/roleLists.vue'
import SocreLists from './views/pages/socreLists.vue'
import Grid from './views/grid.vue'
//import UserOnline from './views/pages/userOnline.vue'
import RoomLists from './views/pages/roomLists.vue'
import EmployeeLists from './views/pages/employee.vue'
//import NoticeController from './views/pages/noticeController.vue'
import Integral from './views/pages/integral.vue'
import Ziyinglog from './views/pages/ziying.vue'

import RoomController from './views/pages/controller.vue'
import Yard from './views/pages/yard.vue'
import Settlement from './views/pages/settlement.vue'
//import Board from './views/pages/board.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: 'sess'
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: 'sess'
    }, {
        path: '/',
        redirect:"/menu_member",
        hidden: 'sess'
    },{
        path: '/',
        component: Home,
        name: '首页',
        iconCls: 'fa fa-user-o',
        hidden: 'sess',
        children: [
            {
                path: '/my-info',
                component: MyInfo,
                name: '个人信息',
                hidden: "sess"
            },
        ]
    }
    // ,{
    //     path: '/',
    //     component: Home,
    //     name: '数据面板',
    //     iconCls: 'el-icon-data-board',
    //     hidden: "sess",
    //     children: [
    //         {
    //             path: '/board',
    //             component: Board,
    //             name: '数据面板',
    //             hidden: "sess"
    //         },
    //     ]
    // }
    ,{
        path: '/',
        component: Home,
        name: '代理和会员',
       iconCls: 'fa fa-user-o',
        children: [
            //{ path: '/board',component: Board,name: '数据面板',hidden: "board"},
            { path: '/agent-lists', component: AgentLists, name: '代理列表' ,hidden:'agent-lists'},
            { path: '/agent-share', component: AgentShare, name: '占成统计',hidden:'agent-share' },
            { path: '/menu_member', component: MemberLists, name: '会员列表' },
            { path: '/member-win', component: MemberWin, name: '会员输赢' },
           // { path: '/agents-win', component: AgentsWin, name: '代理输赢' },
           // { path: '/agents-integral', component: AgentsIntegral, name: '代理收益' },
           // { path: '/agent-score-log', component: AgentsScorelog, name: '代理上下分' },
            { path: '/score-log', component: Scorelog, name: '财务记录',hidden:'score-log' },
            { path: '/ziying-log', component: Ziyinglog, name: '自营报表',hidden:'ziying-log' },
            { path: '/settlement-log', component: Settlement, name: '结算报表',hidden:'settlement-log' },
            { path: '/xm-log', component: XmLog, name: '单边洗码' ,hidden:'xm-log'},
            { path: '/yard', component: Yard, name: '码粮结算', hidden:'yard'},        
            // { path: '/zhuang-ts', component: ZhuangTs, name: '退水列表' },
            { path: '/bet-lists', component: BetLists, name: '下注列表' },
            { path: '/game-lists', component: GameLists, name: '牌局记录', hidden:'game-lists' },
            { path: '/user-score-log', component: UserScoreLog, name: '流水明细', hidden:'user-score-log' },
            { path: '/integral', component: Integral, name: '会员积分' },
            { path: '/member-online', component: MemberOnline, name: '上线记录',hidden:'member-online' },
            { path: '/room-lists', component: RoomLists, name: '房间列表',hidden:'room-lists' },
            { path: '/employee-lists', component: EmployeeLists, name: '员工列表',hidden:'zhuguan' },
            { path: '/operation-log', component: OperationLog, name: '操作日志' ,hidden:'operation-log' },
            { path: '/change-password', component: ChangeMyPwd, name: '修改密码' },
            { path: '/room-controller', component: RoomController, name: '控制台',hidden:'room-controller' },
          //  { path: '/hongbao', component: Hongbao, name: '日红包群',hidden:'hongbao'},
           // { path: '/hongbaoy', component: HongbaoY, name: '月红包群',hidden:'hongbao'},
          //  { path: '/hongbaohis', component: HongbaoHis, name: '红包记录',hidden:'hongbaohis'},
           // { path: '/user-online', component: UserOnline, name: '在线用户' },
          //  { path: '/notice-controller', component: NoticeController, name: '公告管理',hidden:'notice-controller' },
            // { path: '/fen-lists', component: FenLists, name: '上下分列表' },
            // { path: '/socre-lists', component: SocreLists, name: '余分流水' },
            // { path: '/role-lists', component: RoleLists, name: '角色管理' },
            // { path: '/grid', component: Grid, name: 'grid' },
            // { path: '/point-lists', component: PointLists, name: '积分列表' },
            // { path: '/point-flow', component: PointFlow, name: '积分流水' },
            // { path: '/operate-lists', component: OperateLists, name: '按天统计' },
            // { path: '/operate-lists-total', component: OperateListsTotal, name: '累计统计' },
            // { path: '/yard-lists', component: YardLists, name: '一键清积分' }
        ]
    },
    //  {
    //     path: '/',
    //     component: Home,
    //     name: '牌局管理',
    //     iconCls: 'fa fa-newspaper-o',
    //     children: [
    //         { path: '/game-lists', component: GameLists, name: '牌局列表' }
    //     ]
    // },{
    //     path: '/',
    //     component: Home,
    //     name: '上下分管理',
    //     iconCls: 'fa fa-magic',
    //     children: [
    //         { path: '/fen-lists', component: FenLists, name: '上下分列表' }
    //     ]
    // },{
    //     path: '/',
    //     component: Home,
    //     name: '下注管理',
    //     iconCls: 'fa fa-star-half',
    //     children: [
    //         { path: '/bet-lists', component: BetLists, name: '下注列表' }
    //     ]
    // },{
    //     path: '/',
    //     component: Home,
    //     name: '余分管理',
    //     iconCls: 'fa fa-shopping-bag',
    //     children: [
    //         { path: '/socre-lists', component: SocreLists, name: '余分流水' }
    //     ]
    // },{
    //     path: '/',
    //     component: Home,
    //     name: '代理管理',
    //     iconCls: 'fa fa-ship',
    //     children: [
    //         { path: '/role-lists', component: RoleLists, name: '角色管理' },
    //         { path: '/agent-lists', component: AgentLists, name: '代理列表' }
    //     ]
    // },{
    //     path: '/',
    //     component: Home,
    //     name: '积分管理',
    //     iconCls: 'fa fa-signal',
    //     children: [
    //         { path: '/point-lists', component: PointLists, name: '积分列表' },
    //         { path: '/point-flow', component: PointFlow, name: '积分流水' }
    //     ]
    // },{
    //     path: '/',
    //     component: Home,
    //     name: '运营管理',
    //     iconCls: 'fa fa-gamepad',
    //     children: [
    //         { path: '/operate-lists', component: OperateLists, name: '按天统计' },
    //         { path: '/operate-lists-total', component: OperateListsTotal, name: '累计统计' }
    //     ]
    // },{
    //     path: '/',
    //     component: Home,
    //     name: '码粮管理',
    //     iconCls: 'fa fa-gift',
    //     children: [
    //         { path: '/yard-lists', component: YardLists, name: '一键清积分' }
    //     ]
    // },
   /* {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'fa fa-cog',
        children: [
            // { path: '/game-pwd', component: GamePwd, name: '牌局密码设置' },
            { path: '/employee', component: Employee, name: '员工列表',hidden:'employee' },
            { path: '/boss-agents', component: Boss, name: '总代理上分',hidden:'bossagents' },
            { path: '/operation-log', component: OperationLog, name: '操作日志' },
            { path: '/domain', component: Domain, name: '域名管理',hidden:'domain' },
            { path: '/domains', component: Domains, name: '跳板管理',hidden:'domain' },
            { path: '/change-password', component: ChangeMyPwd, name: '修改密码' },

        ]
    },*/
    {
        path: '*',
        hidden: 'sess',
        redirect: { path: '/404' }
    }
];

export default routes;
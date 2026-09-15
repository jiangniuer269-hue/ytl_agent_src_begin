/*
在文件的开始先定义一个对象
*/
const  plugin = {}

plugin.tableRowClassName = function({row, rowIndex}) {
    if (rowIndex % 2 == 0) {
        return 'table-00';
    } else if(rowIndex % 2 == 1){
        return 'table-11';
    }
    return '';
}

plugin.tableRowClassNameUser = function({row, rowIndex}) { 
    if (row.isfalse > 0) {
        return "onlineUser";
    } else if (row.istourist > 0) {
        return  "onlineUser1";
    }
    return 'normal';
}
plugin.columnFilter =  ["room_boots_ju","uptime","lucky","status","end_date","relation_link","phone","idcard","level","account","uid","name","user_type","note","do_agents_account","mktime","boss_account","boss_name",
        "xm_type","share_rate","xm_rate","sb_share_rate","sb_xm_rate","status","agents_account","agents_name","room_id","boots_number","ju","mark",
        "time","agents_share_rate","nickname","username","odds_text","game_result_text","result",'no_say','date','type','ip','score_before','score_after','score','integral_rate','user_original_score','user_integral','user_score_total','all_score_total','id','card_game_id'];
plugin.columnFilterFunc = function(lists,firstColumn){
    var heji = {};
    for(var i = 0;i < lists.length;i++){
        var list  = lists[i]
        for(var key in list){
            if(plugin.columnFilter.indexOf(key) == -1){
                if(heji[key]){
                    if(key == "lower_total"){
                        heji[key] = (Number(Number(heji[key])) + Number(Number(list[key])))
                    }else{
                        heji[key] = (Number(Number(heji[key])) + Number(Number(list[key]))).toFixed(2)
                    }
                   
                }else{
                    heji[key] = Number(Number(list[key]).toFixed(2))
                }
            }
            if(key == firstColumn){
                heji[key] = "合计"
                heji['countt'] = "合计"
            }
        }
    }
    return heji;
}
plugin.getSummaries = function (param) {
    const { columns, data } = param;
    const sums = [];
    var filter = ["account","name","user_type","note","do_agents_account","mktime","boss_account","boss_name",
        "xm_type","share_rate","xm_rate","sb_share_rate","sb_xm_rate","status","agents_account","agents_name",
    "time","agents_share_rate"]
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计';
            return;
        }
        if (filter.indexOf(column.property) != -1) {
            sums[index] = '-';
            return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                    return prev + curr;
                } else {
                    return prev;
                }
            }, 0);
        } else {
            sums[index] = '-';
        }
    });

    return sums;
}
plugin.getSessionItem  = function (session,item) {
    return JSON.parse(sessionStorage.getItem(session))[item]
}
export default plugin
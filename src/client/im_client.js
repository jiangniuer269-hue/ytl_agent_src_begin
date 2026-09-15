export class IMClient {
  constructor(url, heartChecknterval) {
    this.url = url
    this.heartChecknterval = heartChecknterval
  }

  connect(callback) {
    this.connectCallback = callback
    this.conn = new WebSocket(this.url)

    this.conn.onopen = () => {
      this.connected = true
      this.onOpen()
    }

    this.conn.onclose = () => {
      this.connected = false
      this.onClose()
    }

    this.conn.onerror = (event) => {
      this.onError(event)
    }

    this.conn.onmessage = (event) => {
      this.onMessage(event.data)
    }
  }

  heartCheckUtil = {
    start: () => {
        this.heartCheckObj = setInterval(() => {
          if (this.conn && this.conn.readyState === 1) {
            this.conn.send('{"cmd":7002}')
          }
        }, this.heartChecknterval)
    },

    reset: () => {
      clearInterval(this.heartCheckObj)
      this.heartCheckUtil.start()
    },

    stop: () => {
      if (this.heartCheckObj) {
        clearInterval(this.heartCheckObj)
      }
    }
  }

  reconnectUtil = {
    start: () => {
      this.reconnectObj = setTimeout(() => {
        // 已经关闭了与服务器的连接
        if (this.conn.readyState == 3) {
          this.reconnectStarting = true
          if(this.handleDisConnect){
            this.handleDisConnect()
          }
          console.log("尝试重新连接ws")
          if(sessionStorage.getItem("setOtherLoginFlag") == 0){
            this.connect()
          }
        }
      }, 2000)
    },

    stop: () => {
      this.reconnectStarting = false
      if (this.reconnectObj) {
        clearTimeout(this.reconnectObj)
        this.reconnectObj = null
      }
    }
  }

  onOpen() {
    if(this.connectCallback != null) {
      this.connectCallback(this)
    }
    const reconnectStarting = this.reconnectStarting
    this.reconnectUtil.stop()
    if (reconnectStarting && this.handleReconnectSuccessed) {
      this.handleReconnectSuccessed()
    }

    this.heartCheckUtil.start()
  }

  onClose() {
    this.heartCheckUtil.stop()
    this.reconnectUtil.start()
    if(this.handleConnectionClosed) {
      this.handleConnectionClosed()
    }
  }

  onError(error) {
    console.error(error)
  }

  onMessage(message) {
    if (message !== '') {   
      this.handleMessage(JSON.parse(message))
    }
    // this.heartCheckUtil.reset()
  }

  send(message) {
    if (this.connected) {
      this.conn.send(message)
      // this.heartCheckUtil.reset()
    }
  }

  handleMessage(message) {
    switch (message.cmd) {
      case 10:
        if(this.handleLoginSuccess) {
          this.handleLoginSuccess(message)
        }
        localStorage.setItem('user',JSON.stringify(message))
        break;
      case 15:
        if(this.handAlert) {
          this.handAlert(message)
        }
        break;  
      case 3004:
        if(this.handleCancalGame && message.set == 5){//取消此局
          this. handleCancalGame(message);
        }
        if(this.handleRealTimeMsg) {
          this.handleRealTimeMsg(message)
        }
        break;
      case 3006:
        if(this.handleRealTimeMsg) {
          this.handleRealTimeMsg(message)
        }
        break;
      case 3087:
        if(this.handleRoomInfo) {
          this.handleRoomInfo(message)
        }
        break;
      case 3089:
        if(this.handleShowRoomList) {
          this.handleShowRoomList(message)
        }
        break;
      case 3030:
        if(this.handleShowRoomLudan) {
          this.handleShowRoomLudan(message)
        }
        break;
      case 3079:
        if(this.handleShowHistory) {
          this.handleShowHistory(message)
        }
        break;
      case 1000:
        if(this.handleOtherLogin) {
          this.handleOtherLogin(message)
        }
        break;
      case 4001:
        if(this.handleJY) {
          this.handleJY(message)
        }
        break;
      case 4501:
        if(this.handleDeleteAg) {
          this.handleDeleteAg(message)
        }
        break;  
      case 4201:
        if(this.handleGuiling) {
          this.handleGuiling(message)
        }
        break;  
      case 3024:
        if(this.handleScore) {
          this.handleScore(message)
        }
        break
      case 4007:
        if(this.handleUserOnline) {
          this.handleUserOnline(message)
        }
        break  
      case 4008:
        if(this.handleAUserOnline) {
          this.handleAUserOnline(message)
        }
        break 
      case 4009:
        if(this.handleAUserOffline) {
          this.handleAUserOffline(message)
        }
        break    
      case 3092:
        if(this.handleRoomOpera) {
          this.handleRoomOpera(message)
        }
        break 
      case 4300:
        if(this.handleNotices) {
          this.handleNotices(message)
        }
        break;   
      case 4301:
        if(this.handlesendNotices) {
          this.handlesendNotices(message)
        }
        break;   
      case 4302:
        if(this.handleDelNotices) {
          this.handleDelNotices(message)
        }
        break;  
      case 4600:
        if(this.handleCreateHbGroup) {
          this.handleCreateHbGroup(message)
        }
        break;  
      case 4602:
        if(this.handleListHbGroup) {
          this.handleListHbGroup(message)
        }
        break;  
      case 4603:
        if(this.handleCreateHb) {
          this.handleCreateHb(message)
        }
        break;   
      case 4011:
        if(this.handleOpFen) {
          this.handleOpFen(message)
        }
        break;   
      case 4012:
        if(this.handleOpFenzs) {
          this.handleOpFenzs(message)
        }
        break;                    
      case 4500:
        if(this.handleChangeSf) {
          this.handleChangeSf(message)
        }
        break;     
      case 6006:
        if(this.handleHbRealMsg) {
          this.handleHbRealMsg(message)
        }
        break;    
      case 6001:
        if(this.handleHbDetail) {
          this.handleHbDetail(message)
        }
        break;      
      case 6079:
        if(this.handleHbHisMsg) {
          this.handleHbHisMsg(message)
        }
        break;                   
      case 1002:
        if(this.handleRoomDj && message.set == 32) {
          this.handleRoomDj(message)
        }else if(this.handleRoomZy && message.set == 33) {
          this.handleRoomZy(message)
        }
        break 
      case 4608:
        if(this.handleHbResUser) {
          this.handleHbResUser(message)
        }
        break               
      case 4210:
        if(this.handleUpdateCardGame &&  message.data && message.data.set == 100){//重新结算
          this.handleUpdateCardGame(message)       
        }else if(this.handleUpdateCardGame &&  message.code ==500 && message.set == 100){//重新结算失败
          this.handleUpdateCardGame(message)      
        }else if(this.handleUpdateCardGame && message.set == 101 ){//修改路单
          this.handleUpdateCardGame(message)           
        }else if(this.handleDaojishiSecond && message.set == 2){ //倒计时
          this.handleDaojishiSecond(message)      
        }else if(this.handleBuLudan && message.set == 7){//快捷补路单
          this.handleBuLudan(message);
        }else if(this.handleBuLudan && !message.set && message.code &&( message.code==0||message.code==500)){//操作归零
          this.handleGuiling(message);
        }
        break     
      case 7010: //清空群消息
        if(this.handleClearGroupMsg){
          this.handleClearGroupMsg(message)           
        }
        break
      case 7002:
        if(this.handleDjs) {
          this.handleDjs(message)
        }
        break

    }
  }
  bindCancalGame(callback){
    this.handleCancalGame = callback;
  }
  bindBuLudan(callback){
    this.handleBuLudan = callback;
  }
  bindDaojishiSecond(callback){//倒计时
    this.handleDaojishiSecond = callback;
  }
  bindUpdateCardGame(callback){
    this.handleUpdateCardGame = callback;
  }
  bindOpFenzs(callback){
    this.handleOpFenzs = callback;
  }
  bindOpFen(callback){
    this.handleOpFen = callback;
  }
  bindHbResUser(callback){
    this.handleHbResUser = callback;
  }
  bindHbDetail(callback){
    this.handleHbDetail = callback;
  }
  bindCreateHb(callback){
    this.handleCreateHb = callback;
  }
  bindHbHisMsg(callback){
    this.handleHbHisMsg = callback;
  }
  bindHbRealMsg(callback){
    this.handleHbRealMsg = callback;
  }
  bindListHbGroup(callback){
    this.handleListHbGroup = callback;
  }
  handleDeleteAg(callback){
    this.handleDeleteAg = callback;
  } 
  bindCreateHbGroup(callback){
    this.handleCreateHbGroup = callback;
  }  
  bindGuiling(callback){
    this.handleGuiling = callback;
  } 
  bindChangeSf(callback){
    this.handleChangeSf = callback;
  } 
  bindDelNotices(callback){
    this.handleDelNotices = callback;
  } 
   bindsendNotices(callback){
    this.handlesendNotices = callback;
  } 
  bindNotices(callback){
    this.handleNotices = callback;
  }

  bindAlert(callback){
    this.handAlert = callback;
  }
  bindRoomDj(callback){
    this.handleRoomDj = callback
  }
  bindRoomZy(callback){
    this.handleRoomZy = callback
  }
  bindRoomClose(callback){
    this.handleRoomClose = callback
  }
  bindAUserOffline(callback){
    this.handleAUserOffline = callback
  }
  bindAUserOnline(callback){
    this.handleAUserOnline = callback
  }
  bindUserOnline(callback){
    this.handleUserOnline = callback
  }

  bindRoomOpera(callback){
    this.handleRoomOpera = callback
  }

  bindUserJY(callback){
    this.handleJY = callback
  }
  bindDisConnect(callback){
    this.handleDisConnect = callback
  }
  bindRealTimeMsg(callback){
    this.handleRealTimeMsg = callback
  }
  bindRoomInfo(callback){
    this.handleRoomInfo = callback
  }
  bindLoginSuccess(callback){
    this.handleLoginSuccess = callback
  }
  bindShowRoomList(callback){
    this.handleShowRoomList = callback
  }
  bindReconnectSuccessed(callback) {
    this.handleReconnectSuccessed = callback
  }
  bindConnectionClosed(callback) {
    this.handleConnectionClosed = callback
  }
  bindShowRoomLudan(callback) {
    this.handleShowRoomLudan = callback
  }
  bindShowHistory(callback) {
    this.handleShowHistory = callback
  }
  bindOtherLogin(callback) {
    this.handleOtherLogin = callback
  }
  bindScore(callback) {
    this.handleScore = callback
  }
  bindClearGroupMsg(callback){
    this.handleClearGroupMsg= callback
  }
  bindDjs(callback){
    this.handleDjs = callback;
  }
}

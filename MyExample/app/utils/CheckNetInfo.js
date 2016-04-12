'use strict';
import React, {
  NetInfo,
  ToastAndroid,
} from 'react-native';

class CheckNetInfo {
	constructor(){
    this.vars={
    	isConnected:null,
      connectInfo:null,
    }
	}
  check(){
    NetInfo.isConnected.addEventListener(
        'change',
        this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
        (isConnected) => { this.setVars({isConnected}); }
    );
    NetInfo.fetch().done(
        (connectionInfo) => { this.setVars({connectionInfo}); }
    );
  }
  remove() {
    NetInfo.isConnected.removeEventListener(
        'change',
        this._handleConnectivityChange
    );
  }
  _handleConnectivityChange(isConnected) {
    this.setVars({
      isConnected,
    });
    if(!isConnected){
      ToastAndroid.show('无法连接至网络',ToastAndroid.SHORT);
    }
  }
  setVars(obj){
    for(var key in obj){
      this.vars[key]=obj[key];
    }
  }
}

export default CheckNetInfo;
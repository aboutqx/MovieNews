'use strict';
import React, { Component } from 'react';
import {   Image,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  StatusBar} from 'react-native';


import CheckNetInfo from '../utils/CheckNetInfo';
import MovieToolbar from '../components/MovieToolbar'
var PAGE_URL="http://video.mtime.com/trailer/";
var netUtils=new CheckNetInfo();

var MovieList=React.createClass({
  getInitialState:function() {

    netUtils.check();
    this.movies=[];
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,    
      movieSrc:'',
      empty: false,
    };
  },

  componentDidMount:function() {
    
    this.fetchData();
  },
  
  fetchData:function(){
    var self=this;
    fetch(PAGE_URL)
      .then((response) => response.text())
      .then((responseText) => {
        
        var snippet=responseText.match(/(<ul id="ulWeekVideos"){1}(.|\r|\n)+?(<\/ul>){1}/gm)[0];
        
        var tmp=snippet.split('</li>')
        tmp.forEach(function(v,i){
          if(i==tmp.length-1) return;
          var linkDeptPart=v.split('</a>')[0];
          var link=linkDeptPart.match(/href=".+?"/)[0].substr(5).slice(1,-1);

          var dept=linkDeptPart.match(/_blank\">.+/)[0].substr(8);
          var imgSrc=v.match(/src=".+?"/)[0].substr(4).slice(1,-1);

          var movieId=link.split('/')[3];
          var videoId=link.split('/')[5].slice(0,-5);
          var tmpDate=new Date();
          var tParam=tmpDate.getFullYear()+""+(tmpDate.getMonth()+1)+tmpDate.getDate()+tmpDate.getTime();
          var movieInfoLink='http://api.mtime.com/Service/Video.api?Ajax_CallBack=true&Ajax_CallBackType=Mtime.Api.Pages.VideoService&Ajax_CallBackMethod=GetVideoInfo&Ajax_CrossDomain=1&Ajax_RequestUrl=http://http://video.mtime.com/'+videoId+'/?mid='+movieId+'&t='+tParam+'&Ajax_CallBackArgument0='+videoId;
          
          var t=dept.split(' ');
          var movieName=t.shift();  
          dept="《"+movieName+"》"+t.join(' ')
          self.movies.push({movieInfoLink:movieInfoLink,dept:dept,imgSrc:imgSrc});
         
          self.setState({
              dataSource: self.state.dataSource.cloneWithRows(self.movies),
              loaded: true,
              empty:false //reload set empty false
          });
          
        })
      })
      .catch((error) => {
        self.setState({empty:true})
      });
  },

  render:function(){
    
    return (
        <View style={{flex:1}}>
          <StatusBar backgroundColor='#3e9ce9' translucent={true}/>
          <MovieToolbar title="电影预告片" logo={require('../images/mainIcon.png')}/>
          {this.renderContent()}
        </View>
    );

  },
  renderContent:function(){

    if(this.state.empty){
      return this.renderNoData();
    }
    if (!this.state.loaded) {
      return this.renderLoadingView();
    } else{
      return  (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderMovie}
          style={styles.listView} />
      );
    }
  },
  renderNoData:function(){
    return(
      <View style={styles.container}>
        <View style={{alignItems:'center'}}>
          <Text style={{marginBottom:7}}>目前没有数据 </Text>
          <TouchableHighlight onPress={() => {this.fetchData();}} style={[styles.textBtn,{width:70}]}>
            <Text style={styles.centerText}>
              刷新重试
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  },
  renderLoadingView:function() {
    return(
      <View style={styles.container}>
        <Text style={styles.centerText}>
          数据加载中...
        </Text>
      </View>
    );
  },
  renderMovie:function(movie:object) {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => this._pressRow(movie.movieInfoLink)}>
        <Image
          source={{uri: movie.imgSrc}}
          style={styles.thumbnail}
          
        />
        </TouchableHighlight>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{movie.dept}</Text>
        </View>
      </View>
    );
  },
  _pressRow:function(movieInfoLink:string) {

    var self=this;
    fetch(movieInfoLink,{}).then(function(response){
        return response.text().then(function(text){
          
          var movieSrc=text.match(/mp4URL":.+?"/)[0].slice(9,-1);

          self.props.navigator.push({movieSrc:movieSrc,id:'PlayMovie'});

        })
    }).catch((error) => {
      console.warn(error);
    });
  },
});
var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor:'#ccc',
    borderBottomWidth:1,
    marginBottom:3,
    paddingBottom:3,
    marginLeft:4,
  },
  rightContainer: {
    flex:1,
    alignItems:'flex-start',
    justifyContent:'flex-start',
    flexWrap:'wrap',
    overflow:'visible',
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    lineHeight:26,
    marginBottom: 18,
    textAlign: 'left',
    color:'#000',
    opacity:.87,
    marginLeft:8,
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 120,
    height: 90,
  },
  listView: {
    paddingTop:2,
    backgroundColor: '#F5FCFF',
    
  },
  textBtn: {
    borderWidth:1,
    borderColor:'#d11',
    borderRadius:2,
  },
  centerText:{
    textAlign: 'center',
    color:'#000'
  },
});

module.exports=MovieList;
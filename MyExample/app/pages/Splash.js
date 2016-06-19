'use strict';

import MovieList from '../pages/MovieList';
import React, { Component } from 'react';
import {  StyleSheet,
  Text,
  View,
  Image,
  InteractionManager,
  Dimensions,
  StatusBar} from 'react-native';


const {height, width} = Dimensions.get('window');

export default class Splash extends React.Component{
	constructor(props) {
		super(props)
	}
	componentDidMount() {

    const {navigator} = this.props;
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        navigator.resetTo({
          id: 'MovieList',
          component: MovieList
        });
      });
    }, 2000);

	}
	render() {
		return (
          <View>
            <StatusBar hidden={true}/>
		    <Image
		      source={require('../images/welcome.jpg')}
		      style={styles.welcomeImg}
            >
	        <Text style={styles.welcome}>
			      欢迎来到电影预告片应用!
			    </Text>
		    </Image>
          </View>
      );

	}
};

const styles=StyleSheet.create({

	welcome:{
    fontSize:18,
	},
	welcomeImg:{
		width:width,
		height:height,
		justifyContent: 'center',
    alignItems: 'center',
	}
})


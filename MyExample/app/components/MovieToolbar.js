'use strict';

import React, { Component } from 'react';
import { StyleSheet,
	ToolbarAndroid } from 'react-native';

import {GoBack} from '../nav/GoBack';
class MovieToolbar extends Component {
	constructor(props) {
		super(props);
		this.onIconClicked = this.onIconClicked.bind(this);
		this.onActionSelected = this.onActionSelected.bind(this);
	}

	onIconClicked() {
		const {navigator} = this.props;
		if (navigator) {
			GoBack(navigator);
		}
	
	}

	onActionSelected(position) {
		this.props.onActionSelected();
	}

	render() {
		const {navigator} = this.props;
		if (this.props.customView) {
			return (
			  <ToolbarAndroid style={styles.toolbar}>
			    {this.props.customView} 
			  </ToolbarAndroid>
			)
		} else if(this.props.isGoBack){
			return (
				<ToolbarAndroid
					style={styles.toolbar}
					actions={this.props.actions}
			        onActionSelected={this.onActionSelected}
			        onIconClicked={this.onIconClicked}
			        navIcon={this.props.navIcon ? this.props.navIcon : require('../images/up.png')}
			        titleColor='#fff'
			        title={this.props.title} />
			);
		} else{
			return(
                <ToolbarAndroid
					style={styles.toolbar}
					logo={this.props.logo}
					actions={this.props.actions}
			        onActionSelected={this.props.onActionSelected}
			        onIconClicked={this.props.onIconClicked}
			        navIcon={this.props.navIcon }
			        titleColor='#fff'
			        title={this.props.title} />
			)
		}
	}
}

let styles = StyleSheet.create({
	toolbar: {
    backgroundColor: '#3e9ce9',
    height: 58,
  }
})



export default MovieToolbar;
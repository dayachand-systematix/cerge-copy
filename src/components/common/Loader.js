import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, View, StyleSheet } from 'react-native';
import { Text } from '../common';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = '100%';
const { height } = Dimensions;

export default class Loader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			height: this.props.height || deviceHeight,
			width: this.props.width || deviceWidth,
			isLoading: false
		};
	}

	/**
    * @method componentWillReceiveProps
    * @description to set the loader value in state by props
    */
	componentWillReceiveProps(nextProps) {
		if (this.state.isLoading != nextProps.isLoading) {
			if (nextProps.isLoading) {
				this.setState({
					isLoading: true
				}, () => {
					setTimeout(() => {

						this.autoOffLoader();
					}, 120000);
				});
			} else {
				this.setState({
					isLoading: false
				});
			}
		}
	}

	/**
    * @method autoOffLoader
    * @description after the 2 min loader will stop automatically
    */
	autoOffLoader = () => {
		if (this.state.isLoading) {

			this.setState({
				isLoading: false
			});
		}
	}

	/**
    * @method render
    * @description to render the loader
    */
	render() {
		return (
			this.state.isLoading &&
			(<View
				style={innerStyles.loader}
			>
				<ActivityIndicator size='large' color='#FFF' />
				<Text style={innerStyles.whiteColor}> Loading...</Text>
			</View>)
		);
	}
}

const innerStyles = StyleSheet.create({
	loader: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 9999,
		justifyContent: 'center',
		alignItems: 'center',
		width: deviceWidth,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,.8)',
		height: height
	},
	whiteColor: {
		color: '#FFF'
	}
});

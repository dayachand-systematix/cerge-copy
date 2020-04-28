import React, { Component } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Icon } from 'native-base';
import styles from '../../assets/styles';
import { LineText } from './index';

export default class CommonModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  render() {
    return (
      <Modal animationType={'fade'} transparent visible={this.props.isVisiable}>
        <View style={styles.modal}>
          <View style={[styles.modalInnerBox, { height: 'auto' }]}>
            <View style={styles.modalHead}>
              <View style={styles.headTitle}>
                <LineText
                  weight={'semiBold'}
                  color={'#000000'}
                  style={{ fontFamily: fontBoldItalic }}
                >{this.props.heading}</LineText>
              </View>
              <TouchableOpacity style={styles.closeIcon} onPress={this.props.closeModal}>
                <Icon name="close" style={styles.closeIcn} />
              </TouchableOpacity>
            </View>
            <View style={styles.paddingFifteen}>
              {this.props.children}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

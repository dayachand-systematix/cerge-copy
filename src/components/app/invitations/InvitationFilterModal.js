import React from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { CommonModal, NoContentFound, Text } from '../../common';
import { ValidationComponent, displayValue } from '../../../helper';

class InvitationFilterModal extends ValidationComponent {
    /**
     * @method renderTileRow
     * @description called in render list in card section
     */
    renderTileRow = ({ item }) => (
        <View style={innerStyle.invitationBox} >
            <View>
                <TouchableOpacity
                    style={{ marginTop: 2, padding: 6 }}
                    onPress={() => this.props.searchNearMeDetail(item)}
                >
                    <Text style={innerStyle.text}>
                        {`${displayValue(item.name)}${' '}${displayValue(item.address)}`}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    render() {
        const { isVisiable, closeModal, type, modalLoading } = this.props;
        return (
            <View>
                <CommonModal
                    heading='Nearby Locations'
                    isVisiable={isVisiable}
                    closeModal={closeModal}
                >
                    <ScrollView
                        style={{ maxHeight: actualDeviceHeight - 400 }}
                    >
                        {type.length == 0 && <ActivityIndicator size='large' color='#FFF' />}
                        {type &&
                            <FlatList
                                data={type}
                                renderItem={this.renderTileRow}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={() => {
                                    if (type.length === 0 && (!modalLoading)) {
                                        return (
                                            <NoContentFound
                                                customHeigth={100}
                                                customWidth={100}
                                                title={'No Data'}
                                            />
                                        );
                                    }
                                    return null;
                                }}
                                onEndReachedThreshold={0.5}
                            />
                        }
                    </ScrollView>
                </CommonModal>
            </View >
        );
    }
}

const innerStyle = StyleSheet.create({
    invitationBox: {
        backgroundColor: '#000000',
        borderTopWidth: 2,
        fontFamily: fontBoldItalic,
        borderBottomWidth: 2,
        borderBottomColor: '#b5b5b5',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 3
    },
    text: {
        color: '#FFFFFF',
    }
});

/**
* @method mapStateToProps
* @description return state to component as props
* @param {*} state
*/
const mapStateToProps = ({ invitations }) => {
    const { invitationLoading } = invitations;
    return { invitationLoading };
};

/**
* @method connect
* @description connect with redux
* @param {function} mapStateToProps
* @param {*} object
*/
export default connect(
    mapStateToProps, null)(InvitationFilterModal);

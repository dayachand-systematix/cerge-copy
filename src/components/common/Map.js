
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
// import mapPin from '../../assets/images/map-marker.png';
import styles from '../../assets/styles';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.0021;
class Map extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
            latitudeDelta: null,
            longitudeDelta: null,
            error: null,
            initialPosition: null
        };
    }

    componentDidMount() {
        if (this.props.mapData.length > 0) {
            const initialRegion = {
                latitude: parseFloat(this.props.mapData[0].lat),
                longitude: parseFloat(this.props.mapData[0].long),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            };
            this.setState({
                initialPosition: initialRegion,
                latitude: parseFloat(this.props.userCurrentLatitude),
                longitude: parseFloat(this.props.userCurrentLongitude),
                error: null,
            });
            const tempCoords = {
                latitude: Number(this.props.mapData[0].lat),
                longitude: Number(this.props.mapData[0].long)
            };
            this._map.animateToCoordinate(tempCoords, 1);
        }
    }
    
    /**
     * @method renderMapMarker
     * @description Renders multiple map marker on map
     */
    renderMapMarker = () => {
        const mapData = this.props.mapData;
        if (mapData != null && typeof mapData != 'undefined' && Array.isArray(mapData) && mapData.length > 0) {
            return mapData.map((data, i) => {
                return (
                    <MapView.Marker
                        key={i}
                        coordinate={{ latitude: parseFloat(data.lat), longitude: parseFloat(data.long) }}
                    // image={mapPin}
                    >
                        <Image
                            source={data.isEnabled ? require('../../assets/images/pin-green.png') : require('../../assets/images/pin-red.png')}
                            style={inlineStyles.mapPinImage}
                        />
                        <MapView.Callout tooltip>
                            <TouchableOpacity underlayColor='#dddddd'>
                                <View style={inlineStyles.toolTipWrap}>
                                    <View style={inlineStyles.innerToolTipWrap}>
                                        <Text style={styles.mainTitle}>{data.displayName}</Text>
                                        <Text style={[styles.smallHeading, inlineStyles.tooltipAddress]}>{data.address}</Text>
                                        {data.isEnabled != true && (
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={styles.closedText}>CLOSED</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={inlineStyles.mapArrowIconWrap}>
                                        <Icon style={inlineStyles.mapArrowIcon} name={'md-arrow-dropdown'} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </MapView.Callout>
                    </MapView.Marker>
                );
            });
        }
    }
    /**
     * @method render
     * @description Renders the component
     */
    render() {
        return (
            <View style={inlineStyles.container}>
                <MapView
                    ref={component => this._map = component}
                    mapType="hybrid"
                    style={inlineStyles.map}
                    initialRegion={this.state.initialPosition}
                >
                    {this.renderMapMarker()}
                </MapView>
            </View>
        );
    }
}
const inlineStyles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    toolTipWrap: {
        width: 200,
        height: 115,
        paddingBottom: 15
    },
    innerToolTipWrap: {
        backgroundColor: '#FFF',
        borderRadius: 6,
        padding: 15,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 0,
        height: 100
    },
    mapPinImage: {
        width: 25,
        height: 36
    },
    container: {
        height: deviceHeight - 120,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    mapArrowIconWrap: {
        marginTop: -22
    },
    mapArrowIcon: {
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#fff',
        marginTop: 0,
        marginBottom: 0,
        padding: 0,
        fontSize: 50

    },
    tooltipAddress: {
        paddingTop: 0,
        lineHeight: 16
    },
});

/**
* @method mapStateToProps
* @description return state to component as props
* @param {*} state
*/
function mapStateToProps({ auth }) {
    const { userData } = auth;
    return {
        userData,
    };
}


/**
* @method connect
* @description connect with redux
* @param {function} mapStateToProps
* @param {function} mapDispatchToProps
                        */
export default connect(
    mapStateToProps, null
)(Map);


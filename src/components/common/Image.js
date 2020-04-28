import React from 'react';
import {Image, Dimensions} from 'react-native';

const ImageBox = ({
    source,
    autoResize=false,
    minWidthFromWindow=0,
    width,
    height,
    style
    }) =>{

    let WindowWidth = Dimensions.get('window').width - minWidthFromWindow;

    let imageStyle = {
        width:width,
        height:height
    };
   
    if(autoResize){
        imageStyle.width = WindowWidth
        imageStyle.height =  (height / width) * WindowWidth
    }
    
    return(
        <Image source={source} style={[imageStyle, style]}  />
    )
}
export { ImageBox };
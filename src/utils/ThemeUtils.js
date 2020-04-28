 export const checkFontSize = (size) => {
    switch (size) {
        case 'smallxx':
            return { fontSize: 10 }
            break;
        case 'smallx':
            return { fontSize: 12 }
            break;
        case 'small':
            return { fontSize: 14 }
            break;
        case 'normal':
            return { fontSize: 16 }
            break;
        case 'large':
            return { fontSize: 18 }
            break;
        default:
            return { fontSize: 16 }
            break;
    }
}
export const checkFontWeight = (weight) => {
    switch (weight) {
        case 'extraLight':
            return { fontFamily: fontExtraLight }
            break;
        case 'light':
            return { fontFamily: fontLight }
            break;
        case 'regular':
            return { fontFamily: fontRegular }
            break;
        case 'semiBold':
            return { fontFamily: fontSemiBold }
            break;
        case 'bold':
            return { fontFamily: fontBold }
            break;
        default:
            return { fontFamily: fontRegular }
            break;
    }
}
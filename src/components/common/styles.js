/*!
 * react-native-multi-select
 * Copyright(c) 2017 Mustapha Babatunde Oluwaleke
 * MIT Licensed
 */

export const colorPack = {
  primary: '#00A5FF',
  primaryDark: '#215191',
  light: '#FFF',
  textPrimary: '#2C3138',
  placeholderTextColor: '#87939F',
  danger: '#C62828',
  borderColor: '#738A9D',
  backgroundColor: '#b1b1b1',
};

export default {
  footerWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  footerWrapperNC: {
    width: 320,
    flexDirection: 'column',
  },
  subSection: {
    borderBottomWidth: 1,
    borderColor: colorPack.borderColor,
    paddingLeft: 0,
    paddingRight: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    color: '#2C3138',
    paddingTop: 16,
    height: 68,
  },
  greyButton: {
    height: 40,
    borderRadius: 5,
    elevation: 0,
    backgroundColor: colorPack.backgroundColor,
  },
  indicator: {
    fontSize: 15,
    color: colorPack.placeholderTextColor,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 3,
    paddingRight: 3,
    paddingBottom: 3,
    margin: 3,
    borderRadius: 20,
    borderWidth: 2,
  },
  button: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colorPack.light,
    fontSize: 14,
  },
  selectorView: (fixedHeight) => {
    const style = {
      flexDirection: 'column',
      marginBottom: 10,
      elevation: 2,
    };
    if (fixedHeight) {
      style.height = 250;
    }
    return style;
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    backgroundColor: colorPack.light,
  },
  dropdownView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginBottom: 10,
  },
  cancelButton: {
    fontSize: 18,
    padding: 5,
    backgroundColor: '#000',
    position: 'absolute',
    right: 0,
    top: 70,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 3
  },
  modal: {
    height: 'auto',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  text: {
    color: '#000',
  },
  modalInnerBox: {
    width: 320,
    height: 340,
    backgroundColor: '#fff',
    position: 'relative',
  },
  modalHead: {
    backgroundColor: '#B8C1C9',
    textAlign: 'center',
    padding: 15,
    paddingTop: 12,
    paddingBottom: 12
  },
  optionLabel: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
  },
  closeIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 0,
    top: 18,
  },
  closeIcn: {
    color: '#fff',
    fontSize: 13

  }, 
  clearIcn: {
    color: 'rgba(184, 193, 201, 0.7)',
    fontSize: 10

  },
  modalFooter: {
    backgroundColor: '#F5F7F9',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#DDE4EB',
    borderStyle: 'solid',
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    width: '100%',
    maxHeight: 50
  },
  commonButton: {
    padding: 9,
    backgroundColor: '#FFC30D',
    borderRadius: 30,
    color: '#fff',
    paddingTop: 4,
    paddingBottom: 5,
    width: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  commonButtonText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  }

};

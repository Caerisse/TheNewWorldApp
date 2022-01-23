import React from 'react';
import { Switch, Platform } from 'react-native';

import { appTheme } from '../../constants/examples';

class MkSwitch extends React.Component {
  render() {
    const { value, ...props } = this.props;
    let thumbColor;
    if (Platform.OS === 'ios') {
      thumbColor = null;
    } else {
      thumbColor = Platform.OS === 'android' && value ? appTheme.COLORS.SWITCH_ON : appTheme.COLORS.SWITCH_OFF;
    }

    return (
      <Switch
        value={value}
        thumbColor={thumbColor}
        ios_backgroundColor={appTheme.COLORS.SWITCH_OFF}
        trackColor={{ false: appTheme.COLORS.SWITCH_ON, true: appTheme.COLORS.SWITCH_ON }}
        {...props}
      />
    );
  }
}

export default MkSwitch;

/* eslint-disable */
// @flow

import * as React from 'react';
import { Text } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { Color } from '@kiwicom/react-native-app-common';

type Props = {|
  name: string,
  size: number,
  color?: string,
  // $FlowFixMeProps
  style?: Object,
|};

// const defaults = {
//   color: Color.grey.$600,
// };

/**
 * Currently only supported package is "MaterialIcons".
 * @see https://material.io/icons/
 */
export default function Icon(props: Props) {
  return <Text>??</Text>;
  // const newProps = { ...defaults, ...props };
  // return <MaterialIcons {...newProps} />;
}
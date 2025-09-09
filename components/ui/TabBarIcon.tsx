import React from 'react';
import { SvgProps } from 'react-native-svg';

type Props = {
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
  active: React.FC<SvgProps>;
  inactive: React.FC<SvgProps>;
};

export function TabBarIcon({
  focused,
  activeColor,
  inactiveColor,
  active,
  inactive,
}: Props) {
  const Icon = focused ? active : inactive;
  return (
    <Icon
      width={20}
      height={20}
      color={focused ? activeColor : inactiveColor}
      fill={focused ? activeColor : 'none'}
      stroke={focused ? 'none' : inactiveColor}
    />
  );
}

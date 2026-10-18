import React from 'react';
import { StatusBar as RNStatusBar } from 'react-native';

type StatusBarStyle = 'auto' | 'inverted' | 'light' | 'dark';

type Props = {
  style?: StatusBarStyle;
  hidden?: boolean;
  backgroundColor?: string;
  translucent?: boolean;
};

export function StatusBar({ style = 'auto', hidden, backgroundColor, translucent }: Props) {
  const barStyle =
    style === 'light' ? 'light-content' : style === 'dark' ? 'dark-content' : 'default';

  return (
    <RNStatusBar
      barStyle={barStyle}
      hidden={hidden}
      backgroundColor={backgroundColor}
      translucent={translucent}
    />
  );
}

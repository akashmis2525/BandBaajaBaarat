import React from 'react';
import RNLinearGradient from 'react-native-linear-gradient';
import type { ViewProps } from 'react-native';

type Props = ViewProps & {
  colors: readonly (string | number)[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: readonly number[];
};

export function LinearGradient({ colors, locations, ...rest }: Props) {
  return (
    <RNLinearGradient
      colors={[...colors]}
      locations={locations ? [...locations] : undefined}
      {...rest}
    />
  );
}

export default LinearGradient;

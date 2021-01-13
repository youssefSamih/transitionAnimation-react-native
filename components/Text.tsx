import React from 'react';
import type {TextProps as OriginalTextProps} from 'react-native';
import {Text as RNText} from 'react-native';
import typography from './typography.json';

interface TextProps extends OriginalTextProps {
  dark?: boolean;
  type?: keyof typeof typography;
  children: React.ReactNode;
}

const Text = ({dark, type, style, children}: TextProps) => {
  const color = dark ? 'white' : 'black';
  return (
    <RNText style={[typography[type || 'body'], {color}, style]}>
      {children}
    </RNText>
  );
};

export default Text;

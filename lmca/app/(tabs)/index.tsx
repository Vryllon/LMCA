import React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        height: 'auto',
        marginHorizontal: 20,
        marginVertical: 60
      }}>
      <Text>Some text here</Text>
    </View>
  );
}
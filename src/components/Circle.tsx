import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'

const styles = StyleSheet.create({
  container: {
    paddingRight: 8
  },
  shape: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  text: {
    marginLeft: 12,
    marginTop: 3,
    fontSize: 36,
    color: 'white'
  }
})

export default ({letter}: {letter: string}) => <View style={styles.container}>
  <LinearGradient
    colors={['#a5bef5', '#8498c4']}
    start={{x: 0.1, y: 0.2}}
    style={styles.shape}
  >
    <Text style={styles.text}>{letter}</Text>
  </LinearGradient>
</View>
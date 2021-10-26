import React, {useRef, useState} from 'react'
import {Text, TouchableOpacity, View, Animated, PanResponder, Dimensions} from 'react-native'
import {useStore, Channel} from './store'
import styles from './styles'

const width = Dimensions.get('window').width

export const ChatListItem = ({ item, onPress, onDelete }: { item: Channel, onPress: () => void, onDelete: () => void }) => {
    const [scrollEnabled, enableScroll] = useState(true)
    const gestureDelay = -35
    const position = useRef(new Animated.ValueXY()).current
    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: (event, gestureState) => {
            if (gestureState.dx > 35) {
                enableScroll(false)
                let newX = gestureState.dx  + gestureDelay
                position.setValue({x: newX, y: 0})
            }
        },
        onPanResponderRelease: (event, gestureState) => {
            if (gestureState.dx < 150) {
                Animated
                  .timing(position, { toValue: { x: 0, y:0 }, duration: 150, useNativeDriver: true })
                  .start(() => {
                      enableScroll(true)
                  })
            } else {
                Animated
                  .timing(position, {toValue: {x: width, y: 0}, duration: 300, useNativeDriver: true})
                  .start(() => {
                      enableScroll(true)
                      onDelete()
                  })
            }
        }
    })).current
    return <View>
        <Animated.View style={[position.getLayout()]} {...panResponder.panHandlers}><TouchableOpacity
          style={styles.listView}
          onPress={onPress}
          >
            <View style={{flexDirection: 'row'}}>
                <View style={styles.circle}/>
                <View style={{flexDirection: 'column'}}>
                    <Text>{item.name}</Text>
                    <Text>{item.description}</Text>
                </View>
            </View>
        </TouchableOpacity></Animated.View>
    </View>
}
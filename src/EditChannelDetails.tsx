import React, {useLayoutEffect, useState} from 'react'
import {ActivityIndicator, Button, TextInput, View} from 'react-native'
import styles, {ListViewStyle, NavigationStyle} from './styles'
import {RouteProp} from '@react-navigation/native'
import {StackParamList} from './Navigator'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {usePubNub} from 'pubnub-react'
import {useStore} from './store'
import CirclePrompt from './components/CirclePrompt'
import * as ImagePicker from 'expo-image-picker'
import {ImageInfo} from 'expo-image-picker/build/ImagePicker.types'
import {upload} from './storage';

export default ({navigation, route}: {
  route: RouteProp<StackParamList, 'EditChannelDetails'>,
  navigation: NativeStackNavigationProp<StackParamList, 'EditChannelDetails'>
}) => {
  const {state, dispatch} = useStore()
  const pubnub = usePubNub()
  const [name, setName] = useState(route.params.item.name)
  const [image, setImage] = useState(null)
  const [localImage, setLocalImage] = useState<string>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    const res = await pubnub.objects.setChannelMetadata({
      channel: route.params.item.id,
      data: {name}
    })
    console.log('updating channel name', name, res)
    const channel = state.channels[route.params.item.id]
    if (image) {
      try {
        const file = await upload(Buffer.from(image, 'base64'))
        console.log('uploaded file', file.size)
        const res2 = await pubnub.objects.setChannelMetadata({
          channel: route.params.item.id,
          data: {custom: {...channel.custom, caption: file.url}}
        })
        console.log('setting caption to channel data', res2)
        dispatch({
          channels: {
            ...state.channels,
            [route.params.item.id]: {...channel, name, custom: {...channel.custom, caption: file.url}}
          }
        })
      } catch (e) {
        console.log('failed to upload a file', e)
      }
    }
    dispatch({channels: {...state.channels, [route.params.item.id]: {...channel, name}}})
    setLoading(false)
    navigation.goBack()
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true
    })

    if (!result.cancelled) {
      console.log('picking result', result)
      setImage((result as ImageInfo).base64)
      setLocalImage((result as ImageInfo).uri)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <View style={NavigationStyle.headerRight}>
        {loading ? <ActivityIndicator/> : <Button title="Done" onPress={submit}/>}
      </View>
    })
  }, [navigation, name, image, loading])

  return <View>
    <CirclePrompt onPress={pickImage} source={localImage || route.params.item.custom.caption}/>
    <View style={styles.section}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={ListViewStyle.subtitle}/>
    </View>
  </View>
}

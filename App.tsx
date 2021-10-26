import React, { useEffect } from 'react'
import 'react-native-gesture-handler'
import Pubnub from 'pubnub'
import Constants from 'expo-constants'
import { PubNubProvider } from "pubnub-react"
import Navigator from './src/Navigator'
import { useStore, uuid } from './src/store'
import { StatusBar, AppState } from 'react-native'
import listener from './src/model'

const {subscribeKey, publishKey} = Constants.manifest.extra

const client = new Pubnub({
  subscribeKey,
  publishKey,
  uuid,
  restore: true
})

export default () => {
  const { state, dispatch } = useStore()

  useEffect(() => {
    AppState.addEventListener('change', (nextState) => {
      if (nextState.match(/inactive|background/)) {
        client.unsubscribeAll()
      }
    })
    client.addListener(listener(state, dispatch))
    client.subscribe({
      channelGroups: [uuid],
      withPresence: true
    })
  }, [])

  return <>
    <StatusBar translucent={true} />
    <PubNubProvider client={client}>
      <Navigator />
    </PubNubProvider>
  </>
}

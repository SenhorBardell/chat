import 'dotenv/config'

export default {
  extra: {
    subscribeKey: process.env.PUBNUB_SUB,
    publishKey: process.env.PUBNUB_PUB,
    fileStackKey: process.env.FILESTACK_KEY
  }
}

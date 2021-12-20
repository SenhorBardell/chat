import Constants from 'expo-constants'

const KEY = Constants.manifest.extra.fileStackKey
const ENDPOINT = 'https://www.filestackapi.com/api'

type UploadRes = {
  url: string
  size: number
  type: string
  filename: string
  key: string
}

export const upload = async (file: Buffer): Promise<UploadRes> => {
  const res = await fetch(`${ENDPOINT}/store/S3?key=${KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
      'Access-Control-Allow-Origin': '*'
    },
    body: file
  })
  return res.json()
}

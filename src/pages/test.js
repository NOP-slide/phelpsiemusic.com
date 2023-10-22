import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { navigate } from "gatsby"

const TestPage = () => {
  const videoRef = React.useRef(null)
  const [didFire, setDidFire] = React.useState(false)
  const [result, setResult] = React.useState("iOS")

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0;
      if (didFire) setResult("Not iOS")
    }
  }, [videoRef.current])

  return (
    <Layout>
      <div className="my-auto">
        <p className="my-4 text-3xl text-center text-white">{result}</p>
        <video ref={videoRef} onVolumeChange={e => setDidFire(true)} />
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="404: Not Found" />

export default TestPage

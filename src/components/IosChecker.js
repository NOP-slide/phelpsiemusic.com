import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"

const IosChecker = () => {
  const { setIsIOS } = useSiteContext()
  const videoRef = React.useRef(null)
  const [didFire, setDidFire] = React.useState(false)

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0
      if (didFire) {
        setIsIOS(false)
      }
    }
  }, [videoRef.current, didFire, setIsIOS])

  return (
    <video
      className="hidden"
      ref={videoRef}
      onVolumeChange={() => setDidFire(true)}
    />
  )
}

export default IosChecker

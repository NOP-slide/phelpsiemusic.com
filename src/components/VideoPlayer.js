import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"
import { useOutsideClick } from "../hooks/use-outside-click"
import { CgSpinner } from "react-icons/cg"
import VideoProgressBar from "./VideoProgressBar"
import {
  MdClose,
  MdPlayArrow,
  MdPause,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md"

const VideoPlayer = () => {
  const videoRef = React.useRef(null)
  const [videoOpen, setVideoOpen] = React.useState(true)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isReady, setIsReady] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [currrentProgress, setCurrrentProgress] = React.useState(0)
  const [buffered, setBuffered] = React.useState(0)
  const [volume, setVolume] = React.useState(1.0)
  const { setIsVideoPlayerOpen } = useSiteContext()

  const handleBufferProgress = e => {
    const video = e.currentTarget
    const dur = video.duration
    if (dur > 0) {
      for (let i = 0; i < video.buffered.length; i++) {
        if (
          video.buffered.start(video.buffered.length - 1 - i) <
          video.currentTime
        ) {
          const bufferedLength = video.buffered.end(
            video.buffered.length - 1 - i
          )
          setBuffered(bufferedLength)
          break
        }
      }
    }
  }

  const handlePlay = () => {
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleMuteUnmute = () => {
    if (!videoRef.current) return

    if (videoRef.current.volume !== 0) {
      videoRef.current.volume = 0
    } else {
      videoRef.current.volume = 1.0
    }
  }

  const handleVolumeChange = volumeValue => {
    if (!videoRef.current) return
    videoRef.current.volume = volumeValue
    setVolume(volumeValue)
  }

  const handleOutsideClick = () => {
    setVideoOpen(false)
    setTimeout(() => setIsVideoPlayerOpen(false), 350)
  }

  const outsideClickRef = useOutsideClick(handleOutsideClick)

  return (
    <div
      className={`cart-modal-container transform ${
        videoOpen ? "cart-modal-fadein" : "cart-modal-fadeout"
      }`}
    >
      <div
        ref={outsideClickRef}
        className={`fixed h-4/5 w-4/5 lg:w-1/2 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 bg-brand-dark ${
          videoOpen ? "cross-sell-modal-fadein" : "cross-sell-modal-fadeout"
        }`}
      >
        <div className="relative w-full h-full p-8 lg:p-16">
          <MdClose
            onClick={() => {
              setVideoOpen(false)
              setTimeout(() => setIsVideoPlayerOpen(false), 350)
            }}
            className="absolute text-3xl text-white cursor-pointer top-1 right-2"
          />
          <video
            ref={videoRef}
            className="w-full h-full"
            disableRemotePlayback
            onDurationChange={e => setDuration(e.currentTarget.duration)}
            onTimeUpdate={e => {
              setCurrrentProgress(e.currentTarget.currentTime)
              handleBufferProgress(e)
            }}
            onProgress={handleBufferProgress}
            onLoadedMetadata={() => {
              setIsReady(true)
              handlePlay()
            }}
            // onCanPlay={() => {
            //   setIsReady(true)
            //   handlePlay()
            // }}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlaying={() => setIsPlaying(true)}
            onVolumeChange={e => setVolume(e.currentTarget.volume)}
            preload="auto"
            playsInline
            src="/twysted-ig-vertical.mp4"
          />
          <VideoProgressBar
            duration={duration}
            currentProgress={currrentProgress}
            buffered={buffered}
            onChange={e => {
              if (!videoRef.current) return

              videoRef.current.currentTime = e.currentTarget.valueAsNumber

              setCurrrentProgress(e.currentTarget.valueAsNumber)
            }}
          />
          <button
            type="button"
            disabled={!isReady}
            onClick={() => handlePlay()}
            className="absolute flex items-center justify-center w-10 h-10 text-white rounded-full bottom-4 left-4 bg-brand-teal disabled:opacity-60"
          >
            {!isReady ? (
              <CgSpinner size={24} className="spinner" />
            ) : isPlaying ? (
              <MdPause size={30} />
            ) : (
              <MdPlayArrow size={30} />
            )}
          </button>
          <div className="absolute flex items-center gap-1 right-4 bottom-5">
            <button
              onClick={() => handleMuteUnmute()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-400 disabled:opacity-60"
            >
              {volume === 0 ? (
                <MdVolumeOff size={20} />
              ) : (
                <MdVolumeUp size={20} />
              )}
            </button>
            <input
              aria-label="volume"
              name="volume"
              type="range"
              min={0}
              step={0.05}
              max={1}
              value={volume}
              className="w-[80px] ml-2 sm:ml-0 h-2 appearance-none rounded-full accent-brand-teal bg-gray-700 cursor-pointer"
              onChange={e => {
                handleVolumeChange(e.currentTarget.valueAsNumber)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer

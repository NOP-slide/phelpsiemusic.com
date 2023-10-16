import * as React from "react"
import {
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdSkipPrevious,
  MdVolumeUp,
  MdVolumeOff,
} from "react-icons/md"
import { graphql, useStaticQuery } from "gatsby"
import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image"
import { CgSpinner } from "react-icons/cg"
import IconButton from "./components/IconButton"
import AudioProgressBar from "./components/AudioProgressBar"
import VolumeInput from "./components/VolumeInput"

function formatDurationDisplay(duration) {
  const min = Math.floor(duration / 60)
  const sec = Math.floor(duration - min * 60)

  const formatted = [min, sec].map(n => (n < 10 ? "0" + n : n)).join(":")

  return formatted
}

export default function AudioPlayer({
  currentSong,
  songCount,
  songIndex,
  onNext,
  onPrev,
  demoTracks,
}) {
  const audioRef = React.useRef(null)

  const [isReady, setIsReady] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [currrentProgress, setCurrrentProgress] = React.useState(0)
  const [buffered, setBuffered] = React.useState(0)
  const [volume, setVolume] = React.useState(1.0)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const durationDisplay = formatDurationDisplay(duration)
  const elapsedDisplay = formatDurationDisplay(currrentProgress)

  React.useEffect(() => {
    audioRef.current?.pause()
    let playPromise = audioRef.current?.play()
    if (playPromise !== undefined) {
      playPromise
        .then(_ => {})
        .catch(error => {
          audioRef.current?.pause()
        })
    }
  }, [songIndex])

  const handleNext = () => {
    isReady && onNext()
  }

  const handlePrev = () => {
    isReady && onPrev()
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current?.play()
      setIsPlaying(true)
    }
  }

  const handleBufferProgress = e => {
    const audio = e.currentTarget
    const dur = audio.duration
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) <
          audio.currentTime
        ) {
          const bufferedLength = audio.buffered.end(
            audio.buffered.length - 1 - i
          )
          setBuffered(bufferedLength)
          break
        }
      }
    }
  }

  const handleMuteUnmute = () => {
    if (!audioRef.current) return

    if (audioRef.current.volume !== 0) {
      audioRef.current.volume = 0
    } else {
      audioRef.current.volume = 1
    }
  }

  const handleVolumeChange = volumeValue => {
    if (!audioRef.current) return
    audioRef.current.volume = volumeValue
    setVolume(volumeValue)
  }

  return (
    <div
      style={{ position: "relative" }}
      className="p-3 text-white bg-brand-dark"
    >
      {currentSong && (
        <audio
          ref={audioRef}
          preload="metadata"
          onDurationChange={e => setDuration(e.currentTarget.duration)}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          // onEnded={handleNext}
          onCanPlay={e => {
            e.currentTarget.volume = volume
            setIsReady(true)
          }}
          onTimeUpdate={e => {
            setCurrrentProgress(e.currentTarget.currentTime)
            handleBufferProgress(e)
          }}
          onProgress={handleBufferProgress}
          onVolumeChange={e => setVolume(e.currentTarget.volume)}
        >
          <source type="audio/mpeg" src={currentSong.src} />
        </audio>
      )}
      <AudioProgressBar
        duration={duration}
        currentProgress={currrentProgress}
        buffered={buffered}
        onChange={e => {
          if (!audioRef.current) return

          audioRef.current.currentTime = e.currentTarget.valueAsNumber

          setCurrrentProgress(e.currentTarget.valueAsNumber)
        }}
      />

      <div className="flex items-center">
        <div className="flex items-center w-full sm:w-1/2">
          <div className="">
            <IconButton
              disabled={!isReady}
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
              size="md"
            >
              {!isReady && currentSong ? (
                <CgSpinner size={24} className="spinner" />
              ) : isPlaying ? (
                <MdPause size={30} />
              ) : (
                <MdPlayArrow size={30} />
              )}
            </IconButton>
          </div>

          <div className="flex items-center">
            <IconButton
              intent="secondary"
              size="sm"
              onClick={handleMuteUnmute}
              aria-label={volume === 0 ? "unmute" : "mute"}
            >
              {volume === 0 ? (
                <MdVolumeOff size={20} />
              ) : (
                <MdVolumeUp size={20} />
              )}
            </IconButton>
            <VolumeInput volume={volume} onVolumeChange={handleVolumeChange} />
          </div>
          <div className="flex items-center">
            <span className="">
              {elapsedDisplay} / {durationDisplay}
            </span>
          </div>
        </div>
        <div className="flex items-center w-full sm:w-1/2">
          <div>
            <StaticImage
              quality={95}
              src="./images/imaginarium-vol-1-art.jpg"
              placeholder="none"
              alt=""
              className="w-12 h-16"
            />
            {/* <GatsbyImage
              quality={95}
              // src="./images/imaginarium-vol-1-art.jpg"
              src={demoTracks[songIndex]?.image}
              placeholder="none"
              alt=""
              className="w-16 h-16"
            /> */}
          </div>
          <div className="">
            <p className="">{currentSong?.title ?? "Select a track"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

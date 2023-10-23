import * as React from "react"
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeOff } from "react-icons/md"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { CgSpinner } from "react-icons/cg"
import IconButton from "./IconButton"
import AudioProgressBar from "./AudioProgressBar"
import VolumeInput from "./VolumeInput"
import { useSiteContext } from "../hooks/use-site-context"
import { allProducts } from "../data/all-products"

function formatDurationDisplay(duration) {
  const min = Math.floor(duration / 60)
  const sec = Math.floor(duration - min * 60)

  const formatted = [min, sec].map(n => (n < 10 ? "0" + n : n)).join(":")

  return formatted
}

export default function AudioPlayer({
  currentSong,
  songIndex,
  isPaused,
  setIsPaused,
}) {
  const imageData = useStaticQuery(graphql`
    {
      allFile(
        filter: { relativeDirectory: { eq: "products" } }
        sort: { name: ASC }
      ) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED, quality: 95)
            }
            name
          }
        }
      }
    }
  `)

  const audioRef = React.useRef(null)

  const [isReady, setIsReady] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [currrentProgress, setCurrrentProgress] = React.useState(0)
  const [buffered, setBuffered] = React.useState(0)
  const [volume, setVolume] = React.useState(1.0)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const durationDisplay = formatDurationDisplay(duration)
  const elapsedDisplay = formatDurationDisplay(currrentProgress)
  const {
    setIsCartOpen,
    cartItemsFromLS,
    setCartItemsFromLS,
    isCrossSellModalOpen,
    setCrossSellItem,
    setCrossSellItemNum,
    setIsCrossSellModalOpen,
    isIOS,
  } = useSiteContext()

  const addToCart = () => {
    if (typeof localStorage !== undefined) {
      let tempCart = {
        items: [],
      }

      // If cart already exists
      if (cartItemsFromLS.length > 0) {
        // If product is not already in cart
        if (!cartItemsFromLS.includes(currentSong.prodCode)) {
          tempCart = JSON.parse(cartItemsFromLS)
          tempCart.items.push(currentSong.prodCode)
          localStorage.setItem("phelpsieCart", JSON.stringify(tempCart))
          setCartItemsFromLS(JSON.stringify(tempCart))
        }
        // else make a new cart
      } else {
        tempCart.items.push(currentSong.prodCode)
        localStorage.setItem("phelpsieCart", JSON.stringify(tempCart))
        setCartItemsFromLS(JSON.stringify(tempCart))
      }
      console.log("Tempcart: ", tempCart)
    }

    if (allProducts[songIndex].crossSellsWith) {
      if (!cartItemsFromLS.includes(allProducts[songIndex].crossSellsWith)) {
        setCrossSellItem(allProducts[songIndex].crossSellsWith)
        setCrossSellItemNum(allProducts[songIndex].crossSellsWithNum)
        setTimeout(() => {
          setIsPaused(true)
          setIsCrossSellModalOpen(true)
        }, 400)
      }
    }

    setIsCartOpen(true)
  }
  // This is necessary because localStorage isn't available at build time
  React.useEffect(() => {
    let phelpsieVolume = localStorage.getItem("phelpsieVolume")
    if (phelpsieVolume) setVolume(phelpsieVolume)
  }, [])

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

  React.useEffect(() => {
    if (isPaused) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current?.play()
      setIsPlaying(true)
    }
  }, [isPaused])

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
      !isCrossSellModalOpen && setIsPaused(true)
    } else {
      audioRef.current?.play()
      setIsPlaying(true)
      !isCrossSellModalOpen && setIsPaused(false)
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
      if (typeof localStorage !== undefined)
        localStorage.setItem("phelpsieVolume", audioRef.current.volume)
      audioRef.current.volume = 0
    } else {
      audioRef.current.volume = localStorage.getItem("phelpsieVolume")
    }
  }

  const handleVolumeChange = volumeValue => {
    if (!audioRef.current) return
    audioRef.current.volume = volumeValue
    if (typeof localStorage !== undefined)
      localStorage.setItem("phelpsieVolume", volumeValue)
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
          onEnded={() => setIsPaused(true)}
          // onEnded={handleNext}
          onLoadedMetadata={e => {
            e.currentTarget.volume = volume
            console.log("onLoadedMetadata fired")
            setIsReady(true)
          }}
          // onCanPlay={e => {
          //   e.currentTarget.volume = volume
          //   console.log("onCanPlay fired");
          //   setIsReady(true)
          // }}
          onTimeUpdate={e => {
            setCurrrentProgress(e.currentTarget.currentTime)
            handleBufferProgress(e)
          }}
          onProgress={handleBufferProgress}
          onVolumeChange={e => setVolume(e.currentTarget.volume)}
        >
          <source type="audio/mpeg" src={currentSong.audioSrc} />
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

      <div className="flex flex-wrap items-center justify-center text-sm sm:text-base">
        <div className="flex items-center justify-center w-full space-x-8 lg:w-1/2">
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

          {!isIOS && (
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
              <VolumeInput
                volume={volume}
                onVolumeChange={handleVolumeChange}
              />
            </div>
          )}
          <div className="flex items-center">
            <span className="">
              {elapsedDisplay} / {durationDisplay}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center w-full mt-2 space-x-2 sm:mt-0 sm:space-x-6 lg:space-x-8 lg:w-1/2">
          <div>
            {imageData.allFile.edges[songIndex]?.node.childImageSharp
              .gatsbyImageData && (
              <GatsbyImage
                image={
                  imageData.allFile.edges[songIndex]?.node.childImageSharp
                    .gatsbyImageData
                }
                className="w-16 h-16"
                alt=""
              />
            )}
          </div>
          <div className="">
            <p className="line-clamp-1 lg:pr-0">
              {currentSong?.title ?? "Select a track"}
            </p>
          </div>
          <div>
            {!isCrossSellModalOpen && (
              <p className="px-2 line-through bg-red-700 rounded-full">
                ${currentSong?.oldPrice}
              </p>
            )}
          </div>
          <div>
            {!isCrossSellModalOpen && (
              <p className="font-black">${currentSong?.price}</p>
            )}
          </div>
          {!isCrossSellModalOpen && (
            <div className="">
              <button
                type="button"
                onClick={() => addToCart()}
                className="px-4 py-2 text-xs font-bold text-white rounded-full sm:text-sm md:text-base whitespace-nowrap bg-brand-teal hover:bg-teal-300"
              >
                ADD TO CART
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

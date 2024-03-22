import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"
import { MdOutlineTimer } from "react-icons/md"

const Countdown = () => {
  const [time, setTime] = React.useState({
    minutes: 4,
    seconds: 0,
    centiseconds: 0,
  })

  React.useEffect(() => {
    let interval = setInterval(() => {
      if (time.minutes === 0 && time.seconds === 0 && time.centiseconds === 0) {
        clearInterval(interval)
      } else {
        if (time.centiseconds === 0) {
          if (time.seconds === 0) {
            setTime({
              minutes: time.minutes - 1,
              seconds: 59,
              centiseconds: 99,
            })
          } else {
            setTime({
              ...time,
              seconds: time.seconds - 1,
              centiseconds: 99,
            })
          }
        } else {
          setTime({
            ...time,
            centiseconds: time.centiseconds - 1,
          })
        }
      }
    }, 10)

    return () => clearInterval(interval)
  }, [time])

  return (
    <div
      id="thebanner"
      className={`banner-slidein sticky top-0 z-10 w-full pt-2 pb-2 md:pb-2 text-sm font-bold text-center text-white bg-red-700 md:text-lg`}
    >
      <p className="">
        <span className="border-b border-white">Limited Time Free Offer</span>
        <br />
        Invest in yourself now, before it's gone forever.
        <br />
        {/* <MdOutlineTimer className="inline-block w-5 h-5 mr-1 transform -translate-y-1 md:w-6 md:h-6" /> */}
        <span className="text-lg md:text-2xl">
          {time.minutes.toString().padStart(2, "0")}:
          {time.seconds.toString().padStart(2, "0")}:
          {time.centiseconds.toString().padStart(2, "0")}
        </span>
      </p>
    </div>
  )
}

export default Countdown

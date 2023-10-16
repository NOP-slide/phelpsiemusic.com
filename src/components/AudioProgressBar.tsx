import * as React from "react"

interface ProgressCSSProps extends React.CSSProperties {
  "--progress-width": number
  "--buffered-width": number
}

interface AudioProgressBarProps
  extends React.ComponentPropsWithoutRef<"input"> {
  duration: number
  currentProgress: number
  buffered: number
}

export default function AudioProgressBar(props: AudioProgressBarProps) {
  const { duration, currentProgress, buffered, ...rest } = props

  const progressBarWidth = isNaN(currentProgress / duration)
    ? 0
    : currentProgress / duration
  const bufferedWidth = isNaN(buffered / duration) ? 0 : buffered / duration

  const progressStyles: ProgressCSSProps = {
    "--progress-width": progressBarWidth,
    "--buffered-width": bufferedWidth,
  }

  return (
    <div className="absolute left-0 right-0 h-1 -top-2 group">
      <input
        type="range"
        name="progress"
        className={`progress-bar absolute inset-0 w-full m-0 h-full bg-transparent cursor-pointer dark:bg-brand-dark group-hover:h-2 transition-all accent-brand-teal hover:accent-brand-teal before:absolute before:inset-0 before:h-full before:w-full before:bg-brand-teal before:origin-left after:absolute after:h-full after:w-full after:bg-teal-700`}
        style={progressStyles}
        min={0}
        max={duration}
        value={currentProgress}
        {...rest}
      />
    </div>
  )
}

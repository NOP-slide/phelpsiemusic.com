import React from "react"

interface VolumeInputProps {
  volume: number
  onVolumeChange: (volume: number) => void
}

export default function VolumeInput({
  volume,
  onVolumeChange,
}: VolumeInputProps) {
  return (
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
        onVolumeChange(e.currentTarget.valueAsNumber)
      }}
    />
  )
}

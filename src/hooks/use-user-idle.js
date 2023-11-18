import * as React from "react"

export const useUserIdle = (timeout, onExpire) => {
  const timerId = React.useRef()

  //function to handle user activity
  const handleUserActivity = React.useCallback(() => {
    clearTimeout(timerId.current)
    timerId.current = setTimeout(onExpire, timeout)
  }, [onExpire, timeout])

  React.useEffect(() => {
    // Listen for user activity
    document.addEventListener("mousemove", handleUserActivity, {
      passive: true,
    })
    document.addEventListener("mousedown", handleUserActivity)
    document.addEventListener("keydown", handleUserActivity)
    document.addEventListener("touchstart", handleUserActivity)
    document.addEventListener("scroll", handleUserActivity, { passive: true })

    handleUserActivity()

    return () => {
      document.removeEventListener("mousemove", handleUserActivity, {
        passive: true,
      })
      document.removeEventListener("mousedown", handleUserActivity)
      document.removeEventListener("keydown", handleUserActivity)
      document.removeEventListener("touchstart", handleUserActivity)
      document.addEventListener("scroll", handleUserActivity, { passive: true })
    }
  }, [handleUserActivity])

  React.useEffect(() => {
    return () => {
      clearTimeout(timerId.current)
    }
  }, [])

  return { reset: handleUserActivity }
}

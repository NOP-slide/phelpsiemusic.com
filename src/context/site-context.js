import PropTypes from "prop-types"
import React, { createContext, useState } from "react"

const SiteContext = createContext({
  isUrgencyBannerOpen: false,
  setIsUrgencyBannerOpen: ()  => {},
  isIOS: true,
  setIsIOS: () => {},
  isEmailCollectorOpen: false,
  setIsEmailCollectorOpen: () => {},
  isMidiCratePopupOpen: false,
  setIsMidiCratePopupOpen: () => {},
  iosFlagHasBeenSet: false,
  setIosFlagHasBeenSet: () => {},
  isCartOpen: false,
  isVideoPlayerOpen: false,
  isCrossSellModalOpen: false,
  crossSellItem: '',
  crossSellItemNum: -1,
  setCrossSellItemNum: () => {},
  setCrossSellItem: () => {},
  cartItemsFromLS: [],
  setCartItemsFromLS: () => {},
  setIsCartOpen: () => {},
  setIsVideoPlayerOpen: () => {},
  videoPlayerSrc: '',
  setVideoPlayerSrc: () => {},
  setIsCrossSellModalOpen: () => {},
  playerZIndexBoost: false,
  setPlayerZIndexBoost: () => {},
  isExitIntentModalOpen: false,
  setIsExitIntentModalOpen: () => {},
  isUserAFK: false,
  setIsUserAFK: () => {},
})

function SiteProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isUrgencyBannerOpen, setIsUrgencyBannerOpen] = useState(false)
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false)
  const [videoPlayerSrc, setVideoPlayerSrc] = useState('')
  const [isCrossSellModalOpen, setIsCrossSellModalOpen] = useState(false)
  const [playerZIndexBoost, setPlayerZIndexBoost] = useState(false)
  const [crossSellItem, setCrossSellItem] = useState('')
  const [crossSellItemNum, setCrossSellItemNum] = useState(-1)
  const [isIOS, setIsIOS] = useState(true);
  const [iosFlagHasBeenSet, setIosFlagHasBeenSet] = useState(false);
  const [isEmailCollectorOpen, setIsEmailCollectorOpen] = useState(false);
  const [isMidiCratePopupOpen, setIsMidiCratePopupOpen] = useState(false);
  const [isExitIntentModalOpen, setIsExitIntentModalOpen] = useState(false);
  const [isUserAFK, setIsUserAFK] = useState(false);

  // Get cart contents from local storage and provide to each component
  let cartItems = []
  if (typeof localStorage !== undefined) {
    const phelpsieCart = localStorage.getItem("phelpsieCart")

    if (phelpsieCart) {
      cartItems = phelpsieCart
    }
  }

  const [cartItemsFromLS, setCartItemsFromLS] = useState(cartItems)

  return (
    <SiteContext.Provider
      value={{
        isUrgencyBannerOpen,
        setIsUrgencyBannerOpen,
        isEmailCollectorOpen,
        setIsEmailCollectorOpen,
        isMidiCratePopupOpen,
        setIsMidiCratePopupOpen,
        isIOS,
        setIsIOS,
        iosFlagHasBeenSet,
        setIosFlagHasBeenSet,
        isCartOpen,
        setIsCartOpen,
        cartItemsFromLS,
        setCartItemsFromLS,
        isVideoPlayerOpen,
        setIsVideoPlayerOpen,
        videoPlayerSrc,
        setVideoPlayerSrc,
        isCrossSellModalOpen,
        setIsCrossSellModalOpen,
        isExitIntentModalOpen,
        setIsExitIntentModalOpen,
        crossSellItem,
        setCrossSellItem,
        crossSellItemNum,
        setCrossSellItemNum,
        playerZIndexBoost,
        setPlayerZIndexBoost,
        isUserAFK,
        setIsUserAFK,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

SiteProvider.propTypes = {
  children: PropTypes.node,
}

export { SiteContext, SiteProvider }

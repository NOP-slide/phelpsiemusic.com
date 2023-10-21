import PropTypes from "prop-types"
import React, { createContext, useState } from "react"

const SiteContext = createContext({
  isCartOpen: false,
  isVideoPlayerOpen: false,
  isCrossSellModalOpen: false,
  crossSellItem: '',
  setCrossSellItem: () => {},
  cartItemsFromLS: [],
  setCartItemsFromLS: () => {},
  setIsCartOpen: () => {},
  setIsVideoPlayerOpen: () => {},
  setIsCrossSellModalOpen: () => {},
  playerZIndexBoost: false,
  setPlayerZIndexBoost: () => {},
})

function SiteProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false)
  const [isCrossSellModalOpen, setIsCrossSellModalOpen] = useState(false)
  const [playerZIndexBoost, setPlayerZIndexBoost] = useState(false)
  const [crossSellItem, setCrossSellItem] = useState('')

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
        isCartOpen,
        setIsCartOpen,
        cartItemsFromLS,
        setCartItemsFromLS,
        isVideoPlayerOpen,
        setIsVideoPlayerOpen,
        isCrossSellModalOpen,
        setIsCrossSellModalOpen,
        crossSellItem,
        setCrossSellItem,
        playerZIndexBoost,
        setPlayerZIndexBoost,
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

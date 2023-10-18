import PropTypes from "prop-types"
import React, { createContext, useState } from "react"

const SiteContext = createContext({
  isCartOpen: false,
  cartItemsFromLS: [],
  setCartItemsFromLS: () => {},
  setIsCartOpen: () => {},
})

function SiteProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false)

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

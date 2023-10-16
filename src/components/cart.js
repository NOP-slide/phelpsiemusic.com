import * as React from "react"
import { Link } from "gatsby"
import { useSiteContext } from "../hooks/use-site-context"

const Cart = () => {
  const { setIsCartOpen } = useSiteContext();

  const [cartOpen, setCartOpen] = React.useState(true);

  return (
    <div className={`cart-modal-container transform ${cartOpen ? 'cart-modal-fadein' : 'cart-modal-fadeout'}`}>
      <div className={`fixed right-0 h-screen w-small-cart sm:w-big-cart bg-brand-dark ${cartOpen ? 'cart-modal-slidein' : 'cart-modal-slideout'}`}>
        <button
          className="p-24 text-4xl text-red-600 bg-blue-600 border border-black "
          type="button"
          onClick={() => {
            setCartOpen(false);
            setTimeout(()=>setIsCartOpen(false), 350);
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default Cart

import * as React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { useSiteContext } from "../hooks/use-site-context"
import { useOutsideClick } from "../hooks/use-outside-click"
import { CgPushRight } from "react-icons/cg"

const Cart = () => {
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false)

  async function stripeCheckout() {
    setIsCheckoutLoading(true)
    try {
      const res = await fetch("/.netlify/functions/stripe-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ eventType: 'Contact', context:'123' }),
        body: null,
      })
      const data = await res.json()
      console.log("Return from netlify functions =", data)
      window.location = data.url
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      setIsCheckoutLoading(false)
    }
  }

  const phelpsieCart = [
    {
      title: "Imaginarium Vol. 2 - Trap & Drill Loop Kit",
      audioSrc: "imaginarium-vol-2-demo.mp3",
      oldPrice: 30,
      price: 17,
      imgName: "2-imaginarium-vol-2-art",
      slug: "/imaginarium-vol-2",
      prodCode: "imaginarium-v-2",
    },
    {
      title: "Imaginarium Vol. 1 - Trap & Drill Loop Kit",
      audioSrc: "imaginarium-vol-1-demo.mp3",
      oldPrice: 40,
      price: 27,
      imgName: "1-imaginarium-vol-1-art",
      slug: "/imaginarium-vol-1",
      prodCode: "imaginarium-v-1",
    },
    {
      title: "Imaginarium Vol. 1 - Trap & Drill Loop Kit",
      audioSrc: "imaginarium-vol-1-demo.mp3",
      oldPrice: 40,
      price: 27,
      imgName: "1-imaginarium-vol-1-art",
      slug: "/imaginarium-vol-1",
      prodCode: "imaginarium-v-1",
    },
    {
      title: "Imaginarium Vol. 1 - Trap & Drill Loop Kit",
      audioSrc: "imaginarium-vol-1-demo.mp3",
      oldPrice: 40,
      price: 27,
      imgName: "1-imaginarium-vol-1-art",
      slug: "/imaginarium-vol-1",
      prodCode: "imaginarium-v-1",
    },
    {
      title: "Imaginarium Vol. 2 - Trap & Drill Loop Kit",
      audioSrc: "imaginarium-vol-2-demo.mp3",
      oldPrice: 30,
      price: 17,
      imgName: "2-imaginarium-vol-2-art",
      slug: "/imaginarium-vol-2",
      prodCode: "imaginarium-v-2",
    },
    {
      title: "Imaginarium Vol. 2 - Trap & Drill Loop Kit",
      audioSrc: "imaginarium-vol-2-demo.mp3",
      oldPrice: 30,
      price: 17,
      imgName: "2-imaginarium-vol-2-art",
      slug: "/imaginarium-vol-2",
      prodCode: "imaginarium-v-2",
    },
    {
      title: "Imaginarium Vol. 2 - Trap & Drill Loop Kit",
      audioSrc: "imaginarium-vol-2-demo.mp3",
      oldPrice: 30,
      price: 17,
      imgName: "2-imaginarium-vol-2-art",
      slug: "/imaginarium-vol-2",
      prodCode: "imaginarium-v-2",
    },
    {
      title: "Imaginarium Vol. 1 - Trap & Drill Loop Kit",
      audioSrc: "imaginarium-vol-1-demo.mp3",
      oldPrice: 40,
      price: 27,
      imgName: "1-imaginarium-vol-1-art",
      slug: "/imaginarium-vol-1",
      prodCode: "imaginarium-v-1",
    },
    {
      title: "Imaginarium Vol. 1 - Trap & Drill Loop Kit",
      audioSrc: "imaginarium-vol-1-demo.mp3",
      oldPrice: 40,
      price: 27,
      imgName: "1-imaginarium-vol-1-art",
      slug: "/imaginarium-vol-1",
      prodCode: "imaginarium-v-1",
    },
  ]

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

  const { setIsCartOpen } = useSiteContext()

  const [cartOpen, setCartOpen] = React.useState(true)

  const handleOutsideClick = () => {
    setCartOpen(false)
    setTimeout(() => setIsCartOpen(false), 350)
  }

  const ref = useOutsideClick(handleOutsideClick)
  return (
    <div
      className={`cart-modal-container transform ${
        cartOpen ? "cart-modal-fadein" : "cart-modal-fadeout"
      }`}
    >
      <div
        ref={ref}
        className={`fixed right-0 p-6 h-screen w-small-cart sm:w-big-cart bg-brand-dark ${
          cartOpen ? "cart-modal-slidein" : "cart-modal-slideout"
        }`}
      >
        <div className="relative h-screen">
          <div className="flex">
            <button
              className="text-3xl text-white"
              type="button"
              onClick={() => {
                setCartOpen(false)
                setTimeout(() => setIsCartOpen(false), 350)
              }}
            >
              <CgPushRight />
            </button>
            <h2 className="mx-auto text-2xl font-bold text-center text-white">
              CART
            </h2>
          </div>

          <div className="flex flex-col gap-6 px-2 mt-12 overflow-y-auto h-1/2 md:h-4/6 scroll-without-scrollbar">
            {phelpsieCart.map((item, num) => (
              <div
                key={num}
                className="flex w-full pb-6 border-b border-gray-700 sm:pb-0 sm:border-none"
              >
                <Link to={item.slug}>
                  <GatsbyImage
                    image={
                      imageData.allFile.edges[
                        imageData.allFile.edges.findIndex(
                          edge => edge.node.name === item.imgName
                        )
                      ]?.node.childImageSharp.gatsbyImageData
                    }
                    className="w-24 h-16 sm:w-24 sm:h-24"
                    alt=""
                  />
                </Link>
                <div className="flex flex-col justify-center px-4">
                  <div className="text-sm font-semibold text-white sm:text-base">
                    {item.title}
                  </div>
                  <div className="text-lg font-black text-white sm:text-xl">
                    ${item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 z-30 flex flex-col w-full gap-6 px-0 pt-8 pb-16 sm:px-6 bg-brand-dark fill-available">
            <h3 className="text-lg font-semibold text-center text-gray-500">
              Subtotal : ${phelpsieCart.map(item => item.price).reduce((a, b) => a + b, 0)}
            </h3>
            <button
              className={`whitespace-nowrap transition ease-in-out hover:scale-110 duration-200 hover:bg-teal-300 px-12 py-3 sm:py-4 text-lg text-white font-bold bg-brand-teal rounded-full ${
                isCheckoutLoading ? "checkout-loading" : ""
              }`}
              disabled={isCheckoutLoading}
              type="button"
              onClick={() => stripeCheckout()}
            >
              GO TO CHECKOUT
            </button>
            <button
              className="w-auto mx-auto text-sm font-semibold tracking-wide text-center text-gray-400 underline"
              type="button"
              onClick={() => {
                setCartOpen(false)
                setTimeout(() => setIsCartOpen(false), 350)
              }}
            >KEEP SHOPPING</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

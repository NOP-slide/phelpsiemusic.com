const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.handler = async ({ body }) => {
  console.log(
    "*****************************************************************************************************************************BODY******************************************************************************",
    body
  )
  const res = await stripe.paymentMethods.retrieve(JSON.parse(body).pm)

  return {
    statusCode: 200,
    body: JSON.stringify({
      paymentMethod: res,
    }),
  }
}

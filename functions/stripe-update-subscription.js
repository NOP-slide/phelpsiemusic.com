const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.handler = async ({ body }) => {
  console.log(
    "*****************************************************************************************************************************BODY******************************************************************************",
    body
  )
  const res = await stripe.subscriptions.update(JSON.parse(body).id, {
    metadata: { authenticated: "true" },
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: "ok",
    }),
  }
}

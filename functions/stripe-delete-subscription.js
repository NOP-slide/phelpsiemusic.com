const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.handler = async ({ body }) => {
  console.log(
    "*****************************************************************************************************************************BODY******************************************************************************",
    body
  )
  const res = await stripe.subscriptions.cancel(JSON.parse(body).id, {
    cancellation_details: { comment: "card_failed" },
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: "ok",
    }),
  }
}

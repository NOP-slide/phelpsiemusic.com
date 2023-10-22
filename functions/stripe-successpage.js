const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.handler = async ({ body }) => {
  const session = await stripe.checkout.sessions.retrieve(JSON.parse(body).sessionID)

  return {
    statusCode: 200,
    body: JSON.stringify({
      customer: session.customer_details,
    }),
  }
}

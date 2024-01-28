const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.handler = async ({ body }) => {
  console.log("Body: ", body)
  let lineItems = []
  let obj = {}
  obj.price = JSON.parse(body)
  obj.quantity = 1
  lineItems.push(obj)

  const email = JSON.parse(body).email

  console.log("Lineitems: ", lineItems)

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "subscription",
    success_url: `https://phelpsiemusic.com/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://phelpsiemusic.com/`,
    subscription_data: {
      trial_period_days: 30,
    },
  })
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: session.id,
      url: session.url,
    }),
  }
}

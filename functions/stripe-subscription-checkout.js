const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.handler = async ({ body }) => {
  console.log("Body: ", body)
  let lineItems = []
  let obj = {}
  obj.price = "price_1OH8QSAHwqgwuHo3DFgteSqv";
  obj.quantity = 1
  lineItems.push(obj)

  const email = JSON.parse(body);

  console.log("Lineitems: ", lineItems)
  console.log("Email: ", email);

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "subscription",
    success_url: `https://phelpsiemusic.com/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://phelpsiemusic.com/midi-crate`,
    subscription_data: {
      trial_period_days: 30,
    },
    after_expiration: {
      recovery: {
        enabled: true,
      },
    },
    customer_email: email,
    expires_at: Math.floor(Date.now() / 1000) + (2700), // Configured to expire after 6 hours (21600)
  })
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: session.id,
      url: session.url,
    }),
  }
}

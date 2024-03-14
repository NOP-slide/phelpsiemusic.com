const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.handler = async ({ body }) => {
  const customerId = JSON.parse(body).id
  console.log("ID IN FunC= ", customerId)

  const priceId = "price_1OH8QSAHwqgwuHo3DFgteSqv"

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
      trial_period_days: 30,
    })

    if (subscription.pending_setup_intent !== null) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          type: "setup",
          clientSecret: subscription.pending_setup_intent.client_secret,
          id: subscription.id,
        }),
      }
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          type: "payment",
          clientSecret:
            subscription.latest_invoice.payment_intent.client_secret,
          id: subscription.id,
        }),
      }
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${error.message}`,
    }
  }
}

const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.handler = async ({ body }) => {
  console.log("BODY: ", body)
  try {
    const intent = await stripe.paymentIntents.create({
      amount: 900, // $9
      currency: 'usd',
      capture_method: 'manual',
      statement_descriptor_suffix: 'Card Verify',
      confirm: true,
      payment_method: JSON.parse(body).pm,
      customer: JSON.parse(body).cus,
      return_url: 'https://www.phelpsiemusic.com/success-mc',
    });

    if (intent.status === 'requires_capture') {
      // Payment method is verified
      return {
        statusCode: 200,
        body: JSON.stringify({
          verification: true,
        }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        verification: false,
      }),
    }
  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        verification: false,
      }),
    }
  }
}

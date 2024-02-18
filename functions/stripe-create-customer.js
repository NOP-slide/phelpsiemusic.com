const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.handler = async ({ body }) => {
  const customer = await stripe.customers.create({
    name: JSON.parse(body).name,
    email: JSON.parse(body).email,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      customer: customer,
    }),
  }
}

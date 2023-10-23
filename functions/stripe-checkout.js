const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.handler = async ({body}) => {
    console.log("Body: ", body);
    let lineItems = [];
    JSON.parse(body).map(item=>{
      let obj = {};
      obj.price = item.stripeCode;
      obj.quantity = 1;
      lineItems.push(obj)
    });

    console.log("Lineitems: ", lineItems);

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `http://localhost:8888/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:8888/`,
        after_expiration: {
          recovery: {
            enabled: true,
            allow_promotion_codes: true,
          },
        },
        customer_email: 'seadoo14@gmail.com',
        expires_at: Math.floor(Date.now() / 1000) + (3600 / 2), // Configured to expire after 30 min
      });
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: session.id,
      url: session.url,
    }),
  };
};
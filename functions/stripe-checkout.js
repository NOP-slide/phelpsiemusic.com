const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.handler = async ({body}) => {
    console.log("Body: ", body);
    let lineItems = [];
    JSON.parse(body).cartItems.map(item=>{
      let obj = {};
      obj.price = item.stripeCode;
      obj.quantity = 1;
      lineItems.push(obj)
    });

    const email = JSON.parse(body).email;

    console.log("Lineitems: ", lineItems);

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        allow_promotion_codes: true,
        success_url: `https://phelpsiemusic.com/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://phelpsiemusic.com/`,
        after_expiration: {
          recovery: {
            enabled: true,
            allow_promotion_codes: true,
          },
        },
        customer_email: email,
        expires_at: Math.floor(Date.now() / 1000) + (14400), // Configured to expire after 4 hours
      });
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: session.id,
      url: session.url,
    }),
  };
};
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.handler = async () => {
    // console.log(event);
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1O140pAHwqgwuHo34UD20mDj',
            quantity: 1,
          },
          {
            price: 'price_1O141LAHwqgwuHo3QYrwT1JD',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://localhost:8888/?success=true`,
        cancel_url: `https://localhost:8888/?canceled=true`,
      });
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: session.id,
      url: session.url,
    }),
  };
};
require("dotenv").config();

//connect stripe with private key
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

async function paymentStripe(req, res, next) {
  const { Order_quantity, Car_name, Car_model, Car_rentPrice, bookedDays } =
    req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "rm",
            product_data: {
              name: Car_name + " " + Car_model,
            },
            unit_amount: +Car_rentPrice * 100,
          },
          quantity: +Order_quantity * +bookedDays,
        };
      }),
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}`,
    });
    req.url = session.url
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  paymentStripe: paymentStripe,
};

import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(cors());

app.post("/create-checkout-session", async (req, res) => {
    const { amount, product } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: { name: product },
                unit_amount: amount * 100,
            },
            quantity: 1,
        }],
        mode: "payment",
        success_url: "https://your-frontend-site.com/success",
        cancel_url: "https://your-frontend-site.com/cancel",
    });

    res.json({ id: session.id });
});

app.listen(10000, () => console.log("Server running on port 10000"));

import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const stripe = new Stripe('sk_test_51QxrOUGmxOvkyo74mqKzwEQPIYEoBklqSTKeVXBQqcgzolyrLu9UnbKlntndd1KkjpCI3pkEzB89mQRDUk3gjxWN009COp8Qel');

app.use(express.json());
app.use(cors());

app.post("/create-checkout-session", async (req, res) => {
    try {
        const { amount, product } = req.body;
    
    if (!amount || !product) {
            return res.status(400).json({ error: "Missing amount or product" });
    }


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
        success_url: "https://bike-shop-backend-2l3f.onrender.com",
        cancel_url: "https://bike-shop-backend-2l3f.onrender.com",
    });

    res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(10000, () => console.log("Server running on port 10000"));

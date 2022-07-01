const mongoose = require("mongoose");

const billingSchema = mongoose.Schema(
    {
        billing_id: {
            type: Number,
            required: true,
            unique: true,
        },
        full_name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        paid_amount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = billingSchema;

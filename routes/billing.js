const express = require("express");
const { default: mongoose } = require("mongoose");
const { verifyToken } = require("./verifyToken");
const router = express.Router();

const billingSchema = require("../schemas/billingSchema");
const Billing = new mongoose.model("Billing", billingSchema);

router.post("/add-billing", verifyToken, async (req, res) => {
    // console.log(req.body);
    try {
        const uniqueId = Date.now();
        const newBill = new Billing({ ...req?.body, billing_id: uniqueId });
        const addedBill = await newBill.save();
        // console.log("addedBill data => ", addedBill);
        res.status(200).json({
            status: 1,
            message: "Bill added successfully!",
        });
    } catch (err) {
        console.log("bill adding error =>", err);
        res.status(500).json({
            status: 0,
            error: "There was a server side error!",
        });
    }
});

// get searched bills
router.get("/billing-list", verifyToken, async (req, res) => {
    // console.log(req.query.key);
    try {
        let query = {};
        let regex;
        if (req?.query?.full_name) {
            regex = new RegExp(req?.query?.full_name, "i");
            query = {
                $or: [
                    {
                        full_name: regex,
                    },
                ],
            };
        } else if (req?.query?.email) {
            regex = new RegExp(req?.query?.email, "i");
            query = {
                $or: [
                    {
                        email: regex,
                    },
                ],
            };
        } else if (req?.query?.phone) {
            regex = new RegExp(req?.query?.phone, "i");
            query = {
                $or: [
                    {
                        phone: regex,
                    },
                ],
            };
        }
        // console.log(query);
        const data = await Billing.find(query).sort({ _id: -1 });
        res.status(200).json({
            status: 1,
            result: data,
            message: "Billings data retrieve successfully!",
        });
    } catch (err) {
        console.log("bills fetching error => ", err);
        res.status(500).json({
            status: 0,
            error: "There was a server side error!",
        });
    }
});

// get single data

router.get("/update-billing/:id", verifyToken, async (req, res) => {
    try {
        const bill = await Billing.findById(req.params.id);
        res.status(200).json({
            status: 1,
            data: bill,
            message: "Billing data updated successfully!",
        });
    } catch (err) {
        console.log("billing updating error", err);
        res.status(500).json({
            status: 0,
            error: "There was a server side error!",
        });
    }
});

// update billing
router.put("/update-billing/:id", verifyToken, async (req, res) => {
    try {
        const updateBill = await Billing.findByIdAndUpdate(
            req?.params?.id,
            {
                $set: req?.body,
            },
            { new: true }
        );
        res.status(200).json({
            status: 1,
            message: "Billing data updated successfully!",
        });
    } catch (err) {
        console.log("billing updating error", err);
        res.status(500).json({
            status: 0,
            error: "There was a server side error!",
        });
    }
});

// delete a bill
router.delete("/delete-billing/:id", verifyToken, async (req, res) => {
    console.log(req?.params);
    const id = req?.params?.id;
    try {
        const result = await Billing.findOneAndDelete({ _id: id });
        res.status(200).json({
            status: 1,
            message: "Billing data deleted successfully!",
        });
    } catch (err) {
        console.log("billing deleting error", err);
        res.status(500).json({
            status: 0,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;

const express = require("express");
const { default: mongoose } = require("mongoose");
const { verifyToken } = require("./verifyToken");
const router = express.Router();

const billingSchema = require("../schemas/billingSchema");
const Billing = new mongoose.model("Billing", billingSchema);

router.post("/", verifyToken, async (req, res) => {
    // console.log(req.body);
    try {
        const newBill = new Billing(req?.body);
        const addedBill = await newBill.save();
        console.log("addedBill data => ", addedBill);
        res.status(200).json({
            status: 1,
            message: "Review added successfully!",
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
router.get("/", async (req, res) => {
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
            message: "Data retrieve successfully!",
        });
    } catch (err) {
        console.log("bills fetching error => ", err);
        res.status(500).json({
            status: 0,
            error: "There was a server side error!",
        });
    }
});

// update billing
router.put("/:id", verifyToken, async (req, res) => {
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
router.delete("/:id", verifyToken, async (req, res) => {
    const id = req?.params?.id;
    // console.log(id);
    try {
        const result = await Billing.findOneAndDelete(id);
        res.status(200).json({
            status: 1,
            message: "Blog deleted successfully!",
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

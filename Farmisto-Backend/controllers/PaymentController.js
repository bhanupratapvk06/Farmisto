const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const pdf = require("pdfkit");

const createPayment = async (req, res) => {
  try {
    const { cartItems, address, farmers } = req.body;

    if (!farmers || farmers.length === 0) {
      return res.status(400).json({ message: "Information is incomplete" });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items cannot be empty" });
    }

    if (
      !address ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip ||
      !address.country
    ) {
      return res
        .status(400)
        .json({ message: "Shipping address is incomplete" });
    }

    const updatedCartItems = cartItems.map((item) => {
      const discountValue = (item.itemPrice * item.discount) / 100;
      const discountedPrice = item.itemPrice - discountValue;
      const totalItemCost = discountedPrice * item.quantity;

      return {
        ...item,
        discountedPrice: discountedPrice.toFixed(2),
        totalItemCost: totalItemCost.toFixed(2),
      };
    });

    const totalAmount = updatedCartItems.reduce(
      (sum, item) => sum + parseFloat(item.totalItemCost),
      0
    );

    const payment = new Payment({
      farmers: farmers,
      buyer: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
      cartItems: updatedCartItems,
      totalAmount,
      address,
      paymentMethod: "COD",
    });

    await payment.save();

    const doc = new pdf();

    doc
      .fillColor("#006400")
      .fontSize(18)
      .text(`Invoice for Order #${payment._id}`, { align: "center" })
      .moveDown(1);

    doc
      .fontSize(14)
      .text(`Buyer Name: ${req.user.name}`, { align: "left" })
      .moveDown(0.5);
    doc.text(`Buyer Email: ${req.user.email}`, { align: "left" }).moveDown(0.5);
    doc.text(`Total Amount: Rs ${totalAmount.toFixed(2)}`).moveDown(2);

    const tableTop = doc.y;
    doc
      .fillColor("#008000")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Item Name", 40, tableTop, { width: 120, align: "left" })
      .text("Price", 180, tableTop, { width: 100, align: "right" })
      .text("Discount", 280, tableTop, { width: 80, align: "right" })
      .text("Quantity", 380, tableTop, { width: 80, align: "right" })
      .text("Discounted Price", 480, tableTop, { width: 100, align: "right" })
      .text("Total", 600, tableTop, { width: 100, align: "right" });

    doc
      .moveTo(30, tableTop + 15)
      .lineTo(600, tableTop + 15)
      .stroke();

    let currentY = tableTop + 20;
    updatedCartItems.forEach((item) => {
      doc
        .fillColor("#000000")
        .fontSize(10)
        .font("Helvetica")
        .text(item.itemName, 40, currentY, { width: 120, align: "left" })
        .text(`Rs ${item.itemPrice.toFixed(2)}`, 180, currentY, {
          width: 100,
          align: "right",
        })
        .text(`${item.discount}%`, 280, currentY, { width: 80, align: "right" })
        .text(item.quantity.toString(), 380, currentY, {
          width: 80,
          align: "right",
        })
        .text(`Rs ${item.discountedPrice}`, 480, currentY, {
          width: 100,
          align: "right",
        })
        .text(`Rs ${item.totalItemCost}`, 600, currentY, {
          width: 100,
          align: "right",
        });

      currentY += 20;
    });

    doc.moveTo(30, currentY).lineTo(600, currentY).stroke();

    doc
      .fillColor("#006400")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("\nFarmers Involved:", 40, currentY + 20);

    farmers.forEach((farmer, index) => {
      doc
        .fillColor("#000000")
        .fontSize(10)
        .font("Helvetica")
        .text(
          `${index + 1}. ${farmer.name} (${farmer.email})`,
          40,
          currentY + 50 + index * 20
        );
    });

    doc
      .fillColor("#006400")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("\nShipping Address:", 40, currentY + 60 + farmers.length * 20);
    doc
      .fillColor("#000000")
      .fontSize(10)
      .font("Helvetica")
      .text(
        `${address.street}, ${address.city}, ${address.state} - ${address.zip}, ${address.country}`,
        40,
        currentY + 100 + farmers.length * 20
      );

    doc
      .fillColor("#006400")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("\nPayment Method:", 40, currentY + 120 + farmers.length * 20);
    doc
      .fillColor("#000000")
      .fontSize(10)
      .font("Helvetica")
      .text(payment.paymentMethod, 40, currentY + 150 + farmers.length * 20);

    doc
      .fillColor("#8FBC8F")
      .fontSize(12)
      .font("Helvetica")
      .text("\nThank you for your purchase!", { align: "center" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${payment._id}.pdf"`
    );
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Error creating payment:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const GetPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ "farmers.email": req.user.email });

    if (!payments || payments.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found for this farmer" });
    }

    res.status(200).json({ message: "Payments Fetched Successfully! ", payments });
  } catch (error) {
    console.error("Error getting payments:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const ALLOWED_UPDATE_FIELDS = ["orderStatus", "paymentMethod"];

const UpdatePayment = async (req, res) => {
  try {
    const { field, value, id } = req.body;
    if (!ALLOWED_UPDATE_FIELDS.includes(field)) {
      return res.status(400).json({ message: `Field '${field}' cannot be updated` });
    }
    const payment = await Payment.findByIdAndUpdate(
      { _id: id },
      { [field]: value },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    return res.status(200).json(payment);
  }
  catch (error) {
    console.error("Error updating payment:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createPayment, GetPayments, UpdatePayment };

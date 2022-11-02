const fs = require("fs");
const PDFDocument = require("pdfkit");
const dateHandle = require("./dateHandle.js");
require("dotenv").config();

const env = process.env;
const logoPath = "back_end/util/img/lbjlogo.png";

async function createInvoice(req, res) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  const invNum = generateInvNum(req);
  req.invNum = invNum
  try{
      generateHeader(doc);
      generateCustomerInformation(doc, req);
      generateInvoiceTable(doc, req);
      generateFooter(doc);
      doc.end();
      await doc.pipe(fs.createWriteStream("back_end/util/invoice/" + invNum + ".pdf"));
      res.status(200).download("back_end/util/invoice/" + invNum + ".pdf");
    }
    catch(err){
      console.log(err)
    }
}

function generateHeader(doc) {
  doc
    .image(logoPath, 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text(env.COMPANYNAME, 110, 57)
    .fontSize(10)
    .text(env.COMPANYNAME, 200, 50, { align: "right" })
    .text(env.COMPANYSTREET, 200, 65, { align: "right" })
    .text(env.COMPANYCITY, 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, req) {
  const invNum = req.invNum;
  const {
    Order_dateTime,
    Car_rentPrice,
    PickUp_dateTime,
    DropOff_dateTime,
    PickUp_address,
    Cust_name,
    PickUp_city,
    PickUp_state,
  } = req.body.InvInfo;

  const quantity = dateHandle.getDatesInRange(PickUp_dateTime, DropOff_dateTime);
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);
  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invNum, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(
      dateHandle.formatDate(Order_dateTime),
      150,
      customerInformationTop + 15
    )
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(Car_rentPrice * quantity),
      150,
      customerInformationTop + 30
    )
    .font("Helvetica-Bold")
    .text(Cust_name, 300, customerInformationTop)
    .font("Helvetica")
    .text(PickUp_address, 300, customerInformationTop + 15)
    .text(PickUp_city + ", " + PickUp_state, 300, customerInformationTop + 30)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, req) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  var subtotal = 0;

  for (i = 0; i < req.body.InvInfo.length; i++) {
    const item = req.body.InvInfo[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.Car_id,
      item.Car_brand + " " + item.Car_model,
      formatCurrency(item.Car_rentPrice),
      item.Order_quantity,
      formatCurrency(item.Car_rentPrice * item.Order_quantity)
    );

    generateHr(doc, position + 20);
    subtotal += item.Car_rentPrice * item.Order_quantity;
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(0)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(subtotal)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(price) {
  return "RM" + (price + 0.0).toFixed(2);
}

function generateInvNum(req) {
  const invNum = dateHandle.formatInvDate(req.body.Order_dateTime) + ("00" + req.body.OrderNumToday).slice(-3)
  return invNum;
}
module.exports = {
  createInvoice,
};

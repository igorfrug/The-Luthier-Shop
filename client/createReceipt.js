
const fs = require("fs");
const PDFDocument = require("pdfkit");


function createReceipt(receipt, path) {

    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, receipt);
    generateReceiptTable(doc, receipt);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));


    function generateHeader(doc) {
        doc
            .image('C:/Users/igorf/OneDrive/Desktop/My projects/MySTORE/images/frog-plays-violin-vector-illustration-eps-41005022.jpg', 50, 30, { width: 45, height: 60 })
            .fillColor("#444444")
            .fontSize(20)
            .text("FROG THE FIDDLER", 110, 57)
            .fontSize(10)
            .text("Qwa-Qwa-land, The Central Swamp Concert Hall", 200, 50, { align: "right" })
            .text("Email: frogifiddles@frog.qwa", 200, 65, { align: "right" })
            .text("Tel: +222-2222222", 200, 80, { align: "right" })
            .moveDown();
    }

    function generateCustomerInformation(doc, receipt) {
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("Receipt", 50, 160);

        generateHr(doc, 185);

        const customerInformationTop = 200;

        doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Receipt Number:", 50, customerInformationTop)
            .font("Helvetica")
            .text(receipt.invoice_nr, 150, customerInformationTop)
            .font("Helvetica-Bold")
            .text("Receipt Date:", 50, customerInformationTop + 15)
            .font("Helvetica")
            .text(formatDate(new Date()), 150, customerInformationTop + 15)
            .font("Helvetica-Bold")
            .text("Total cost:", 50, customerInformationTop + 30)
            .font("Helvetica")
            .text(
                `$${receipt.paid}`,
                150,
                customerInformationTop + 30
            )

            .font("Helvetica-Bold")
            .text(receipt.head.name + " " + receipt.head.surname, 300, customerInformationTop)
            .text("ID Number:", 300, customerInformationTop + 15)
            .font("Helvetica")
            .text(receipt.head.id, 360, customerInformationTop + 15)
            .font("Helvetica-Bold")
            .text("Shipping address:", 300, customerInformationTop + 30)
            .font("Helvetica")
            .text(
                receipt.head.city +
                ", " +
                receipt.head.street,
                390,
                customerInformationTop + 30
            )
            .moveDown();

        generateHr(doc, 252);
    }

    function generateReceiptTable(doc, receiptPar) {
        let i;
        const receiptTableTop = 330;

        doc.font("Helvetica-Bold");
        generateTableRow(
            doc,
            receiptTableTop,
            `Author/Luthier
        /Manufacturer`,
            "        Item",
            "Quantity",
            "Unit Cost",
            "Total For Item"
        );
        generateHr(doc, receiptTableTop + 20);
        doc.font("Helvetica");

        for (i = 0; i < receipt.table.length; i++) {
            const item = receipt.table[i];
            const position = receiptTableTop + (i + 1) * 30;
            generateTableRow(
                doc,
                position,
                item.author,
                item.name,
                item.quantity,
                `$${item.price}`,
                `$${item.total_price}`
            );

            generateHr(doc, position + 20);
        }
        const paidPosition = receiptTableTop + (i + 1) * 30;
        doc.font("Helvetica-Bold")
        generateTableRow(
            doc,
            paidPosition,
            "",
            "",
            "",
            "Paid:",
            `$${receipt.paid}`

        );
        const deliveryPosition = paidPosition + (i + 1) * 7;
        doc.font("Helvetica-Bold")
        generateTableRow(
            doc,
            deliveryPosition,
            "Delivery on: ",
            `${formatDate(new Date(receipt.shipping))}`
        );
        const cardPosition = deliveryPosition + (i + 1) * 7;
        doc.font("Helvetica-Bold")
        generateTableRow(
            doc,
            cardPosition,
            "Paid by Card:",

            `******${receipt.card}`
        );
    }

    function generateFooter(doc) {
        doc
            .fontSize(10)
            .text(
                "Thank you  for your purchase!",
                50,
                760,
                { align: "center", width: 500 }
            );
    }

    function generateTableRow(
        doc,
        y,
        author,
        item,
        unitCost,
        quantity,
        totalPrice
    ) {
        doc
            .fontSize(10)
            .text(author, 50, y)
            .text(item, 150, y)
            .text(unitCost, 280, y, { width: 90, align: "right" })
            .text(quantity, 370, y, { width: 90, align: "right" })
            .text(totalPrice, 0, y, { align: "right" });
    }

    function generateHr(doc, y) {
        doc
            .strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, y)
            .lineTo(550, y)
            .stroke();
    }
    function formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return year + "/" + month + "/" + day;
    }
}



module.exports = { createReceipt }
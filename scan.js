/* =========================================================
   Bharat.io – QR Scan Engine (FINAL)
   File: scan.js
========================================================= */


/* =========================
   CONFIGURATION
========================= */

const SHEET_CSV_URL =
"https://opensheet.elk.sh/12OsU8oViB-MztQLh1Ly7zSCPOaCAPBWb45TtUpIcg2c/Form%20Responses%201";


/* =========================
   HELPERS
========================= */

// URL parameter read
function getParam(name){

const params = new URLSearchParams(window.location.search);

return params.get(name);

}


// CSV parser
function parseCSV(text){

return text
.trim()
.split("\n")
.map(row =>

row
.split(",")
.map(cell =>

cell
.replace(/^"|"$/g,"")
.trim()

)

)

}


// Safe HTML
function escapeHTML(text){

if(!text) return "";

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")

}



/* =========================
   MAIN ELEMENT
========================= */

const container = document.querySelector(".container");



/* =========================
   QR ID READ
========================= */

const qrId = getParam("id");



/* =========================
   QR MISSING
========================= */

if(!qrId){

container.innerHTML = `

<h2>Invalid QR Code</h2>

<p>
This QR link appears incomplete.
Please scan the QR sticker again.
</p>

`;

throw new Error("QR ID missing");

}



/* =========================
   FETCH GOOGLE SHEET
========================= */

fetch(SHEET_CSV_URL)

.then(response => response.json())

.then(data =>{


/* =========================
   FIND MATCHING STICKER
========================= */

const record = data.find(row => row["Sticker ID"] === qrId);



/* =========================
   QR NOT REGISTERED
========================= */

if(!record){

container.innerHTML = `

<h2>QR Not Registered</h2>

<p>
This QR sticker is not connected
to any vehicle owner yet.
</p>

<a href="register.html" class="btn-primary">
Register This QR
</a>

`;

return;

}



/* =========================
   EXTRACT DATA
========================= */

const vehicle = escapeHTML(record["Vehicle Number"]);

const phone = escapeHTML(record["Mobile Number"]);

const email = escapeHTML(record["Email (Optional)"]);

const profession = escapeHTML(record["Profession / Business Title"]);

const work = escapeHTML(record["Work Description (Max 30–40 words)"]);



/* =========================
   BUILD UI
========================= */

container.innerHTML = `

<h2>Vehicle Owner Contact</h2>

<div class="owner-card">


${vehicle ? `

<div class="info-row">

<span class="label">
Vehicle Number
</span>

<span class="value">
${vehicle}
</span>

</div>

` : ""}



${profession ? `

<div class="info-row">

<span class="label">
Profession
</span>

<span class="value">
${profession}
</span>

</div>

` : ""}



${work ? `

<div class="info-row">

<span class="label">
About
</span>

<span class="value">
${work}
</span>

</div>

` : ""}



<div class="action-buttons">


${phone ? `

<a href="tel:${phone}" class="btn-primary full">

📞 Call Vehicle Owner

</a>

` : ""}



${phone ? `

<a href="https://wa.me/${phone.replace(/\D/g,"")}"

class="btn-secondary full">

💬 WhatsApp Message

</a>

` : ""}



${email ? `

<a href="mailto:${email}"

class="btn-secondary full">

✉ Email Owner

</a>

` : ""}


</div>

</div>


<p class="note">

This contact information is shared
only for parking assistance or
emergency situations.

</p>

`;


})


.catch(error =>{


console.error(error);


container.innerHTML = `

<h2>Something Went Wrong</h2>

<p>

Unable to load vehicle details.

Please try again later.

</p>

`;


});

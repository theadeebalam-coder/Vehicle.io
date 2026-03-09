/* =========================================================
   Bharat.io – QR Scan Engine (Production Version)
   File: scan.js
   Purpose:
   - Read QR Sticker ID
   - Fetch Google Sheet database
   - Match sticker with owner
   - Display vehicle contact / business profile
========================================================= */


/* ===============================
   CONFIGURATION
================================ */

const SHEET_API =
"https://opensheet.elk.sh/12OsU8oViB-MztQLh1Ly7zSCPOaCAPBWb45TtUpIcg2c/Form%20Responses%201";


/* ===============================
   GLOBAL ELEMENTS
================================ */

const container = document.querySelector(".container");
const ownerContainer = document.getElementById("ownerData");


/* ===============================
   HELPER FUNCTIONS
================================ */

function getParam(name){

const params = new URLSearchParams(window.location.search);

return params.get(name);

}


function escapeHTML(text){

if(!text) return "";

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")

}


function normalize(value){

if(!value) return "";

return String(value).trim();

}



/* ===============================
   LOADING UI
================================ */

function showLoading(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>Loading Profile</h3>

<p>

Please wait while we retrieve the profile
information from Bharat.io database.

</p>

</div>

`;

}



/* ===============================
   ERROR UI
================================ */

function showError(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>System Error</h3>

<p>

Unable to load profile information.

Please try again later.

</p>

</div>

`;

}



/* ===============================
   QR NOT REGISTERED
================================ */

function showNotRegistered(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>QR Not Registered</h3>

<p>

This QR sticker is not connected
to any registered user yet.

</p>

<a href="register.html" class="btn-primary full">

Register This QR

</a>

</div>

`;

}



/* ===============================
   CONSENT BLOCK
================================ */

function showConsentBlocked(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>Access Disabled</h3>

<p>

The user has disabled
public contact access for this QR.

</p>

</div>

`;

}



/* ===============================
   BUILD OWNER UI
================================ */

function renderOwner(record){

const vehicle = escapeHTML(record["Vehicle Number"] || "Not Provided");
const phone = escapeHTML(record["Mobile Number"]);
const profession = escapeHTML(record["Profession / Business Title"]);
const email = escapeHTML(record["Email (Optional)"]);
const work = escapeHTML(record["Work Description (Max 30–40 words)"]);


/* ===============================
   PROFILE TITLE LOGIC
================================ */

let profileTitle = "Vehicle Contact";

if(profession || work){

profileTitle = "Business Profile";

}


/* ===============================
   UI BUILD
================================ */

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>${profileTitle}</h3>

<div class="info-row">

<span class="label">Vehicle Number</span>

<span class="value">${vehicle}</span>

</div>


${profession ? `

<div class="profile-block">

<span class="label">Profession</span>

<p class="profile-text">${profession}</p>

</div>

` : ""}


${work ? `

<div class="profile-block">

<span class="label">About</span>

<p class="profile-text">${work}</p>

</div>

` : ""}


<div class="action-buttons">

${phone ? `
<a href="tel:${phone}" class="btn-primary full">
📞 Call
</a>
` : ''}


${phone ? `
<a href="https://wa.me/${phone.replace(/\D/g,"")}"
class="btn-secondary full">
💬 WhatsApp
</a>
` : ''}


${email ? `

<a href="mailto:${email}"

class="btn-secondary full">

✉ Email

</a>

` : ""}

</div>

</div>


<p class="note">

This contact profile is provided through Bharat.io.

Please use responsibly for genuine communication only.

</p>

`;

document.getElementById("orderBtn").style.display = "block";

}



/* ===============================
   MAIN FUNCTION
================================ */

function initQR(){

const qrId = normalize(getParam("id"));


if(!qrId){

container.innerHTML = `

<h2>Invalid QR Code</h2>

<p>

This QR link appears incomplete.

Please scan the sticker again.

</p>

`;

return;

}


showLoading();


fetch(SHEET_API)

.then(response => response.json())

.then(data =>{


const record = data.find(

row => normalize(row["Sticker ID"]) === qrId

);


if(!record){

window.location.href =
"register.html?id=" + encodeURIComponent(qrId);

return;

}


const consent = normalize(record["Consent (Required)"]).toLowerCase();


if(!consent.includes("agree")){

showConsentBlocked();

return;

}


renderOwner(record);


})


.catch(error =>{

console.error(error);

showError();

});

}



/* ===============================
   INIT
================================ */

document.addEventListener(

"DOMContentLoaded",

initQR

);

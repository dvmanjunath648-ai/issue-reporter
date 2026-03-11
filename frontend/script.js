const API = "http://localhost:5001";

let issues = [];

/* =========================
   REGISTER
========================= */

async function register(){

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if(!name || !email || !password){
alert("Fill all fields");
return;
}

try{

const res = await fetch(API + "/users/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name,
email,
password
})

});

const data = await res.json();

alert(data.message);

window.location="login.html";

}catch(err){

alert("Registration failed");

}

}


/* =========================
   LOGIN
========================= */

async function login(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if(!email || !password){
alert("Enter email and password");
return;
}

try{

const res = await fetch(API + "/users/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})

});

const data = await res.json();

if(data.user){

localStorage.setItem("user",JSON.stringify(data.user));

alert("Login successful");

window.location="home.html";

}else{

alert(data.message);

}

}catch(err){

alert("Login failed");

}

}


/* =========================
   LOGOUT
========================= */

function logout(){

localStorage.removeItem("user");

window.location="login.html";

}


/* =========================
   LOAD ISSUES
========================= */

async function loadIssues(){

const container = document.getElementById("issueContainer");

if(!container) return;

container.innerHTML="Loading issues...";

try{

const res = await fetch(API + "/issues");

issues = await res.json();

displayIssues(issues);

}catch(err){

container.innerHTML="Failed to load issues";

}

}


/* =========================
   DISPLAY ISSUES
========================= */

function displayIssues(data){

const container = document.getElementById("issueContainer");

if(!container) return;

container.innerHTML="";

data.forEach(issue=>{

const card = document.createElement("div");

card.className="issue-card";

card.innerHTML=`

<h3>${issue.title}</h3>

<p>${issue.description}</p>

<p><b>Location:</b> ${issue.location}</p>

${issue.photo ? `<img src="${API}/uploads/${issue.photo}" class="issue-img">` : ""}

<p>Status: ${issue.status}</p>

<div class="actions">

<button onclick="voteIssue('${issue._id}')">👍 ${issue.votes}</button>

<button onclick="resolveIssue('${issue._id}')">Resolve</button>

<button onclick="deleteIssue('${issue._id}')">Delete</button>

</div>

`;

container.appendChild(card);

});

}


/* =========================
   SEARCH
========================= */

function searchIssues(){

const keyword=document.getElementById("searchInput").value.toLowerCase();

const filtered=issues.filter(issue=>

issue.title.toLowerCase().includes(keyword) ||
issue.location.toLowerCase().includes(keyword)

);

displayIssues(filtered);

}


/* =========================
   REPORT ISSUE
========================= */

async function reportIssue(){

const title=document.getElementById("title").value;
const location=document.getElementById("location").value;
const description=document.getElementById("description").value;
const photo=document.getElementById("photo").files[0];

if(!title || !location || !description){
alert("Fill all fields");
return;
}

const formData=new FormData();

formData.append("title",title);
formData.append("location",location);
formData.append("description",description);

if(photo){
formData.append("photo",photo);
}

try{

await fetch(API + "/issues",{

method:"POST",

body:formData

});

alert("Issue reported successfully");

window.location="home.html";

}catch(err){

alert("Failed to report issue");

}

}


/* =========================
   RESOLVE ISSUE
========================= */

async function resolveIssue(id){

await fetch(API + "/issues/" + id,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
status:"resolved"
})

});

loadIssues();

}


/* =========================
   DELETE ISSUE
========================= */

async function deleteIssue(id){

if(!confirm("Delete this issue?")) return;

await fetch(API + "/issues/" + id,{

method:"DELETE"

});

loadIssues();

}


/* =========================
   VOTE ISSUE
========================= */

async function voteIssue(id){

await fetch(API + "/issues/vote/" + id,{

method:"PUT"

});

loadIssues();

}


/* =========================
   LOAD STATS
========================= */

async function loadStats(){

const total=document.getElementById("totalIssues");
const open=document.getElementById("openIssues");
const resolved=document.getElementById("resolvedIssues");

if(!total) return;

const res=await fetch(API + "/issues/stats/summary");

const data=await res.json();

total.innerText=data.total;
open.innerText=data.open;
resolved.innerText=data.resolved;

}


/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded",()=>{

loadIssues();
loadStats();

});
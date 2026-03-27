const users = [{ nom: "kikwika", pass: "1234" }];

// 15 ALIMENTS
let defaultPlats = [
  { nom: "Pizza", prix: 26000, stock: 10 },
  { nom: "Burger", prix: 23000, stock: 10 },
  { nom: "Salade", prix: 12000, stock: 10 },
  { nom: "Pâtes", prix: 20500, stock: 10 },
  { nom: "Sushi", prix: 17000, stock: 10 },
  { nom: "Steak", prix: 19000, stock: 10 },
  { nom: "Tacos", prix: 13500, stock: 10 },
  { nom: "Sandwich", prix: 22500, stock: 10 },
  { nom: "Poulet rôti", prix: 26000, stock: 10 },
  { nom: "Quiche", prix: 24000, stock: 10 },
  { nom: "Soupe", prix: 12000, stock: 10 },
  { nom: "Frites", prix: 15000, stock: 10 },
  { nom: "Omelette", prix: 13000, stock: 10 },
  { nom: "Crêpe", prix: 12500, stock: 10 },
  { nom: "Glace", prix: 11500, stock: 10 }
];

// INIT STOCK
if(!localStorage.getItem("plats")){
  localStorage.setItem("plats", JSON.stringify(defaultPlats));
}

let plats = JSON.parse(localStorage.getItem("plats"));
let commandes = JSON.parse(localStorage.getItem("commandes")) || [];

// LOGIN
function login(){
  let u = username.value;
  let p = password.value;

  let ok = users.find(x=>x.nom===u && x.pass===p);

  if(ok){
    localStorage.setItem("user", u);
    location.href = "dashboard.html";
  } else {
    msg.innerText = "Erreur";
  }
}

// INIT
if(document.getElementById("welcome")){
  welcome.innerText = "Bonjour " + localStorage.getItem("user");
  loadPlats();
  show();
}

// LOAD
function loadPlats(){
  platSelect.innerHTML="";
  plats.forEach(p=>{
    platSelect.innerHTML += `<option>${p.nom} (${p.stock})</option>`;
  });
}

// QUANTITE
function plus(){ quantite.value++ }
function moins(){ if(quantite.value>1) quantite.value-- }

// AJOUT
function ajouterCommande(){
  let nom = platSelect.value.split(" (")[0];
  let q = parseInt(quantite.value);
  let p = plats.find(x=>x.nom===nom);

  if(p.stock < q) return alert("Stock insuffisant");

  let now = new Date();

  commandes.push({
    id: Date.now(),
    plat: nom,
    quantite: q,
    total: p.prix*q,
    date: now.toLocaleDateString(),
    heure: now.toLocaleTimeString()
  });

  p.stock -= q;

  save();
  show();
}

// SHOW
function show(){
  list.innerHTML="";
  let total=0;

  commandes.forEach(c=>{
    list.innerHTML += `<li>${c.plat} x${c.quantite} = ${c.total}</li>`;
    total += c.total;
  });

  document.getElementById("total").innerText = total + " FC";

  updateCalendar();
  loadPlats();
}

// CALENDAR
function updateCalendar(){
  calendarList.innerHTML="";
  commandes.forEach(c=>{
    calendarList.innerHTML += `<p>${c.date} - ${c.heure} : ${c.plat}</p>`;
  });
}

// SAVE
function save(){
  localStorage.setItem("plats", JSON.stringify(plats));
  localStorage.setItem("commandes", JSON.stringify(commandes));
}

// RESET
function resetStock(){
  plats = defaultPlats;
  save();
  show();
}

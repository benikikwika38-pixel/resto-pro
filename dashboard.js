// USERS
const users = [
  { nom: "Béni", pass: "1234" }
];

// PLATS (15 aliments)
let plats = JSON.parse(localStorage.getItem("plats")) || [
  { nom: "Pizza", prix: 5000, stock: 10 },
  { nom: "Burger", prix: 3000, stock: 10 },
  { nom: "Salade", prix: 2000, stock: 10 },
  { nom: "Pâtes", prix: 4500, stock: 10 },
  { nom: "Sushi", prix: 7000, stock: 10 },
  { nom: "Steak", prix: 9000, stock: 10 },
  { nom: "Tacos", prix: 3500, stock: 10 },
  { nom: "Sandwich", prix: 2500, stock: 10 },
  { nom: "Poulet rôti", prix: 6000, stock: 10 },
  { nom: "Quiche", prix: 4000, stock: 10 },
  { nom: "Soupe", prix: 2000, stock: 10 },
  { nom: "Frites", prix: 1500, stock: 10 },
  { nom: "Omelette", prix: 3000, stock: 10 },
  { nom: "Crêpe", prix: 2500, stock: 10 },
  { nom: "Glace", prix: 1500, stock: 10 }
];

// COMMANDES
let commandes = JSON.parse(localStorage.getItem("commandes")) || [];

// --- LOGIN ---
function login() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  let ok = users.find(x => x.nom === u && x.pass === p);

  if(ok){
    localStorage.setItem("user", u);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("msg").innerText = "Erreur de connexion";
  }
}

// --- DASHBOARD INIT ---
if(document.getElementById("welcome")){
  document.getElementById("welcome").innerText =
    "Bonjour " + (localStorage.getItem("user") || "Employé");

  loadPlats();
  show();
}

// --- CHARGER PLATS ---
function loadPlats(){
  const select = document.getElementById("platSelect");
  select.innerHTML = "";
  plats.forEach(p=>{
    let o = document.createElement("option");
    o.value = p.nom;
    o.innerText = `${p.nom} (${p.stock})`;
    select.appendChild(o);
  });
}

// --- AJOUTER COMMANDE ---
function ajouterCommande(){
  let nom = document.getElementById("platSelect").value;
  let q = parseInt(document.getElementById("quantite").value);
  let p = plats.find(x=>x.nom===nom);

  if(q>0 && p.stock>=q){
    const now = new Date();
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
  } else {
    alert("Stock insuffisant !");
  }
}

// --- AFFICHER COMMANDES ---
function show(){
  const list = document.getElementById("list");
  list.innerHTML = "";
  let total = 0;

  // Trier les commandes les plus récentes
  commandes.sort((a,b)=> b.id - a.id);

  commandes.forEach(c=>{
    let li = document.createElement("li");
    li.innerHTML = `
      <div class="flex justify-between items-center bg-gray-700 p-3 rounded">
        <span>${c.plat} x${c.quantite} = ${c.total} FC</span>
        <span class="text-gray-300 text-sm">${c.date} ${c.heure}</span>
        <button onclick="del(${c.id})"
          class="bg-red-600 px-2 py-1 rounded hover:bg-red-500">
          ❌
        </button>
      </div>
    `;
    list.appendChild(li);
    total += c.total;
  });

  document.getElementById("total").innerText = total + " FC";
  graph();
  alertStock();
  loadPlats();
  updateCalendar();
}

// --- SUPPRIMER COMMANDE ---
function del(id){
  commandes = commandes.filter(c=>c.id!==id);
  save();
  show();
}

// --- SAVE DATA ---
function save(){
  localStorage.setItem("commandes", JSON.stringify(commandes));
  localStorage.setItem("plats", JSON.stringify(plats));
}

// --- GRAPH ---
function graph(){
  let stats = {};
  commandes.forEach(c=>{
    stats[c.plat] = (stats[c.plat]||0) + c.quantite;
  });

  const ctx = document.getElementById("chart");
  new Chart(ctx,{
    type:"bar",
    data:{
      labels:Object.keys(stats),
      datasets:[{
        label:"Ventes",
        data:Object.values(stats),
        backgroundColor:"rgba(255,215,0,0.7)"
      }]
    },
    options:{ responsive:true }
  });
}

// --- ALERT STOCK ---
function alertStock(){
  plats.forEach(p=>{
    if(p.stock<=3){
      alert("⚠ Stock faible: " + p.nom);
    }
  });
}

// --- CALENDRIER HISTORIQUE ---
function updateCalendar(){
  const calendar = document.getElementById("calendarList");
  if(!calendar) return;

  calendar.innerHTML = "";

  commandes.sort((a,b)=> b.id - a.id);

  commandes.forEach(c=>{
    let li = document.createElement("li");
    li.innerHTML = `
      <div class="flex justify-between bg-gray-700 p-3 rounded">
        <span>${c.plat} x${c.quantite} = ${c.total} FC</span>
        <span class="text-gray-300 text-sm">${c.date} ${c.heure}</span>
      </div>
    `;
    calendar.appendChild(li);
  });
      }

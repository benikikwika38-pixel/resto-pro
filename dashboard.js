// USERS
const users = [
  { nom: "kikwika", pass: "223345" }
];

// PLATS + STOCK
let plats = JSON.parse(localStorage.getItem("plats")) || [
  { nom: "Pizza", prix: 5000, stock: 10 },
  { nom: "Burger", prix: 3000, stock: 10 },
  { nom: "Salade", prix: 2000, stock: 10 }
];

// COMMANDES
let commandes = JSON.parse(localStorage.getItem("commandes")) || [];

// LOGIN
function login() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  let ok = users.find(x => x.nom === u && x.pass === p);

  if(ok){
    localStorage.setItem("user", u);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("msg").innerText = "Nom ou mot de passe incorrect";
  }
}

// LOAD DASHBOARD
if(document.getElementById("welcome")){
  document.getElementById("welcome").innerText =
    "Bonjour " + (localStorage.getItem("user") || "Employé");

  loadPlats();
  show();
}

// LOAD PLATS
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

// ADD COMMANDE
function ajouterCommande(){
  let nom = document.getElementById("platSelect").value;
  let q = parseInt(document.getElementById("quantite").value);

  let p = plats.find(x=>x.nom===nom);

  if(q>0 && p.stock>=q){
    commandes.push({
      id: Date.now(),
      plat: nom,
      quantite: q,
      total: p.prix*q,
      date: new Date().toLocaleDateString()
    });

    p.stock -= q;
    save();
    show();
  } else {
    alert("Stock insuffisant !");
  }
}

// SHOW COMMANDES
function show(){
  const list = document.getElementById("list");
  list.innerHTML = "";

  let total = 0;

  commandes.forEach(c=>{
    let li = document.createElement("li");

    li.innerHTML = `
      ${c.plat} x${c.quantite} = ${c.total} FC
      <button onclick="del(${c.id})" style="color:red;">❌</button>
    `;

    list.appendChild(li);
    total += c.total;
  });

  document.getElementById("total").innerText = total + " FC";

  graph();
  alertStock();
  loadPlats();
}

// DELETE
function del(id){
  commandes = commandes.filter(c=>c.id!==id);
  save();
  show();
}

// SAVE
function save(){
  localStorage.setItem("commandes", JSON.stringify(commandes));
  localStorage.setItem("plats", JSON.stringify(plats));
}

// GRAPH
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
        data:Object.values(stats)
      }]
    }
  });
}

// STOCK ALERT
function alertStock(){
  plats.forEach(p=>{
    if(p.stock<=3){
      alert("⚠ Stock faible: " + p.nom);
    }
  });
}

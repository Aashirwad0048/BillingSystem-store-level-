const API = "https://billingsystem-store-level-2.onrender.com";

const input1 = document.getElementById("name");
const input2 = document.getElementById("quantity");
const input3 = document.getElementById("price");

let grandtotal = 0;


async function loadBill() {
  const res = await fetch(API);
  const items = await res.json();

  const tbody = document.getElementById("tbody-main");
  tbody.innerHTML = "";
  grandtotal = 0;

  items.forEach(item => {
    addRowToTable(item);
    grandtotal += item.total;
  });

  updateTotals();
}

window.onload = loadBill;


function addRowToTable(item) {
  const tbody = document.getElementById("tbody-main");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${item.name}</td>
    <td>${item.qty}</td>
    <td>${item.price}</td>
    <td>${item.total}</td>
    <td><button style="background:red;color:white;border-radius:20px;border:none">Delete</button></td>
  `;

  row.querySelector("button").onclick = () => deleteItem(item.id, item.total);
  tbody.appendChild(row);
}

document.getElementById("submit").addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!input1.value || input2.value <= 0 || input3.value <= 0) {
    alert("Please enter valid product details");
    return;
  }

  const total = Number(input2.value) * Number(input3.value);

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input1.value,
      qty: Number(input2.value),
      price: Number(input3.value),
      total: total
    })
  });

  input1.value = "";
  input2.value = "";
  input3.value = "";

  loadBill();
});
document.getElementById("date").textContent =
    new Date().toLocaleString();

document.getElementById("billno").textContent =
    Math.floor(Math.random() * 100000);


async function deleteItem(id, itemTotal) {
  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  loadBill(); 
}

function updateTotals() {
  const gst = grandtotal * 0.18;

  document.getElementById("grand-total").textContent = grandtotal.toFixed(2);
  document.getElementById("gst").textContent = gst.toFixed(2);
  document.getElementById("final-total").textContent =
    (grandtotal + gst).toFixed(2);
}

window.onafterprint = async function () {
    if (!confirm("Clear bill after printing?")) return;

    const res = await fetch(API);
    const items = await res.json();

    for (let item of items) {
        await fetch(`${API}/${item.id}`, { method: "DELETE" });
    }

    location.reload();
};

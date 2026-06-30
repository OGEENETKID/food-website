/* ===========================================================
   AMAGWINYA — menu data, cart logic, WhatsApp checkout
   =========================================================== */

const WHATSAPP_NUMBER = "27645139675"; // 064 513 9675, international format, no +

const MENU = [
  {
    id: "fatcakes",
    label: "Fat Cakes",
    note: "Base fat cake R6, plus your filling of choice. Only made to order within the windows below.",
    items: [
      {
        id: "fatcake",
        name: "Fat Cake",
        basePrice: 6,
        note: "Pick a filling — price shown includes it",
        options: [
          { id: "plain", label: "Plain", add: 0 },
          { id: "polony", label: "+ Polony", add: 2 },
          { id: "cheese", label: "+ Cheese", add: 3 },
          { id: "viyena", label: "+ Viyena", add: 4 }
        ]
      }
    ]
  },
  {
    id: "drinks",
    label: "Drinks",
    items: [
      { id: "coke2l", name: "2L Coke", price: 32 },
      { id: "twist2l", name: "2L Twist (lemon / granadilla)", price: 27 },
      { id: "soda2l", name: "2L Stoney / Sprite / Fanta (orange, grape)", price: 30 },
      { id: "redbull", name: "Redbull", price: 20 },
      { id: "play", name: "Play", price: 22 },
      { id: "cokecan", name: "Coke Can", price: 20 },
      { id: "energy", name: "Switch / Reebost / Score", price: 15 }
    ]
  },
  {
    id: "bread",
    label: "Bread",
    items: [
      { id: "whitebread", name: "White Bread", price: 23 },
      { id: "brownbread", name: "Brown Bread", price: 22 },
      { id: "frenchpolon", name: "French Polon", price: 2 },
      { id: "parmalat", name: "Parmalat Cheese", price: 3 }
    ]
  },
  {
    id: "chips",
    label: "Chips",
    items: [
      { id: "laysdoritos", name: "Lays / Doritos", price: 26 },
      { id: "sylosgoslow", name: "Sylos / Goslow (cheese & onion, BBQ, tomato, sweet chilli)", price: 8, note: "R10 for Sylos, R8 each for Goslow flavours" },
      { id: "spokiespele", name: "Spokies (pelepele)", price: 8 },
      { id: "niknaks", name: "Niknaks / Stylos", price: 10, note: "5 for R10" },
      { id: "spokies", name: "Spokies (cheese, sweet chilli, pelepele)", price: 6 }
    ]
  },
  {
    id: "sweets",
    label: "Sweets",
    items: [
      { id: "sticksweets", name: "Stick Sweets (Pinpop / Yogeta)", price: 2 },
      { id: "sweets", name: "Sweets (Halls, Eclairs)", price: 5, note: "6 for R5" }
    ]
  },
  {
    id: "chocolates",
    label: "Chocolates",
    items: [
      { id: "choc19", name: "Chocolate — PS / Lunchbar", price: 19 },
      { id: "choc7", name: "Chocolate — Lunchbar, KitKat, PS", price: 7 },
      { id: "toppers", name: "Toppers", price: 15 },
      { id: "grandpar", name: "Grandpar", price: 5 },
      { id: "medlemon", name: "Med Lemon", price: 10 }
    ]
  }
];

/* ----------------- cart state (in-memory only) ----------------- */
let cart = []; // { lineId, name, qty, unitPrice, note }

function formatR(n){
  return "R" + n.toFixed(n % 1 === 0 ? 0 : 2);
}

function addToCart(name, unitPrice, qty, note){
  const lineId = name + "|" + (note || "");
  const existing = cart.find(l => l.lineId === lineId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ lineId, name, qty, unitPrice, note: note || "" });
  }
  renderTicket();
}

function removeLine(lineId){
  cart = cart.filter(l => l.lineId !== lineId);
  renderTicket();
}

function cartTotal(){
  return cart.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
}

function cartCount(){
  return cart.reduce((sum, l) => sum + l.qty, 0);
}

/* ----------------- render menu ----------------- */
function renderMenu(){
  const tabsEl = document.getElementById("menu-tabs");
  const panelsEl = document.getElementById("menu-panels");
  tabsEl.innerHTML = "";
  panelsEl.innerHTML = "";

  MENU.forEach((cat, idx) => {
    const tab = document.createElement("button");
    tab.className = "menu-tab" + (idx === 0 ? " is-active" : "");
    tab.type = "button";
    tab.textContent = cat.label;
    tab.dataset.cat = cat.id;
    tab.addEventListener("click", () => {
      document.querySelectorAll(".menu-tab").forEach(t => t.classList.remove("is-active"));
      document.querySelectorAll(".menu-panel").forEach(p => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.getElementById("panel-" + cat.id).classList.add("is-active");
    });
    tabsEl.appendChild(tab);

    const panel = document.createElement("div");
    panel.className = "menu-panel" + (idx === 0 ? " is-active" : "");
    panel.id = "panel-" + cat.id;

    if (cat.note){
      const p = document.createElement("p");
      p.className = "section-sub";
      p.style.marginBottom = "20px";
      p.textContent = cat.note;
      panel.appendChild(p);
    }

    const grid = document.createElement("div");
    grid.className = "item-grid";

    cat.items.forEach(item => {
      grid.appendChild(buildItemCard(item));
    });

    panel.appendChild(grid);
    panelsEl.appendChild(panel);
  });
}

function buildItemCard(item){
  const card = document.createElement("div");
  card.className = "item-card";

  let selectedOption = item.options ? item.options[0] : null;
  let qty = 1;

  const top = document.createElement("div");
  top.className = "item-top";

  const nameEl = document.createElement("span");
  nameEl.className = "item-name";
  nameEl.textContent = item.name;

  const priceEl = document.createElement("span");
  priceEl.className = "item-price";

  function currentUnitPrice(){
    if (item.options) return item.basePrice + selectedOption.add;
    return item.price;
  }
  function refreshPrice(){
    priceEl.textContent = formatR(currentUnitPrice());
  }
  refreshPrice();

  top.appendChild(nameEl);
  top.appendChild(priceEl);
  card.appendChild(top);

  if (item.note){
    const noteEl = document.createElement("p");
    noteEl.className = "item-note";
    noteEl.textContent = item.note;
    card.appendChild(noteEl);
  }

  if (item.options){
    const optWrap = document.createElement("div");
    optWrap.className = "item-options";
    item.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt-btn" + (i === 0 ? " is-selected" : "");
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        selectedOption = opt;
        optWrap.querySelectorAll(".opt-btn").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        refreshPrice();
      });
      optWrap.appendChild(btn);
    });
    card.appendChild(optWrap);
  }

  const actions = document.createElement("div");
  actions.className = "item-actions";

  const qtyControl = document.createElement("div");
  qtyControl.className = "qty-control";
  const minusBtn = document.createElement("button");
  minusBtn.type = "button";
  minusBtn.className = "qty-btn";
  minusBtn.textContent = "–";
  minusBtn.setAttribute("aria-label", "Decrease quantity");
  const qtyVal = document.createElement("span");
  qtyVal.className = "qty-val";
  qtyVal.textContent = qty;
  const plusBtn = document.createElement("button");
  plusBtn.type = "button";
  plusBtn.className = "qty-btn";
  plusBtn.textContent = "+";
  plusBtn.setAttribute("aria-label", "Increase quantity");

  minusBtn.addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyVal.textContent = qty;
  });
  plusBtn.addEventListener("click", () => {
    qty = Math.min(20, qty + 1);
    qtyVal.textContent = qty;
  });

  qtyControl.appendChild(minusBtn);
  qtyControl.appendChild(qtyVal);
  qtyControl.appendChild(plusBtn);

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "add-btn";
  addBtn.textContent = "Add";
  addBtn.addEventListener("click", () => {
    const fullName = item.options ? (item.name + " (" + selectedOption.label.replace("+ ", "") + ")") : item.name;
    addToCart(fullName, currentUnitPrice(), qty, "");
    addBtn.textContent = "Added ✓";
    addBtn.classList.add("is-added");
    setTimeout(() => {
      addBtn.textContent = "Add";
      addBtn.classList.remove("is-added");
    }, 900);
    qty = 1;
    qtyVal.textContent = qty;
    openTicketBriefHighlight();
  });

  actions.appendChild(qtyControl);
  actions.appendChild(addBtn);
  card.appendChild(actions);

  return card;
}

/* ----------------- render ticket / cart panel ----------------- */
function renderTicket(){
  const itemsEl = document.getElementById("ticket-items");
  const totalEl = document.getElementById("ticket-total");
  const toggleCount = document.getElementById("cart-toggle-count");
  const toggleBtn = document.getElementById("cart-toggle");

  itemsEl.innerHTML = "";

  if (cart.length === 0){
    const empty = document.createElement("p");
    empty.className = "ticket-empty";
    empty.textContent = "Nothing on the ticket yet — add a fat cake or two.";
    itemsEl.appendChild(empty);
  } else {
    cart.forEach(line => {
      const row = document.createElement("div");
      row.className = "ticket-row";

      const left = document.createElement("div");
      const nameSpan = document.createElement("span");
      nameSpan.className = "ticket-row-name";
      nameSpan.textContent = line.qty + "× " + line.name;
      left.appendChild(nameSpan);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "ticket-row-remove";
      removeBtn.textContent = "remove";
      removeBtn.addEventListener("click", () => removeLine(line.lineId));
      left.appendChild(document.createElement("br"));
      left.appendChild(removeBtn);

      const priceSpan = document.createElement("span");
      priceSpan.className = "ticket-row-price";
      priceSpan.textContent = formatR(line.unitPrice * line.qty);

      row.appendChild(left);
      row.appendChild(priceSpan);
      itemsEl.appendChild(row);
    });
  }

  totalEl.textContent = formatR(cartTotal());

  const count = cartCount();
  toggleCount.textContent = count;
  toggleBtn.classList.toggle("is-visible", count > 0 && window.innerWidth <= 900);

  updateWhatsappLink();
}

function openTicketBriefHighlight(){
  // On mobile, surface the toggle button once an item is added.
  if (window.innerWidth <= 900){
    document.getElementById("cart-toggle").classList.add("is-visible");
  }
}

/* ----------------- ticket panel open/close ----------------- */
function openTicket(){
  document.getElementById("ticket-panel").classList.add("is-open");
  document.getElementById("ticket-backdrop").classList.add("is-visible");
  document.getElementById("cart-toggle").setAttribute("aria-expanded", "true");
}
function closeTicket(){
  document.getElementById("ticket-panel").classList.remove("is-open");
  document.getElementById("ticket-backdrop").classList.remove("is-visible");
  document.getElementById("cart-toggle").setAttribute("aria-expanded", "false");
}

/* ----------------- WhatsApp checkout ----------------- */
function updateWhatsappLink(){
  const link = document.getElementById("whatsapp-send");
  const residence = document.getElementById("residence").value.trim();
  const room = document.getElementById("room").value.trim();
  const session = document.getElementById("session").value;
  const notes = document.getElementById("notes").value.trim();

  let msg = "Hi! I'd like to order from Amagwinya 🔥\n\n";
  if (cart.length === 0){
    msg += "(no items added yet)\n";
  } else {
    cart.forEach(line => {
      msg += `${line.qty}x ${line.name} — ${formatR(line.unitPrice * line.qty)}\n`;
    });
  }
  msg += `\nTotal: ${formatR(cartTotal())}\n\n`;
  msg += `Residence: ${residence || "[please add your residence]"}\n`;
  msg += `Room/Unit: ${room || "[please add your room/unit]"}\n`;
  msg += `Session: ${session}\n`;
  if (notes) msg += `Notes: ${notes}\n`;

  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* ----------------- order window status ----------------- */
function updateOrderStatus(){
  const el = document.getElementById("order-status");
  const textEl = document.getElementById("order-status-text");
  const now = new Date();
  const hour = now.getHours();

  // Morning session ordering window: 9pm (21:00) – 11pm (23:00) the previous night.
  const open = hour >= 21 && hour < 23;

  if (open){
    el.classList.add("is-open");
    el.classList.remove("is-closed");
    textEl.textContent = "Order window is open now — closes 11:00 PM for tomorrow's morning delivery.";
  } else {
    el.classList.add("is-closed");
    el.classList.remove("is-open");
    const next = hour < 21 ? "tonight" : "tomorrow night";
    textEl.textContent = `Orders are currently closed — next window opens 9:00 PM ${next}.`;
  }
}

/* ----------------- init ----------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderTicket();
  updateOrderStatus();
  setInterval(updateOrderStatus, 60000);

  document.getElementById("cart-toggle").addEventListener("click", openTicket);
  document.getElementById("ticket-close").addEventListener("click", closeTicket);
  document.getElementById("ticket-backdrop").addEventListener("click", closeTicket);

  ["residence", "room", "session", "notes"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateWhatsappLink);
    document.getElementById(id).addEventListener("change", updateWhatsappLink);
  });

  window.addEventListener("resize", renderTicket);
});

// ---------------- SETUP ----------------
const form = document.getElementById("invoiceForm");
const preview = {
  company: document.getElementById("previewCompany"),
  client: document.getElementById("previewClient"),
  items: document.getElementById("previewItems"),
  date: document.getElementById("previewDate"),
  tax: document.getElementById("previewTax"),
  total: document.getElementById("previewTotal"),
  qr: document.getElementById("previewQR"),
};

const inputs = {
  company: document.getElementById("company"),
  client: document.getElementById("client"),
  items: document.getElementById("items"),
  date: document.getElementById("date"),
  tax: document.getElementById("tax"),
  payment: document.getElementById("payment"),
};

// ---------------- LIVE PREVIEW ----------------
function updatePreview() {
  preview.company.textContent = inputs.company.value;
  preview.client.textContent = inputs.client.value;
  preview.date.textContent = inputs.date.value;
  preview.tax.textContent = inputs.tax.value;

  const itemLines = inputs.items.value.split("\n");
  let total = 0;
  let itemsText = "";

  itemLines.forEach(line => {
    itemsText += line + "\n";
    const match = line.match(/\$?(\d+(?:\.\d+)?)/);
    if (match) total += parseFloat(match[1]);
  });

  const taxRate = parseFloat(inputs.tax.value) || 0;
  const taxAmount = total * (taxRate / 100);
  const final = total + taxAmount;

  preview.items.textContent = itemsText.trim();
  preview.total.textContent = `$ ${final.toFixed(2)}`;
  updateQR(inputs.payment.value);
}

Object.values(inputs).forEach(input => {
  input.addEventListener("input", updatePreview);
});

// ---------------- QR CODE ----------------
function updateQR(data) {
  preview.qr.src = data
    ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(data)}`
    : "";
}

// ---------------- RESET ----------------
document.getElementById("resetForm").addEventListener("click", () => {
  form.reset();
  Object.values(preview).forEach(el => {
    if (el.tagName === "IMG") el.src = "";
    else el.textContent = "";
  });
});

// ---------------- THEME TOGGLE ----------------
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
});

// ---------------- LANGUAGE SWITCH ----------------
const translations = {
  en: {
    company: "Company Name",
    client: "Client Name",
    items: "Items",
    date: "Date",
    tax: "Tax (%)",
    payment: "Payment Info",
    total: "Total",
  },
  el: {
    company: "Εταιρεία",
    client: "Πελάτης",
    items: "Στοιχεία",
    date: "Ημερομηνία",
    tax: "Φόρος (%)",
    payment: "Πληρωμή",
    total: "Σύνολο",
  },
  fr: {
    company: "Société",
    client: "Client",
    items: "Articles",
    date: "Date",
    tax: "Taxe (%)",
    payment: "Paiement",
    total: "Total",
  }
};

document.getElementById("langSelect").addEventListener("change", e => {
  const lang = e.target.value;
  form.querySelectorAll("label").forEach(label => {
    const forAttr = label.getAttribute("for");
    if (translations[lang][forAttr]) label.textContent = translations[lang][forAttr];
  });
});

// ---------------- PDF EXPORT ----------------
document.getElementById("exportPDF").addEventListener("click", () => {
  const element = document.getElementById("invoicePreview");
  const opt = {
    margin: 0.5,
    filename: "invoice.pdf",
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
});


// ---------------- TXT EXPORT ----------------
document.getElementById("exportTXT").addEventListener("click", () => {
  const content = `
Company: ${inputs.company.value}
Client: ${inputs.client.value}
Date: ${inputs.date.value}
Items:
${inputs.items.value}
Tax: ${inputs.tax.value}%
Total: ${preview.total.textContent}
`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "invoice.txt";
  a.click();
});

// ---------------- CSV EXPORT ----------------
document.getElementById("exportCSV").addEventListener("click", () => {
  const csv = `"Company","Client","Date","Items","Tax","Total"\n"${inputs.company.value}","${inputs.client.value}","${inputs.date.value}","${inputs.items.value.replace(/\n/g, " | ")}","${inputs.tax.value}","${preview.total.textContent}"`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "invoice.csv";
  a.click();
});

// ---------------- JSON EXPORT ----------------
document.getElementById("exportJSON").addEventListener("click", () => {
  const data = {
    company: inputs.company.value,
    client: inputs.client.value,
    date: inputs.date.value,
    items: inputs.items.value.split('\n'),
    tax: inputs.tax.value,
    total: preview.total.textContent
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "invoice.json";
  a.click();
});





document.getElementById("exportPDF").addEventListener("click", () => {
  const element = document.getElementById("invoicePreview");
  const opt = {
    margin: 0.5,
    filename: "invoice.pdf",
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
});

document.getElementById("exportPDF").addEventListener("click", () => {
  const preview = document.getElementById("invoicePreview");
  console.log("✅ Debug:", preview.innerHTML); // Να δεις αν έχει περιεχόμενο!

  // Απλό delay να είμαστε σίγουροι πως όλα έχουν φορτώσει
  setTimeout(() => {
    html2pdf().from(preview).save();
  }, 100);
});














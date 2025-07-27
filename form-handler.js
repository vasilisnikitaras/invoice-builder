// ---------- Load Sample Invoice ----------
async function loadSampleData() {
  try {
    const res = await fetch("sample_invoice.json"); 
    const data = await res.json();

    document.getElementById("company").value = data.company;
    document.getElementById("client").value = data.client;
    document.getElementById("date").value = data.date;
    document.getElementById("tax").value = data.tax;
    document.getElementById("payment").value = data.payment;

    // Format items as text area
    const itemsText = data.items.map(item => `${item.description} - $${item.price}`).join("\n");
    document.getElementById("items").value = itemsText;

    // Trigger preview update
    if (typeof updatePreview === "function") updatePreview();
  } catch (err) {
    console.error("Error loading sample invoice:", err);
    alert("Failed to load sample invoice.");
  }
}

// ---------- Auto Meta Sync ----------
window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("invoiceForm")) {
    loadSampleData(); // Optional: Comment out if not needed at first load
  }
});

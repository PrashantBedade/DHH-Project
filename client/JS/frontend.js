document.addEventListener("DOMContentLoaded", () => {
    // Navigation buttons and sections
    const pharmacyDetails = document.getElementById("pharmacyDetails");
    const viewInventory = document.getElementById("viewInventory");
    const addMedicine = document.getElementById("addMedicine");
    const editMedicine = document.getElementById("editMedicine");

    // Hide all sections initially
    const hideAllSections = () => {
        pharmacyDetails.style.display = "none";
        viewInventory.style.display = "none";
        addMedicine.style.display = "none";
        editMedicine.style.display = "none";
    };

    // Event listeners for showing sections
    document.getElementById("pharmacyDetails").addEventListener("click", () => {
        hideAllSections();
        pharmacyDetails.style.display = "block";
    });

    document.getElementById("viewInventory").addEventListener("click", () => {
        hideAllSections();
        viewInventory.style.display = "block";
    });

    document.getElementById("addMedicine").addEventListener("click", () => {
        hideAllSections();
        addMedicine.style.display = "block";
    });

    document.getElementById("editMedicine").addEventListener("click", () => {
        hideAllSections();
        editMedicine.style.display = "block";
    });

    // Default behavior: Show "Pharmacy Details"
    hideAllSections();
    pharmacyDetails.style.display = "block";
});

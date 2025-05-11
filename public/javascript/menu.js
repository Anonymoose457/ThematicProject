// Toggle menu
function toggleMenu() {
    var menuColumn = document.getElementById("menuColumn");
    menuColumn.classList.toggle("active");
}

// Show submenu
function showSubMenu(submenuId) {
    var submenu = document.getElementById(submenuId);
    submenu.classList.add("active");
}

// Close submenu
function closeSubMenu() {
    var submenus = document.querySelectorAll(".submenu-column");
    submenus.forEach(function(submenu) {
        submenu.classList.remove("active");
    });
}

function setLanguage(language) {
    localStorage.setItem('lang', language);
    alert("Language changed to " + language.charAt(0).toUpperCase() + language.slice(1));
    updateLanguageOnScreen();
}


function clearStorage(){
    localStorage.clear();
}

// Play sound on menu open
function toggleMenu() {
    var menuColumn = document.getElementById("menuColumn");
    const menuSound = document.getElementById("menuSound");
    
    menuColumn.classList.toggle("active");

    if (localStorage.getItem("sound") !== "off") {
        menuSound.currentTime = 0;
        menuSound.play();
    }
}

if (localStorage.getItem("sound") === null) {
    localStorage.setItem("sound", "off");
}


// Toggle sound setting
function toggleSound() {
    let currentSetting = localStorage.getItem("sound");
    let newSetting = (currentSetting === "off") ? "on" : "off";
    localStorage.setItem("sound", newSetting);

    // Update menu text
    const toggleLabel = document.getElementById("soundToggle");
    toggleLabel.textContent = newSetting === "off" ? "Sound Off" : "Sound On";
}


document.addEventListener("DOMContentLoaded", () => {
    const currentSetting = localStorage.getItem("sound") || "off";
    localStorage.setItem("sound", currentSetting); 

    const soundToggle = document.getElementById("soundToggle");
    if (soundToggle) {
        soundToggle.textContent = currentSetting === "off" ? "Sound Off" : "Sound On";
    }
});


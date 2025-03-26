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

function clearStorage(){
    localStorage.clear();
}

const loginForm = document.querySelector("#loginForm");
const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector("#sidebar");
const sidebarBackdrop = document.querySelector("#sidebarBackdrop");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const storedRole = localStorage.getItem("jobtrackerRole");
const currentRole = (storedRole || document.body.dataset.userRole || "USUARIO").toUpperCase();
const adminOnlyElements = document.querySelectorAll("[data-admin-only]");
const adminContent = document.querySelector(".admin-content");
const accessDenied = document.querySelector(".access-denied");

const closeSidebar = () => {
  if (!sidebar || !sidebarBackdrop) return;
  sidebar.classList.remove("is-open");
  sidebarBackdrop.classList.remove("is-open");
};

const toggleSidebar = () => {
  if (!sidebar || !sidebarBackdrop) return;
  sidebar.classList.toggle("is-open");
  sidebarBackdrop.classList.toggle("is-open");
};

const applyRoleVisibility = () => {
  if (currentRole === "USUARIO") {
    adminOnlyElements.forEach((element) => {
      element.hidden = true;
    });

    if (document.body.dataset.requiresAdmin === "true") {
      if (adminContent) adminContent.hidden = true;
      if (accessDenied) accessDenied.hidden = false;
    }
  }
};

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "dashboard.html";
  });
}

if (menuButton) {
  menuButton.addEventListener("click", toggleSidebar);
}

if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener("click", closeSidebar);
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.tabTarget;
    const targetPanel = document.getElementById(targetId);

    tabButtons.forEach((tabButton) => {
      tabButton.classList.remove("is-active");
      tabButton.setAttribute("aria-selected", "false");
    });

    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.remove("is-active");
      panel.hidden = true;
    });

    button.classList.add("is-active");
    button.setAttribute("aria-selected", "true");

    if (targetPanel) {
      targetPanel.hidden = false;
      targetPanel.classList.add("is-active");
    }
  });
});

applyRoleVisibility();

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
  }
});

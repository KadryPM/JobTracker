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

function attachDeleteEvents() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const row = e.target.closest("tr");
      const id = row.dataset.id;

      await fetch(`http://localhost:3001/users/${id}`, {
        method: "DELETE"
      });

      row.remove();
    });
  });
}

async function loadUsers() {
  const res = await fetch("http://localhost:3001/users");
  const users = await res.json();

  const tableBody = document.querySelector("#usersTable");

  tableBody.innerHTML = users.map(user => `
    <tr data-id="${user.id}">
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Eliminar</button>
      </td>
    </tr>
  `).join("");

  attachDeleteEvents();
  attachEditEvents(); 
}
function attachEditEvents() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const id = row.dataset.id;

      const name = row.children[0].textContent;
      const email = row.children[1].textContent;
      const role = row.children[2].textContent;

      document.querySelector("#name").value = name;
      document.querySelector("#email").value = email;
      document.querySelector("#role").value = role;

      document.querySelector("#userForm").dataset.editingId = id;
    });
  });
}
loadUsers();

async function createUser(user) {
  await fetch("http://localhost:3001/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  loadUsers();
}

document.querySelector("#userForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const id = e.target.dataset.editingId;

  const user = {
    name: document.querySelector("#name").value,
    email: document.querySelector("#email").value,
    role: document.querySelector("#role").value
  };

  if (id) {
    updateUser(id, user); // 🔥 EDITAR
    delete e.target.dataset.editingId;
  } else {
    createUser(user); // crear nuevo
  }
});

async function updateUser(id, data) {
  await fetch(`http://localhost:3001/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  loadUsers();
}
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const footer = document.querySelector('footer');

// --- SIDEBAR STATE ---
let sidebarOpen = window.innerWidth >= 1024;

function updateSidebarState() {
  if (sidebarOpen) {
    sidebar.classList.remove('-translate-x-full');
    mainContent.classList.add('lg:ml-72');
    footer.classList.add('lg:ml-72');
    sidebar.style.transform = 'translateX(0)';
  } else {
    sidebar.classList.add('-translate-x-full');
    mainContent.classList.remove('lg:ml-72');
    footer.classList.remove('lg:ml-72');
    sidebar.style.transform = 'translateX(-100%)';
  }
}

// --- DROPDOWN HANDLER ---
function setupDropdown(toggleId, submenuId, chevId) {
  const toggle = document.getElementById(toggleId);
  const submenu = document.getElementById(submenuId);
  const chev = document.getElementById(chevId);
  if (!toggle) return;

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = submenu.getAttribute('data-open') === 'true';
    if (isOpen) {
      chev.classList.remove('chev-rot');
      const h = submenu.scrollHeight + 'px';
      submenu.style.height = h;
      requestAnimationFrame(() => {
        submenu.classList.add('submenu-hidden');
        submenu.style.height = '0px';
      });
      submenu.setAttribute('data-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      chev.classList.add('chev-rot');
      submenu.classList.remove('submenu-hidden');
      submenu.style.height = '0px';
      requestAnimationFrame(() => {
        const full = submenu.scrollHeight + 'px';
        submenu.style.height = full;
      });
      setTimeout(() => { submenu.style.removeProperty('height'); }, 260);
      submenu.setAttribute('data-open', 'true');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
}

// Apply dropdowns
setupDropdown('configToggle', 'configSubmenu', 'configChev');
setupDropdown('inventoryToggle', 'inventorySubmenu', 'inventoryChev');
setupDropdown('ordersToggle', 'ordersSubmenu', 'ordersChev');
setupDropdown('shipmentToggle', 'shipmentSubmenu', 'shipmentChev');
setupDropdown('reportsToggle', 'reportsSubmenu', 'reportsChev');
setupDropdown('helpToggle', 'helpSubmenu', 'helpChev');

// --- ACTIVE & HOVER LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("#sidebar a");

  // Theme map for each icon
  const themeMap = {
    "fa-chart-line": { from: "from-primary-400", to: "to-primary-500", dot: "bg-primary-400", border: "border-primary-400" },
    "fa-cog": { from: "from-purple-400", to: "to-purple-500", dot: "bg-purple-400", border: "border-purple-400" },
    "fa-boxes": { from: "from-emerald-400", to: "to-emerald-600", dot: "bg-emerald-400", border: "border-emerald-400" },
    "fa-shopping-bag": { from: "from-orange-400", to: "to-orange-600", dot: "bg-orange-400", border: "border-orange-400" },
    "fa-shipping-fast": { from: "from-blue-400", to: "to-blue-600", dot: "bg-blue-400", border: "border-blue-400" },
    "fa-chart-bar": { from: "from-pink-400", to: "to-pink-600", dot: "bg-pink-400", border: "border-pink-400" },
    "fa-search": { from: "from-teal-400", to: "to-teal-600", dot: "bg-teal-400", border: "border-teal-400" },
    "fa-question-circle": { from: "from-indigo-400", to: "to-indigo-600", dot: "bg-indigo-400", border: "border-indigo-400" },
  };

  const getTheme = (link) => {
    const icon = link.querySelector("i");
    if (icon) {
      for (const key in themeMap) {
        if (icon.classList.contains(key)) return themeMap[key];
      }
    }
    const submenu = link.closest("ul.submenu");
    if (submenu) {
      const parentIcon = submenu.previousElementSibling?.querySelector("i");
      if (parentIcon) {
        for (const key in themeMap) {
          if (parentIcon.classList.contains(key)) return themeMap[key];
        }
      }
    }
    return themeMap["fa-chart-line"];
  };

  links.forEach(link => {
    const isSub = !!link.closest("ul.submenu");
    const iconWrap = link.querySelector(".w-10");
    const dot = link.querySelector(".w-2");
    const theme = getTheme(link);

    // default submenu style
    if (isSub) {
      link.classList.add("text-white/80");
      dot?.classList.add("bg-white/40");
    }

    // --- ACTIVE ---
    if (link.classList.contains("active")) {
      if (isSub) {
        link.classList.add("bg-gradient-to-r", "from-white/15", "to-white/10", "text-white", "border-l-2", theme.border);
        dot?.classList.remove("bg-white/40");
        dot?.classList.add(theme.dot);

        const submenu = link.closest("ul.submenu");
        submenu?.classList.remove("submenu-hidden");
        submenu?.setAttribute("data-open", "true");

        const toggle = submenu?.previousElementSibling;
        if (toggle) {
          toggle.classList.add("bg-gradient-to-r", "from-white/20", "to-white/10", "text-white", "shadow-lg");
          toggle.dataset.parentActive = "true";
          const tIcon = toggle.querySelector(".w-10");
          tIcon?.classList.add("bg-gradient-to-r", theme.from, theme.to);
          toggle.querySelector(".chev")?.classList.add("chev-rot");
        }
      } else {
        link.classList.add("bg-gradient-to-r", "from-white/20", "to-white/10", "text-white", "shadow-lg");
        iconWrap?.classList.add("bg-gradient-to-r", theme.from, theme.to);
      }
    }

    // --- HOVER ---
    link.addEventListener("mouseenter", () => {
      if (link.classList.contains("active") || link.dataset.parentActive === "true") return;
      link.classList.add("bg-white/10", "text-white");
      if (!isSub && iconWrap) iconWrap.classList.add("bg-gradient-to-r", theme.from, theme.to);
    });
    link.addEventListener("mouseleave", () => {
      if (link.classList.contains("active") || link.dataset.parentActive === "true") return;
      link.classList.remove("bg-white/10", "text-white");
      if (!isSub && iconWrap) iconWrap.classList.remove("bg-gradient-to-r", theme.from, theme.to);
    });
  });
});

// --- SIDEBAR TOGGLE ---
function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  updateSidebarState();
  sidebar.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  mainContent.style.transition = 'margin 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  footer.style.transition = 'margin 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
}
updateSidebarState();
sidebarToggle.addEventListener('click', toggleSidebar);

// close on outside click (mobile)
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && window.innerWidth < 1024 && sidebarOpen) {
    toggleSidebar();
  }
});

// resize handler
window.addEventListener('resize', () => {
  sidebarOpen = window.innerWidth >= 1024;
  updateSidebarState();
});

// card animation
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card-hover');
  cards.forEach((c, i) => {
    c.style.animationDelay = `${i * 0.1}s`;
    c.classList.add('animate-fade-in');
  });
});


// --- Select All Checkbox Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const selectAll = document.getElementById("selectAll");
  const rowChecks = document.querySelectorAll(".rowCheck");

  if (selectAll) {
    selectAll.addEventListener("change", () => {
      rowChecks.forEach(chk => {
        chk.checked = selectAll.checked;
      });
    });

    rowChecks.forEach(chk => {
      chk.addEventListener("change", () => {
        const allChecked = Array.from(rowChecks).every(c => c.checked);
        selectAll.checked = allChecked;
      });
    });
  }
});



// smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

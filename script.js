
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const footer = document.querySelector('footer');

// Enhanced sidebar functionality
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

// Helper for creating toggles
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

// Apply to all dropdowns
setupDropdown('configToggle', 'configSubmenu', 'configChev');
setupDropdown('inventoryToggle', 'inventorySubmenu', 'inventoryChev');
setupDropdown('ordersToggle', 'ordersSubmenu', 'ordersChev');
setupDropdown('shipmentToggle', 'shipmentSubmenu', 'shipmentChev');
setupDropdown('reportsToggle', 'reportsSubmenu', 'reportsChev');
setupDropdown('helpToggle', 'helpSubmenu', 'helpChev');



document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("#sidebar a");

  // 🔹 color map for each menu icon
  const colorMap = {
    "fa-chart-line": ["from-primary-400", "to-primary-500"],
    "fa-cog": ["from-purple-400", "to-purple-500"],
    "fa-boxes": ["from-emerald-400", "to-emerald-600"],
    "fa-shopping-bag": ["from-orange-400", "to-orange-600"],
    "fa-shipping-fast": ["from-blue-400", "to-blue-600"],
    "fa-chart-bar": ["from-pink-400", "to-pink-600"],
    "fa-search": ["from-teal-400", "to-teal-600"],
    "fa-question-circle": ["from-indigo-400", "to-indigo-600"],
  };

  links.forEach(link => {
    const isSubmenu = link.closest("ul.submenu") !== null;
    const iconWrapper = link.querySelector(".w-10");
    const dot = link.querySelector(".w-2");
    const icon = link.querySelector("i");

    // Find hover gradient based on icon
    let hoverColors = ["from-primary-400", "to-primary-500"];
    if (icon) {
      for (const key in colorMap) {
        if (icon.classList.contains(key)) {
          hoverColors = colorMap[key];
          break;
        }
      }
    }

    // Default submenu style
    if (isSubmenu && dot) dot.classList.add("bg-white/40");
    if (isSubmenu) link.classList.add("text-white/80");

    // === ACTIVE ===
    if (link.classList.contains("active")) {
      if (isSubmenu) {
        link.classList.add(
          "bg-gradient-to-r",
          "from-white/15",
          "to-white/10",
          "text-white",
          "border-l-2",
          "border-purple-400"
        );
        dot?.classList.remove("bg-white/40");
        dot?.classList.add("bg-purple-400");

        // also activate parent
        const submenu = link.closest("ul.submenu");
        if (submenu) {
          submenu.classList.remove("submenu-hidden");
          submenu.setAttribute("data-open", "true");
          const toggle = submenu.previousElementSibling;
          if (toggle) {
            toggle.classList.add(
              "bg-gradient-to-r",
              "from-white/20",
              "to-white/10",
              "text-white",
              "shadow-lg"
            );
            toggle.dataset.parentActive = "true"; // 🔥 mark parent
            const toggleIcon = toggle.querySelector(".w-10");
            const toggleI = toggle.querySelector("i");
            if (toggleI) {
              for (const key in colorMap) {
                if (toggleI.classList.contains(key)) {
                  toggleIcon?.classList.add("bg-gradient-to-r", ...colorMap[key]);
                }
              }
            }
            toggle.querySelector(".chev")?.classList.add("chev-rot");
          }
        }
      } else {
        link.classList.add(
          "bg-gradient-to-r",
          "from-white/20",
          "to-white/10",
          "text-white",
          "shadow-lg"
        );
        iconWrapper?.classList.add("bg-gradient-to-r", ...hoverColors);
      }
    }

    // === HOVER ===
    link.addEventListener("mouseenter", () => {
      if (link.classList.contains("active") || link.dataset.parentActive === "true") return;

      link.classList.add("bg-white/10", "text-white");
      if (!isSubmenu && iconWrapper) {
        iconWrapper.classList.add("bg-gradient-to-r", ...hoverColors);
      }
    });

    link.addEventListener("mouseleave", () => {
      if (link.classList.contains("active") || link.dataset.parentActive === "true") return;

      link.classList.remove("bg-white/10", "text-white");
      if (!isSubmenu && iconWrapper) {
        iconWrapper.classList.remove("bg-gradient-to-r", ...hoverColors);
      }
    });
  });
});




function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    updateSidebarState();

    // Add smooth transition effect
    sidebar.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    mainContent.style.transition = 'margin 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    footer.style.transition = 'margin 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
}

// Initialize sidebar state
updateSidebarState();

sidebarToggle.addEventListener('click', toggleSidebar);

// Close sidebar on outside click for mobile
document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target) && window.innerWidth < 1024 && sidebarOpen) {
        toggleSidebar();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        sidebarOpen = true;
    } else {
        sidebarOpen = false;
    }
    updateSidebarState();
});

// Add animation delays for cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

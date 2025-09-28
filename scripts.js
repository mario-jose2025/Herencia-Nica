// Espera a que todo el contenido del HTML se haya cargado antes de ejecutar el script.
document.addEventListener("DOMContentLoaded", () => {
  // === MANEJO DEL MODAL ===
  const infoModal = document.getElementById("info-modal");
  const closeBtn = document.querySelector(".close-btn");

  const closeModal = () => {
    if (infoModal) {
      infoModal.classList.add("modal-hidden");
    }
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }
  if (infoModal) {
    infoModal.addEventListener("click", (event) => {
      if (event.target === infoModal) {
        closeModal();
      }
    });
  }

  // === MENÚ ===
  const nav = document.querySelector('.main-nav');
  if (nav) {
    // marcar li que tienen submenus
    nav.querySelectorAll('li').forEach(li => {
      if (li.querySelector(':scope > ul')) li.classList.add('has-children');
    });

    // función que mide y aplica clase flip al UL si se sale de la ventana
    function adjustFlipForUl(ul) {
      if (!ul) return;
      // guardar estilos 
      const prevDisplay = ul.style.display;
      const prevVisibility = ul.style.visibility;

      // mostrar temporalmente para medir
      ul.style.display = 'block';
      ul.style.visibility = 'hidden';

      const rect = ul.getBoundingClientRect();
      const padding = 8; 

      // quitar flip por defecto
      ul.classList.remove('flip');

      // si el right se sale del viewport -> flip a la izquierda
      if (rect.right > window.innerWidth - padding) {
        ul.classList.add('flip');
      } else if (rect.left < padding) {
        // si se sale por la izquierda también flipear
        ul.classList.add('flip');
      } else {
        ul.classList.remove('flip');
      }

      // restaurar estilos
      ul.style.display = prevDisplay;
      ul.style.visibility = prevVisibility;
    }

    // aplicar listeners a todos los li.has-children
    const hasChildren = nav.querySelectorAll('.has-children');
    hasChildren.forEach(li => {
      const childUl = li.querySelector(':scope > ul');
      const trigger = li.querySelector(':scope > a');

      // Hover (mouse) -> recalcula flip al entrar
      li.addEventListener('mouseenter', () => {
        adjustFlipForUl(childUl);
      });

      // Si es táctil, el click abrirá el submenu y recalcula flip
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      if (trigger && isTouch) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          // toggle abierto
          li.classList.toggle('open');
          // cerrar hermanos en el mismo nivel
          const siblings = li.parentElement.querySelectorAll(':scope > li.open');
          siblings.forEach(sib => { if (sib !== li) sib.classList.remove('open'); });
          // recalcular flip para el UL que abrimos
          adjustFlipForUl(childUl);
        });
      }
    });

    // Cerrar menús si se hace clic fuera 
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.main-nav')) {
        nav.querySelectorAll('.open').forEach(el => el.classList.remove('open'));
      }
    });

    window.addEventListener('resize', () => {
      nav.querySelectorAll('ul').forEach(ul => {
        if (ul.offsetParent !== null) adjustFlipForUl(ul);
      });
    });
  }
  // === CÓDIGO DEL MAPA ===
  const map = L.map("map").setView([12.8654, -85.2072], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const locateBtn = document.getElementById("locateBtn");
  if (locateBtn) {
    locateBtn.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 10);
            L.marker([lat, lng]).addTo(map).bindPopup("📍 Estás aquí").openPopup();
          },
          () => { alert("No se pudo obtener tu ubicación. Asegúrate de haber aceptado los permisos."); }
        );
      } else {
        alert("La geolocalización no está disponible en este navegador.");
      }
    });
  }
  // ===FOOTER ===
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

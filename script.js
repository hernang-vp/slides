// BARRA DE NAVEGACIÓN
const btnMenu = document.getElementById('btnMenu');
const navMenu = document.getElementById('navMenu');
const iconMenu = document.getElementById('iconMenu');

function toggleMenu() {
  navMenu.classList.toggle('open');
  const isOpen = navMenu.classList.contains('open');
  iconMenu.src = isOpen ? 'assets/menu-close.svg' : 'assets/menu-open.svg';
}

btnMenu.addEventListener('click', (e) => {
  e.stopPropagation(); // CAMBIO: evitar que el clic en el botón cierre la barra
  toggleMenu();
});

// CAMBIO: cerrar menú si se hace clic fuera de él
document.addEventListener('click', (e) => {
  const isClickInsideMenu = navMenu.contains(e.target) || btnMenu.contains(e.target);
  if (!isClickInsideMenu && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    iconMenu.src = 'assets/menu-open.svg';
  }
});


// DESPLAZAMIENTO
const secciones = document.querySelectorAll(".seccion");
let index = 0;
let bloqueado = false;

function irASeccion(nuevoIndex) {
  if (bloqueado || nuevoIndex < 0 || nuevoIndex >= secciones.length) return;

  bloqueado = true;
  index = nuevoIndex;
  secciones[index].scrollIntoView({ behavior: "smooth" });

  // Actualizar clase 'active' en los links
  const links = document.querySelectorAll(".nav-link");
  links.forEach(link => {
    if (parseInt(link.dataset.index) === index) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  setTimeout(() => bloqueado = false, 200); // evitar scroll múltiple accidental
}

// --- Teclado ---
window.addEventListener("keydown", function (e) {
  if (e.code === "Space" || e.code === "ArrowDown" || e.code === "ArrowRight") {
    e.preventDefault();
    irASeccion(index + 1);
  } else if (e.code === "ArrowUp" || e.code === "ArrowLeft") {
    e.preventDefault();
    irASeccion(index - 1);
  }
});

// --- Swipe táctil ---
let startX = 0, startY = 0;

window.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

window.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffY) > Math.abs(diffX)) {
    if (diffY < -30) irASeccion(index + 1); // swipe arriba
    else if (diffY > 30) irASeccion(index - 1); // swipe abajo
  } else {
    if (diffX < -30) irASeccion(index + 1); // swipe izq
    else if (diffX > 30) irASeccion(index - 1); // swipe der
  }
});

// --- Scroll con mouse ---
window.addEventListener("wheel", (e) => {
  if (bloqueado) return;

  if (e.deltaY > 30) {
    irASeccion(index + 1); // scroll hacia abajo
  } else if (e.deltaY < -30) {
    irASeccion(index - 1); // scroll hacia arriba
  }
}, { passive: true });


// PANTALLA COMPLETA
const btn = document.getElementById("btnFullscreen");
const img = document.getElementById("imgFullscreen");

function toggleFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    entrarPantallaCompleta();
  } else {
    salirPantallaCompleta();
  }
}

function entrarPantallaCompleta() {
  const docEl = document.documentElement;
  if (docEl.requestFullscreen) {
    docEl.requestFullscreen();
  } else if (docEl.webkitRequestFullscreen) {
    docEl.webkitRequestFullscreen();
  } else if (docEl.msRequestFullscreen) {
    docEl.msRequestFullscreen();
  }
}

function salirPantallaCompleta() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// Cambiar la imagen según el estado
function actualizarImagen() {
  const enPantallaCompleta = document.fullscreenElement || document.webkitFullscreenElement;
  img.src = enPantallaCompleta ? "assets/full-screen-off.svg" : "assets/full-screen-on.svg";
}

// Detectar cambio de modo fullscreen
document.addEventListener("fullscreenchange", actualizarImagen);
document.addEventListener("webkitfullscreenchange", actualizarImagen);

// Acción del botón
btn.addEventListener("click", toggleFullscreen);
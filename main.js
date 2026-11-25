// Botón de lectura fácil
const fb = document.getElementById("facil");
fb.onclick = () => {
  const on = document.body.classList.toggle("facil");
  fb.setAttribute("aria-pressed", on);
};

// Al imprimir, abre los bloques plegables para que el PDF lleve todo el contenido
let cerrados = [];
addEventListener("beforeprint", () => {
  cerrados = [...document.querySelectorAll("details:not([open])")];
  cerrados.forEach((d) => (d.open = true));
});
addEventListener("afterprint", () => cerrados.forEach((d) => (d.open = false)));

// Marca la sección activa en el menú lateral
const links = [...document.querySelectorAll("aside a")];
const io = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && links.forEach((l) => l.classList.toggle("on", l.hash === "#" + e.target.id))),
  { rootMargin: "-40% 0px -55% 0px" }
);
document.querySelectorAll("main section").forEach((s) => io.observe(s));

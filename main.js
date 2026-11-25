import * as THREE from "three";

// Botón de lectura fácil y menú activo
const fb = document.getElementById("facil");
fb.onclick = () => {
  const on = document.body.classList.toggle("facil");
  fb.setAttribute("aria-pressed", on);
};
const links = [...document.querySelectorAll("aside a")];
const io = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && links.forEach((l) => l.classList.toggle("on", l.hash === "#" + e.target.id))),
  { rootMargin: "-40% 0px -55% 0px" }
);
document.querySelectorAll("main section").forEach((s) => io.observe(s));

// Escena three.js: las tres figuras de la referencia (círculo rojo, anillo, punto negro) en 3D
const cv = document.getElementById("gl");
const hero = cv.parentElement;
try {
  const r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  cam.position.z = 9;
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const L = new THREE.DirectionalLight(0xffffff, 2.2);
  L.position.set(-3, 4, 5);
  scene.add(L);

  const group = new THREE.Group();
  scene.add(group);
  const red = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0xd63a1e, roughness: 0.55 })
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.025, 16, 160),
    new THREE.MeshBasicMaterial({ color: 0x0b0b0b })
  );
  const ring2 = ring.clone();
  ring2.scale.setScalar(0.62);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshBasicMaterial({ color: 0x0b0b0b }));
  const net = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.4, 2),
    new THREE.MeshBasicMaterial({ color: 0x0b0b0b, wireframe: true, transparent: true, opacity: 0.12 })
  );
  group.add(red, ring, ring2, dot, net);

  let mx = 0, my = 0, sy = 0;
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
  addEventListener("scroll", () => (sy = scrollY / innerHeight), { passive: true });
  const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;

  const size = () => {
    const w = hero.clientWidth, h = hero.clientHeight;
    r.setSize(w, h, false);
    cam.aspect = w / h;
    // en pantallas anchas, las figuras van a la derecha; en estrechas, al centro y más pequeñas
    group.position.x = w > 900 ? 3.2 : 2.2;
    group.scale.setScalar(w > 900 ? 1 : 0.6);
    cam.updateProjectionMatrix();
  };
  addEventListener("resize", size);
  size();

  const clock = new THREE.Clock();
  r.setAnimationLoop(() => {
    const t = calm ? 0 : clock.getElapsedTime();
    ring.rotation.set(1.2 + my * 0.8 + t * 0.15, mx * 0.8, t * 0.2);
    ring2.rotation.set(t * 0.3, 1 + mx, my);
    net.rotation.set(t * 0.05 + sy, t * 0.07, 0);
    red.position.y = Math.sin(t) * 0.12;
    dot.position.set(Math.cos(t * 0.8) * 2.6, Math.sin(t * 0.8) * 1.3, Math.sin(t * 0.8) * 2);
    group.rotation.y += (mx * 0.5 - group.rotation.y) * 0.05;
    group.rotation.x += (my * 0.4 + sy * 0.6 - group.rotation.x) * 0.05;
    r.render(scene, cam);
  });
} catch (e) {
  hero.classList.add("fallback");
}

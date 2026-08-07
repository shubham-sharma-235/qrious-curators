const scrollSection = document.querySelector('.services-scroll');
const sticky = document.querySelector('.services-sticky');
const panels = [...document.querySelectorAll('.service-panel')];
const activeLabel = document.getElementById('activeLabel');
const indexNumber = document.getElementById('indexNumber');
const indexProgress = document.getElementById('indexProgress');

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const pad = (n) => String(n).padStart(2, '0');

function updateServices() {
  const rect = scrollSection.getBoundingClientRect();
  const scrollable = scrollSection.offsetHeight - window.innerHeight;
  const travelled = clamp(-rect.top, 0, scrollable);
  const normalized = scrollable > 0 ? travelled / scrollable : 0;
  const progress = normalized * (panels.length - 1);
  const active = clamp(Math.round(progress), 0, panels.length - 1);

  panels.forEach((panel, i) => {
    const d = i - progress;
    let y, scale, opacity, rotateX, z;

    if (d < 0) {
      // Outgoing card: simply leave its position and slide straight upward.
      // No scale, fade, blur or 3D rotation so the text/art stays fully sharp.
      const gone = clamp(-d, 0, 1);
      y = -gone * (sticky.clientHeight + 80);
      scale = 1;
      opacity = 1;
      rotateX = 0;
      z = 0;
    } else {
      const depth = clamp(d, 0, 5);
      y = depth * 29;
      scale = 1 - depth * 0.032;
      opacity = depth > 4.4 ? 0 : 1;
      rotateX = depth * 0.35;
      z = -depth * 28;
    }

    panel.style.transform = `translate3d(0, ${y}px, ${z}px) scale(${scale}) rotateX(${rotateX}deg)`;
    panel.style.opacity = opacity;
    panel.style.filter = 'none';
    panel.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
    panel.style.pointerEvents = Math.abs(d) < 0.55 ? 'auto' : 'none';
  });

  activeLabel.textContent = `${pad(active + 1)} / ${pad(panels.length)}`;
  indexNumber.textContent = pad(active + 1);
  indexProgress.style.transform = `scaleY(${normalized})`;
}

let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateServices();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateServices);
updateServices();

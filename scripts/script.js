const qnToggle = document.getElementById('qnToggle');
const qnOverlay = document.getElementById('qnOverlay');
function qnToggleMenu(force){
  const isOpen = typeof force === 'boolean' ? force : !qnOverlay.classList.contains('open');
  qnOverlay.classList.toggle('open', isOpen);
  qnToggle.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
qnToggle.addEventListener('click', () => qnToggleMenu());
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') qnToggleMenu(false);
});

// ----------------------------------------------------------------------


(function () {
  const MIN_TIME = 5000;

  const start = Date.now();

  window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const elapsed = Date.now() - start;
    const remaining = Math.max(0, MIN_TIME - elapsed);

    setTimeout(() => {
      preloader.classList.add("hide");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 600);
    }, remaining);
  });
})();

// ----------------------------------------------------------------------

/* ---- CURSOR ---- */
/* ---- HAMBURGER ---- */
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.add("open");
});

document.getElementById("mmClose").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.remove("open");
});

document.querySelectorAll(".mobile-menu a").forEach((a) => {
  a.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.remove("open");
  });
});

/* ---- HORIZONTAL SCROLL ---- */
const svcSection = document.getElementById("services");
const svcTrack = document.getElementById("svcTrack");

function updateSvc() {
  if (!svcSection || !svcTrack) return;

  const r = svcSection.getBoundingClientRect();
  const totalH = svcSection.offsetHeight - window.innerHeight;
  const p = Math.max(0, Math.min(1, -r.top / totalH));
  const maxShift = svcTrack.scrollWidth - window.innerWidth;

  svcTrack.style.transform = `translateX(-${p * maxShift}px)`;
}

window.addEventListener("scroll", updateSvc, { passive: true });

/* ---- PROCESS CARDS ---- */
const procSection=document.getElementById('process');
const procCards=document.querySelectorAll('.p-card');
function updateProc(){
  const r=procSection.getBoundingClientRect();
  const totalH=procSection.offsetHeight-window.innerHeight;
  const p=Math.max(0,Math.min(1,-r.top/totalH));
  procCards.forEach((c,i)=>{
    const delay=i*0.22;
    const cp=Math.max(0,Math.min(1,(p-delay)/.22));
    c.style.transform=`translateY(${100*(1-cp)}px) scale(${.92+.08*cp})`;
    c.style.opacity=cp;
    c.style.transition='transform .05s linear,opacity .05s linear';
  });
}
window.addEventListener('scroll',updateProc,{passive:true});

/* ---- TEAM PARALLAX ---- */
const teamSection=document.getElementById('team');
const teamCards=document.getElementById('teamCards');
function updateTeam(){
  const r=teamSection.getBoundingClientRect();
  const totalH=teamSection.offsetHeight-window.innerHeight;
  const p=Math.max(0,Math.min(1,-r.top/totalH));
  const maxY=teamCards.offsetHeight-window.innerHeight+80;
  teamCards.style.transform=`translateX(-50%) translateY(-${p*maxY}px)`;
}
window.addEventListener('scroll',updateTeam,{passive:true});

/* ---- MANIFESTO WORD REVEAL ---- */
const words=document.querySelectorAll('.manifesto-word');
function updateManifesto(){
  const section=document.getElementById('manifesto');
  const r=section.getBoundingClientRect();
  const progress=1-r.bottom/window.innerHeight;
  const visible=Math.floor(progress*words.length*4);
  words.forEach((w,i)=>w.classList.toggle('lit',i<visible));
}
window.addEventListener('scroll',updateManifesto,{passive:true});

/* ---- GENERIC REVEAL ---- */
const obs=new IntersectionObserver(e=>{e.forEach(el=>{if(el.isIntersecting)el.target.classList.add('in');});},{threshold:.1});
document.querySelectorAll('.rv,.rvl,.rvr').forEach(el=>obs.observe(el));

/* ---- SMOOTH ANCHORS ---- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});

/* ---- FOOTER REVEAL ---- */
const footerObs=new IntersectionObserver(e=>{e.forEach(el=>{if(el.isIntersecting)el.target.style.opacity='1';});},{threshold:.05});
document.querySelectorAll('footer').forEach(el=>{el.style.opacity='0';el.style.transition='opacity 1s ease';footerObs.observe(el);});


/* ════════════════════════════════════════════
   D3 WORLD MAP
════════════════════════════════════════════ */

// Cities: [lon, lat] in geographic coords + display offset for badge
const CITIES = {
  london:  { coord:[-0.12, 51.51],  label:'London',    bdx:-60, bdy:-54 },
  newyork: { coord:[-74.00, 40.71], label:'New York',   bdx:-70, bdy:-54 },
  toronto: { coord:[-79.38, 43.65], label:'Toronto',    bdx: 8,  bdy:-54 },
  sao:     { coord:[-46.63,-23.55], label:'São Paulo',  bdx:-70, bdy: 16 },
  berlin:  { coord:[ 13.40, 52.52], label:'Berlin',     bdx: 8,  bdy:-54 },
  dubai:   { coord:[ 55.30, 25.20], label:'Dubai',      bdx: 8,  bdy:-54 },
  mumbai:  { coord:[ 72.88, 19.08], label:'Mumbai',     bdx: 8,  bdy:-54 },
  tokyo:   { coord:[139.69, 35.69], label:'Tokyo',      bdx:-70, bdy:-54 },
  sydney:  { coord:[151.21,-33.87], label:'Sydney',     bdx:-70, bdy: 16 },
}

// Arc connections [cityA, cityB]
const ARCS = [
  ['london','newyork'],['london','dubai'],['london','toronto'],
  ['london','berlin'],['dubai','mumbai'],['mumbai','tokyo'],
  ['newyork','sao'],['tokyo','sydney'],
]

// Countries to highlight (ISO Alpha-2 → used in topojson id)
const HIGHLIGHT_ISO = new Set([
  'GBR','USA','ARE','JPN','AUS','IND','BRA','CAN','DEU',
  'FRA','NLD','SGP','CHN','ZAF','NGA','SAU','KEN','MEX'
])

async function drawMap() {
  const canvas = document.getElementById('map-canvas')
  const W = canvas.offsetWidth || 1000
  const H = Math.round(W * 0.52)

  // Remove loading indicator
  document.getElementById('mapLoading').remove()

  // Create SVG
  const svg = d3.select('#map-canvas')
    .append('svg')
    .attr('id','map-svg')
    .attr('viewBox',`0 0 ${W} ${H}`)
    .attr('width','100%')
    .attr('height',H)

  // Natural Earth projection
  const projection = d3.geoNaturalEarth1()
    .scale(W / 6.5)
    .translate([W / 2, H / 2])

  const path = d3.geoPath().projection(projection)

  // ── Sphere (ocean) ──
  svg.append('path')
    .datum({type:'Sphere'})
    .attr('class','sphere')
    .attr('d', path)

  // ── Graticule ──
  const graticule = d3.geoGraticule()
  svg.append('path')
    .datum(graticule())
    .attr('class','graticule')
    .attr('d', path)

  // Major lines (equator + tropics)
  const majorLines = d3.geoGraticule().step([180,23.5])()
  svg.append('path')
    .datum(majorLines)
    .attr('class','graticule-major')
    .attr('d', path)

  // ── Fetch TopoJSON world data ──
  let world
  try {
    world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  } catch(e) {
    // Fallback URL
    world = await d3.json('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
  }

  const { feature, mesh } = await import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm')

  const countries = feature(world, world.objects.countries)

  // Country id → ISO lookup (numeric codes)
  const ISO_NUMERIC = {
    '826':'GBR','840':'USA','784':'ARE','392':'JPN','036':'AUS',
    '356':'IND','076':'BRA','124':'CAN','276':'DEU','250':'FRA',
    '528':'NLD','702':'SGP','156':'CHN','710':'ZAF','566':'NGA',
    '682':'SAU','404':'KEN','484':'MEX','620':'PRT','724':'ESP',
    '380':'ITA','56':'BEL','620':'PRT','616':'POL','804':'UKR',
    '643':'RUS','792':'TUR','818':'EGY','012':'DZA','504':'MAR',
    '364':'IRN','050':'BGD','144':'LKA','586':'PAK','608':'PHL',
    '458':'MYS','360':'IDN','764':'THA','704':'VNM','410':'KOR',
  }

  // Draw countries
  const countryPaths = svg.selectAll('.country')
    .data(countries.features)
    .join('path')
    .attr('class', d => {
      const iso = ISO_NUMERIC[d.id] || ''
      return 'country' + (HIGHLIGHT_ISO.has(iso) ? ' highlighted' : '')
    })
    .attr('d', path)

  // Country borders mesh
  svg.append('path')
    .datum(mesh(world, world.objects.countries, (a,b) => a !== b))
    .attr('fill','none')
    .attr('stroke','rgba(255,255,255,.14)')
    .attr('stroke-width','.35')
    .attr('d', path)

  // ── Draw arcs ──
  const arcG = svg.append('g').attr('class','arcs-layer')
  ARCS.forEach(([a,b]) => {
    const c1 = CITIES[a].coord
    const c2 = CITIES[b].coord
    // Great-circle arc via interpolation
    const line = d3.geoInterpolate(c1, c2)
    const arcPoints = d3.range(0,1.01,.02).map(t => line(t))
    const arcPath = d3.line()
      .x(d => projection(d)?.[0])
      .y(d => projection(d)?.[1])
    arcG.append('path')
      .datum(arcPoints)
      .attr('class','arc-path')
      .attr('d', arcPath)
  })

  // ── Draw city dots ──
  Object.entries(CITIES).forEach(([key, city]) => {
    const [x, y] = projection(city.coord) || [0,0]
    if (!x || !y) return

    const g = svg.append('g').attr('class',`city-group cg-${key}`)

    // Rings
    g.append('circle').attr('class','dot-ring1').attr('cx',x).attr('cy',y).attr('r',2.5)
    g.append('circle').attr('class','dot-ring2').attr('cx',x).attr('cy',y).attr('r',2.5)
    g.append('circle').attr('class','dot-core').attr('cx',x).attr('cy',y).attr('r',2.5)

    // Small city label
    g.append('text')
      .attr('class','city-label')
      .attr('x', x + 6)
      .attr('y', y + 3)
      .text(city.label)

    // Position corresponding badge relative to SVG container
    const badge = document.querySelector(`.badge[data-city="${key}"]`)
    if (badge) {
      // Convert SVG coords to percentage of container
      const pctX = (x / W) * 100
      const pctY = (y / H) * 100
      // Compute badge offset so it appears above/beside dot
      const bw = 170 // approx badge width px
      const bh = 44  // approx badge height px

      // Use pixel offsets from dot
      badge.style.position = 'absolute'
      badge.style.left = `calc(${pctX}% + ${city.bdx}px)`
      badge.style.top  = `calc(${pctY}% + ${city.bdy}px)`
    }
  })

  // Fade in SVG
  requestAnimationFrame(() => {
    document.getElementById('map-svg').classList.add('ready')
  })

  // Trigger badge entrance after map loads
  setTimeout(() => {
    const badges = document.querySelectorAll('.badge')
    badges.forEach((b, i) => {
      setTimeout(() => {
        b.classList.add('show')
        setTimeout(() => b.classList.add('float'), 700)
      }, i * 120)
    })
  }, 800)
}

// ── Observe section, draw when visible ──
const mapObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      drawMap().catch(err => {
        console.warn('Map load error:', err)
        document.getElementById('mapLoading') && (document.getElementById('mapLoading').textContent = 'Map unavailable')
      })
      mapObs.disconnect()
    }
  })
}, { threshold: 0.05 })

mapObs.observe(document.getElementById('worldwide'))

/* Smooth anchors */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'))
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }) }
  })
})

document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector('.nx-floating-video');
    const targetCard = document.getElementById('nx-target-slot');
    const contentArea = document.querySelector('.nx-content-area');
    const dimOverlay = document.querySelector('.nx-dim-overlay');
    const textLayer = document.querySelector('.nx-sticky-text-layer');
    const words = document.querySelectorAll('.nx-word');
    const updateAnimation = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        /* =========================================
           1. VIDEO DOCKING LOGIC
           ========================================= */
        let dockProgress = scrollY / windowHeight;
        dockProgress = Math.max(0, Math.min(1, dockProgress));
        const rect = targetCard.getBoundingClientRect();
        const currentWidth = window.innerWidth - ((window.innerWidth - rect.width) * dockProgress);
        const currentHeight = windowHeight - ((windowHeight - rect.height) * dockProgress);
        const currentX = rect.left * dockProgress;
        const currentY = rect.top * dockProgress;
        const currentRadius = 4 * dockProgress;
        video.style.width = `${currentWidth}px`;
        video.style.height = `${currentHeight}px`;
        video.style.transform = `translate(${currentX}px, ${currentY}px)`;
        video.style.borderRadius = `${currentRadius}px`;
        /* =========================================
           2. TEXT & DIM OVERLAY REVEAL
           ========================================= */
        // Wait until the docking scroll is almost done to start fading in the background dim
        const postDockScroll = Math.max(0, scrollY - (windowHeight * 0.8));
        const textRevealProgress = Math.min(1, postDockScroll / 400);

        dimOverlay.style.opacity = textRevealProgress;
        // Animate words sliding up beautifully
        words.forEach((word, index) => {
            const delay = index * 0.15;
            let wordProgress = (textRevealProgress - delay) * 2;
            wordProgress = Math.max(0, Math.min(1, wordProgress));

            // Custom ease-out curve
            const easeOut = 1 - Math.pow(1 - wordProgress, 4);

            // Slides from Y:120% and Rotate:4deg down to 0
            const translateY = (1 - easeOut) * 120;
            const rotateZ = (1 - easeOut) * 4;

            word.style.transform = `translateY(${translateY}%) rotateZ(${rotateZ}deg)`;
        });
        /* =========================================
           3. SECTION EXIT LOGIC
           Makes the fixed text and dim overlay scroll away naturally
           when you reach the bottom of the grid.
           ========================================= */
        const contentBottom = contentArea.offsetTop + contentArea.offsetHeight;
        const scrollBottom = scrollY + windowHeight;

        let layerExitTranslate = 0;
        if (scrollBottom > contentBottom) {
            // Push the fixed layers UP by the exact amount scrolled past the section
            layerExitTranslate = contentBottom - scrollBottom;
        }

        textLayer.style.transform = `translateY(${layerExitTranslate}px)`;
        dimOverlay.style.transform = `translateY(${layerExitTranslate}px)`;
    };
    window.addEventListener('scroll', updateAnimation);
    window.addEventListener('resize', updateAnimation);
    updateAnimation(); // Initial setup
});


const slides = document.querySelectorAll(".content-slide");

const imageData = [

[
  "./assets/homeimages/teamh1.JPG",
  "./assets/homeimages/teamh2.JPG",
  "./assets/homeimages/teamh3.JPG"
],

[
  "./assets/homeimages/teamh4.JPG",
  "./assets/homeimages/teamh5.JPG",
  "./assets/homeimages/teamh6.JPG"
],

[
  "./assets/homeimages/teamh7.JPG",
  "./assets/homeimages/teamh8.JPG",
  "./assets/homeimages/teamh9.JPG"
]

];

const cards = document.querySelectorAll(".visual-card");

const progress = document.querySelector(".scroll-progress");

let currentIndex = 0;

window.addEventListener("scroll",()=>{

    const section = document.querySelector(".premium-about");

    const scrollTop = window.scrollY - section.offsetTop;

    const maxScroll = section.offsetHeight - window.innerHeight;

    const progressWidth = (scrollTop / maxScroll) * 100;

    progress.style.width = `${progressWidth}%`;

    let index = Math.floor(scrollTop / (window.innerHeight * 0.9));

    index = Math.max(0, Math.min(index, 2));

    if(index !== currentIndex){

        currentIndex = index;

        slides.forEach((slide,i)=>{

            slide.classList.toggle("active", i === index);

        });

        cards.forEach((card)=>{

            card.classList.remove("active");
            card.classList.add("inactive");

        });

        setTimeout(()=>{

            document.getElementById("img1").src = imageData[index][0];
            document.getElementById("img2").src = imageData[index][1];
            document.getElementById("img3").src = imageData[index][2];

            cards.forEach((card)=>{

                card.classList.remove("inactive");
                card.classList.add("active");

            });

        },350);

    }

});

// ------------------------------------------------------------- Testimonials ---------------------------------------------------------------------------------

const reviews = [
  { q: "Working with Qrious Curators has been an outstanding experience. What truly sets them apart is their content quality — every post feels thoughtfully crafted, visually compelling, and perfectly aligned with our brand voice.", name: "Harsh Jain", role: "Verified Google Review", initials: "HJ" },
  { q: "If you want jaw dropping graphics for your wedding, call Qrious Curators. Period.", name: "Kanika Agarwal", role: "Local Guide · Verified Review", initials: "KA", guide: true },
  { q: "Qrious Curators were my complete wedding digital planner — trust me they killed it. What an e-invite they made and all my social media countdowns were on point.", name: "Akshat Goyal", role: "Local Guide · Verified Review", initials: "AG", guide: true },
  { q: "We recently worked with Qrious for photo editing and retouching of around 150 images. Excellent communication throughout and great quality work.", name: "Angie Ng", role: "Verified Google Review", initials: "AN" },
  { q: "I highly recommend Qrious Curators. The experience was smooth, clear and I am satisfied about the result. The team always goes an extra mile.", name: "Lina Stanule", role: "Local Guide · Verified Review", initials: "LS", guide: true },
  { q: "We are a family business since 50+ years and always relied on word of mouth — but because of Qrious Curators we got a way to digital marketing. Their services are extremely personalised.", name: "MDI Nikita Punjabi", role: "Verified Google Review", initials: "NP" },
  { q: "I have been working with Team QC for 9 months. Their work is actually good, the team is proactive, and they've helped my brand Jain Textile gain a strong online presence.", name: "Harshit Sethi", role: "Verified Google Review", initials: "HS" },
  { q: "Have been their client since past 1 year and everything has been beyond perfect! The team is knowledgeable and very good at what they do.", name: "Prerna Daryanani", role: "Verified Google Review", initials: "PD" },
  { q: "One of the best digital marketing and branding agencies in Jaipur. Their expertise in social media, content creation, website development, and brand strategy drives real growth.", name: "Suniti Verma", role: "Verified Google Review", initials: "SV" },
  { q: "Qrious Curators have been fantastic for our brand! Their creative strategies boosted our engagement and reach quickly. They're responsive, transparent, and really understand our goals.", name: "Javed Ahmed Khan", role: "Local Guide · Verified Review", initials: "JK", guide: true },
  { q: "I got my website work done from Qrious Curators. They completed the project on time and as per my expectations. Highly recommended!", name: "Heeralal Soni", role: "Verified Google Review", initials: "HS" },
  { q: "Great work by Abhay and Team for their seamless efforts for my newly launched brand. I'd also like to highlight Social Media Manager Preeti for her outstanding work.", name: "Kanu Sharma", role: "Verified Google Review", initials: "KS" },
  { q: "Excellent digital marketing services! Their strategies significantly improved our online visibility and drove real results. A professional and reliable team.", name: "Ishika Jhalani", role: "Verified Google Review", initials: "IJ" },
  { q: "Outstanding social media marketing services! They crafted innovative campaigns that boosted our engagement and reach significantly.", name: "Kumkum Chauhan", role: "Verified Google Review", initials: "KC" },
  { q: "Good service and nice experience. The team is helpful and professional. One of the best digital marketing agencies in Jaipur.", name: "Yashika Chouhan", role: "Verified Google Review", initials: "YC" },
  { q: "Excellent services and very well trained staff. Behaviour is polite and they complete projects on due dates.", name: "Prapti Dave", role: "Verified Google Review", initials: "PD" },
];

function buildCard(d) {
  return `<div class="t-card">
    <div class="t-stars">${'★'.repeat(5).split('').map(s => `<span class="t-star">${s}</span>`).join('')}</div>
    <p class="t-quote">${d.q}</p>
    <div class="t-author">
      <div class="t-avatar">${d.initials}</div>
      <div>
        <p class="t-name">${d.name}</p>
        <p class="t-role">${d.role}</p>
        ${d.guide ? `<div class="t-badge"><span class="t-g-dot"></span>Local Guide</div>` : ''}
      </div>
    </div>
  </div>`;
}

const half = Math.ceil(reviews.length / 2);
const h1 = reviews.slice(0, half).map(buildCard).join('');
const h2 = reviews.slice(half).map(buildCard).join('');
document.getElementById('r1').innerHTML = h1 + h1;
document.getElementById('r2').innerHTML = h2 + h2;

// ------------------ Testimonials ------------------





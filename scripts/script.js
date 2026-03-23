
(function () {
  const MIN_TIME = 900; 

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
const cur=document.getElementById('qc-cur'),ring=document.getElementById('qc-cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function raf(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(raf);})();
document.querySelectorAll('a,button,.stack-card,.p-card,.t-card,.tm-card,.showcase-card,.award-cell,.stat-cell,.impact-card,.pill-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cur-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cur-hover'));
});

/* ---- HAMBURGER ---- */
document.getElementById('hamburger').addEventListener('click',()=>document.getElementById('mobileMenu').classList.add('open'));
document.getElementById('mmClose').addEventListener('click',()=>document.getElementById('mobileMenu').classList.remove('open'));
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>document.getElementById('mobileMenu').classList.remove('open')));

/* ---- HORIZONTAL SCROLL ---- */
const svcSection=document.getElementById('services');
const svcTrack=document.getElementById('svcTrack');
function updateSvc(){
  const r=svcSection.getBoundingClientRect();
  const totalH=svcSection.offsetHeight-window.innerHeight;
  const p=Math.max(0,Math.min(1,-r.top/totalH));
  const maxShift=svcTrack.scrollWidth-window.innerWidth;
  svcTrack.style.transform=`translateX(-${p*maxShift}px)`;
}
window.addEventListener('scroll',updateSvc,{passive:true});

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
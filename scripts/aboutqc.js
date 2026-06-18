// Combined page interactions
// Journey horizontal scroll + appended counter/reveal animations


    // --- 1. MOUSE IMAGE TRAIL EFFECT ---
    // const images = [
    //   "./images/artboard-7.jpeg",
    //   "./images/artboard-12.jpeg",
    //   "./images/artboard-19.jpeg",
    //   "./images/artboard-18.jpeg",
    //   "./images/artboard-6.jpeg"
    // ];

    // let trailIndex = 0;
    // let lastX = 0;
    // let lastY = 0;

    // window.addEventListener("mousemove", (e) => {
    //   const distance = Math.hypot(
    //     e.clientX - lastX,
    //     e.clientY - lastY
    //   );

    //   if (distance > 60) {
    //     createImage(e.clientX, e.clientY);
    //     lastX = e.clientX;
    //     lastY = e.clientY;
    //   }
    // });

    function createImage(x, y) {
      const img = document.createElement("img");
      img.src = images[trailIndex % images.length];
      img.classList.add("trail-img");
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      document.body.appendChild(img);
      trailIndex++;

      gsap.fromTo(
        img,
        { scale: 0, opacity: 1 },
        { scale: 1, duration: 0.3 }
      );

      gsap.to(img, {
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        delay: 0.5,
        onComplete: () => img.remove()
      });
    }

    // --- 2. INITIALIZE LENIS SMOOTH SCROLL ---
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo out
      smoothWheel: true,
      lerp: 0.05, // inertia lag for buttery feel
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- 3. DYNAMIC ROADMAP CARDS INJECTION ---
    const cardsData = [
      { 
        id: 1, 
        x: -600, 
        y: -500, 
        r: 0, 
        year: "2022",
        title: "The Ignition", 
        tag: "Foundation", 
        desc: "We set out to challenge the status quo, launching our creative agency with a small, elite team of developers and designers determined to create premium web experiences.", 
        metric: "5 Core Founders",
        image: "./images/artboard-7.jpeg"
      },
      { 
        id: 2, 
        x: 600, 
        y: -500, 
        r: 0, 
        year: "2023",
        title: "Expanding Horizons", 
        tag: "Acceleration", 
        desc: "Rapid adoption of WebGL and modern animation libraries led to our first round of international clients. We grew our team and built our core interactive engine.", 
        metric: "+15 Creative Minds",
        image: "./images/artboard-12.jpeg"
      },
      { 
        id: 3, 
        x: 1000, 
        y: 0, 
        r: 90, 
        year: "2024",
        title: "Industry Recognition", 
        tag: "Innovation", 
        desc: "A milestone year. We secured our first global design nominations and established our agency as a top-tier creative force for high-end digital storytelling.", 
        metric: "3 Site Of The Day Awards",
        image: "./images/artboard-19.jpeg"
      },
      { 
        id: 4, 
        x: 600, 
        y: 500, 
        r: 180, 
        year: "2025",
        title: "Going Global", 
        tag: "Global Scale", 
        desc: "Opened regional partnerships in Europe and North America. Scaled our operations and introduced immersive interactive web-spaces and spatial web portals.", 
        metric: "40+ Global Projects",
        image: "./images/artboard-18.jpeg"
      },
      { 
        id: 5, 
        x: -600, 
        y: 500, 
        r: 180, 
        year: "2026",
        title: "State of Art", 
        tag: "Present Day", 
        desc: "Integrating state-of-the-art AI design pipelines with ultra-performance 3D rendering in WebGL. Continuing to push the boundaries of what is possible inside a browser.", 
        metric: "Current Landmark",
        image: "./images/artboard-6.jpeg"
      },
      { 
        id: 6, 
        x: -1000, 
        y: 0, 
        r: 270, 
        year: "2026+",
        title: "Future Horizons", 
        tag: "Vision", 
        desc: "Stepping into next-generation digital interfaces, spatial computing, and fully decentralized interactive ecosystems. The journey has only just begun.", 
        metric: "Infinite Opportunities",
        image: "./images/artboard-13.jpeg"
      }
    ];

    function getFrameTransformForCard(card) {
      const theta = card.r;
      const phi = -theta * (Math.PI / 180);
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      const rotatedX = card.x * cosPhi - card.y * sinPhi;
      const rotatedY = card.x * sinPhi + card.y * cosPhi;
      return {
        x: -rotatedX,
        y: -rotatedY,
        rotation: -theta
      };
    }

    const trackFrame = document.querySelector('.track-frame');
    cardsData.forEach((card) => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'card-container';
      cardContainer.style.setProperty('--x', `${card.x}px`);
      cardContainer.style.setProperty('--y', `${card.y}px`);
      cardContainer.style.setProperty('--r', `${card.r}deg`);

      cardContainer.innerHTML = `
        <div class="card" data-id="${card.id}">
          <div class="card-info">
            <div class="card-header">
              <span class="card-year">${card.year}</span>
              <span class="card-tag">${card.tag}</span>
            </div>
            <div class="card-body">
              <h3 class="card-title">${card.title}</h3>
              <p class="card-desc">${card.desc}</p>
            </div>
            <div class="card-footer">
              <div class="card-meta">
                <span>${card.metric}</span>
                <div class="card-meta-dot"></div>
                <span>Milestone</span>
              </div>
            </div>
          </div>
          <div class="card-media">
            <img src="${card.image}" alt="${card.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 18px;" />
          </div>
        </div>
      `;
      trackFrame.appendChild(cardContainer);
    });

    // --- 4. HUD OVERLAYS INTERACTION ---
    function setActiveCard(index) {
      document.querySelectorAll('.dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
      
      document.querySelectorAll('.panel-works-track .card').forEach((card, idx) => {
        if (idx === index) {
          card.classList.add('active');
          gsap.to(card, {
            scale: 1.02,
            borderColor: 'rgba(197, 168, 128, 0.35)',
            background: 'rgba(20, 20, 26, 0.85)',
            duration: 0.6,
            ease: "power2.out"
          });
        } else {
          card.classList.remove('active');
          gsap.to(card, {
            scale: 1.0,
            borderColor: 'rgba(255, 255, 255, 0.08)',
            background: 'rgba(12, 12, 16, 0.65)',
            duration: 0.6,
            ease: "power2.out"
          });
        }
      });

      const progressNum = document.querySelector('.works-hud .progress-num');
      if (index >= 0) {
        const formattedNum = (index + 1).toString().padStart(2, '0');
        progressNum.textContent = `${formattedNum} / 06`;
      } else {
        progressNum.textContent = `INTRO / 06`;
      }
    }

    // --- 5. UNIFIED GSAP HORIZONTAL SCROLL TIMELINE ---
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".about-horizontal");
    const track = document.querySelector(".horizontal-track");

    // Unified scroll timeline:
    // 0.0 -> 0.8: Panel 1 reveal / animations
    // 0.8 -> 1.8: Slide to Panel 2 (works-track)
    // 1.8 -> 13.8: Panel 2 works-track timeline (zoom in, rotation through 6 cards, zoom out)
    // 13.8 -> 14.8: Slide to Panel 3 (mockup)
    // 14.8 -> 16.5: Slide to Panel 4 (but-not-all)
    // 16.5 -> 18.5: Panel 4 expanding black circle / eureka reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + (window.innerWidth * 3 + 5500), // Slower, buttery scroll depth
        scrub: 1.5, // inertia scrub smoothing
        pin: ".about-pin",
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Sync HUD progress bar with Panel 2 active scroll playhead
          // Panel 2 runs from progress time 1.8 to 13.8 in our 18.5 total timeline
          const progress = self.progress;
          const timelineTime = progress * 18.5;
          if (timelineTime >= 1.8 && timelineTime <= 13.8) {
            const worksProgress = (timelineTime - 1.8) / 12.0;
            gsap.to(".works-hud .progress-fill", { width: `${worksProgress * 100}%`, duration: 0.3, ease: "power1.out" });
          }
        }
      }
    });

    // Initial works-track setup
    tl.set(".panel-works-track .track-frame", {
      scale: 0.5,
      x: 0,
      y: 0,
      rotation: -15
    }, 0);

    // --- PANEL 1 STUFF ---
    tl.to(".seed-circle", {
      scale: 0.2,
      opacity: 0,
      duration: 0.3,
      ease: "none"
    }, 0);

    tl.to(".circle-reveal", {
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    }, 0);

    tl.to(".bg-orb", {
      scale: 1.35,
      opacity: 0.4,
      duration: 0.8,
      ease: "none"
    }, 0);

    // --- SLIDE TO PANEL 2 ---
    tl.to(track, {
      x: "-100vw",
      duration: 1.0,
      ease: "power2.inOut"
    }, 0.8);

    // Fade in Panel 2 HUD/dots overlays
    tl.to(".works-dots, .works-hud", {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.6,
      ease: "power1.out"
    }, 1.2);

    // --- PANEL 2 WORKSTRACK TIMELINE ---
    // Fade out Panel 2 Title Overlay
    tl.to(".panel-works-track .intro-container", {
      opacity: 0,
      y: -60,
      duration: 0.8,
      ease: "power2.inOut"
    }, 1.8);

    // Zoom in to Card 1
    const firstCardTransform = getFrameTransformForCard(cardsData[0]);
    tl.to(".panel-works-track .track-frame", {
      scale: 1,
      x: firstCardTransform.x,
      y: firstCardTransform.y,
      rotation: firstCardTransform.rotation,
      duration: 1.2,
      ease: "power2.inOut"
    }, 1.8);

    // Hold Card 1
    tl.to({}, { duration: 0.6 }, 3.0);

    // Card 2 to 6 transitions
    let currentTime = 3.6;
    for (let i = 1; i < cardsData.length; i++) {
      const currentCard = cardsData[i];
      const target = getFrameTransformForCard(currentCard);
      
      // Transition
      tl.to(".panel-works-track .track-frame", {
        x: target.x,
        y: target.y,
        rotation: target.rotation,
        duration: 1.2,
        ease: "power2.inOut"
      }, currentTime);
      currentTime += 1.2;
      
      // Hold
      tl.to({}, { duration: 0.6 }, currentTime);
      currentTime += 0.6;
    }

    // Zoom Out at the end of Panel 2
    tl.to(".panel-works-track .track-frame", {
      scale: 0.5,
      x: 0,
      y: 0,
      rotation: -375,
      duration: 1.2,
      ease: "power2.inOut"
    }, currentTime); // 12.6 -> 13.8

    // Fade in Panel 2 Title Overlay on zoom-out
    tl.to(".panel-works-track .intro-container", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.inOut"
    }, currentTime);

    // --- SLIDE TO PANEL 3 (mockup) ---
    tl.to(track, {
      x: "-200vw",
      duration: 1.0,
      ease: "power2.inOut"
    }, 13.8);

    // Fade out Panel 2 HUD/dots overlays
    tl.to(".works-dots, .works-hud", {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.5,
      ease: "power1.out"
    }, 13.8);

    // --- SLIDE TO PANEL 4 (but-not-all) ---
    tl.to(track, {
      x: "-300vw",
      duration: 1.7,
      ease: "power2.inOut"
    }, 14.8);

    // --- PANEL 4 EXPANDING BLACK CIRCLE STUFF ---
    tl.to(".but-expand-bg", {
      scale: 42,
      duration: 1.2,
      ease: "power2.inOut"
    }, 16.5);

    // tl.to(".but-icon", {
    //   scale: 0.35,
    //   opacity: 0,
    //   duration: 2,
    //   ease: "power2.out"
    // }, 16.6);


//   tl.to(".but-icon",{
//    x:-120,
//    duration:1,
//    ease:"power4.out"
//    });

  
// tl.to(".but-icon", {
//   x: -120,
//   duration: 1,
//   ease: "power4.out"
// });


// tl.fromTo(".brand-info",
// {
//   opacity: 0,
//   x: 50
// },
// {
//   opacity: 1,
//   x: 0,
//   duration: 1
// },
// "<0.2");

// tl.to({},{
//   duration:0.5
// });

// tl.to(".but-icon",{
//    y:-20,
//    scale:0.7,
//    duration:1
// });


// tl.to(".but-icon", { left: "42%", top: "50%", duration: 0.8, ease: "power3.out" }, 17.0);

tl.to(".but-icon", {
  left: "46.8%",
  top: "50%",
  x: 0,
  y: 0,
  scale: 0.72,
  duration: 0.8,
  ease: "power3.out"
}, 17.0);

tl.set(".but-dark-content", { opacity: 1 }, 17.0);

tl.fromTo(".brand-info",
  {
    opacity: 0,
    x: 45
  },
  {
    opacity: 1,
    x: 0,
    duration: 0.8,
    ease: "power3.out"
  },
17.2);

   
    tl.set(".but-dark-content", { opacity: 1 }, 17.0);
    tl.fromTo(".brand-info",
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
    17.2);
    // --- Set Active States via Timeline Callbacks ---
    // Total duration is 18.5
    tl.call(() => setActiveCard(-1), null, 0.5);   // Intro of Panel 2
    tl.call(() => setActiveCard(0), null, 2.0);    // Card 1
    tl.call(() => setActiveCard(1), null, 4.2);    // Card 2
    tl.call(() => setActiveCard(2), null, 6.0);    // Card 3
    tl.call(() => setActiveCard(3), null, 7.8);    // Card 4
    tl.call(() => setActiveCard(4), null, 9.6);    // Card 5
    tl.call(() => setActiveCard(5), null, 11.4);   // Card 6
    tl.call(() => setActiveCard(-1), null, 13.0);  // Zoom-out phase

    // --- 6. CLICK DOTS TO NAVIGATE PANEL 2 ---
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        // Active marks at times: 2.0, 4.2, 6.0, 7.8, 9.6, 11.4
        const times = [2.0, 4.2, 6.0, 7.8, 9.6, 11.4];
        const progress = times[index] / 18.5;
        
        const start = tl.scrollTrigger.start;
        const end = tl.scrollTrigger.end;
        const scrollOffset = start + progress * (end - start);
        
        lenis.scrollTo(scrollOffset, {
          duration: 1.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      });
    });

    // --- 7. 3D VIEWPORT MOUSE PARALLAX TILT ---
    const worksPanel = document.querySelector('.panel-works-track');
    worksPanel.addEventListener('mousemove', (e) => {
      const rect = worksPanel.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      
      gsap.to(".panel-works-track .track-wrapper", {
        rotationY: mouseX * 2.5,
        rotationX: -mouseY * 2.5,
        duration: 1.0,
        ease: "power2.out",
        overwrite: "auto"
      });
    });

    window.addEventListener("resize", () => {
      ScrollTrigger.refresh();
    });
  

/* ===== APPENDED ARKITEK SECTION JS ===== */
const arkCounters = document.querySelectorAll(".ark-counter");

const animateArkCounter = (counterElement) => {
  const target = Number(counterElement.dataset.target);
  const duration = 1400;
  const startTime = performance.now();

  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(easedProgress * target);

    counterElement.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counterElement.textContent = target;
    }
  };

  requestAnimationFrame(update);
};

const arkCounterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateArkCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.35 }
);

arkCounters.forEach((counterElement) => arkCounterObserver.observe(counterElement));

const arkRevealItems = document.querySelectorAll(".ark-reveal-item");

const arkRevealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        arkRevealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

arkRevealItems.forEach((item) => arkRevealObserver.observe(item));

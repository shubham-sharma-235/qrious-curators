// Old stacked testimonial handler removed.

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


/* Legacy standalone worldwide map removed; map now lives inside QG testimonial section. */

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

// Legacy testimonial marquee data/build code removed.




/* =========================================================
   CINEMATIC SERVICES SECTION JS — REVISIT FIXED VERSION
   Requires:
   gsap.min.js
   ScrollTrigger.min.js

   Use this instead of the previous qc-cine JS.
========================================================= */

(function () {
  window.addEventListener("load", function () {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error("GSAP or ScrollTrigger is not loaded.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /*
      Prevent duplicate timelines if this file is loaded twice
      or if you are testing with hot reload.
    */
    qcKillOldCinematicTriggers();

    qcInitCinematicServices();
    qcInitExperienceCards();
    qcRefreshAfterImages();
  });


  function qcKillOldCinematicTriggers() {
    const oldServicesTrigger = ScrollTrigger.getById("qc-cinematic-services");
    const oldExperienceTrigger = ScrollTrigger.getById("qc-experience-cards");

    if (oldServicesTrigger) oldServicesTrigger.kill(true);
    if (oldExperienceTrigger) oldExperienceTrigger.kill(true);

    gsap.killTweensOf([
      "#qcCineTrack",
      "#qcCineClone",
      "#qcCineClone img",
      "#qcCineSource",
      ".qc-cine-panel",
      ".qc-cine-panel-last .qc-cine-content",
      ".qc-cine-panel-last .qc-cine-num",
      ".qc-floating-card",
      ".qc-exp-kicker",
      ".qc-exp-sub",
      ".qc-exp-line",
      ".qc-exp-copy"
    ]);
  }


  /* =========================================================
     PART 1 + PART 2
     Horizontal service scroll + last card image fullscreen takeover
  ========================================================= */

  function qcInitCinematicServices() {
    const section = document.querySelector("#qc-cine-services");
    const track = document.querySelector("#qcCineTrack");
    const sourceBox = document.querySelector("#qcCineSource");
    const sourceImg = document.querySelector("#qcCineImage");
    const clone = document.querySelector("#qcCineClone");
    const cloneImg = clone ? clone.querySelector("img") : null;

    if (!section || !track || !sourceBox || !sourceImg || !clone || !cloneImg) {
      console.error("Cinematic services elements missing.");
      return;
    }

    cloneImg.src = sourceImg.currentSrc || sourceImg.src;

    const panels = gsap.utils.toArray(".qc-cine-panel");
    const previousPanels = panels.slice(0, -1);
    const lastPanelContent = document.querySelectorAll(
      ".qc-cine-panel-last .qc-cine-content, .qc-cine-panel-last .qc-cine-num"
    );

    function getMaxShift() {
      return Math.max(0, track.scrollWidth - window.innerWidth);
    }

    function getSourceRect() {
      return sourceBox.getBoundingClientRect();
    }

    function getSourceRadius() {
      return window.getComputedStyle(sourceBox).borderRadius || "38px";
    }

    function getScrollDistance() {
      return Math.max(5200, getMaxShift() + window.innerHeight * 3.4);
    }

    function resetServicesToStart() {
      gsap.set(track, {
        x: 0,
        clearProps: "transform"
      });

      gsap.set(sourceBox, {
        autoAlpha: 1,
        clearProps: "visibility,opacity"
      });

      gsap.set(previousPanels, {
        autoAlpha: 1,
        clearProps: "visibility,opacity"
      });

      gsap.set(lastPanelContent, {
        autoAlpha: 1,
        y: 0,
        clearProps: "visibility,opacity,transform"
      });

      gsap.set(clone, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        borderRadius: getSourceRadius(),
        clearProps: "visibility,opacity,transform,width,height"
      });

      gsap.set(cloneImg, {
        scale: 1.04,
        clearProps: "transform"
      });
    }

    function resetServicesToEnd() {
      gsap.set(track, {
        x: -getMaxShift()
      });

      gsap.set(sourceBox, {
        autoAlpha: 0
      });

      gsap.set(previousPanels, {
        autoAlpha: 0
      });

      gsap.set(lastPanelContent, {
        autoAlpha: 0,
        y: -58
      });

      gsap.set(clone, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0
      });

      gsap.set(cloneImg, {
        scale: 1.14
      });
    }

    /*
      Initial clean state.
    */
    gsap.set(track, {
      x: 0,
      force3D: true
    });

    gsap.set(clone, {
      autoAlpha: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      borderRadius: getSourceRadius(),
      transformOrigin: "top left",
      force3D: true
    });

    gsap.set(cloneImg, {
      scale: 1.04,
      transformOrigin: "center center",
      force3D: true
    });

    gsap.set(sourceBox, {
      autoAlpha: 1
    });

    gsap.set(previousPanels, {
      autoAlpha: 1
    });

    gsap.set(lastPanelContent, {
      autoAlpha: 1,
      y: 0
    });


    const tl = gsap.timeline({
      defaults: {
        ease: "none"
      },
      scrollTrigger: {
        id: "qc-cinematic-services",
        trigger: section,
        start: "top top",
        end: function () {
          return "+=" + getScrollDistance();
        },
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,

        /*
          These callbacks fix the revisit issue.
        */
        onEnter: function () {
          if (this.progress === 0) {
            resetServicesToStart();
          }
        },

        onLeave: function () {
          resetServicesToEnd();
        },

        onEnterBack: function () {
          resetServicesToEnd();
        },

        onLeaveBack: function () {
          resetServicesToStart();
        },

        onRefresh: function (self) {
          if (self.progress === 0) {
            resetServicesToStart();
          }
        }
      }
    });


    /*
      PHASE 1:
      Horizontal scroll through all service cards.
    */
    tl.to(track, {
      x: function () {
        return -getMaxShift();
      },
      duration: 2.6,
      ease: "none"
    });


    /*
      PHASE 2:
      Last card image detaches and expands.
    */
    tl.addLabel("takeover");

    tl.fromTo(
      clone,
      {
        autoAlpha: 1,
        x: function () {
          return getSourceRect().left;
        },
        y: function () {
          return getSourceRect().top;
        },
        width: function () {
          return getSourceRect().width;
        },
        height: function () {
          return getSourceRect().height;
        },
        borderRadius: function () {
          return getSourceRadius();
        }
      },
      {
        x: 0,
        y: 0,
        width: function () {
          return window.innerWidth;
        },
        height: function () {
          return window.innerHeight;
        },
        borderRadius: 0,
        duration: 1.3,
        ease: "power2.inOut",
        immediateRender: false
      },
      "takeover"
    );

    tl.to(
      sourceBox,
      {
        autoAlpha: 0,
        duration: 0.08,
        ease: "none"
      },
      "takeover+=0.04"
    );

    tl.to(
      previousPanels,
      {
        autoAlpha: 0,
        duration: 0.55,
        ease: "power1.out"
      },
      "takeover+=0.08"
    );

    tl.to(
      lastPanelContent,
      {
        autoAlpha: 0,
        y: -58,
        duration: 0.75,
        ease: "power2.out"
      },
      "takeover+=0.12"
    );

    tl.to(
      cloneImg,
      {
        scale: 1.14,
        duration: 1.3,
        ease: "power2.inOut"
      },
      "takeover"
    );


    /*
      PHASE 3:
      Fullscreen image fades away.
    */
    tl.to(
      clone,
      {
        autoAlpha: 0,
        duration: 0.95,
        ease: "power1.inOut"
      },
      "takeover+=1.32"
    );

    tl.to({}, { duration: 0.35 });
  }


  /* =========================================================
     PART 3 + PART 4
     Sticky text + floating cards
  ========================================================= */

  function qcInitExperienceCards() {
    const section = document.querySelector("#qc-cine-experience");
    const sticky = document.querySelector(".qc-cine-experience-sticky");
    const cards = gsap.utils.toArray(".qc-floating-card");

    if (!section || !sticky || !cards.length) {
      console.error("Experience cards elements missing.");
      return;
    }

    function resetExperienceToStart() {
      gsap.set(cards, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        clearProps: "visibility,opacity,transform"
      });

      gsap.set(".qc-exp-kicker", {
        autoAlpha: 0,
        y: 20
      });

      gsap.set(".qc-exp-sub", {
        autoAlpha: 0,
        y: 26
      });

      gsap.set(".qc-exp-line", {
        yPercent: 115,
        rotateX: 12,
        transformOrigin: "center bottom"
      });

      gsap.set(".qc-exp-copy", {
        scale: 1,
        autoAlpha: 1
      });
    }

    function resetExperienceToEnd() {
      gsap.set(cards, {
        autoAlpha: 0
      });

      gsap.set(".qc-exp-kicker", {
        autoAlpha: 1,
        y: 0
      });

      gsap.set(".qc-exp-sub", {
        autoAlpha: 1,
        y: 0
      });

      gsap.set(".qc-exp-line", {
        yPercent: 0,
        rotateX: 0
      });

      gsap.set(".qc-exp-copy", {
        scale: 0.965,
        autoAlpha: 1
      });
    }

    gsap.set(cards, {
      autoAlpha: 0,
      force3D: true,
      transformOrigin: "center center"
    });

    gsap.set(".qc-exp-kicker", {
      autoAlpha: 0,
      y: 20
    });

    gsap.set(".qc-exp-sub", {
      autoAlpha: 0,
      y: 26
    });

    gsap.set(".qc-exp-line", {
      yPercent: 115,
      rotateX: 12,
      transformOrigin: "center bottom"
    });

    gsap.set(".qc-exp-copy", {
      scale: 1,
      autoAlpha: 1
    });


    const enterStates = [
      { x: -360, y: 80, rotation: -8, scale: 0.86 },
      { x: 0, y: 320, rotation: 5, scale: 0.74 },
      { x: 360, y: 70, rotation: 7, scale: 0.86 },

      { x: -330, y: -90, rotation: 8, scale: 0.84 },
      { x: 330, y: 120, rotation: -6, scale: 0.86 },
      { x: 40, y: 330, rotation: 5, scale: 0.78 },

      { x: 360, y: -70, rotation: 9, scale: 0.84 },
      { x: -380, y: 160, rotation: -9, scale: 0.84 },
      { x: 300, y: 260, rotation: 6, scale: 0.78 }
    ];

    const activeStates = [
      { x: 0, y: 0, rotation: -3, scale: 1 },
      { x: 0, y: 0, rotation: 2, scale: 1 },
      { x: 0, y: 0, rotation: 4, scale: 1 },

      { x: 0, y: 0, rotation: 3, scale: 1 },
      { x: 0, y: 0, rotation: -3, scale: 1 },
      { x: 0, y: 0, rotation: 2, scale: 1 },

      { x: 0, y: 0, rotation: 4, scale: 1 },
      { x: 0, y: 0, rotation: -4, scale: 1 },
      { x: 0, y: 0, rotation: 3, scale: 1 }
    ];

    const exitStates = [
      { x: -260, y: -180, rotation: -14, scale: 0.82 },
      { x: 40, y: -320, rotation: 8, scale: 0.82 },
      { x: 300, y: -140, rotation: 12, scale: 0.82 },

      { x: -300, y: 180, rotation: -8, scale: 0.82 },
      { x: 320, y: -210, rotation: 9, scale: 0.82 },
      { x: 80, y: -330, rotation: -7, scale: 0.82 },

      { x: 300, y: -180, rotation: 13, scale: 0.82 },
      { x: -320, y: -170, rotation: -12, scale: 0.82 },
      { x: 260, y: -260, rotation: 9, scale: 0.82 }
    ];


    const tl = gsap.timeline({
      defaults: {
        ease: "none"
      },
      scrollTrigger: {
        id: "qc-experience-cards",
        trigger: section,
        start: "top top",
        end: function () {
          return "+=" + Math.max(4200, window.innerHeight * 4.4);
        },
        scrub: 1,
        pin: sticky,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,

        onEnter: function () {
          if (this.progress === 0) {
            resetExperienceToStart();
          }
        },

        onLeave: function () {
          resetExperienceToEnd();
        },

        onEnterBack: function () {
          resetExperienceToEnd();
        },

        onLeaveBack: function () {
          resetExperienceToStart();
        },

        onRefresh: function (self) {
          if (self.progress === 0) {
            resetExperienceToStart();
          }
        }
      }
    });


    /*
      Sticky text reveal.
    */
    tl.to(
      ".qc-exp-kicker",
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        ease: "power2.out"
      },
      0
    );

    tl.to(
      ".qc-exp-line",
      {
        yPercent: 0,
        rotateX: 0,
        duration: 0.62,
        stagger: 0.08,
        ease: "power3.out"
      },
      0.05
    );

    tl.to(
      ".qc-exp-sub",
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      },
      0.35
    );

    tl.to(
      ".qc-exp-copy",
      {
        scale: 0.965,
        duration: 3.4,
        ease: "none"
      },
      0.48
    );


    function animateGroup(indexes, startTime, exitTime, isLastGroup) {
      indexes.forEach(function (cardIndex, slotIndex) {
        const card = cards[cardIndex];
        const delay = slotIndex * 0.075;

        tl.fromTo(
          card,
          {
            autoAlpha: 0,
            ...enterStates[cardIndex]
          },
          {
            autoAlpha: 1,
            ...activeStates[cardIndex],
            duration: 0.48,
            ease: "power3.out"
          },
          startTime + delay
        );

        tl.to(
          card,
          {
            autoAlpha: 0,
            ...exitStates[cardIndex],
            duration: isLastGroup ? 0.52 : 0.4,
            ease: "power2.in"
          },
          exitTime + delay
        );
      });
    }


    /*
      0% - 30%: cards 1, 2, 3
      30% - 60%: cards 4, 5, 6
      60% - 100%: cards 7, 8, 9
    */
    animateGroup([0, 1, 2], 0.68, 1.35, false);
    animateGroup([3, 4, 5], 1.52, 2.24, false);
    animateGroup([6, 7, 8], 2.48, 3.34, true);

    tl.to({}, { duration: 0.35 });
  }


  /* =========================================================
     REFRESH HANDLING
  ========================================================= */

  function qcRefreshAfterImages() {
    const images = document.querySelectorAll(
      "#qc-cine-services img, #qc-cine-experience img"
    );

    images.forEach(function (img) {
      if (!img.complete) {
        img.addEventListener(
          "load",
          function () {
            ScrollTrigger.refresh();
          },
          { once: true }
        );

        img.addEventListener(
          "error",
          function () {
            ScrollTrigger.refresh();
          },
          { once: true }
        );
      }
    });

    let resizeTimer;

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(function () {
        ScrollTrigger.refresh();
      }, 250);
    });

    setTimeout(function () {
      ScrollTrigger.refresh();
    }, 300);

    setTimeout(function () {
      ScrollTrigger.refresh();
    }, 1000);
  }
})();

/* ===== QG TESTIMONIAL + WORLD MAP ===== */
(function () {
  "use strict";


  /* =====================================================
     ELEMENTS
  ===================================================== */

  const section =
    document.querySelector(
      "#qcGlobalProof"
    );

  const qcMarqueeStage =
    document.querySelector(
      "#qcMarqueeStage"
    );

  const qcIntroCopy =
    document.querySelector(
      "#qcIntroCopy"
    );

  const qcWorldLayer =
    document.querySelector(
      "#qcWorldLayer"
    );

  const mapTitles =
    [
      ...document.querySelectorAll(
        ".qg-map-title"
      )
    ];

  const qcScrollCue =
    document.querySelector(
      "#qcScrollCue"
    );

  const qcScrollButton =
    document.querySelector(
      "#qcScrollButton"
    );

  const svg =
    d3.select(
      "#qcWorldMapSvg"
    );


  /* =====================================================
     DUPLICATE MARQUEE GROUPS

     This creates infinite rows automatically.

     You only need to edit the FIRST marquee-group
     inside each row.
  ===================================================== */

  document
    .querySelectorAll(
      ".qg-marquee-track"
    )
    .forEach(track => {

      const group =
        track.querySelector(
          ".qg-marquee-group"
        );

      const copy =
        group.cloneNode(true);

      copy.setAttribute(
        "aria-hidden",
        "true"
      );

      track.appendChild(copy);

    });


  /* =====================================================
     ALTERNATING CARD COLOURS

     Row 1: white / orange / white ...
     Row 2: orange / white / orange ...

     Classes are applied to both original and duplicated
     marquee groups so a card keeps the SAME colour when
     it later flies into the map.
  ===================================================== */

  document
    .querySelectorAll(".qg-marquee-row")
    .forEach((row, rowIndex) => {

      row
        .querySelectorAll(".qg-marquee-group")
        .forEach(group => {

          group
            .querySelectorAll(".qg-testimonial-card")
            .forEach((card, cardIndex) => {

              const isOrange =
                (cardIndex + rowIndex) % 2 === 1;

              card.classList.toggle(
                "qg-card-orange",
                isOrange
              );

              card.classList.toggle(
                "qg-card-white",
                !isOrange
              );

            });

        });

    });



  /* =====================================================
     MATH HELPERS
  ===================================================== */

  function clamp(
    value,
    min = 0,
    max = 1
  ) {

    return Math.min(
      max,
      Math.max(
        min,
        value
      )
    );

  }


  function lerp(
    start,
    end,
    progress
  ) {

    return (
      start +
      (
        end -
        start
      ) *
      progress
    );

  }


  function inverseLerp(
    start,
    end,
    value
  ) {

    return clamp(
      (
        value -
        start
      ) /
      (
        end -
        start
      )
    );

  }


  function smoothstep(
    start,
    end,
    value
  ) {

    const x =
      inverseLerp(
        start,
        end,
        value
      );

    return (
      x *
      x *
      (
        3 -
        2 * x
      )
    );

  }


  function easeInOutCubic(t) {

    return (
      t < 0.5

        ? 4 * t * t * t

        : 1 -
          Math.pow(
            -2 * t + 2,
            3
          ) / 2
    );

  }



  /* =====================================================
     ACTUAL WORLD MAP — FLAT 2D WEBSITE MAP

     Uses the same real country geometry, but deliberately
     avoids the globe / atlas look:
     - Mercator projection
     - Antarctica removed from the visual crop
     - no sphere
     - no graticule
     - quiet land + orange client markets
  ===================================================== */

  const WORLD_DATA_URL =
    "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";


  /*
    Numeric ISO country IDs.

    India        356
    China        156
    Australia     36
    USA          840

    Europe is represented by the selected countries below.
  */

  const clientCountryIds =
    new Set([

      840, // USA
      356, // India
      156, // China
      36,  // Australia

      826, // United Kingdom
      250, // France
      276, // Germany
      724, // Spain
      380, // Italy
      528, // Netherlands
      56,  // Belgium
      756, // Switzerland
      40,  // Austria
      620, // Portugal
      616, // Poland
      372, // Ireland
      208, // Denmark
      752, // Sweden
      578  // Norway

    ]);


  /*
    Actual geographic coordinates:
    [longitude, latitude]
  */

  const clientLocations = {

    usa: [
      -98.5795,
      39.8283
    ],

    europe: [
      10.0,
      50.5
    ],

    india: [
      78.9629,
      20.5937
    ],

    china: [
      104.1954,
      35.8617
    ],

    australia: [
      133.7751,
      -25.2744
    ]

  };


  let worldData = null;
  let projection = null;
  let mapWidth = 0;
  let mapHeight = 0;


  async function loadWorldMap() {

    try {

      worldData =
        await d3.json(
          WORLD_DATA_URL
        );

      renderWorldMap();

    } catch (error) {

      console.error(
        "Could not load world map:",
        error
      );

    }

  }


  function renderWorldMap() {

    if (!worldData) {
      return;
    }


    const rect =
      qcWorldLayer
        .getBoundingClientRect();


    mapWidth =
      Math.max(
        700,
        Math.round(rect.width)
      );


    mapHeight =
      Math.max(
        420,
        Math.round(rect.height)
      );


    svg
      .attr(
        "viewBox",
        `0 0 ${mapWidth} ${mapHeight}`
      )
      .attr(
        "preserveAspectRatio",
        "xMidYMid meet"
      );


    const allCountries =
      topojson
        .feature(
          worldData,
          worldData.objects.countries
        )
        .features;


    /* Antarctica is excluded to match a modern website world-map
       silhouette rather than a textbook atlas plate. */
    const countries =
      allCountries.filter(
        country => Number(country.id) !== 10
      );


    const mapFeatureCollection = {
      type: "FeatureCollection",
      features: countries
    };


    /* A flat Natural Earth projection keeps the world familiar while
       avoiding globe distortion. The generous width fit makes the map
       read as the hero visual across the full desktop. */
    projection =
      d3
        .geoNaturalEarth1()
        .fitExtent(
          [
            [-22, 34],
            [mapWidth + 22, mapHeight - 24]
          ],
          mapFeatureCollection
        );


    const geoPath =
      d3.geoPath(
        projection
      );


    svg
      .selectAll("*")
      .remove();


    /* Merge all countries into ONE land silhouette. This is what gives
       the reference-style clean map with no internal border clutter. */
    const mergedLand =
      topojson.merge(
        worldData,
        worldData.objects.countries.geometries.filter(
          geometry => Number(geometry.id) !== 10
        )
      );


    svg
      .append("path")
      .datum(mergedLand)
      .attr("class", "qg-world-land-shadow")
      .attr("d", geoPath);


    svg
      .append("path")
      .datum(mergedLand)
      .attr("class", "qg-world-land-glow")
      .attr("d", geoPath);


    svg
      .append("path")
      .datum(mergedLand)
      .attr("class", "qg-world-land")
      .attr("d", geoPath);


    positionMapMarkers();

  }


  /* =====================================================
     PLACE MARKERS USING REAL LAT/LONG
  ===================================================== */

  function positionMapMarkers() {

    if (!projection) {
      return;
    }


    document
      .querySelectorAll(
        ".qg-map-point"
      )
      .forEach(point => {

        const country =
          point.dataset.country;


        const coordinates =
          clientLocations[
            country
          ];


        if (!coordinates) {
          return;
        }


        const projected =
          projection(
            coordinates
          );


        if (!projected) {
          return;
        }


        const [
          x,
          y
        ] =
          projected;


        point.style.left =
          `${
            (
              x /
              mapWidth
            ) * 100
          }%`;


        point.style.top =
          `${
            (
              y /
              mapHeight
            ) * 100
          }%`;

      });

  }



  /* =====================================================
     FLIGHT CARDS
  ===================================================== */

  let flights = [];

  let flightsCreated = false;



  /*
    Only pick cards that are actually visible on screen.

    Since marquee contains duplicate copies,
    data-id prevents duplicated testimonials
    entering the map twice.
  */

  function getVisibleCards() {

    /*
      There are only 10 unique testimonials. Every one of them exists
      TWICE in the DOM (the marquee's cloned loop copy). We must never
      drop a testimonial just because one of its two copies currently
      looks off-screen — we only need to pick the BETTER of its two
      copies (the one that is actually visible right now) so its rect
      is accurate. This guarantees all 10 always fly, including the
      ones sitting near the left/right edges.
    */

    const cards =
      [
        ...document
          .querySelectorAll(
            ".qg-testimonial-card"
          )
      ];


    const byId =
      new Map();


    for (
      const card
      of cards
    ) {

      const id =
        card.dataset.id;


      if (
        !byId.has(id)
      ) {

        byId.set(
          id,
          []
        );

      }


      byId
        .get(id)
        .push(card);

    }


    const centerX =
      window.innerWidth / 2;

    const centerY =
      window.innerHeight / 2;


    const visible =
      [];


    byId.forEach(
      instances => {

        let best = null;
        let bestScore = -Infinity;


        for (
          const card
          of instances
        ) {

          const rect =
            card
              .getBoundingClientRect();


          const onScreen =

            rect.right > -40 &&

            rect.left <
            window.innerWidth + 40 &&

            rect.bottom > -40 &&

            rect.top <
            window.innerHeight + 40 &&

            rect.width > 4 &&

            rect.height > 4;


          const rectCenterX =
            rect.left +
            rect.width / 2;

          const rectCenterY =
            rect.top +
            rect.height / 2;


          const distanceFromCenter =

            Math.abs(
              rectCenterX -
              centerX
            ) +

            Math.abs(
              rectCenterY -
              centerY
            );


          /*
            Strongly prefer an on-screen copy. Between two on-screen
            (or two off-screen) copies, prefer whichever sits closer
            to the viewport centre — that's always the "real" one the
            person is currently looking at, never the looping clone.
          */

          const score =

            (
              onScreen
                ? 100000
                : 0
            ) -

            distanceFromCenter;


          if (
            score >
            bestScore
          ) {

            bestScore = score;

            best = {
              card,
              rect
            };

          }

        }


        if (best) {

          visible.push(
            best
          );

        }

      }
    );


    return visible;

  }



  function createFlights() {

    if (flightsCreated) {
      return;
    }


    flightsCreated = true;


    const visibleCards =
      getVisibleCards();


    const countryCounts = {};


    flights =
      visibleCards.map(
        (
          item,
          index
        ) => {

          const {
            card,
            rect
          } = item;


          const country =
            card.dataset.country;


          const target =
            document.querySelector(
              `.qg-map-point[data-country="${country}"]`
            );


          if (!target) {
            return null;
          }


          /*
            IMPORTANT: at this point the marquee stage is already
            tilted in 3D (rotateX + perspective), so rect.width /
            rect.height is the FORESHORTENED, perspective-distorted
            bounding box — not the card's real size. Using that
            directly made the card visibly snap to a different size
            the instant it left the tilted stage.

            Fix: use the card's real, untransformed layout size
            (offsetWidth/offsetHeight never lies about CSS transforms)
            for the flight size, and use the rect's CENTER POINT
            (which correctly reflects the tilted on-screen position)
            to place that real-sized card so it starts exactly where
            the eye currently sees it.
          */
          const naturalWidth =
            card.offsetWidth;

          const naturalHeight =
            card.offsetHeight;


          const rectCenterX =
            rect.left +
            rect.width / 2;

          const rectCenterY =
            rect.top +
            rect.height / 2;


          const startLeft =
            rectCenterX -
            naturalWidth / 2;

          const startTop =
            rectCenterY -
            naturalHeight / 2;


          /*
            THIS is the important change:
            we do NOT clone the testimonial.

            A hidden placeholder keeps the marquee layout exactly where
            it was, while the SAME visible card is temporarily moved to
            document.body for a clean fixed-position morph.
          */
          const placeholder =
            document.createElement("div");

          placeholder.className =
            "qg-flight-placeholder";

          placeholder.style.width =
            `${naturalWidth}px`;

          placeholder.style.height =
            `${naturalHeight}px`;

          placeholder.style.flex =
            `0 0 ${naturalWidth}px`;


          const originalStyle =
            card.getAttribute("style");


          card.parentNode
            .insertBefore(
              placeholder,
              card
            );


          card.classList.add(
            "qg-flight-card"
          );

          card.style.width =
            `${naturalWidth}px`;

          card.style.height =
            `${naturalHeight}px`;

          card.style.flexBasis =
            `${naturalWidth}px`;

          card.style.opacity = "1";
          card.style.borderRadius = "14px";
          card.style.setProperty(
            "--flight-content-opacity",
            "1"
          );

          card.style.transform =
            `translate3d(${startLeft}px, ${startTop}px, 0)`;


          document.body
            .appendChild(card);


          /*
            All testimonials now land on the EXACT same target point
            (no golden-angle spread), per request — every card for a
            given country converges on the identical spot instead of
            fanning out to slightly different positions.
          */

          return {
            card,
            placeholder,
            originalStyle,
            country,
            target,

            startX: startLeft,
            startY: startTop,
            width: naturalWidth,
            height: naturalHeight,

            offsetX: 0,
            offsetY: 0,

            index
          };

        }
      )
      .filter(Boolean);

  }


  /* =====================================================
     UPDATE FLIGHT POSITIONS FROM SCROLL

     IMPORTANT:
     No setTimeout.
     No autoplay timeline.
     No "animate then reset".

     Every frame is calculated directly
     from page scroll position.
  ===================================================== */

  function updateFlights(
    progress
  ) {

    if (!flightsCreated) {
      return;
    }


    flights.forEach(
      (
        flight,
        index
      ) => {

        /*
          No per-card stagger — every testimonial travels on the
          EXACT same timeline, so they all leave the marquee and
          land on the map together. A stagger here caused a few
          cards to visibly lag behind as oversized, leftover-looking
          circles while the rest had already landed as small dots.
        */
        const stagger = 0;


        const localProgress =
          clamp(
            (
              progress -
              stagger
            ) /
            (
              1 -
              stagger
            )
          );


        /*
          The card rounds into a circle QUICKLY (fast morph, first
          ~22% of the local timeline) so it never lingers as a big
          half-card mid-flight. Position still travels across the
          full timeline.
        */
        const travelProgress =
          smoothstep(
            0.00,
            1.00,
            localProgress
          );


        const travelEased =
          easeInOutCubic(
            travelProgress
          );


        const morphProgress =
          smoothstep(
            0.00,
            0.22,
            localProgress
          );


        const targetRect =
          flight.target
            .getBoundingClientRect();


        const targetX =
          targetRect.left +
          targetRect.width / 2 -
          flight.width / 2 +
          flight.offsetX;


        const targetY =
          targetRect.top +
          targetRect.height / 2 -
          flight.height / 2 +
          flight.offsetY;


        /* Keep the card in place while it rounds, then give the
           travelling circle a gentle clean arc into its location. */
        const arcHeight =
          38 +
          (index % 3) * 12;


        const arc =
          Math.sin(
            Math.PI *
            travelEased
          ) *
          arcHeight;


        const currentX =
          lerp(
            flight.startX,
            targetX,
            travelEased
          );


        const currentY =
          lerp(
            flight.startY,
            targetY,
            travelEased
          ) -
          arc;


        /*
          Stay SMALL for the whole transit, then grow BIGGER only in
          the final stretch as it actually lands on the map point —
          this is what "chota while flying, bada on arrival" means.
        */
        const landingGrow =
          smoothstep(
            0.78,
            1.00,
            localProgress
          );


        const circleSize =
          lerp(
            16,
            40,
            landingGrow
          );


        const visualWidth =
          lerp(
            flight.width,
            circleSize,
            morphProgress
          );


        const visualHeight =
          lerp(
            flight.height,
            circleSize,
            morphProgress
          );


        const scaleX =
          visualWidth /
          flight.width;


        const scaleY =
          visualHeight /
          flight.height;


        const roundness =
          lerp(
            14,
            999,
            morphProgress
          );


        const contentOpacity =
          1 -
          smoothstep(
            0.04,
            0.16,
            localProgress
          );


        let opacity = 1;

        if (localProgress > 0.94) {
          opacity =
            1 -
            smoothstep(
              0.94,
              1,
              localProgress
            );
        }


        flight.card.style.transform =
          `
          translate3d(
            ${currentX}px,
            ${currentY}px,
            0
          )
          scale(${scaleX}, ${scaleY})
          `;


        flight.card.style.borderRadius =
          `${roundness}px`;


        flight.card.style.opacity =
          opacity;


        flight.card.style.setProperty(
          "--flight-content-opacity",
          contentOpacity.toFixed(3)
        );


        if (localProgress > 0.88) {
          flight.target
            .classList.add(
              "qg-active"
            );
        } else {
          flight.target
            .classList.remove(
              "qg-active"
            );
        }

      }
    );

  }


  function removeFlights() {

    flights.forEach(
      flight => {

        const card =
          flight.card;


        if (
          flight.placeholder &&
          flight.placeholder.isConnected
        ) {
          flight.placeholder
            .replaceWith(card);
        }


        card.classList.remove(
          "qg-flight-card"
        );


        if (flight.originalStyle === null) {
          card.removeAttribute("style");
        } else {
          card.setAttribute(
            "style",
            flight.originalStyle
          );
        }

      }
    );


    flights = [];
    flightsCreated = false;


    document
      .querySelectorAll(
        ".qg-map-point"
      )
      .forEach(point => {
        point.classList.remove(
          "qg-active"
        );
      });

  }


  /* =====================================================
     SCROLL PHASE SETTINGS

     Change these only if you want the stages
     earlier / later.
  ===================================================== */

  const SCROLL_PHASE = {

    /*
      First ~30%:
      rows ONLY.
    */

    freezeStart:
      0.30,


    /*
      30% - 49%:
      tilt + world map reveal.
    */

    tiltEnd:
      0.49,


    /*
      Flight begins only after rows
      have properly tilted.
    */

    flightStart:
      0.50,


    flightEnd:
      0.74,


    /*
      Upper map text sequence after the cards arrive.
    */

    textStart:
      0.75,


    textEnd:
      0.98

  };



  /* =====================================================
     GET SECTION SCROLL PROGRESS
  ===================================================== */

  function getSectionProgress() {

    const rect =
      section
        .getBoundingClientRect();


    const scrollDistance =
      section.offsetHeight -
      window.innerHeight;


    if (
      scrollDistance <= 0
    ) {

      return 0;

    }


    return clamp(
      -rect.top /
      scrollDistance
    );

  }



  /* =====================================================
     MAIN SCROLL ANIMATION
  ===================================================== */

  let ticking = false;


  function updateAnimation() {

    ticking = false;


    const progress =
      getSectionProgress();


    const {
      freezeStart,
      tiltEnd,
      flightStart,
      flightEnd,
      textStart,
      textEnd
    } =
      SCROLL_PHASE;


    /* -----------------------------------------
       PHASE 1
       JUST MOVING ROWS
    ------------------------------------------ */

    if (
      progress <
      freezeStart
    ) {

      section
        .classList
        .remove(
          "qg-is-frozen"
        );


      /*
        If user scrolls backwards,
        rebuild later from the new
        marquee position.
      */

      if (
        flightsCreated
      ) {

        removeFlights();

      }

    } else {

      /*
        FREEZE EXACTLY WHERE ROWS CURRENTLY ARE.

        No transform reset.
        No rearranging.
      */

      section
        .classList
        .add(
          "qg-is-frozen"
        );

    }


    /* -----------------------------------------
       PHASE 2
       GRID TILT
    ------------------------------------------ */

    const tiltProgress =
      smoothstep(
        freezeStart,
        tiltEnd,
        progress
      );


    const rotateX =
      lerp(
        0,
        56,
        tiltProgress
      );


    const stageScale =
      lerp(
        1,
        0.78,
        tiltProgress
      );


    const stageY =
      lerp(
        0,
        -7,
        tiltProgress
      );


    qcMarqueeStage.style.transform =

      `
      translate3d(
        0,
        ${stageY}vh,
        0
      )
      rotateX(${rotateX}deg)
      scale(${stageScale})
      `;


    /*
      heading fades while grid
      starts becoming map
    */

    const introFade =
      smoothstep(
        freezeStart,
        freezeStart + 0.09,
        progress
      );


    qcIntroCopy.style.opacity =
      1 -
      introFade;


    qcIntroCopy.style.transform =

      `
      translateX(-50%)
      translateY(
        ${-25 * introFade}px
      )
      `;


    /* -----------------------------------------
       MAP REVEAL
    ------------------------------------------ */

    const mapProgress =
      smoothstep(
        freezeStart + 0.02,
        flightStart + 0.16,
        progress
      );


    qcWorldLayer.style.opacity =
      mapProgress;


    const mapScale =
      lerp(
        0.90,
        1,
        mapProgress
      );


    qcWorldLayer.style.transform =

      `
      translate(
        -50%,
        -50%
      )
      scale(${mapScale})
      `;


    /* -----------------------------------------
       PHASE 3
       CARD FLIGHT
    ------------------------------------------ */

    if (
      progress >=
      flightStart
    ) {

      if (
        !flightsCreated
      ) {

        /*
          At this exact moment rows
          are already frozen + tilted.

          We capture THAT position.
        */

        createFlights();

      }


      const flightProgress =
        inverseLerp(
          flightStart,
          flightEnd,
          progress
        );


      updateFlights(
        flightProgress
      );


      /*
        original cards fade as flying
        copies leave them.
      */

      const deckFade =
        smoothstep(
          flightStart,
          flightStart + 0.18,
          progress
        );


      qcMarqueeStage.style.opacity =
        1 -
        deckFade;


    } else {

      qcMarqueeStage.style.opacity =
        1;


      /*
        Scrolling backwards before
        flight = remove snapshots.
      */

      if (
        flightsCreated
      ) {

        removeFlights();

      }

    }


    /* -----------------------------------------
       MAP TITLE SEQUENCE

       Text 1 appears -> zooms away ->
       Text 2 appears -> zooms away ->
       Text 3 appears -> zooms away.
    ------------------------------------------ */

    const titleProgress =
      inverseLerp(
        textStart,
        textEnd,
        progress
      );


    const titleCount =
      mapTitles.length;


    mapTitles.forEach(
      (title, index) => {

        const segmentStart =
          index / titleCount;

        const segmentEnd =
          (index + 1) / titleCount;

        const local =
          inverseLerp(
            segmentStart,
            segmentEnd,
            titleProgress
          );

        const enter =
          smoothstep(
            0.00,
            0.22,
            local
          );

        const exit =
          smoothstep(
            0.62,
            1.00,
            local
          );

        const opacity =
          enter *
          (1 - exit);

        const scale =
          local < 0.62
            ? lerp(
                1.08,
                1.00,
                enter
              )
            : lerp(
                1.00,
                0.64,
                exit
              );

        const y =
          local < 0.62
            ? lerp(
                18,
                0,
                enter
              )
            : lerp(
                0,
                -14,
                exit
              );

        const blur =
          lerp(
            0,
            7,
            exit
          );


        title.style.opacity =
          opacity;

        title.style.transform =
          `
          translateY(${y}px)
          scale(${scale})
          `;

        title.style.filter =
          `blur(${blur}px)`;

      }
    );


    /* -----------------------------------------
       SCROLL BUTTON
    ------------------------------------------ */

    const cueFade =
      smoothstep(
        0.16,
        0.30,
        progress
      );


    qcScrollCue.style.opacity =
      1 -
      cueFade;


    qcScrollCue.style.pointerEvents =

      cueFade > 0.9

        ? "none"

        : "auto";

  }



  function requestUpdate() {

    if (ticking) {
      return;
    }


    ticking = true;


    requestAnimationFrame(
      updateAnimation
    );

  }



  window.addEventListener(
    "scroll",
    requestUpdate,
    {
      passive: true
    }
  );



  /* =====================================================
     SCROLL DOWN BUTTON

     Goes to the point where the marquee begins
     transforming into the world map.
  ===================================================== */

  qcScrollButton.addEventListener(
    "click",
    () => {

      const scrollDistance =

        section.offsetHeight -

        window.innerHeight;


      const destination =

        section.offsetTop +

        scrollDistance *
        0.33;


      window.scrollTo({

        top:
          destination,

        behavior:
          "smooth"

      });

    }
  );



  /* =====================================================
     RESIZE
  ===================================================== */

  let resizeTimer = null;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            /*
              map recalculated so coordinates
              stay correct.
            */

            renderWorldMap();


            /*
              Remove old flight snapshots
              because screen positions changed.
            */

            if (
              flightsCreated
            ) {

              removeFlights();

            }


            requestUpdate();

          },
          120
        );

    }
  );



  /* =====================================================
     START
  ===================================================== */

  loadWorldMap();

  updateAnimation();


})();

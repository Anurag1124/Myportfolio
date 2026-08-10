// 1. Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
gsap.registerPlugin(ScrollTrigger);

// 2. Custom Glow Cursor Follower (Default pointer will still show!)
const cursor = document.querySelector('.cursor-glow');
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });
    });
}

// 3. Magnetic Buttons Effect
const magneticBtns = document.querySelectorAll('.magnetic-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.4,
            ease: "power3.out"
        });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    });
});

// 4. Hero Section Entrance Animation
const heroTl = gsap.timeline();
heroTl.from('.hero-anim', {
    y: 50, opacity: 0, duration: 1,
    stagger: 0.2, ease: 'power3.out'
})
.from('.hero-visual', {
    scale: 0.85, opacity: 0, duration: 1.5,
    ease: 'power3.out'
}, "-=1");

// 5. Section Reveal Animations
gsap.utils.toArray('.reveal-header').forEach((header) => {
    gsap.from(header, { scrollTrigger: { trigger: header, start: 'top 85%' }, y: 40, opacity: 0, duration: 0.8, ease: 'power2.out' });
});
gsap.utils.toArray('.reveal-card').forEach((card) => {
    gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 85%' }, y: 50, opacity: 0, duration: 0.8, ease: 'power2.out' });
});

// 6. GSAP RESPONSIVE PINNED HORIZONTAL SKILLS
let mm = gsap.matchMedia();

mm.add("(min-width: 1025px)", () => {
    // Desktop: Pin the section and scroll the track horizontally
    const track = document.querySelector('.kpi-horizontal-track');
    
    if (track) {
        // Calculate exactly how far the track needs to slide to the left
        // (Total width of track) - (Viewport width) + (Padding allowance)
        let scrollDistance = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.16);
        
        gsap.to(track, {
            x: -scrollDistance,
            ease: "none",
            scrollTrigger: {
                trigger: ".pinned-skills-wrapper",
                start: "center center",
                end: () => "+=" + scrollDistance, // Duration based on scroll width
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true // Recalculates on window resize
            }
        });
    }
});

mm.add("(max-width: 1024px)", () => {
    // Mobile/Tablet: Stack them vertically as standard scroll items
    const track = document.querySelector('.kpi-horizontal-track');
    if (track) {
        track.style.flexDirection = "column";
        track.style.width = "100%";
        track.style.paddingRight = "8%";
        
        const cards = gsap.utils.toArray('.kpi-card');
        cards.forEach(card => {
            card.style.width = "100%"; // Full width on mobile
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 85%' },
                y: 30, 
                opacity: 0, 
                duration: 0.6, 
                ease: "power2.out"
            });
        });
    }
});

// 7. VanillaTilt 3D Effect
VanillaTilt.init(document.querySelectorAll(".floating-card, .project-card, .service-card"), {
    max: 8, speed: 400, glare: true, "max-glare": 0.1,
});

// 8. Navigation Smooth Scroll Setup
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) { lenis.scrollTo(targetElement, { offset: -80, duration: 1.5 }); }
    });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => { navLinks.classList.toggle('active'); });
}

// 9. Interactive Copy Email
function copyEmail() {
    const emailText = document.getElementById("email-text").innerText;
    navigator.clipboard.writeText(emailText).then(() => {
        const btn = document.querySelector(".copy-btn");
        btn.innerHTML = `<i class="fa-solid fa-check" style="color: #0ea5e9;"></i>`;
        setTimeout(() => { btn.innerHTML = `<i class="fa-regular fa-copy"></i>`; }, 2000);
    });
}
/* ================================================
   Portfolio JS — Lenis · Tilt · Magnetic · Progress
   ================================================ */

// ===== 1. Lenis Smooth Scroll =====
const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
});

function rafLoop(time) {
    lenis.raf(time);
    requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);

// Anchor links use Lenis
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    });
});

// ===== 2. Nav scroll state + progress bar =====
const nav = document.querySelector('.nav');
const navProgress = document.getElementById('navProgress');

lenis.on('scroll', ({ scroll, limit }) => {
    nav.classList.toggle('scrolled', scroll > 20);
    if (navProgress) navProgress.style.width = Math.min(100, (scroll / limit) * 100) + '%';
});

// ===== 3. Section active highlight =====
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');

new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting)
            navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
}, { threshold: 0.4 }).observe && sections.forEach(s =>
    new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting)
                navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
        });
    }, { threshold: 0.4 }).observe(s)
);

// ===== 4. Reveal on scroll =====
const revealEls = document.querySelectorAll(
    '.section-head, .about-text, .about-card, .project, .skill-group, .contact-card, .hero-content > *'
);
revealEls.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ===== 5. Orb parallax =====
const orbs = document.querySelectorAll('.orb');
window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.forEach((orb, i) => {
        const f = (i + 1) * 12;
        orb.style.transform = `translate(${x * f}px, ${y * f}px)`;
    });
});

// ===== 6. Mobile menu =====
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? '' : 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%'; navLinks.style.left = '0'; navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column'; navLinks.style.padding = '1.5rem';
    navLinks.style.background = 'rgba(7,7,11,0.95)';
    navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    navLinks.style.backdropFilter = 'blur(20px)';
});
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => { if (window.innerWidth <= 900) navLinks.style.display = ''; });
});

// ===== 7. 3D Card Tilt =====
function applyTilt(cards, maxTilt = 10) {
    cards.forEach(card => {
        card.classList.add('tilt-card');
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            card.style.transform = `perspective(900px) rotateX(${-dy * maxTilt}deg) rotateY(${dx * maxTilt}deg) scale3d(1.03,1.03,1.03)`;
            card.style.transition = 'transform 0.08s ease-out, border-color 0.3s';
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
            card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), border-color 0.3s';
        });
    });
}
applyTilt(document.querySelectorAll('.project'), 10);
applyTilt(document.querySelectorAll('.skill-group'), 8);
applyTilt(document.querySelectorAll('.about-card'), 7);

// ===== 8. Magnetic Buttons =====
function applyMagnetic(els, strength = 0.35) {
    els.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width / 2);
            const dy = e.clientY - (rect.top + rect.height / 2);
            el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
            el.style.transition = 'transform 0.15s ease-out';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0,0)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
        });
    });
}
applyMagnetic(document.querySelectorAll('.btn'));
applyMagnetic(document.querySelectorAll('.nav-cta'), 0.25);
applyMagnetic(document.querySelectorAll('.socials a'), 0.4);

// ===== 9. Page transition =====
const overlay = document.getElementById('pageTransition');
function triggerTransition(cb) {
    if (!overlay) { cb(); return; }
    overlay.classList.remove('leave');
    overlay.classList.add('enter');
    overlay.style.pointerEvents = 'all';
    setTimeout(() => {
        cb();
        setTimeout(() => { overlay.classList.remove('enter'); overlay.style.pointerEvents = 'none'; }, 400);
    }, 280);
}
document.querySelectorAll('a[href]:not([href^="#"]):not([target])').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    a.addEventListener('click', e => { e.preventDefault(); triggerTransition(() => { window.location.href = href; }); });
});
window.addEventListener('load', () => { if (overlay) { overlay.classList.add('leave'); setTimeout(() => overlay.classList.remove('leave'), 600); } });

// ===== 10. Card Click Modal =====
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project');
    const modal = document.getElementById('cardModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    cards.forEach((card) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const info = card.querySelector('.project-info');
            if (!info) {
                console.error('Project info not found');
                return;
            }

            const tags = info.querySelector('.tags');
            const h3 = info.querySelector('h3');
            const p = info.querySelector('p');

            if (!h3 || !p) {
                console.error('Title or paragraph not found');
                return;
            }

            modalTitle.textContent = h3.textContent;
            let tagsHTML = '';
            if (tags) {
                tags.querySelectorAll('span').forEach(tag => {
                    tagsHTML += `<span style="display: inline-block; margin-right: 0.5rem; padding: 0.25rem 0.7rem; border: 1px solid var(--border); border-radius: 100px; font-size: 0.8rem; color: var(--text-dim);">${tag.textContent}</span>`;
                });
            }
            modalBody.innerHTML = `<div style="margin-bottom: 1rem;">${tagsHTML}</div><div>${p.innerHTML}</div>`;
            modal.classList.add('active');
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
});


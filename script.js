// ===== LOADING SCREEN =====
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Wait for the loading bar animation to complete (~2s) then fade out
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after transition
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Start typing animation after loading screen disappears
            startTypingAnimation();
        }, 800);
    }, 2200);
});

// ===== PARTICLE BACKGROUND =====
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = 45 + Math.random() * 10; // Golden yellow hues
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Mouse interaction - gentle push away
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150 * 0.5;
                this.x += (dx / dist) * force;
                this.y += (dy / dist) * force;
            }
            
            // Wrap around edges
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
            ctx.fill();
            
            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity * 0.1})`;
            ctx.fill();
        }
    }
    
    // Create particles
    const particleCount = Math.min(Math.floor(window.innerWidth * 0.05), 80);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connection lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(45, 100%, 60%, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
})();

// ===== PARALLAX EFFECT =====
(function() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxSections.forEach(section => {
            const bg = section.querySelector('.parallax-bg');
            if (bg) {
                const rect = section.getBoundingClientRect();
                const speed = 0.15;
                const yPos = -(rect.top * speed);
                bg.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
})();

// ===== SCROLL OBSERVER FOR FADE-IN / SLIDE-UP =====
(function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, .slide-up').forEach(el => {
        observer.observe(el);
    });
})();

// ===== MOUSE FOLLOWER EFFECT =====
const follower = document.createElement('div');
follower.className = 'mouse-follower';
document.body.appendChild(follower);

const followerDot = document.createElement('div');
followerDot.className = 'mouse-follower-dot';
document.body.appendChild(followerDot);

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    followerDot.style.left = mouseX + 'px';
    followerDot.style.top = mouseY + 'px';
});

// Smooth follow for outer ring
function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Hide follower when mouse leaves window
document.addEventListener('mouseleave', () => {
    follower.style.opacity = '0';
    followerDot.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    follower.style.opacity = '1';
    followerDot.style.opacity = '1';
});

// Enlarge follower on interactive elements
document.querySelectorAll('a, button, .btn, .player-card, .match-card, .news-card, .stat, input, textarea, .social-icon').forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.classList.add('hover');
        followerDot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        follower.classList.remove('hover');
        followerDot.classList.remove('hover');
    });
});

// Hide follower on touch devices (mobile/tablet)
if ('ontouchstart' in window) {
    follower.style.display = 'none';
    followerDot.style.display = 'none';
}

// ===== TYPING ANIMATION =====
function startTypingAnimation() {
    const heroTitle = document.querySelector('.hero-content h1');
    const heroSubtitle = document.querySelector('.hero-content p');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (!heroTitle) return;
    
    // Store original content
    const titleText = heroTitle.textContent;
    const subtitleText = heroSubtitle ? heroSubtitle.textContent : '';
    
    // Clear content
    heroTitle.textContent = '';
    heroSubtitle.textContent = '';
    heroButtons.style.display = 'none';
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    
    // Type the title
    let charIndex = 0;
    function typeTitle() {
        if (charIndex < titleText.length) {
            heroTitle.textContent = titleText.substring(0, charIndex + 1);
            heroTitle.appendChild(cursor);
            charIndex++;
            setTimeout(typeTitle, 80 + Math.random() * 60);
        } else {
            heroTitle.appendChild(cursor);
            setTimeout(typeSubtitle, 500);
        }
    }
    
    function typeSubtitle() {
        let subIndex = 0;
        function typeSub() {
            if (subIndex < subtitleText.length) {
                heroSubtitle.textContent = subtitleText.substring(0, subIndex + 1);
                subIndex++;
                setTimeout(typeSub, 40 + Math.random() * 40);
            } else {
                setTimeout(() => {
                    cursor.remove();
                    heroButtons.style.display = 'flex';
                    heroButtons.style.opacity = '0';
                    setTimeout(() => {
                        heroButtons.style.transition = 'opacity 0.5s ease';
                        heroButtons.style.opacity = '1';
                    }, 100);
                }, 400);
            }
        }
        typeSub();
    }
    
    setTimeout(typeTitle, 300);
}

// ===== HAMBURGER MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
});

// ===== CLOSE NAV ON LINK CLICK (MOBILE) =====
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== ACTIVE NAV LINK HIGHLIGHTING ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-links a');

function highlightNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent! ✅';
            submitBtn.style.background = 'linear-gradient(135deg, #00cc66, #00994d)';
            
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// ===== NEWSLETTER FORM HANDLING =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = this.querySelector('input');
        const button = this.querySelector('button');
        
        if (input.value.trim() === '') return;
        
        button.textContent = 'Subscribed! ✅';
        button.style.background = 'linear-gradient(135deg, #00cc66, #00994d)';
        
        setTimeout(() => {
            input.value = '';
            button.textContent = 'Subscribe';
            button.style.background = '';
        }, 3000);
    });
}

// ===== COUNTER ANIMATION FOR STATS =====
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const text = stat.textContent;
        const targetNumber = parseInt(text);
        const suffix = text.replace(/[0-9]/g, '');
        
        if (isNaN(targetNumber)) return;
        
        let currentNumber = 0;
        const increment = Math.ceil(targetNumber / 30);
        const stepTime = Math.floor(2000 / 30);
        
        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(counter);
            }
            stat.textContent = currentNumber + suffix;
        }, stepTime);
    });
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsContainer = document.querySelector('.stats');
if (statsContainer) {
    statsObserver.observe(statsContainer);
}
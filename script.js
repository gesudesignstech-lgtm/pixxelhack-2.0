/* ==========================================================================
   PIXXLEHACK 2.0 // INTERACTIVITY SYSTEM
   Vanilla JS Engine for Preloader, Parallax, Countdown, & Reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- 1. Mobile Menu Navigation --- */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                mobileMenu.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            });
        });
    }

    /* --- 2. Page Loading & Preloader Sequence --- */
    const preloader = document.getElementById('preloader');
    const loadBar = document.getElementById('load-bar');
    const loadPct = document.getElementById('load-pct');
    const termLines = document.querySelectorAll('.term-line');
    
    // Disable scrolling during load
    document.body.style.overflow = 'hidden';

    // Print terminal lines procedurally
    termLines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, index * 400);
    });

    // Animate load percentage bar
    let currentPct = 0;
    const loadInterval = setInterval(() => {
        currentPct += Math.floor(Math.random() * 5) + 1;
        if (currentPct >= 100) {
            currentPct = 100;
            clearInterval(loadInterval);
            
            // Finish loader
            setTimeout(() => {
                if (preloader) {
                    preloader.classList.add('fade-out');
                    document.body.style.overflow = 'auto';
                }
            }, 500);
        }
        
        if (loadBar) loadBar.style.width = `${currentPct}%`;
        if (loadPct) loadPct.textContent = currentPct.toString().padStart(2, '0');
    }, 80);

    /* --- 3. Scroll Progress Indicator --- */
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScrollHeight > 0) {
            const scrolledPercentage = (window.scrollY / totalScrollHeight) * 100;
            if (progressBar) progressBar.style.width = `${scrolledPercentage}%`;
        }
    });

    /* --- 4. Interactive Mouse Follow Glow --- */
    const mouseGlow = document.getElementById('mouse-glow');
    
    if (mouseGlow && !prefersReducedMotion) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth follow animation frame loop
        const updateGlow = () => {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            
            mouseGlow.style.left = `${glowX}px`;
            mouseGlow.style.top = `${glowY}px`;
            
            requestAnimationFrame(updateGlow);
        };
        updateGlow();
    }

    /* --- 5. 3D Parallax Tilt on Hero Poster --- */
    const parallaxCard = document.getElementById('parallax-card');
    
    if (parallaxCard && !prefersReducedMotion) {
        parallaxCard.addEventListener('mousemove', (e) => {
            const rect = parallaxCard.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top; 
            
            // Normalize inputs: -0.5 to 0.5
            const xNorm = (x / rect.width) - 0.5;
            const yNorm = (y / rect.height) - 0.5;
            
            // Calculate tilt rotations (max 15 degrees)
            const rotateX = -yNorm * 25;
            const rotateY = xNorm * 25;
            
            parallaxCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        parallaxCard.addEventListener('mouseleave', () => {
            // Reset transition smoothly
            parallaxCard.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            parallaxCard.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        parallaxCard.addEventListener('mouseenter', () => {
            // Remove transitions during live mouse movement
            parallaxCard.style.transition = 'none';
        });
    }

    /* --- 6. Stats Counter Numbers Ticker --- */
    const statsSection = document.getElementById('about');
    const counterElements = document.querySelectorAll('.counter-num');
    let countersStarted = false;

    const animateCounters = () => {
        counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            let current = 0;
            const speed = target / 50; // uniform duration

            const updateCount = () => {
                current += speed;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target;
                }
            };
            updateCount();
        });
    };

    /* --- 7. Intersection Observer for Scroll Reveals --- */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger counters when Stats come into view
                if (entry.target.classList.contains('about-stats-panel') && !countersStarted) {
                    countersStarted = true;
                    animateCounters();
                }
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* --- 8. Mission Control Countdown Timer --- */
/* --- 8. Mission Control Countdown Timer --- */
    const timerDisplay = document.getElementById('timer-display');
    const countdownSub = document.querySelector('.countdown-sub');
    
    // exact timelines for the event phases (2026 dates)
    const eventPhases = [
        {
            name: "ROUND 1: WEBATHON",
            start: new Date('2026-08-02T12:00:00').getTime(),
            end: new Date('2026-08-03T12:00:00').getTime()
        },
        {
            name: "ROUND 2: DEVELOPMENT SPRINT",
            start: new Date('2026-08-07T12:00:00').getTime(),
            end: new Date('2026-08-08T12:00:00').getTime()
        }
    ];

    const updateTimer = () => {
        const now = Date.now();
        let activePhase = null;
        let targetTime = null;
        let isLive = false;
        let labelText = "";

        // Determine the current phase status
        for (const phase of eventPhases) {
            if (now < phase.start) {
                targetTime = phase.start;
                labelText = `// TIMELINE COUNTDOWN TO ${phase.name} START`;
                activePhase = phase;
                isLive = false;
                break;
            } else if (now >= phase.start && now < phase.end) {
                targetTime = phase.end;
                labelText = `// ${phase.name} IS LIVE! SUBMISSION WINDOW CLOSING`;
                activePhase = phase;
                isLive = true;
                break;
            }
        }

        // Handle case where all rounds are completed
        if (!activePhase) {
            if (timerDisplay) timerDisplay.textContent = "EVENT ENDED";
            if (countdownSub) countdownSub.textContent = "// PIXXELHACK 2.0 MISSION ACCOMPLISHED";
            return;
        }

        const remaining = targetTime - now;

        let displayStr = "";

        if (isLive) {
            // When live, display strict 24-hour style format: HH:MM:SS
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            displayStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            // While waiting, break it down cleanly into days, hours, minutes, seconds
            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            const dStr = days.toString().padStart(2, '0');
            const hStr = hours.toString().padStart(2, '0');
            const mStr = minutes.toString().padStart(2, '0');
            const sStr = seconds.toString().padStart(2, '0');

            displayStr = `${dStr} DAYS  ${hStr}:${mStr}:${sStr}`;
        }

        if (timerDisplay) timerDisplay.textContent = displayStr;
        if (countdownSub) countdownSub.textContent = labelText;
    };

    // Run clock updates
    updateTimer();
    setInterval(updateTimer, 1000);

    /* --- 9. Mission Control Terminal Live Logs Typing Simulation --- */
    const logScreen = document.getElementById('log-screen');
    const sampleLogs = [
        { text: '[OK] Git commit pushed by user: "patch_dashboard_v4".', type: 'text-success' },
        { text: '[INFO] Compiling production build... 100% complete.', type: 'text-info' },
        { text: '[WARN] High CPU load detected on deploy node.', type: 'text-warning' },
        { text: '[OK] Deployment successfully verified on port 80.', type: 'text-success' },
        { text: '[INFO] Squad coffee reserve level: CRITICAL.', type: 'text-info' },
        { text: '[OK] API load balancer checking health nodes... ACTIVE.', type: 'text-success' },
        { text: '[WARN] API latency spiked to 240ms.', type: 'text-warning' },
        { text: '[OK] Database seeding operation completed.', type: 'text-success' }
    ];

    if (logScreen) {
        setInterval(() => {
            const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
            const logLine = document.createElement('div');
            logLine.className = `log-line ${randomLog.type}`;
            logLine.textContent = randomLog.text;
            
            logScreen.appendChild(logLine);
            
            // Auto scroll to bottom
            logScreen.scrollTop = logScreen.scrollHeight;
            
            // Keep maximum of 12 logs on screen to avoid memory issues
            if (logScreen.children.length > 12) {
                logScreen.removeChild(logScreen.firstChild);
            }
        }, 3500);
    }
});
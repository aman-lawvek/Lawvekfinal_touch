document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll Reveal Logic
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // 2. Navbar glass effect on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Tab Switching Logic for Platform Section
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => {
                p.classList.remove('active');
                // Brief timeout to re-trigger animations if needed
                setTimeout(() => p.style.display = 'none', 300);
            });

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            
            setTimeout(() => {
                targetPane.style.display = 'block';
                // Trigger reflow
                void targetPane.offsetWidth;
                targetPane.classList.add('active');
            }, 300);
        });
    });

    // 4. Cursor parallax for hero dashboard
    const heroDashboard = document.querySelector('.dashboard-mockup');
    const heroSection = document.querySelector('.hero');

    if(heroDashboard && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            heroDashboard.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        heroSection.addEventListener('mouseenter', () => {
            heroDashboard.style.transition = 'none';
        });

        heroSection.addEventListener('mouseleave', () => {
            heroDashboard.style.transition = 'transform 0.5s ease';
            heroDashboard.style.transform = `perspective(1000px) rotateY(0deg) rotateX(2deg)`;
        });
    }

    // 5. Modal Logic
    const modal = document.getElementById('demo-modal');
    const openBtns = document.querySelectorAll('.open-demo-modal');
    const closeBtn = document.getElementById('close-demo-modal');

    if(modal && closeBtn) {
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            // Re-enable body scrolling
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                closeModal();
            }
        });

        // Close on esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 6. Interactive 3D Flip Grid & Spotlight
    const heroMeshGrid = document.querySelector('.hero-mesh');
    
        const terms = [
            'Audit', 'IP Rights', 'Missed Obligation', 'Compliance', 'Security', 
            'GDPR', 'SOC2', 'ISO 27001', 'Governance', 'Liability', 'Renewal', 
            'Penalty', 'Control', 'Tracking', 'Evidence', 'Risk', 'Policy', 
            'Access Control', 'Data Privacy', 'Verification'
        ];

        heroMeshGrid.innerHTML = '';
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';
        heroMeshGrid.appendChild(gridContainer);

        let galaxyCells = [];

        const updateGalaxy = () => {
            gridContainer.innerHTML = '';
            galaxyCells = [];
            
            const numCells = 120; // Number of "stars" in the galaxy
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < numCells; i++) {
                const cell = document.createElement('div');
                cell.className = 'mesh-cell';
                
                const inner = document.createElement('div');
                inner.className = 'cell-inner';
                
                const front = document.createElement('div');
                front.className = 'cell-front';
                
                // Spiral parameters
                const angleOffset = i * 0.15;
                const radiusOffset = i * 5;
                
                if (Math.random() > 0.4) {
                    front.innerText = terms[Math.floor(Math.random() * terms.length)];
                }
                
                inner.appendChild(front);
                cell.appendChild(inner);
                fragment.appendChild(cell);
                
                galaxyCells.push({
                    element: cell,
                    inner: inner,
                    angle: angleOffset,
                    radius: radiusOffset,
                    speed: 0.2 + Math.random() * 0.5
                });
            }
            gridContainer.appendChild(fragment);
        };

        updateGalaxy();
        window.addEventListener('resize', updateGalaxy);

        let time = 0;
        const animate = () => {
            time += 0.002; // Super smooth slo-mo
            
            galaxyCells.forEach((cell, i) => {
                const currentAngle = cell.angle + time * cell.speed;
                const currentRadius = cell.radius + Math.sin(time + i) * 20;
                
                // Helical spiral positioning
                const x = Math.cos(currentAngle) * currentRadius;
                const y = Math.sin(currentAngle) * currentRadius;
                const z = Math.sin(time * 0.5 + i * 0.1) * 100 - 150; // Deep 3D pulse
                
                // Rotations for 7D effect
                const rotX = Math.cos(currentAngle) * 20;
                const rotY = Math.sin(currentAngle) * 20;
                
                cell.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                cell.inner.style.transform = `perspective(1500px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${z}px)`;
                
                // Galaxy fading
                const op = 0.4 + Math.sin(time + i * 0.2) * 0.4;
                cell.element.style.opacity = Math.max(0, op);
            });
            
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }
});

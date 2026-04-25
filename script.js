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
    
    if (heroMeshGrid && heroSection) {
        const terms = [
            'Audits', 'IP Rights', 'Compliance', 'Security', 'Risk', 'SLA', 
            'Contracts', 'Policies', 'Privacy', 'GDPR', 'SOC2', 'ISO 27001', 
            'Governance', 'Liability', 'Renewal', 'Penalty', 'Control', 
            'Tracking', 'Evidence', 'Audit-Ready'
        ];

        heroMeshGrid.innerHTML = '';
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';
        heroMeshGrid.appendChild(gridContainer);

        const spotlight = document.createElement('div');
        spotlight.className = 'hero-spotlight';
        heroMeshGrid.appendChild(spotlight);

        let cells = [];

        const updateGrid = () => {
            gridContainer.innerHTML = '';
            cells = []; // This will now be a 2D array for fast lookup
            
            const cellSize = 80;
            const w = window.innerWidth;
            const h = Math.max(heroSection.offsetHeight, 1000);
            
            const cols = Math.ceil(w / cellSize);
            const rows = Math.ceil(h / cellSize);

            const fragment = document.createDocumentFragment();
            for (let r = 0; r < rows; r++) {
                const rowArray = [];
                for (let c = 0; c < cols; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'mesh-cell';
                    
                    const inner = document.createElement('div');
                    inner.className = 'cell-inner';
                    
                    const front = document.createElement('div');
                    front.className = 'cell-front';
                    
                    const back = document.createElement('div');
                    back.className = 'cell-back';
                    back.innerText = terms[Math.floor(Math.random() * terms.length)];
                    
                    inner.appendChild(front);
                    inner.appendChild(back);
                    cell.appendChild(inner);
                    fragment.appendChild(cell);
                    rowArray.push({ element: cell, inner: inner });
                }
                cells.push(rowArray);
            }
            gridContainer.appendChild(fragment);
        };

        updateGrid();
        window.addEventListener('resize', updateGrid);
        window.addEventListener('load', updateGrid);

        let time = 0;
        const animate = () => {
            time += 0.005; // Slo-mo speed
            
            for (let r = 0; r < cells.length; r++) {
                for (let c = 0; c < cells[r].length; c++) {
                    const cellObj = cells[r][c];
                    const cell = cellObj.element;
                    const inner = cellObj.inner;
                    
                    // Helical Wave Math
                    const dx = c - (cells[r].length / 2);
                    const dy = r - (cells.length / 2);
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);
                    
                    // Create helical phase shift
                    const phase = dist * 0.3 - time + angle;
                    
                    // 3D Displacement
                    const z = Math.sin(phase) * 30 - 20; // Pulsates into the screen
                    const rotX = Math.cos(phase) * 15;
                    const rotY = Math.sin(phase) * 15;
                    
                    // Apply slomo helical transform
                    // If the cell is flipped (hover), we add 180 to Y
                    const isFlipped = cell.classList.contains('flipped');
                    const baseRotY = isFlipped ? 180 : 0;
                    
                    inner.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${baseRotY + rotY}deg) translateZ(${z}px)`;
                    
                    // Subtle opacity shift for "lively" effect
                    cell.style.opacity = 0.5 + Math.sin(phase) * 0.2;
                }
            }
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);

        // Keep simple hover flip interaction
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroMeshGrid.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            spotlight.style.left = `${mouseX}px`;
            spotlight.style.top = `${mouseY}px`;

            const cellSize = 80;
            const col = Math.floor(mouseX / cellSize);
            const row = Math.floor(mouseY / cellSize);

            // Reset all flips and set only current
            for (let r = 0; r < cells.length; r++) {
                for (let c = 0; c < cells[r].length; c++) {
                    if (r === row && c === col) {
                        cells[r][c].element.classList.add('flipped');
                    } else {
                        cells[r][c].element.classList.remove('flipped');
                    }
                }
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            for (let r = 0; r < cells.length; r++) {
                for (let c = 0; c < cells[r].length; c++) {
                    cells[r][c].element.classList.remove('flipped');
                }
            }
        });
    }
    }
});

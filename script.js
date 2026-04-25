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

        let activeCells = new Set();

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroMeshGrid.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            spotlight.style.left = `${mouseX}px`;
            spotlight.style.top = `${mouseY}px`;

            const cellSize = 80;
            const range = 200;
            const flipRange = 40;
            
            const centerCol = Math.floor(mouseX / cellSize);
            const centerRow = Math.floor(mouseY / cellSize);
            const colRange = Math.ceil(range / cellSize);
            const rowRange = Math.ceil(range / cellSize);

            // Identify Exclusion Zones (CTAs) - done once per move
            const ctas = document.querySelectorAll('.hero .btn-primary, .hero .hero-badge');
            const exclusionZones = Array.from(ctas).map(cta => cta.getBoundingClientRect());

            // Clear previously active cells that are now out of range
            activeCells.forEach(cellObj => {
                const cRect = cellObj.element.getBoundingClientRect();
                const cX = cRect.left + cRect.width / 2;
                const cY = cRect.top + cRect.height / 2;
                const dist = Math.hypot(e.clientX - cX, e.clientY - cY);
                
                if (dist > range) {
                    cellObj.element.classList.remove('nearby', 'flipped');
                    cellObj.inner.style.transform = '';
                    activeCells.delete(cellObj);
                }
            });

            // Update cells in range
            for (let r = centerRow - rowRange; r <= centerRow + rowRange; r++) {
                if (r < 0 || r >= cells.length) continue;
                for (let c = centerCol - colRange; c <= centerCol + colRange; c++) {
                    if (c < 0 || c >= cells[r].length) continue;
                    
                    const cellObj = cells[r][c];
                    const cell = cellObj.element;
                    const inner = cellObj.inner;
                    const cRect = cell.getBoundingClientRect();
                    
                    const isExcluded = exclusionZones.some(zone => {
                        return !(cRect.right < zone.left || cRect.left > zone.right || 
                                 cRect.bottom < zone.top || cRect.top > zone.bottom);
                    });

                    if (isExcluded) {
                        cell.classList.remove('nearby', 'flipped');
                        inner.style.transform = '';
                        continue;
                    }

                    const cX = cRect.left + cRect.width / 2;
                    const cY = cRect.top + cRect.height / 2;
                    const dist = Math.hypot(e.clientX - cX, e.clientY - cY);

                    if (dist < range) {
                        activeCells.add(cellObj);
                        cell.classList.add('nearby');
                        const tiltX = (cY - e.clientY) / 8;
                        const tiltY = (e.clientX - cX) / 8;
                        const z = Math.max(0, 30 - dist / 5);
                        
                        if (dist < flipRange) {
                            cell.classList.add('flipped');
                            inner.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${180 + tiltY}deg) translateZ(50px)`;
                        } else {
                            cell.classList.remove('flipped');
                            inner.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${z}px) scale(1.1)`;
                        }
                    }
                }
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            activeCells.forEach(cellObj => {
                cellObj.element.classList.remove('nearby', 'flipped');
                cellObj.inner.style.transform = '';
            });
            activeCells.clear();
        });
    }
});

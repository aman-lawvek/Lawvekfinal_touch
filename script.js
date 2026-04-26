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

    // 5. Modal Logic & Google Sheets Integration
    const modal = document.getElementById('demo-modal');
    const openBtns = document.querySelectorAll('.open-demo-modal');
    const closeBtn = document.getElementById('close-demo-modal');
    const bookingForm = document.getElementById('booking-form');
    const submitBtn = document.getElementById('submit-btn');

    // Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwPRmlKdut-0_E-kGlc6W0cDMHT-COAy9ki_6xlcLLrm5xqfGhoAZsdd1RTr75NUuoniA/exec';

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

        // Handle Form Submission
        if (bookingForm) {
            bookingForm.addEventListener('submit', e => {
                e.preventDefault();
                submitBtn.disabled = true;
                submitBtn.innerText = 'Processing...';

                // Convert FormData to URLSearchParams for better GAS compatibility
                const formData = new FormData(bookingForm);
                const params = new URLSearchParams();
                for (const pair of formData.entries()) {
                    params.append(pair[0], pair[1]);
                }
                
                fetch(scriptURL, { 
                    method: 'POST', 
                    body: params,
                    mode: 'no-cors' // This avoids CORS issues with GAS redirects
                })
                .then(() => {
                    // Success State (Note: with no-cors we can't read the response, so we assume success)
                    bookingForm.innerHTML = `
                        <div class="success-message">
                            <div class="success-icon">✓</div>
                            <h3>You're in!</h3>
                            <p>We'll be in touch within 24 hours to schedule your personalized demo.</p>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('Something went wrong. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Request Demo';
                });
            });
        }
    }

    // 6. Interactive 3D Flip Grid & Spotlight
    const heroMeshGrid = document.querySelector('.hero-mesh');
    const heroSectionMesh = document.querySelector('.hero');
    
    if (heroMeshGrid && heroSectionMesh) {
        const terms = [
            'Audit', 'Compliance', 'Obligations', 'Contracts', 'Liability', 
            'Indemnity', 'Confidentiality', 'Licensing', 'Governance', 'Filings', 
            'Deadlines', 'Deliverables', 'Milestones', 'Renewals', 'Penalties', 
            'Breach', 'Default', 'Termination', 'Disclosure', 'Regulation'
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
            cells = [];
            
            const cellSize = 80;
            const w = window.innerWidth;
            const h = Math.max(heroSectionMesh.offsetHeight, 800);
            
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
                    
                    // Front face is EMPTY — clean grid
                    const front = document.createElement('div');
                    front.className = 'cell-front';

                    // Back face shows a term on flip
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
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateGrid, 200);
        });

        // High-performance smooth tracking
        const heroContent = document.querySelector('.hero-content');
        let spotX = -1000, spotY = -1000, targetX = -1000, targetY = -1000;
        let lastMouseX = 0, lastMouseY = 0;

        heroSectionMesh.addEventListener('mousemove', (e) => {
            const rect = heroSectionMesh.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });

        // 7. Floating Legal Tags (Lively Parallax - Symmetrical)
        const floatingTagsList = [
            'Blacklisting', 'Litigation', 'Cure period', 'Service Credits', 
            'Rescission', 'Incidental damages', 'Material breach', 
            'Force majeure', 'Indemnification', 'Disclosure'
        ];

        const tagElements = [];
        const midpoint = Math.ceil(floatingTagsList.length / 2);

        const colors = ['color-purple', 'color-orange', 'color-green', 'color-blue'];
        const leftPositions = [
            { t: 8, l: 6, r: -5 },   { t: 22, l: 10, r: 3 }, 
            { t: 38, l: 7, r: -2 },  { t: 50, l: 12, r: 4 }, 
            { t: 62, l: 9, r: -3 }
        ];
        const rightPositions = [
            { t: 10, r: 4, rot: 5 },  { t: 24, r: 8, rot: -4 }, 
            { t: 40, r: 4, rot: 2 },  { t: 52, r: 10, rot: -5 }, 
            { t: 62, r: 6, rot: 3 }
        ];

        floatingTagsList.forEach((text, i) => {
            const tag = document.createElement('div');
            tag.className = 'floating-tag ' + colors[i % colors.length];
            tag.innerText = text;
            
            const isLeft = i < midpoint;
            const groupIndex = isLeft ? i : i - midpoint;
            const pos = isLeft ? leftPositions[groupIndex] : rightPositions[groupIndex];
            
            if (isLeft) {
                tag.style.left = pos.l + '%';
                tag.style.top = pos.t + '%';
                tag.style.transform = `rotate(${pos.r}deg)`;
            } else {
                tag.style.right = pos.r + '%';
                tag.style.top = pos.t + '%';
                tag.style.transform = `rotate(${pos.rot}deg)`;
            }
            
            tag.style.animationDelay = (Math.random() * -6) + 's';
            heroMeshGrid.appendChild(tag);

            tagElements.push({
                el: tag,
                baseRotation: isLeft ? pos.r : pos.rot,
                factorX: (isLeft ? -1 : 1) * (15 + Math.random() * 10),
                factorY: (Math.random() - 0.5) * 15
            });
        });

        const updateVisuals = () => {
            // Light lerp for fluid movement without lag
            spotX += (targetX - spotX) * 0.25;
            spotY += (targetY - spotY) * 0.25;

            spotlight.style.left = spotX + 'px';
            spotlight.style.top = spotY + 'px';

            const cellSize = 80;
            const mouseCol = Math.floor(spotX / cellSize);
            const mouseRow = Math.floor(spotY / cellSize);

            // Update Floating Tags Parallax
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const moveX = (targetX - centerX) / centerX;

            tagElements.forEach(tag => {
                // Horizontal parallax shift + base rotation
                const tx = -moveX * tag.factorX;
                tag.el.style.transform = `translateX(${tx}px) rotate(${tag.baseRotation}deg)`;
                
                // Professional Fade effect
                const rect = tag.el.getBoundingClientRect();
                const dx = (rect.left + rect.width/2) - spotX;
                const dy = (rect.top + rect.height/2) - spotY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                // Range: 0.3 when far, 1.0 when close
                const opacity = Math.max(0.3, 1.0 - dist/800);
                tag.el.style.opacity = opacity;
            });

            for (let r = 0; r < cells.length; r++) {
                for (let c = 0; c < cells[r].length; c++) {
                    const cellObj = cells[r][c];
                    const dist = Math.sqrt(Math.pow(c - mouseCol, 2) + Math.pow(r - mouseRow, 2));
                    
                    if (dist < 3) {
                        if (!cellObj.element.classList.contains('nearby')) {
                            cellObj.element.classList.add('nearby');
                        }
                    } else {
                        cellObj.element.classList.remove('nearby');
                    }
                }
            }
            requestAnimationFrame(updateVisuals);
        };
        requestAnimationFrame(updateVisuals);

        heroSectionMesh.addEventListener('mouseleave', () => {
            targetX = -1000; targetY = -1000; // Move spotlight away
        });
    }
    // 6. Live Dashboard Animation Sequence
    const setupDashboardAnimation = () => {
        const views = ['upload', 'contracts', 'extracting', 'obligations', 'tasks'];
        const breadcrumbs = {
            'upload': 'Lawvek / <b>Intake & AI Scan</b>',
            'extracting': 'Lawvek / <b>AI Obligation Extraction</b>',
            'contracts': 'Lawvek / <b>Contracts Registry</b>',
            'obligations': 'Lawvek / <b>Obligations Hub</b>',
            'tasks': 'Lawvek / <b>Action Registry</b>'
        };
        let currentIndex = 0;

        const cycleView = () => {
            const nextIndex = (currentIndex + 1) % views.length;
            const nextView = views[nextIndex];
            
            // Update Sidebar
            document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
                // Determine which sidebar item to highlight
                let sidebarTarget = nextView;
                if (nextView === 'upload') sidebarTarget = 'contracts';
                if (nextView === 'extracting') sidebarTarget = 'obligations';
                
                item.classList.toggle('active', item.dataset.view === sidebarTarget);
            });

            // Update Breadcrumbs
            const breadcrumbEl = document.getElementById('app-breadcrumbs');
            if (breadcrumbEl) breadcrumbEl.innerHTML = breadcrumbs[nextView];

            // Update View
            document.querySelectorAll('.app-view').forEach(view => {
                view.classList.toggle('active', view.id === `view-${nextView}`);
            });

            currentIndex = nextIndex;
        };

        // Run every 2.2 seconds (High-performance AI feel)
        setInterval(cycleView, 2200);
    };

    setupDashboardAnimation();
});

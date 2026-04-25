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
            'Audit', 'IP Rights', 'Compliance', 'Obligation Management', 
            'Security', 'Risk', 'SLA', 'Contracts', 'Policies', 'Privacy', 
            'GDPR', 'SOC2', 'ISO 27001', 'Governance', 'Liability', 'Renewal',
            'Penalty', 'Control', 'Accountability', 'Verification'
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
                    
                    const front = document.createElement('div');
                    front.className = 'cell-front';
                    if (Math.random() > 0.6) {
                        front.innerText = terms[Math.floor(Math.random() * terms.length)];
                    }

                    const back = document.createElement('div');
                    back.className = 'cell-back';
                    back.innerText = terms[Math.floor(Math.random() * terms.length)];
                    
                    inner.appendChild(front);
                    inner.appendChild(back);
                    cell.appendChild(inner);
                    fragment.appendChild(cell);
                    rowArray.push({ element: cell, inner: inner, col: c, row: r });
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

        // Mouse tracking for spotlight and cell flipping
        heroSectionMesh.addEventListener('mousemove', (e) => {
            const rect = heroSectionMesh.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            spotlight.style.left = x + 'px';
            spotlight.style.top = y + 'px';

            const cellSize = 80;
            const mouseCol = Math.floor(x / cellSize);
            const mouseRow = Math.floor(y / cellSize);
            const flipRadius = 2;

            for (let r = 0; r < cells.length; r++) {
                for (let c = 0; c < cells[r].length; c++) {
                    const cellObj = cells[r][c];
                    const dist = Math.sqrt(Math.pow(c - mouseCol, 2) + Math.pow(r - mouseRow, 2));
                    
                    if (dist < flipRadius) {
                        cellObj.element.classList.add('flipped');
                        cellObj.element.classList.add('nearby');
                    } else {
                        cellObj.element.classList.remove('flipped');
                        cellObj.element.classList.remove('nearby');
                    }
                }
            }
        });

        heroSectionMesh.addEventListener('mouseleave', () => {
            for (let r = 0; r < cells.length; r++) {
                for (let c = 0; c < cells[r].length; c++) {
                    cells[r][c].element.classList.remove('flipped');
                    cells[r][c].element.classList.remove('nearby');
                }
            }
        });

        // Subtle ambient animation
        let time = 0;
        const animate = () => {
            time += 0.003;
            
            for (let r = 0; r < cells.length; r++) {
                for (let c = 0; c < cells[r].length; c++) {
                    const cellObj = cells[r][c];
                    if (cellObj.element.classList.contains('flipped')) continue;
                    
                    const inner = cellObj.inner;
                    const dx = c - (cells[r].length / 2);
                    const dy = r - (cells.length / 2);
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);
                    
                    const phase = dist * 0.25 - time + angle * 0.5;
                    const z = Math.sin(phase) * 30 - 40;
                    const rotX = Math.cos(phase * 0.8) * 10;
                    const rotY = Math.sin(phase * 0.8) * 10;
                    
                    inner.style.transform = `perspective(1500px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${z}px)`;
                    
                    const op = 0.5 + Math.sin(phase) * 0.35;
                    cellObj.element.style.opacity = Math.max(0, op);
                }
            }
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }
});


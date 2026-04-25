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
    const heroSection = document.querySelector('.hero');
    
    if (heroMeshGrid && heroSection) {
        const terms = [
            'Audits', 'IP Rights', 'Compliance', 'Obligation Management', 
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
            
            const cols = Math.ceil(window.innerWidth / 80);
            const rows = Math.ceil(window.innerHeight / 80);
            const totalCells = cols * rows;

            for (let i = 0; i < totalCells; i++) {
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
                gridContainer.appendChild(cell);
                cells.push(cell);
            }
        };

        updateGrid();
        window.addEventListener('resize', updateGrid);

        heroSection.addEventListener('mousemove', (e) => {
            // Update Spotlight
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            spotlight.style.left = `${x}px`;
            spotlight.style.top = `${y}px`;

            // Randomly flip nearby cells
            cells.forEach(cell => {
                const cellRect = cell.getBoundingClientRect();
                const cellX = cellRect.left + cellRect.width / 2;
                const cellY = cellRect.top + cellRect.height / 2;
                
                const dist = Math.hypot(x - cellX, y - cellY);
                if (dist < 120 && Math.random() > 0.8) {
                    cell.classList.add('flipped');
                    setTimeout(() => cell.classList.remove('flipped'), 2000);
                }
            });
        });
    }
});

// Deploy Trigger: Sat Apr 25 14:20:11 IST 2026

// Final Deploy Trigger: Sat Apr 25 15:12:34 IST 2026

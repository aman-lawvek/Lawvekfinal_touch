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
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz5-KfpP9xi2v4cmido9GwnWZORfMGladEppFxMTh5culCWh52FvSIqScaxQNNJo2kPcw/exec';

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

    // 6. Random Static Hero Grid Overlay
    const heroMeshGrid = document.querySelector('.hero-mesh');
    if (heroMeshGrid) {
        const terms = ['Audit', 'Liability', 'Termination', 'SLA Breach', 'Renewal', 'IP Rights', 'Penalty', 'Payment', 'Risk', 'Control'];
        // Shuffle and pick 7
        const shuffledTerms = terms.sort(() => 0.5 - Math.random()).slice(0, 7);
        
        // Define safe grid columns tightly constrained to remain on-screen 
        // but fully clear the central text container block 
        const safeCols = [-8, -7, -6, 6, 7, 8];
        const chosenCoords = [];
        
        shuffledTerms.forEach(term => {
            let col, row;
            let attempts = 0;
            let isValid = false;
            
            // Re-roll to ensure no two tiles sit in the exact same spot OR touch horizontally/vertically/diagonally
            do {
                col = safeCols[Math.floor(Math.random() * safeCols.length)];
                row = Math.floor(Math.random() * 5) + 1; // 1 to 5 y-axis rows to avoid hiding near dashboard bottom
                
                isValid = true;
                for (const existing of chosenCoords) {
                    const colDiff = Math.abs(existing.col - col);
                    const rowDiff = Math.abs(existing.row - row);
                    
                    if (colDiff <= 1 && rowDiff <= 1) {
                        isValid = false; // Blocks immediate neighbors and diagonals completely
                        break;
                    }
                }
                attempts++;
            } while (!isValid && attempts < 100);
            
            if (isValid) {
                chosenCoords.push({ col, row });
                
                // Mathematically align them to the center-originating CSS grid
                const leftPos = `calc(50% - 40px + ${col * 80}px)`;
                const topPos = `${row * 80}px`;
                
                const cell = document.createElement('div');
                cell.className = 'mesh-cell';
                cell.style.left = leftPos;
                cell.style.top = topPos;
                cell.innerText = term;
                
                heroMeshGrid.appendChild(cell);
            }
        });
    }
});

// Deploy Trigger: Sat Apr 25 14:20:11 IST 2026

// Final Deploy Trigger: Sat Apr 25 15:12:34 IST 2026

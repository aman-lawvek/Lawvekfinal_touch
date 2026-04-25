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
    revealOnScroll();

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
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => {
                p.classList.remove('active');
                setTimeout(() => p.style.display = 'none', 300);
            });

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);

            setTimeout(() => {
                targetPane.style.display = 'block';
                void targetPane.offsetWidth;
                targetPane.classList.add('active');
            }, 300);
        });
    });

    // 4. Cursor parallax for hero dashboard
    const heroDashboard = document.querySelector('.hero-dashboard-preview');
    const heroSection = document.querySelector('.hero');

    if(heroDashboard && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            heroDashboard.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
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

    // IMPORTANT: Replace this with your Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz_HkE8I2P69Zf0R7y2f0Z_6Z0Z6Z0Z6Z0Z/exec'; 

    if(modal && closeBtn) {
        const openModal = (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        openBtns.forEach(btn => btn.addEventListener('click', openModal));
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });

        if(bookingForm) {
            bookingForm.addEventListener('submit', e => {
                e.preventDefault();
                submitBtn.disabled = true;
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Processing...';

                const formData = new FormData(bookingForm);
                fetch(scriptURL, { method: 'POST', body: formData })
                    .then(response => {
                        alert('Success! Your demo is booked.');
                        bookingForm.reset();
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalText;
                        closeModal();
                    })
                    .catch(error => {
                        console.error('Error!', error.message);
                        alert('Something went wrong. Please try again.');
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalText;
                    });
            });
        }
    }

    // 6. Random Static Hero Grid Overlay (Matches Vercel)
    const heroMeshGrid = document.querySelector('.hero-mesh');
    if (heroMeshGrid) {
        const terms = ['Audit', 'Liability', 'Termination', 'SLA Breach', 'Renewal', 'IP Rights', 'Penalty', 'Payment', 'Risk', 'Control'];
        const shuffledTerms = terms.sort(() => 0.5 - Math.random()).slice(0, 7);
        const safeCols = [-8, -7, -6, 6, 7, 8];
        const chosenCoords = [];

        shuffledTerms.forEach(term => {
            let col, row;
            let attempts = 0;
            let isValid = false;

            do {
                col = safeCols[Math.floor(Math.random() * safeCols.length)];
                row = Math.floor(Math.random() * 5) + 1;
                isValid = true;
                for (const existing of chosenCoords) {
                    if (Math.abs(existing.col - col) <= 1 && Math.abs(existing.row - row) <= 1) {
                        isValid = false;
                        break;
                    }
                }
                attempts++;
            } while (!isValid && attempts < 100);

            if (isValid) {
                chosenCoords.push({ col, row });
                const cell = document.createElement('div');
                cell.className = 'mesh-cell';
                cell.style.left = `calc(50% - 40px + ${col * 80}px)`;
                cell.style.top = `${row * 80}px`;
                cell.innerText = term;
                heroMeshGrid.appendChild(cell);
            }
        });
    }
});

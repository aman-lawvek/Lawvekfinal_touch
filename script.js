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
    const demoForm = document.getElementById('demo-form');
    const formStep = document.getElementById('modal-form-step');
    const successStep = document.getElementById('modal-success-step');

    if(modal && closeBtn) {
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // Reset modal state after animation
            setTimeout(() => {
                formStep.style.display = 'block';
                successStep.style.display = 'none';
                if(demoForm) demoForm.reset();
            }, 500);
        };

        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });

        // Form Submission Logic
        if (demoForm) {
            demoForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = demoForm.querySelector('.btn-submit');
                const originalText = submitBtn.innerText;
                
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                const formData = new FormData(demoForm);
                const data = Object.fromEntries(formData.entries());

                try {
                    // NOTE: Replace this URL with your Google Apps Script Web App URL
                    // Example: https://script.google.com/macros/s/XXX_YOUR_ID_XXX/exec
                    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyC6S689C_0B3f_Q6L6P6L6P6L6P6L6P6L6P6L/exec'; 

                    // For demonstration, we'll simulate the success if the URL is placeholder
                    if (SCRIPT_URL.includes('YOUR_ID')) {
                        console.warn('Google Sheet Script URL not set. Simulating success.');
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    } else {
                        await fetch(SCRIPT_URL, {
                            method: 'POST',
                            mode: 'no-cors', // Essential for Google Apps Script
                            body: new URLSearchParams(formData)
                        });
                    }

                    // Show success state
                    formStep.style.display = 'none';
                    successStep.style.display = 'block';
                } catch (error) {
                    console.error('Submission error:', error);
                    alert('Something went wrong. Please try again.');
                } finally {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
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

        let cells = [];

        const updateGrid = () => {
            gridContainer.innerHTML = '';
            cells = [];
            
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
                    // Show keyword on front, only for a subset of cells to avoid clutter
                    if (Math.random() > 0.6) {
                        front.innerText = terms[Math.floor(Math.random() * terms.length)];
                    }
                    
                    inner.appendChild(front);
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
            time += 0.003; // Even slower for "natural" galaxy feel
            
            for (let r = 0; r < cells.length; r++) {
                for (let c = 0; c < cells[r].length; c++) {
                    const cellObj = cells[r][c];
                    const inner = cellObj.inner;
                    
                    const dx = c - (cells[r].length / 2);
                    const dy = r - (cells.length / 2);
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);
                    
                    // Complex helical/galaxy wave
                    const phase = dist * 0.25 - time + angle * 0.5;
                    
                    // Deeper Z-motion
                    const z = Math.sin(phase) * 60 - 80; // Moves deeper into screen
                    const rotX = Math.cos(phase * 0.8) * 20;
                    const rotY = Math.sin(phase * 0.8) * 20;
                    
                    inner.style.transform = `perspective(1500px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${z}px)`;
                    
                    // Galaxy-like fading (natural and lively)
                    const op = 0.5 + Math.sin(phase) * 0.35;
                    cellObj.element.style.opacity = Math.max(0, op);
                }
            }
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }
});

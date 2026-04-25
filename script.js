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
    const heroSection = document.querySelector('.hero');
    const heroMeshGrid = document.querySelector('.hero-mesh');
    
    if (heroMeshGrid && heroSection) {
        const terms = [
            'Audits', 'IP Rights', 'Compliance', 'Obligation Management', 
            'Security', 'Risk', 'SLA', 'Contracts', 'Policies', 'Privacy', 
            'GDPR', 'SOC2', 'ISO 27001', 'Governance', 'Liability', 'Renewal',
            'Penalty', 'Control', 'Accountability', 'Verification'
        ];

        // Create spotlight element
        const spotlight = document.createElement('div');
        spotlight.className = 'hero-spotlight';
        heroMeshGrid.appendChild(spotlight);

        let cells = [];

        // Fill grid with cells
        const updateGrid = () => {
            // Remove existing cells
            heroMeshGrid.querySelectorAll('.mesh-cell').forEach(c => c.remove());
            cells = [];
            
            const cellSize = 80;
            const viewportWidth = window.innerWidth;
            // Use the larger of offsetHeight or a safe minimum to ensure full coverage
            const sectionHeight = Math.max(heroSection.offsetHeight, 900); 
            
            const cols = Math.ceil(viewportWidth / cellSize);
            const rows = Math.ceil(sectionHeight / cellSize);
            const totalCells = cols * rows;

            const fragment = document.createDocumentFragment();

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
                fragment.appendChild(cell);
                cells.push(cell);
            }
            heroMeshGrid.appendChild(fragment);
        };

        // Initial build with a small delay to ensure section height is rendered
        setTimeout(updateGrid, 100);
        
        window.addEventListener('resize', updateGrid);

        // Interaction logic on the entire hero section
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroMeshGrid.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Move spotlight smoothly
            spotlight.style.left = `${x}px`;
            spotlight.style.top = `${y}px`;

            // Proximity & Flip logic
            const range = 180;
            const flipRange = 40; // Tightened for precision

            cells.forEach(cell => {
                const cellRect = cell.getBoundingClientRect();
                const cellX = cellRect.left + cellRect.width / 2;
                const cellY = cellRect.top + cellRect.height / 2;
                
                const dist = Math.hypot(e.clientX - cellX, e.clientY - cellY);
                
                // Scale/Brightness Proximity
                if (dist < range) {
                    cell.classList.add('nearby');
                } else {
                    cell.classList.remove('nearby');
                }

                // Precision Flip
                if (dist < flipRange) {
                    cell.classList.add('flipped');
                } else {
                    cell.classList.remove('flipped');
                }
            });
        });

        // Clear effects when cursor leaves hero
        heroSection.addEventListener('mouseleave', () => {
            cells.forEach(cell => {
                cell.classList.remove('nearby');
                cell.classList.remove('flipped');
            });
        });
    }
});

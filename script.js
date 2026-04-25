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

    // 6. Interactive Hero Grid Overhaul
    const heroMeshGrid = document.querySelector('.hero-mesh');
    const heroSection = document.querySelector('.hero');
    
    if (heroMeshGrid && heroSection) {
        const terms = [
            'Audit-Ready', 'IP Rights', 'Compliance', 'Obligation', 'SLA Breach', 
            'Renewal', 'Liability', 'Penalty', 'Risk Score', 'Governance',
            'Data Privacy', 'GDPR', 'SOC 2', 'ISO 27001', 'Automation'
        ];

        // Create Spotlight element
        const spotlight = document.createElement('div');
        spotlight.className = 'mesh-spotlight';
        heroSection.appendChild(spotlight);

        const generateGrid = () => {
            heroMeshGrid.innerHTML = '';
            const columns = Math.ceil(window.innerWidth / 80) + 1;
            const rows = Math.ceil(heroSection.offsetHeight / 80) + 1;
            const totalCells = columns * rows;

            for (let i = 0; i < totalCells; i++) {
                const cell = document.createElement('div');
                cell.className = 'mesh-cell';
                
                const inner = document.createElement('div');
                inner.className = 'mesh-cell-inner';
                
                const front = document.createElement('div');
                front.className = 'mesh-cell-front';
                
                const back = document.createElement('div');
                back.className = 'mesh-cell-back';
                back.innerText = terms[Math.floor(Math.random() * terms.length)];
                
                inner.appendChild(front);
                inner.appendChild(back);
                cell.appendChild(inner);
                heroMeshGrid.appendChild(cell);
            }
        };

        generateGrid();
        window.addEventListener('resize', generateGrid);

        // Interaction Logic
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Move spotlight
            spotlight.style.left = `${x}px`;
            spotlight.style.top = `${y}px`;

            // Proximity Effects
            const cells = document.querySelectorAll('.mesh-cell');
            cells.forEach(cell => {
                const cellRect = cell.getBoundingClientRect();
                const cellX = cellRect.left + cellRect.width / 2;
                const cellY = cellRect.top + cellRect.height / 2;

                const distance = Math.sqrt(
                    Math.pow(e.clientX - cellX, 2) + 
                    Math.pow(e.clientY - cellY, 2)
                );

                if (distance < 150) {
                    const scale = 1 + (150 - distance) / 1000;
                    const brightness = 1 + (150 - distance) / 300;
                    cell.style.transform = `scale(${scale})`;
                    cell.style.filter = `brightness(${brightness})`;
                } else {
                    cell.style.transform = 'scale(1)';
                    cell.style.filter = 'brightness(1)';
                }
            });
        });
    }

});

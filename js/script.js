document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const preloader = document.getElementById('preloader');
    const videoBackground = document.getElementById('video-background');
    const homeSection = document.getElementById('home');
    const scannerTitle = document.getElementById('scanner-title');
    const sonarContainer = document.getElementById('sonar-container');
    const interactionZone = document.getElementById('interaction-zone');
    const hungerButtons = document.querySelectorAll('.hunger-btn');
    const comboDisplaySection = document.getElementById('combo-display');
    const comboDetailsContainer = document.getElementById('combo-details-container');
    const backToScannerBtn = document.getElementById('back-to-scanner-btn');
    const missionDataModal = document.getElementById('mission-data-modal');
    const closeModalFormBtn = document.getElementById('close-modal-form-btn');
    const orderForm = document.getElementById('order-form');
    const missionComboName = document.getElementById('mission-combo-name');
    const welcomeBackMessage = document.getElementById('welcome-back-message');
    const splatterContainer = document.getElementById('splatter-container');

    let selectedCombo = {};

    const combos = {
        1: { name: "El Egoísta", price: "22.000", img: "img/Combo-Salchipapa.png", details: ["Salchipapa personal con todo", "Queso gratinado", "Gaseosa personal"] },
        2: { name: "Dúo Dinamita", price: "38.000", img: "img/Combo-salchipapa2.png", details: ["Salchipapa para dos con doble proteína", "Trozos de chicharrón", "Queso extra y salsas de la casa", "2 Gaseosas personales"] },
        3: { name: "El Devastador", price: "45.000", img: "img/Combo-salchipapa3.png", details: ["Base gigante de papas (francesa y criolla)", "Costilla al barril y chicharrón", "Queso gratinado, guacamole y pico de gallo", "Gaseosa 1.5L"] }
    };

    const sonarBlips = ['🌭', '🍔', '🍟', '🌮'];
    let sonarInterval;

    // --- INICIALIZACIÓN ---
    function init() {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
            
            showSection('home');
            startSonarAnimation();

            setTimeout(() => {
                stopSonarAnimation();
                scannerTitle.style.display = 'none';
                sonarContainer.style.display = 'none';
                interactionZone.style.display = 'block';
            }, 4000);
        });
    }

    // --- LÓGICA DE NAVEGACIÓN (CORREGIDA Y ROBUSTA) ---
    function showSection(sectionId) {
        document.querySelectorAll('main > section').forEach(section => {
            section.style.display = 'none';
        });
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
        }
        videoBackground.classList.toggle('hidden', sectionId !== 'home');
    }

    hungerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.dataset.level;
            vibrate();
            showCombo(level);
        });
    });

    backToScannerBtn.addEventListener('click', () => {
        vibrate();
        showSection('home');
        scannerTitle.style.display = 'block';
        sonarContainer.style.display = 'block';
        interactionZone.style.display = 'none';
        startSonarAnimation();
        setTimeout(() => {
            stopSonarAnimation();
            scannerTitle.style.display = 'none';
            sonarContainer.style.display = 'none';
            interactionZone.style.display = 'block';
        }, 4000);
    });

    function showCombo(level) {
        selectedCombo = combos[level];
        const comboHTML = `
            <div class="combo-image">
                <img src="${selectedCombo.img}" alt="${selectedCombo.name}">
            </div>
            <div class="combo-info">
                <h2>${selectedCombo.name}</h2>
                <p class="price">$${selectedCombo.price} COP</p>
                <ul>${selectedCombo.details.map(item => `<li>${item}</li>`).join('')}</ul>
                <div class="review-card">
                    <div class="review-header">
                        <span class="review-source">Google Reviews</span>
                        <span class="stars">4.8 ⭐⭐⭐⭐⭐</span>
                    </div>
                    <div class="review-body">
                        <p>"La mejor salchipapa que he probado. ¡Brutal!"</p>
                        <span>- Cliente Verificado</span>
                    </div>
                </div>
                <button class="main-cta-btn" id="prepare-launch-btn">¡LO QUIERO AHORA!</button>
            </div>
        `;
        comboDetailsContainer.innerHTML = comboHTML;

        showSection('combo-display');

        document.getElementById('prepare-launch-btn').addEventListener('click', () => {
            vibrate();
            checkForUserData();
            missionComboName.textContent = selectedCombo.name;
            missionDataModal.style.display = 'flex';
        });
    }

    // --- LÓGICA DEL FORMULARIO INTELIGENTE ---
    closeModalFormBtn.addEventListener('click', () => missionDataModal.style.display = 'none');

    function checkForUserData() {
        const savedName = localStorage.getItem('salchipotato_agent_name');
        if (savedName) {
            document.getElementById('nombre-agente').value = savedName;
            document.getElementById('zona-impacto').value = localStorage.getItem('salchipotato_agent_address') || '';
            welcomeBackMessage.innerHTML = `¡Hola de nuevo, <strong>${savedName}</strong>! Tus datos están listos.`;
            welcomeBackMessage.style.display = 'block';
        } else {
            welcomeBackMessage.style.display = 'none';
        }
    }

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        vibrate(150);
        createParticleExplosion(e.clientX, e.clientY);
        
        const nombreAgente = document.getElementById('nombre-agente').value;
        const zonaImpacto = document.getElementById('zona-impacto').value;

        localStorage.setItem('salchipotato_agent_name', nombreAgente);
        localStorage.setItem('salchipotato_agent_address', zonaImpacto);

        missionDataModal.style.display = 'none';
        setTimeout(() => {
            launchWhatsApp(nombreAgente, zonaImpacto);
        }, 800); // Delay para que se vea la explosión
    });

    function launchWhatsApp(nombre, direccion) {
        const comboName = selectedCombo.name;
        const text = `¡Protocolo Hambre Cero Activado!\n\n💣 *COMBO:* ${comboName}\n👤 *AGENTE:* ${nombre}\n📍 *ZONA DE IMPACTO:* ${direccion}\n\n¡Espero mi arsenal para aniquilar el hambre!`;
        const whatsappUrl = `https://wa.me/573233362016?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        setTimeout(() => showSection('home'), 3000);
    }

    // --- EFECTOS VISUALES Y HÁPTICOS ---
    function startSonarAnimation() {
        if(sonarInterval) clearInterval(sonarInterval);
        const sonarScanner = sonarContainer.querySelector('.sonar-scanner');
        if (!sonarScanner) return;
        sonarScanner.innerHTML = '<div class="sonar-sweep"></div>';
        sonarInterval = setInterval(() => {
            const blip = document.createElement('div');
            blip.className = 'sonar-blip';
            blip.textContent = sonarBlips[Math.floor(Math.random() * sonarBlips.length)];
            blip.style.left = `${Math.random() * 90 + 5}%`;
            blip.style.top = `${Math.random() * 90 + 5}%`;
            blip.style.animationDelay = `${Math.random() * 2.5}s`;
            sonarScanner.appendChild(blip);
            setTimeout(() => blip.remove(), 2500);
        }, 500);
    }

    function stopSonarAnimation() {
        clearInterval(sonarInterval);
    }

    function vibrate(duration = 50) {
        if (navigator.vibrate) navigator.vibrate(duration);
    }

    function createParticleExplosion(x, y) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            const angle = Math.random() * 360;
            const distance = Math.random() * 150 + 50;
            const translateX = Math.cos(angle * Math.PI / 180) * distance;
            const translateY = Math.sin(angle * Math.PI / 180) * distance;
            particle.style.setProperty('--transform-end', `translate(${translateX}px, ${translateY}px)`);
            if (Math.random() > 0.5) {
                particle.style.backgroundColor = 'var(--color-danger)';
            }
            splatterContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 700);
        }
    }

    // Iniciar la aplicación
    init();
});

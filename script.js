// Navegação responsiva
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navegação suave com indicador ativo
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll da navegação com efeito glassmorphism
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(15, 15, 35, 0.98)';
        nav.style.backdropFilter = 'blur(20px)';
    } else {
        nav.style.background = 'rgba(15, 15, 35, 0.95)';
        nav.style.backdropFilter = 'blur(20px)';
    }
});

// Intersection Observer para animações e navegação ativa
const observerOptions = {
    threshold: 0.3,
    rootMargin: '-80px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Adicionar animação
            entry.target.classList.add('fade-in');
            
            // Atualizar navegação ativa
            const sectionId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

// Observar seções para animação e navegação
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const elementsToAnimate = document.querySelectorAll('.project-item, .cert-item, .skill-category, .method-step');
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    elementsToAnimate.forEach(element => {
        sectionObserver.observe(element);
    });
});

// Animação das barras de habilidades
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
});

// Formulário de contacto com validação avançada
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Validação dos campos
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        if (!name || !email || !subject || !message) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }
        
        // Animação de envio
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular envio (em produção, conectar com backend)
        try {
            await simulateFormSubmission();
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
            submitBtn.style.background = 'var(--success-color)';
            
            showNotification('Mensagem enviada com sucesso! Entrarei em contacto em breve.', 'success');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                contactForm.reset();
            }, 3000);
        } catch (error) {
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro';
            submitBtn.style.background = 'var(--warning-color)';
            
            showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para simular envio do formulário
function simulateFormSubmission() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 90% de chance de sucesso
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('Erro simulado'));
            }
        }, 2000);
    });
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-glass);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius-md);
        padding: 1rem;
        backdrop-filter: blur(10px);
        z-index: 10000;
        transform: translateX(100%);
        transition: var(--transition-normal);
        max-width: 400px;
        color: var(--text-primary);
    `;
    
    if (type === 'success') {
        notification.style.borderColor = 'var(--success-color)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--warning-color)';
    }
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Fechar notificação
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto-fechar após 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Efeito de digitação no título principal
function typeWriter(element, text, speed = 80) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efeito de digitação
window.addEventListener('load', () => {
    const titleMain = document.querySelector('.title-main');
    if (titleMain) {
        const originalText = titleMain.textContent;
        setTimeout(() => {
            typeWriter(titleMain, originalText, 100);
        }, 500);
    }
});

// Parallax suave no hero com elementos flutuantes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    const dataPoints = document.querySelectorAll('.data-point');
    const chartElements = document.querySelectorAll('.chart-element');
    
    if (heroImage) {
        const speed = scrolled * 0.3;
        heroImage.style.transform = `translateY(${speed}px)`;
    }
    
    // Parallax para elementos de dados
    dataPoints.forEach((point, index) => {
        const speed = scrolled * (0.1 + index * 0.05);
        point.style.transform = `translateY(${speed}px)`;
    });
    
    chartElements.forEach((element, index) => {
        const speed = scrolled * (0.15 + index * 0.1);
        element.style.transform = `translateY(${speed}px) rotate(${speed * 0.5}deg)`;
    });
});

// Contador animado para estatísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Observar estatísticas para animação
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});

// Cursor personalizado para desktop
function initCustomCursor() {
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--highlight-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            opacity: 0;
            mix-blend-mode: difference;
        `;
        
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursor.style.opacity = '0.8';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '0.8';
        });
        
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        
        // Hover effects para elementos interativos
        document.querySelectorAll('a, button, .project-item, .cert-item, .skill-category').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursor.style.background = 'var(--success-color)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'var(--highlight-color)';
            });
        });
    }
}

// Inicializar cursor personalizado
document.addEventListener('DOMContentLoaded', initCustomCursor);

// Lazy loading para imagens
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Preloader com animação
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">DN</div>
            <div class="preloader-text">Carregando...</div>
            <div class="preloader-bar">
                <div class="preloader-progress"></div>
            </div>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(preloader);
    
    // Simular carregamento
    const progress = preloader.querySelector('.preloader-progress');
    let width = 0;
    
    const interval = setInterval(() => {
        width += Math.random() * 10;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(preloader);
                }, 500);
            }, 500);
        }
        progress.style.width = width + '%';
    }, 100);
}

// Performance: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar throttle aos eventos de scroll
const throttledScroll = throttle(() => {
    // Código de scroll já implementado acima
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar preloader
    initPreloader();
    
    // Inicializar lazy loading
    initLazyLoading();
    
    // Adicionar classes CSS para notificações
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.2rem;
            margin-left: 1rem;
            transition: var(--transition-fast);
        }
        
        .notification-close:hover {
            color: var(--text-primary);
        }
        
        .preloader-content {
            text-align: center;
            color: var(--text-primary);
        }
        
        .preloader-logo {
            font-size: 3rem;
            font-weight: 800;
            font-family: 'JetBrains Mono', monospace;
            margin-bottom: 1rem;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .preloader-text {
            margin-bottom: 2rem;
            color: var(--text-secondary);
        }
        
        .preloader-bar {
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .preloader-progress {
            height: 100%;
            background: var(--gradient-primary);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

// Detectar modo escuro do sistema
function detectDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }
}

// Escutar mudanças no modo escuro
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

// Inicializar detecção de modo escuro
detectDarkMode();

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Ativar modo "Matrix"
        document.body.style.filter = 'hue-rotate(120deg) contrast(1.2)';
        showNotification('🎉 Modo Matrix ativado! Você encontrou o easter egg!', 'success');
        
        setTimeout(() => {
            document.body.style.filter = '';
        }, 5000);
        
        konamiCode = [];
    }
});

// Adicionar meta tag para PWA
function addPWAMeta() {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#1a1a2e';
    document.head.appendChild(meta);
}

addPWAMeta();


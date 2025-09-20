// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const form = document.querySelector('.form');
const themeDropdownToggle = document.getElementById('theme-dropdown-toggle');
const themeDropdown = document.getElementById('theme-dropdown');
const themeOptions = document.querySelectorAll('.theme-option');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Theme Selector Functionality
function initTheme() {
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateActiveThemeOption(savedTheme);
    
    // Reset and apply correct navbar styling on page load
    resetNavbarStyles();
    updateNavbarBackground();
    
    // Force correct theme dropdown colors via JavaScript
    forceThemeDropdownColors();
}

function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    updateActiveThemeOption(themeName);
    closeThemeDropdown();
    
    // Reset navbar styles to prevent inconsistencies when switching themes
    resetNavbarStyles();
    
    // Reapply correct navbar styling based on scroll position
    updateNavbarBackground();
    
    // Force correct theme dropdown colors after theme change
    setTimeout(() => {
        forceThemeDropdownColors();
    }, 100);
    
    // Add a subtle animation effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Reset navbar inline styles to allow CSS theme rules to take effect
function resetNavbarStyles() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Remove inline styles that might override theme CSS
        navbar.style.background = '';
        navbar.classList.remove('scrolled');
    }
}

function updateActiveThemeOption(themeName) {
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === themeName) {
            option.classList.add('active');
        }
    });
}

function toggleThemeDropdown() {
    const isActive = themeDropdown.classList.contains('active');
    if (isActive) {
        closeThemeDropdown();
    } else {
        openThemeDropdown();
    }
}

function openThemeDropdown() {
    themeDropdown.classList.add('active');
    themeDropdownToggle.classList.add('active');
}

function closeThemeDropdown() {
    themeDropdown.classList.remove('active');
    themeDropdownToggle.classList.remove('active');
}

// Theme dropdown event listeners
if (themeDropdownToggle) {
    themeDropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleThemeDropdown();
    });
}

// Theme option event listeners
themeOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeName = option.dataset.theme;
        setTheme(themeName);
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.theme-selector')) {
        closeThemeDropdown();
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeThemeDropdown();
    }
});


// Force correct theme dropdown colors via JavaScript (bypass CSS issues)
function forceThemeDropdownColors() {
    console.log('🔧 FORCING THEME DROPDOWN COLORS...');
    
    // Get the current theme to determine dropdown background color
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    console.log(`Current theme: ${currentTheme}`);
    
    // Themes with light dropdown backgrounds need dark text
    const lightDropdownThemes = ['light', 'yellow-light'];
    const useDarkText = lightDropdownThemes.includes(currentTheme);
    
    console.log(`Using ${useDarkText ? 'dark' : 'light'} text for dropdown`);
    
    // Use appropriate text color based on current theme's dropdown background
    const textColor = useDarkText ? '#000000' : '#ffffff';
    const themeColorMap = {
        'dark': textColor,
        'light': textColor,
        'yellow-light': textColor,
        'synthwave': textColor,
        'miami': textColor,
        'arcade': textColor,
        'neon': textColor
    };
    
    const themeOptions = document.querySelectorAll('.theme-option');
    console.log(`Found ${themeOptions.length} theme options`);
    
    themeOptions.forEach((option, index) => {
        const themeName = option.querySelector('.theme-name');
        const themeType = option.getAttribute('data-theme');
        
        console.log(`Theme ${index + 1}: ${themeType}`);
        console.log(`  - Theme name element found: ${themeName ? 'YES' : 'NO'}`);
        console.log(`  - Color to apply: ${themeColorMap[themeType]}`);
        
        if (themeName && themeColorMap[themeType]) {
            // Force the color using inline styles (highest priority)
            themeName.style.color = themeColorMap[themeType] + ' !important';
            themeName.style.setProperty('color', themeColorMap[themeType], 'important');
            
            // Also try direct assignment
            themeName.style.color = themeColorMap[themeType];
            
            console.log(`  - Applied color: ${themeName.style.color}`);
            console.log(`  - Computed color: ${window.getComputedStyle(themeName).color}`);
        }
    });
    
    console.log('✅ THEME DROPDOWN COLORS FORCED');
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// Navbar background on scroll
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        // Theme-specific backgrounds when scrolled
        if (currentTheme === 'light') {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        } else if (currentTheme === 'yellow-light') {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        }
    } else {
        navbar.classList.remove('scrolled');
        // Theme-specific backgrounds when at top
        if (currentTheme === 'light') {
            navbar.style.background = 'rgba(248, 249, 250, 0.95)';
        } else if (currentTheme === 'yellow-light') {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        }
    }
}

// Scroll event listeners
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateNavbarBackground();
});

// Terminal typing animation
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Terminal CLI functionality
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.querySelector('.terminal-body');

// Available commands
const commands = {
    help: () => 'Available commands: help, whoami, skills, contact, clear, date, echo [text], neofetch',
    whoami: () => 'Software Engineer @ Swimage | Full‑Stack Developer',
    skills: () => `Frontend: React, Vue, TypeScript
Backend: Node.js, Python, FastAPI
DB: PostgreSQL, MS SQL
Tools: Git, Docker, AWS, VS Code`,
    contact: () => {
        console.log('DEBUG: Current contact command called');
        console.log('DEBUG: Current email: lukaskanopka@icloud.com');
        console.log('DEBUG: Current LinkedIn: linkedin.com/in/laurynaskanopka');
        console.log('DEBUG: Current GitHub: github.com/LukasKanopka');
        return `📧 lukaskanopka@icloud.com
🐙 github.com/LukasKanopka
💼 linkedin.com/in/laurynaskanopka
💬 Always open to interesting opportunities!`;
    },
    clear: () => {
        // Clear terminal except for input line
        const lines = terminalBody.querySelectorAll('.terminal-line:not(.terminal-input-line)');
        lines.forEach(line => line.remove());
        return '';
    },
    date: () => new Date().toLocaleString(),
    echo: (args) => args.join(' ') || 'Usage: echo [text]',
    neofetch: () => {
        const uptime = Math.floor(performance.now() / 1000);
        return `    ██╗     ██╗   ██╗██╗  ██╗ █████╗ ███████╗
    ██║     ██║   ██║██║ ██╔╝██╔══██╗██╔════╝
    ██║     ██║   ██║█████╔╝ ███████║███████╗
    ██║     ██║   ██║██╔═██╗ ██╔══██║╚════██║
    ███████╗╚██████╔╝██║  ██╗██║  ██║███████║
    ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝

OS: Portfolio v2025.09.15
Host: Lukas Kanopka's Mac Mini
Kernel: 24.5.0
Uptime: ${uptime} seconds
Shell: PortfolioCLI v 1.2.1
Resolution: 720x360
CPU: Apple M4
Memory: 2485MiB / 16384MiB`;
    }
};

// Handle terminal input
function handleTerminalCommand(command) {
    const args = command.trim().split(' ');
    const cmd = args[0].toLowerCase();
    const cmdArgs = args.slice(1);
    
    // Add command line to terminal
    addTerminalLine('prompt', `$ ${command}`);
    
    if (cmd === '') {
        return;
    }
    
    if (commands[cmd]) {
        const output = commands[cmd](cmdArgs);
        if (output) {
            addTerminalLine('output', output);
        }
    } else {
        addTerminalLine('error', `Command not found: ${cmd}. Type 'help' for available commands.`);
    }
    
    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Add line to terminal
function addTerminalLine(type, text) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (type === 'prompt') {
        line.innerHTML = `<span class="command">${text}</span>`;
    } else if (type === 'output') {
        line.innerHTML = `<span class="output">${text}</span>`;
    } else if (type === 'error') {
        line.innerHTML = `<span class="error">${text}</span>`;
    }
    
    // Insert before the input line
    const inputLine = terminalBody.querySelector('.terminal-input-line');
    terminalBody.insertBefore(line, inputLine);
}

// Terminal input event listener
if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value;
            handleTerminalCommand(command);
            terminalInput.value = '';
        }
    });
    
    // Focus terminal input when clicking on terminal
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });
    
    // Auto-focus terminal input on page load
    setTimeout(() => {
        terminalInput.focus();
    }, 2000);
}

// Initialize terminal animation
let terminalAnimationStarted = false;
function initTerminalAnimation() {
    if (terminalAnimationStarted) return;
    terminalAnimationStarted = true;
    
    const commands = [
        { element: '.terminal-line:nth-child(1) .command', text: 'echo "Hi I\'m Lukas!"', delay: 1000, typed: true },
        { element: '.terminal-line:nth-child(2) .output', text: 'Hi I\'m Lukas!', delay: 2000, typed: false },
        { element: '.terminal-line:nth-child(3) .command', text: 'help', delay: 3500, typed: true },
        { element: '.terminal-line:nth-child(4) .output', text: 'Available commands: help, whoami, skills, contact, clear, date, echo [text], neofetch', delay: 4500, typed: false }
    ];

    // Reset terminal content
    document.querySelectorAll('.terminal-line .command, .terminal-line .output').forEach(el => {
        el.innerHTML = '';
    });

    commands.forEach(cmd => {
        setTimeout(() => {
            const element = document.querySelector(cmd.element);
            if (element) {
                if (cmd.typed) {
                    typeWriter(element, cmd.text, 50);
                } else {
                    element.innerHTML = cmd.text;
                }
            }
        }, cmd.delay);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Trigger terminal animation when hero section is visible
            if (entry.target.classList.contains('hero')) {
                initTerminalAnimation();
            }
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Form submission
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple form validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

// Project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill tag hover effects
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'translateY(-2px) scale(1.05)';
        tag.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.2)';
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'translateY(0) scale(1)';
        tag.style.boxShadow = 'none';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Add initial animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Initialize terminal animation after a delay
    setTimeout(() => {
        initTerminalAnimation();
    }, 1500);
    
    // Add click handlers for project buttons (only intercept non-links or "coming soon" UI)
    document.querySelectorAll('.project-card .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const isAnchor = btn.tagName.toLowerCase() === 'a';
            const buttonText = btn.textContent.trim();

            // If it's an anchor with an href, let the browser handle navigation
            if (isAnchor && btn.getAttribute('href')) {
                return;
            }

            // Intercept non-link buttons or "coming soon" placeholders
            if (btn.disabled || buttonText === 'Coming Soon' || buttonText === 'View Demo' || buttonText === 'Source Code') {
                e.preventDefault();
                const message = btn.disabled || buttonText === 'Coming Soon'
                    ? 'This project is still in development. Stay tuned!'
                    : 'Demo links will be available soon!';
                showNotification(message, 'info');
            }
        });
    });
    
    // Add smooth reveal animations
    const revealElements = document.querySelectorAll('.project-card, .skill-category, .contact-link');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(element);
    });

    // GPT Model Details Modal behavior
    const gptDetailsBtn = document.getElementById('gpt-details-btn');
    const gptModal = document.getElementById('gpt-modal');
    if (gptDetailsBtn && gptModal) {
        const modalCloseBtn = gptModal.querySelector('.modal-close');
        const modalTitle = gptModal.querySelector('#gpt-modal-title');

        const openModal = () => {
            gptModal.classList.add('open');
            gptModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            // Focus heading for accessibility
            setTimeout(() => {
                if (modalTitle && typeof modalTitle.focus === 'function') {
                    modalTitle.setAttribute('tabindex', '-1');
                    modalTitle.focus();
                }
            }, 0);
        };

        const closeModal = () => {
            gptModal.classList.remove('open');
            gptModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        gptDetailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        // Close when clicking outside content
        gptModal.addEventListener('click', (e) => {
            if (e.target === gptModal) {
                closeModal();
            }
        });

        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && gptModal.classList.contains('open')) {
                closeModal();
            }
        });
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Arrow keys for section navigation
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        const sections = ['home', 'about', 'projects', 'contact'];
        const currentSection = getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        scrollToSection(sections[nextIndex]);
    }
    
    if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        const sections = ['home', 'about', 'projects', 'contact'];
        const currentSection = getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        scrollToSection(sections[prevIndex]);
    }
});

// Get current section based on scroll position
function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    for (let section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            return section.getAttribute('id');
        }
    }
    
    return 'home';
}

// Add CSS for notifications
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
}

.notification.show {
    opacity: 1;
    transform: translateX(0);
}

.notification-content {
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.notification-success .notification-content {
    border-color: var(--secondary);
    background: rgba(78, 205, 196, 0.1);
}

.notification-error .notification-content {
    border-color: var(--primary);
    background: rgba(255, 107, 53, 0.1);
}

.notification-info .notification-content {
    border-color: var(--accent);
    background: rgba(255, 230, 109, 0.1);
}

.notification-message {
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    flex: 1;
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: var(--font-size-lg);
    cursor: pointer;
    padding: 0;
    margin-left: var(--spacing-3);
    transition: var(--transition);
}

.notification-close:hover {
    color: var(--primary);
}

@media (max-width: 480px) {
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
import React, { useEffect, useRef } from 'react';

// Load external libraries
declare global {
  interface Window {
    gsap: any;
    AOS: any;
  }
}

interface StartPageProps {
  onStartGame: () => void;
}

const StartPage: React.FC<StartPageProps> = ({ onStartGame }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load GSAP and AOS
    const loadScripts = async () => {
      // Load GSAP
      if (!window.gsap) {
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        gsapScript.async = true;
        document.head.appendChild(gsapScript);

        await new Promise((resolve) => {
          gsapScript.onload = resolve;
        });
      }

      // Load AOS
      if (!window.AOS) {
        const aosCSS = document.createElement('link');
        aosCSS.rel = 'stylesheet';
        aosCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css';
        document.head.appendChild(aosCSS);

        const aosScript = document.createElement('script');
        aosScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js';
        aosScript.async = true;
        document.head.appendChild(aosScript);

        await new Promise((resolve) => {
          aosScript.onload = resolve;
        });
      }

      // Initialize animations
      initializeAnimations();
    };

    loadScripts();

    return () => {
      // Cleanup on unmount
      if (window.gsap) {
        window.gsap.killTweensOf('*');
      }
    };
  }, []);

  const initializeAnimations = () => {
    if (!window.gsap || !window.AOS) return;

    // Initialize AOS
    window.AOS.init({
      duration: 2000,
      once: true,
      easing: 'ease-out-cubic'
    });

    // Create particles
    createParticles();

    // GSAP timeline animations
    const tl = window.gsap.timeline();

    tl.from('.start-logo-container', {
      duration: 2,
      scale: 0,
      rotation: 360,
      ease: 'back.out(1.7)'
    })
    .from('.start-social-login-button', {
      duration: 1.2,
      x: -100,
      opacity: 0,
      ease: 'power3.out'
    }, '-=1.5')
    .from('.start-social-media-container', {
      duration: 1.2,
      scale: 0,
      opacity: 0,
      ease: 'back.out(1.7)'
    }, '-=1.5')
    .from('.start-button-container', {
      duration: 1.5,
      y: 100,
      opacity: 0,
      ease: 'power3.out'
    }, '-=1');

    // Interactive effects
    setupInteractiveEffects();
  };

  const createParticles = () => {
    if (!particlesRef.current) return;

    const particleCount = 40;
    particlesRef.current.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'start-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${Math.random() * 3 + 3}s`;
      particlesRef.current.appendChild(particle);
    }
  };

  const setupInteractiveEffects = () => {
    if (!window.gsap || !logoRef.current) return;

    const logo = logoRef.current;

    // Mouse movement effect
    const handleMouseMove = (e: MouseEvent) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 20;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 20;

      window.gsap.to(logo, {
        duration: 0.3,
        rotationY: xAxis,
        rotationX: yAxis,
        ease: 'power2.out'
      });
    };

    // Hover effects
    const handleMouseEnter = () => {
      window.gsap.to(logo, {
        duration: 0.2,
        scale: 1.15,
        ease: 'power2.out'
      });

      window.gsap.to(logo, {
        duration: 0.3,
        filter: 'drop-shadow(0 30px 60px rgba(218, 165, 32, 0.8))',
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      window.gsap.to(logo, {
        duration: 0.3,
        scale: 1,
        ease: 'power2.out'
      });

      window.gsap.to(logo, {
        duration: 0.3,
        filter: 'drop-shadow(0 20px 40px rgba(218, 165, 32, 0.4))',
        ease: 'power2.out'
      });
    };

    // Click effect
    const handleClick = (e: MouseEvent) => {
      window.gsap.to(logo, {
        duration: 0.1,
        scale: 0.95,
        ease: 'power2.out'
      });

      window.gsap.to(logo, {
        duration: 0.1,
        scale: 1,
        ease: 'power2.out',
        delay: 0.1
      });

      createRippleEffect(e);
    };

    document.addEventListener('mousemove', handleMouseMove);
    logo.addEventListener('mouseenter', handleMouseEnter);
    logo.addEventListener('mouseleave', handleMouseLeave);
    logo.addEventListener('click', handleClick);

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      logo.removeEventListener('mouseenter', handleMouseEnter);
      logo.removeEventListener('mouseleave', handleMouseLeave);
      logo.removeEventListener('click', handleClick);
    };
  };

  const createRippleEffect = (e: MouseEvent) => {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(218, 165, 32, 0.6)';
    ripple.style.pointerEvents = 'none';
    ripple.style.left = `${e.clientX - 10}px`;
    ripple.style.top = `${e.clientY - 10}px`;
    ripple.style.zIndex = '1000';

    document.body.appendChild(ripple);

    if (window.gsap) {
      window.gsap.to(ripple, {
        duration: 0.6,
        scale: 20,
        opacity: 0,
        ease: 'power2.out',
        onComplete: () => {
          if (document.body.contains(ripple)) {
            document.body.removeChild(ripple);
          }
        }
      });
    }
  };

  const handleStartGameClick = () => {
    if (!window.gsap) {
      onStartGame();
      return;
    }

    const button = document.querySelector('.start-game-button');
    if (!button) return;

    // GSAP animation for button
    window.gsap.to(button, {
      duration: 0.3,
      scale: 0.95,
      ease: 'power2.out'
    });

    window.gsap.to(button, {
      duration: 0.3,
      scale: 1,
      ease: 'power2.out',
      delay: 0.3
    });

    (button as HTMLElement).textContent = 'Запуск...';
    button.classList.add('start-loading-pulse');

    // Create particle burst effect
    window.gsap.to('.start-particle', {
      duration: 0.5,
      scale: 2,
      opacity: 0,
      stagger: 0.05,
      ease: 'power2.out'
    });

    // Trigger loading screen
    setTimeout(() => {
      onStartGame();
    }, 800);
  };

  const handleSocialLogin = () => {
    if (!window.gsap) return;

    const button = document.querySelector('.start-social-login-button');
    if (!button) return;

    // GSAP animation for button
    window.gsap.to(button, {
      duration: 0.2,
      scale: 0.95,
      ease: 'power2.out'
    });

    window.gsap.to(button, {
      duration: 0.2,
      scale: 1,
      ease: 'power2.out',
      delay: 0.2
    });

    // Show social media options with animation
    const socialContainer = document.querySelector('.start-social-media-container');
    if (socialContainer) {
      window.gsap.to(socialContainer, {
        duration: 0.5,
        scale: 1.1,
        ease: 'power2.out'
      });

      window.gsap.to(socialContainer, {
        duration: 0.5,
        scale: 1,
        ease: 'power2.out',
        delay: 0.5
      });
    }

    // Create particle burst effect around button
    window.gsap.to('.start-particle', {
      duration: 0.8,
      scale: 1.5,
      opacity: 0.6,
      stagger: 0.02,
      ease: 'power2.out'
    });
  };

  return (
    <div className="start-page" ref={containerRef}>
      {/* Background */}
      <div className="start-background-container">
        <img src="/resources/background.png" alt="Game Background" className="start-background-image" />
        <div className="start-background-overlay"></div>
      </div>

      {/* Liquid Glass Effect */}
      <div className="start-liquid-glass-container">
        <div className="start-liquid-glass"></div>
      </div>

      {/* Floating Particles */}
      <div className="start-particles-container" ref={particlesRef}></div>

      {/* Full-screen Logo */}
      <div className="start-logo-container" data-aos="zoom-in" data-aos-duration="2000">
        <img
          ref={logoRef}
          src="/resources/logo.svg"
          alt="Element Game Logo"
          className="start-logo"
        />
      </div>

      {/* Social Login Button */}
      <button
        className="start-social-login-button"
        onClick={handleSocialLogin}
        data-aos="fade-right"
        data-aos-delay="300"
      >
        Войти через соцсети
      </button>

      {/* Social Media Icons */}
      <div className="start-social-media-container">
        <a href="https://t.me/elemgame" target="_blank" rel="noopener noreferrer" className="start-social-icon start-telegram-icon" title="Telegram" aria-label="Telegram">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <path fill="#FFFFFF" d="M9.036 15.803l-.374 5.279c.533 0 .763-.229 1.039-.504l2.494-2.389 5.163 3.783c.946.521 1.617.247 1.876-.876l3.399-15.923h.001c.302-1.41-.509-1.961-1.43-1.618L1.118 9.89c-1.39.541-1.369 1.318-.236 1.667l5.208 1.623L18.87 6.03c.603-.396 1.154-.177.702.22"/>
          </svg>
        </a>
        <a href="https://www.youtube.com/@elemgame" target="_blank" rel="noopener noreferrer" className="start-social-icon start-youtube-icon" title="YouTube" aria-label="YouTube">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <path fill="#FFFFFF" d="M23.499 6.203a3.005 3.005 0 0 0-2.12-2.123C19.507 3.577 12 3.577 12 3.577s-7.507 0-9.379.503a3.005 3.005 0 0 0-2.12 2.123C0 8.074 0 12 0 12s0 3.926.501 5.797a3.005 3.005 0 0 0 2.12 2.123c1.872.503 9.379.503 9.379.503s7.507 0 9.379-.503a3.005 3.005 0 0 0 2.12-2.123C24 15.926 24 12 24 12s0-3.926-.501-5.797zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        <a href="https://x.com/elemgame" target="_blank" rel="noopener noreferrer" className="start-social-icon start-x-icon" title="X (Twitter)" aria-label="X">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <path fill="#FFFFFF" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>

      {/* Start Button */}
      <div className="start-button-container">
        <button
          className="start-game-button"
          onClick={handleStartGameClick}
          data-aos="fade-up"
          data-aos-delay="1000"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartPage;

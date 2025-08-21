import * as PIXI from 'pixi.js';
import React, { useEffect, useMemo, useRef } from 'react';

interface BattleEffectsProps {
  isActive: boolean;
  element: 'fire' | 'water' | 'earth';
}

const BattleEffects: React.FC<BattleEffectsProps> = ({ isActive, element }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  // Mobile optimization settings
  const isMobile = useMemo(() => {
    return window.innerWidth <= 768 || window.innerHeight <= 768;
  }, []);

  const isSmallMobile = useMemo(() => {
    return window.innerWidth <= 480 || window.innerHeight <= 480;
  }, []);

  const elementColors = useMemo(
    () => ({
      fire: { primary: 0xff4757, secondary: 0xff6b6b, glow: 0xff3838 },
      water: { primary: 0x3742fa, secondary: 0x5352ed, glow: 0x2f3542 },
      earth: { primary: 0x2ed573, secondary: 0x26de81, glow: 0x20bf6b },
    }),
    []
  );

  useEffect(() => {
    if (!canvasRef.current || !isActive || !PIXI) return undefined;

    try {
      const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        antialias: !isMobile, // Disable antialiasing on mobile for better performance
        resolution: isSmallMobile ? 1 : window.devicePixelRatio || 1, // Lower resolution on small devices
        powerPreference: 'high-performance',
      });

      if (app.view && app.view instanceof HTMLCanvasElement) {
        canvasRef.current.appendChild(app.view);
      }

      appRef.current = app;

      const colors = elementColors[element];

      // Create energy waves (optimized for mobile)
      const createEnergyWave = () => {
        const wave = new PIXI.Graphics();
        const lineWidth = isSmallMobile ? 1 : isMobile ? 2 : 3;
        const circleSize = isSmallMobile ? 30 : isMobile ? 40 : 50;

        wave.lineStyle(lineWidth, colors.primary, 0.8);
        wave.drawCircle(0, 0, circleSize);
        wave.x = Math.random() * app.screen.width;
        wave.y = Math.random() * app.screen.height;
        app.stage.addChild(wave);

        const animate = () => {
          const scaleSpeed = isSmallMobile ? 0.015 : isMobile ? 0.018 : 0.02;
          const alphaSpeed = isSmallMobile ? 0.015 : isMobile ? 0.012 : 0.01;

          wave.scale.x += scaleSpeed;
          wave.scale.y += scaleSpeed;
          wave.alpha -= alphaSpeed;

          if (wave.alpha <= 0) {
            app.stage.removeChild(wave);
            wave.destroy();
          } else {
            requestAnimationFrame(animate);
          }
        };
        animate();
      };

      // Create sparkles (optimized for mobile)
      const createSparkle = () => {
        const sparkle = new PIXI.Graphics();
        sparkle.beginFill(colors.secondary);

        // Simplified sparkle shape for mobile
        if (isSmallMobile) {
          // Simple diamond shape for small screens
          sparkle.drawPolygon([0, -8, 8, 0, 0, 8, -8, 0]);
        } else if (isMobile) {
          // Simple star shape for mobile
          const points = [];
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const radius = i % 2 === 0 ? 8 : 4;
            points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
          }
          sparkle.drawPolygon(points);
        } else {
          // Full star shape for desktop
          const points = [];
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5;
            const radius = i % 2 === 0 ? 10 : 5;
            points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
          }
          sparkle.drawPolygon(points);
        }

        sparkle.endFill();
        sparkle.x = Math.random() * app.screen.width;
        sparkle.y = Math.random() * app.screen.height;
        sparkle.alpha = 0.8;
        app.stage.addChild(sparkle);

        const animate = () => {
          const moveSpeed = isSmallMobile ? 1 : isMobile ? 1.5 : 2;
          const alphaSpeed = isSmallMobile ? 0.025 : isMobile ? 0.022 : 0.02;
          const rotationSpeed = isSmallMobile ? 0.08 : isMobile ? 0.09 : 0.1;

          sparkle.y -= moveSpeed;
          sparkle.alpha -= alphaSpeed;
          sparkle.rotation += rotationSpeed;

          if (sparkle.alpha <= 0 || sparkle.y < -20) {
            app.stage.removeChild(sparkle);
            sparkle.destroy();
          } else {
            requestAnimationFrame(animate);
          }
        };
        animate();
      };

      // Create element-specific effects (optimized for mobile)
      const createElementEffect = () => {
        if (element === 'fire') {
          // Fire particles (reduced count for mobile)
          const particleCount = isSmallMobile ? 1 : isMobile ? 2 : 3;
          for (let i = 0; i < particleCount; i++) {
            const fireParticle = new PIXI.Graphics();
            fireParticle.beginFill(colors.primary);
            const particleSize = isSmallMobile
              ? Math.random() * 2 + 1
              : Math.random() * 3 + 2;
            fireParticle.drawCircle(0, 0, particleSize);
            fireParticle.endFill();
            fireParticle.x = Math.random() * app.screen.width;
            fireParticle.y = app.screen.height + 10;
            app.stage.addChild(fireParticle);

            const animate = () => {
              const moveSpeed = isSmallMobile
                ? Math.random() * 2 + 0.5
                : Math.random() * 3 + 1;
              const swaySpeed = isSmallMobile ? 1 : 2;
              fireParticle.y -= moveSpeed;
              fireParticle.x += (Math.random() - 0.5) * swaySpeed;
              fireParticle.alpha -= 0.01;

              if (fireParticle.alpha <= 0 || fireParticle.y < -10) {
                app.stage.removeChild(fireParticle);
                fireParticle.destroy();
              } else {
                requestAnimationFrame(animate);
              }
            };
            animate();
          }
        } else if (element === 'water') {
          // Water ripples (optimized for mobile)
          const ripple = new PIXI.Graphics();
          const lineWidth = isSmallMobile ? 1 : isMobile ? 1.5 : 2;
          const rippleSize = isSmallMobile ? 20 : isMobile ? 25 : 30;

          ripple.lineStyle(lineWidth, colors.primary, 0.6);
          ripple.drawCircle(0, 0, rippleSize);
          ripple.x = Math.random() * app.screen.width;
          ripple.y = Math.random() * app.screen.height;
          app.stage.addChild(ripple);

          const animate = () => {
            const scaleSpeed = isSmallMobile ? 0.025 : isMobile ? 0.028 : 0.03;
            const alphaSpeed = isSmallMobile ? 0.025 : isMobile ? 0.023 : 0.02;

            ripple.scale.x += scaleSpeed;
            ripple.scale.y += scaleSpeed;
            ripple.alpha -= alphaSpeed;

            if (ripple.alpha <= 0) {
              app.stage.removeChild(ripple);
              ripple.destroy();
            } else {
              requestAnimationFrame(animate);
            }
          };
          animate();
        } else if (element === 'earth') {
          // Earth crystals (optimized for mobile)
          const crystal = new PIXI.Graphics();
          crystal.beginFill(colors.primary);

          // Simplified crystal shape for mobile
          if (isSmallMobile) {
            crystal.drawPolygon([-3, 6, 3, 6, 5, 0, 3, -6, -3, -6, -5, 0]);
          } else if (isMobile) {
            crystal.drawPolygon([-4, 8, 4, 8, 6, 0, 4, -8, -4, -8, -6, 0]);
          } else {
            crystal.drawPolygon([-5, 10, 5, 10, 8, 0, 5, -10, -5, -10, -8, 0]);
          }

          crystal.endFill();
          crystal.x = Math.random() * app.screen.width;
          crystal.y = Math.random() * app.screen.height;
          crystal.alpha = 0.8;
          app.stage.addChild(crystal);

          const animate = () => {
            const moveSpeed = isSmallMobile ? 0.5 : isMobile ? 0.8 : 1;
            const rotationSpeed = isSmallMobile ? 0.03 : isMobile ? 0.04 : 0.05;

            crystal.y -= moveSpeed;
            crystal.rotation += rotationSpeed;
            crystal.alpha -= 0.01;

            if (crystal.alpha <= 0 || crystal.y < -20) {
              app.stage.removeChild(crystal);
              crystal.destroy();
            } else {
              requestAnimationFrame(animate);
            }
          };
          animate();
        }
      };

      // Start effect loops (optimized intervals for mobile)
      const energyInterval = setInterval(
        createEnergyWave,
        isSmallMobile ? 300 : isMobile ? 250 : 200
      );
      const sparkleInterval = setInterval(
        createSparkle,
        isSmallMobile ? 250 : isMobile ? 200 : 150
      );
      const elementInterval = setInterval(
        createElementEffect,
        isSmallMobile ? 400 : isMobile ? 350 : 300
      );

      return () => {
        clearInterval(energyInterval);
        clearInterval(sparkleInterval);
        clearInterval(elementInterval);
        if (app) {
          app.destroy(true);
        }
      };
    } catch (_error) {
      return undefined;
    }
  }, [isActive, element, elementColors, isMobile, isSmallMobile]);

  if (!isActive) return null;

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default BattleEffects;

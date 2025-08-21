import * as PIXI from 'pixi.js';
import React, { useEffect, useRef } from 'react';

interface BattleEffectsProps {
  isActive: boolean;
  element: 'fire' | 'water' | 'earth';
}

const BattleEffects: React.FC<BattleEffectsProps> = ({ isActive, element }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  const elementColors = {
    fire: { primary: 0xff4757, secondary: 0xff6b6b, glow: 0xff3838 },
    water: { primary: 0x3742fa, secondary: 0x5352ed, glow: 0x2f3542 },
    earth: { primary: 0x2ed573, secondary: 0x26de81, glow: 0x20bf6b },
  };

  useEffect(() => {
    if (!canvasRef.current || !isActive || !PIXI) return undefined;

    try {
      const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
      });

      if (app.view && app.view instanceof HTMLCanvasElement) {
        canvasRef.current.appendChild(app.view);
      }

      appRef.current = app;

    const colors = elementColors[element];

    // Create energy waves
    const createEnergyWave = () => {
      const wave = new PIXI.Graphics();
      wave.lineStyle(3, colors.primary, 0.8);
      wave.drawCircle(0, 0, 50);
      wave.x = Math.random() * app.screen.width;
      wave.y = Math.random() * app.screen.height;
      app.stage.addChild(wave);

      const animate = () => {
        wave.scale.x += 0.02;
        wave.scale.y += 0.02;
        wave.alpha -= 0.01;

        if (wave.alpha <= 0) {
          app.stage.removeChild(wave);
          wave.destroy();
        } else {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    // Create sparkles
    const createSparkle = () => {
      const sparkle = new PIXI.Graphics();
      sparkle.beginFill(colors.secondary);
      // Draw a simple star shape manually
      const points = [];
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const radius = i % 2 === 0 ? 10 : 5;
        points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      sparkle.drawPolygon(points);
      sparkle.endFill();
      sparkle.x = Math.random() * app.screen.width;
      sparkle.y = Math.random() * app.screen.height;
      sparkle.alpha = 0.8;
      app.stage.addChild(sparkle);

      const animate = () => {
        sparkle.y -= 2;
        sparkle.alpha -= 0.02;
        sparkle.rotation += 0.1;

        if (sparkle.alpha <= 0 || sparkle.y < -20) {
          app.stage.removeChild(sparkle);
          sparkle.destroy();
        } else {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    // Create element-specific effects
    const createElementEffect = () => {
      if (element === 'fire') {
        // Fire particles
        for (let i = 0; i < 3; i++) {
          const fireParticle = new PIXI.Graphics();
          fireParticle.beginFill(colors.primary);
          fireParticle.drawCircle(0, 0, Math.random() * 3 + 2);
          fireParticle.endFill();
          fireParticle.x = Math.random() * app.screen.width;
          fireParticle.y = app.screen.height + 10;
          app.stage.addChild(fireParticle);

          const animate = () => {
            fireParticle.y -= Math.random() * 3 + 1;
            fireParticle.x += (Math.random() - 0.5) * 2;
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
        // Water ripples
        const ripple = new PIXI.Graphics();
        ripple.lineStyle(2, colors.primary, 0.6);
        ripple.drawCircle(0, 0, 30);
        ripple.x = Math.random() * app.screen.width;
        ripple.y = Math.random() * app.screen.height;
        app.stage.addChild(ripple);

        const animate = () => {
          ripple.scale.x += 0.03;
          ripple.scale.y += 0.03;
          ripple.alpha -= 0.02;

          if (ripple.alpha <= 0) {
            app.stage.removeChild(ripple);
            ripple.destroy();
          } else {
            requestAnimationFrame(animate);
          }
        };
        animate();
             } else if (element === 'earth') {
         // Earth crystals
         const crystal = new PIXI.Graphics();
         crystal.beginFill(colors.primary);
         crystal.drawPolygon([-5, 10, 5, 10, 8, 0, 5, -10, -5, -10, -8, 0]);
         crystal.endFill();
        crystal.x = Math.random() * app.screen.width;
        crystal.y = Math.random() * app.screen.height;
        crystal.alpha = 0.8;
        app.stage.addChild(crystal);

        const animate = () => {
          crystal.y -= 1;
          crystal.rotation += 0.05;
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

    // Start effect loops
    const energyInterval = setInterval(createEnergyWave, 200);
    const sparkleInterval = setInterval(createSparkle, 150);
    const elementInterval = setInterval(createElementEffect, 300);

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
  }, [isActive, element, elementColors]);

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

import * as PIXI from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';
import { Element, GameState } from '../types';

// interface ElementalData {
//   rarity: string;
//   protection: number;
//   emoji: string;
// }

interface BattleAnimationPixiProps {
  gameState: GameState;
  opponentElement: Element;
  onAnimationComplete: () => void;
}

const BattleAnimationPixi: React.FC<BattleAnimationPixiProps> = ({
  gameState,
  opponentElement,
  onAnimationComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [, setPhase] = useState<
    'intro' | 'elements' | 'elementals' | 'clash' | 'result'
  >('intro');

  const { player, currentOpponent } = gameState;
  const playerElement = player.selectedElement as Element;
  // const playerElemental = player.selectedElemental
  //   ? getElementalData(playerElement, player.selectedElemental)
  //   : null;
  // const opponentElemental = currentOpponent?.elemental
  //   ? getElementalData(opponentElement, currentOpponent.elemental)
  //   : null;

  useEffect(() => {
    if (!canvasRef.current) return;

    // Создаем PIXI приложение
    const app = new PIXI.Application({
      view: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x0a0a0a,
      antialias: true,
    });

    appRef.current = app;

    // Создаем контейнеры для разных слоев
    const backgroundContainer = new PIXI.Container();
    const uiContainer = new PIXI.Container();
    const effectsContainer = new PIXI.Container();

    app.stage.addChild(backgroundContainer);
    app.stage.addChild(uiContainer);
    app.stage.addChild(effectsContainer);

    // Создаем фоновые эффекты
    const createBackgroundEffects = (container: PIXI.Container, pixiApp: PIXI.Application) => {
      // Создаем частицы энергии
      for (let i = 0; i < 50; i++) {
        const particle = new PIXI.Graphics();
        particle.beginFill(Math.random() > 0.5 ? 0x00ffff : 0xff00ff);
        particle.drawCircle(0, 0, Math.random() * 3 + 1);
        particle.endFill();

        particle.x = Math.random() * pixiApp.renderer.width;
        particle.y = Math.random() * pixiApp.renderer.height;
        particle.alpha = Math.random() * 0.5 + 0.3;

        container.addChild(particle);

        // Анимация частиц
        pixiApp.ticker.add(() => {
          particle.y -= 0.5;
          particle.x += Math.sin(particle.y * 0.01) * 0.5;

          if (particle.y < -10) {
            particle.y = pixiApp.renderer.height + 10;
            particle.x = Math.random() * pixiApp.renderer.width;
          }
        });
      }

      // Создаем магические круги
      const outerCircle = new PIXI.Graphics();
      outerCircle.lineStyle(2, 0xffffff, 0.1);
      outerCircle.drawCircle(0, 0, 200);
      outerCircle.x = pixiApp.renderer.width / 2;
      outerCircle.y = pixiApp.renderer.height / 2;
      container.addChild(outerCircle);

      const innerCircle = new PIXI.Graphics();
      innerCircle.lineStyle(1, 0xffffff, 0.05);
      innerCircle.drawCircle(0, 0, 150);
      innerCircle.x = pixiApp.renderer.width / 2;
      innerCircle.y = pixiApp.renderer.height / 2;
      container.addChild(innerCircle);

      // Анимация вращения кругов
      pixiApp.ticker.add(() => {
        outerCircle.rotation += 0.005;
        innerCircle.rotation -= 0.008;
      });
    };

    createBackgroundEffects(backgroundContainer, app);

    // Запускаем анимационную последовательность
    const startBattleSequence = () => {
      const timeline = [
        // Intro phase - show opponents
        { delay: 800, action: () => setPhase('intro') },

        // Complete
        { delay: 18000, action: onAnimationComplete },
      ];

      timeline.forEach(({ delay, action }) => {
        setTimeout(action, delay);
      });
    };

    startBattleSequence();

    // Обработка изменения размера окна
    const handleResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      app.destroy(true);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAnimationComplete]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10000 }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BattleAnimationPixi;

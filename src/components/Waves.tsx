import React, { FC } from 'react';
import Wave from 'react-wavify';
import { cn } from '@/utils/functions/mergeClasses';

interface WaveProps extends React.HTMLAttributes<SVGPathElement> {
  baseStartGradient?: string;
  baseEndGradient?: string;
  speed?: number;
  count?: number;
  offsetEnd?: string;
  paused?: boolean;
}

const Waves: FC<WaveProps> = ({
  className,
  baseStartGradient = '#2b91a3',
  baseEndGradient = '#00101e',
  offsetEnd = '65%',
  count = 5,
  speed = 0.03,
  paused = false,
  ...props
}) => {
  const settingsArray = Array.from({ length: count }, (_, index) => ({
    startColor: `${baseStartGradient}${50 + index * 6}`,
    speed: speed * (index + 2),
    points: Math.floor(Math.random() * (5 - 3 + 1)) + 3,
  }));

  return settingsArray.map(({ startColor, speed, points }, index) => {
    return (
      <Wave
        className={cn('absolute h-full', className)}
        key={index}
        fill="url(#gradient)"
        paused={paused}
        options={{
          height: 100,
          amplitude: 40,
          speed,
          points,
        }}
        {...props}
      >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={startColor} />
            <stop offset={offsetEnd} stopColor={baseEndGradient} />
          </linearGradient>
        </defs>
      </Wave>
    );
  });
};

export { Waves };

'use client';

import { useEffect, useState } from 'react';

import logo from '@/../public/svg/Logo.svg';
import MetallicPaint, { parseLogoImage } from '@/components/MetallicPaint';

let cachedLogoImageData: ImageData | null = null;
let logoImagePromise: Promise<ImageData | null> | null = null;

const loadLogoImageData = async () => {
  if (cachedLogoImageData) {
    return cachedLogoImageData;
  }

  if (!logoImagePromise) {
    logoImagePromise = (async () => {
      const response = await fetch(logo.src);
      const blob = await response.blob();
      const file = new File([blob], 'default.png', { type: blob.type });
      const parsedData = await parseLogoImage(file);

      cachedLogoImageData = parsedData?.imageData ?? null;

      return cachedLogoImageData;
    })().catch((error) => {
      logoImagePromise = null;
      throw error;
    });
  }

  return logoImagePromise;
};

const scheduleWhenIdle = (callback: () => void) => {
  if (typeof window.requestIdleCallback === 'function') {
    const idleCallbackId = window.requestIdleCallback(callback);

    return () => window.cancelIdleCallback(idleCallbackId);
  }

  const timeoutId = globalThis.setTimeout(callback, 1);

  return () => {
    globalThis.clearTimeout(timeoutId);
  };
};

const Logo = () => {
  const [imageData, setImageData] = useState<ImageData | null>(
    cachedLogoImageData
  );
  const [canRender, setCanRender] = useState(Boolean(cachedLogoImageData));

  useEffect(() => {
    let isMounted = true;

    if (cachedLogoImageData) {
      return;
    }

    const cancelScheduledLoad = scheduleWhenIdle(() => {
      void loadLogoImageData()
        .then((nextImageData) => {
          if (!isMounted) {
            return;
          }

          setImageData(nextImageData);
          setCanRender(Boolean(nextImageData));
        })
        .catch((error) => {
          console.error('Error loading default image:', error);
        });
    });

    return () => {
      isMounted = false;
      cancelScheduledLoad();
    };
  }, []);

  return (
    <div
      className={`w-28 h-28 transition duration-500 ${canRender ? 'opacity-80' : 'opacity-0'}`}
    >
      {imageData && imageData.data && (
        <MetallicPaint
          imageData={imageData}
          params={{
            edge: 0.2,
            patternBlur: 0.005,
            patternScale: 5,
            refraction: 0.02,
            speed: 0.1,
            liquid: 1,
          }}
        />
      )}
    </div>
  );
};

Logo.displayName = 'Logo';

export { Logo };

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useImageGrid } from './hooks/use-image-grid';
import RippleEffect from './ripple-effect';

import s from './banner.module.scss';

const Banner: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rippleEffect = useRef<RippleEffect>();
    const { init, image } = useImageGrid();

    const gridFallback = useMemo(() => {
        if (!image) return null;

        return (
            <img src={image} className={s.root__image} />
        );
    }, [image]);

    useLayoutEffect(() => {
        init(containerRef.current!)
    }, []);

    useLayoutEffect(() => {
        if (containerRef.current && image) {
            rippleEffect.current = new RippleEffect({
                parent: containerRef.current,
                texture: image,
                intensity: 0.3
            });
        }

        return () => {
            rippleEffect.current?.dispose();
        }
    }, [image]);

    return (
        <div ref={containerRef} className={s.root}>
            {gridFallback}
        </div>
    );
};

export default Banner;


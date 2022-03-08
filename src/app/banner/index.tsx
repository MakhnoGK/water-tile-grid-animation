import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useImageGrid } from './hooks/use-image-grid';

import s from './banner.module.scss';

const Banner: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { init, image } = useImageGrid();

    const gridFallback = useMemo(() => {
        if (!image) return null;

        return (
            <img src={image} className={s.root__image} />
        );
    }, [image]);

    useLayoutEffect(() => {
        init(containerRef.current!);
    }, []);

    return (
        <div ref={containerRef} className={s.root}>
            {gridFallback}
        </div>
    );
};

export default Banner;


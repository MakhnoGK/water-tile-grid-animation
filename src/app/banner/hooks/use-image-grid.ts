import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { ImageGrid, ImageData, Vector2 } from '../banner.types';
import BannerApi from '../banner.api';
import * as MathUtils from '../../../utils/math.utils';

const EXPECTING_TILE_SIZE = 100;

export const useImageGrid = () => {
    const [container, setContainer] = useState<HTMLDivElement>();
    const [dimmensions, setDimensions] = useState<Vector2>();
    const [image, setImage] = useState<string>();
    const [size, setSize] = useState<Vector2>();

    const init = useCallback((container: HTMLDivElement) => {
        if (container) setContainer(container);
    }, []);

    const getImageUrls = useCallback(async () => {
        const response = await BannerApi.getPhotos();

        return response.reduce<ImageData[]>((acc, curr) => {
            acc.push({ id: curr.id, download_url: curr.download_url });

            return acc;
        }, []);
    }, []);

    const getImages = useCallback(async () => {
        const imageUrls = await getImageUrls();

        return imageUrls?.map(({ download_url }) => new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = '';
            img.onload = () => resolve(img);
            img.onerror = () => reject(`Can't load image ${download_url}`);
            img.src = download_url;
        })).sort(() => Math.random() - 0.5);
    }, []);

    const generateGrid = useCallback(async (options: ImageGrid): Promise<string> => {
        const response = await getImages();
        const images = await Promise.all(response);

        const canvas = document.createElement('canvas');
        canvas.width = options.size.x;
        canvas.height = options.size.y;

        const ctx = canvas.getContext('2d');
        ctx!.fillStyle = '#000';

        for (let k = 0; k < options.dimmensions.y; k++) {
            for (let i = 0; i < options.dimmensions.x; i++) {
                try {
                    ctx!.fillRect(
                        options.tile.x * i,
                        options.tile.y * k,
                        options.tile.x,
                        options.tile.y
                    );

                    ctx!.drawImage(
                        images[MathUtils.range(0, images.length)],
                        options.tile.x * i,
                        options.tile.y * k,
                        options.tile.x,
                        options.tile.y
                    );
                } catch (error) {
                    console.warn(`Error drawing image at [${k}, ${i}]! Details: ${error}`);
                }
            }
        }

        return new Promise((resolve, reject) => {
            try {
                resolve(canvas.toDataURL('image/jpeg', 1));
            } catch (error) {
                reject(`Can't create tile grid: ${error}`);
            }
        });
    }, []);

    const resizeCallback = useCallback(() => {
        if (container) {
            const { width, height } = container.getBoundingClientRect();

            setDimensions({
                x: Math.ceil(width / EXPECTING_TILE_SIZE),
                y: Math.ceil(height / EXPECTING_TILE_SIZE)
            });
            setSize({ x: width, y: height });
        }
    }, [container]);

    const resizeHandler = debounce(resizeCallback, 200);

    useEffect(() => {
        if (container) {
            resizeCallback();

            window.addEventListener('resize', resizeHandler);
        }

        return () => {
            window.removeEventListener('resize', resizeHandler);
        }
    }, [container]);

    useEffect(() => {
        if (dimmensions && size) {
            try {
                generateGrid({
                    size, dimmensions, tile: {
                        x: size.x / dimmensions.x,
                        y: size.y / dimmensions.y
                    }
                }).then((image) => {
                    setImage(image);
                });
            } catch (error) {
                console.warn(`Error generating tile grid: ${error}`);
            }
        }
    }, [size]);

    return {
        image,
        init
    };
};


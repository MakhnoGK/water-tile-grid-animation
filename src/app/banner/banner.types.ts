export interface ImageData {
    id: string | number;
    download_url: string;
}

export interface ImageGrid {
    dimmensions: Vector2;
    size: Vector2;
    tile: Vector2;
    texture?: string;
}

export interface Vector2 {
    x: number;
    y: number;
}

type Easing =
    | 'Expo.none'
    | 'Expo.easeOut'
    | 'Expo.power1'
    | 'Expo.power2'
    | 'Expo.power3'
    | 'Expo.power4'
    | 'Expo.back'
    | 'Expo.elastic'
    | 'Expo.bounce'
    | 'Expo.rough'
    | 'Expo.slow'
    | 'Expo.steps'
    | 'Expo.circ'
    | 'Expo.expo'
    | 'Expo.sine';

export interface RippleOptions {
    container: HTMLElement;
    intensity?: number;
    strength?: number;
    area?: number;
    waveSpeed?: number;
    speedIn?: number;
    speedOut?: number;
    easing?: Easing;
    hover?: boolean;
}

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


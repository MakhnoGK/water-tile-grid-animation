export interface ImageData {
    id: string | number;
    download_url: string;
}

export interface ImageGrid {
    /**
     * Number of tiles per row/col
     */
    dimmensions: Vector2;
    /**
     * Grid size in pixels
     */
    size: Vector2;
    /**
     * Single tile size
     */
    tile: Vector2;
}

export interface Vector2 {
    x: number;
    y: number;
}


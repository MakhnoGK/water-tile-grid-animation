import ApiClient from '../../lib/api';
import { ImageData } from './banner.types';
import { LIST_PHOTOS } from '../../constants/api.constants';

import img1 from './assets/img-1.jpg';
import img2 from './assets/img-2.jpg';
import img3 from './assets/img-3.jpg';
import img4 from './assets/img-4.jpg';
import img5 from './assets/img-5.jpg';

class BannerApi {
    public static async getPhotos(): Promise<ImageData[]> {
        const response = await ApiClient.get(LIST_PHOTOS());
        return await response.json();
    }
}

export default BannerApi;


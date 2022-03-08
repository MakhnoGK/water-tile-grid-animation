import ApiClient from '../../lib/api';
import { ImageData } from './banner.types';
import { LIST_PHOTOS } from '../../constants/api.constants';

class BannerApi {
    public static async getPhotos(): Promise<ImageData[]> {
        const response = await ApiClient.get(LIST_PHOTOS());
        return await response.json();
    }
}

export default BannerApi;


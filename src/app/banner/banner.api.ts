import ApiClient from '../../lib/api';
import { LIST_PHOTOS } from '../../constants/api.constants';

class BannerApi {
    public static async getPhotos() {
        const response = await ApiClient.get(LIST_PHOTOS());
        return await response.json();
    }
}

export default BannerApi;


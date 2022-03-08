import React, {useEffect} from 'react';
import BannerApi from './banner.api';

const Banner: React.FC = () => {
    useEffect(() => {
        BannerApi.getPhotos().then((data) => {
            console.log(data);
        });
    }, []);

    return (<div />);
};

export default Banner;


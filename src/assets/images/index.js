

import facebook from './png_elements/facebook-48.png'
import online_store from './png_elements/online-shop-48.png'
import physical_store from './png_elements/store-48.png'
import instagram from './png_elements/instagram-48.png'
import whatsapp from './png_elements/whatsapp-48.png'
import twitter from './png_elements/twitterx-48.png'
import flutterwave_store from './png_elements/flutterwave-store.png'
import others from './png_elements/others-48.png'
import jiji from './png_elements/jiji.png'
import jumia from './png_elements/jumia.jpeg'
import konga from './png_elements/konga.jpeg'


export {
    facebook, 
    online_store, 
    physical_store, 
    instagram,
    whatsapp, 
    twitter, 
    flutterwave_store, 
    others, 
    jiji, 
    jumia, 
    konga
}

// FUNCTION THAT RETURN THE IMAGE BASED OF THE ASKED IMAGE (IMGTYPE)
export function imgString(imgType) {
    if (imgType === 'online store') return online_store;
    if (imgType === 'facebook') return facebook;
    if (imgType === 'physical shop') return physical_store;
    if (imgType === 'instagram') return instagram;
    if (imgType === 'whatsapp') return whatsapp;
    if (imgType === 'twitter') return twitter;
    if (imgType === 'flutterwave store') return flutterwave_store;
    if (imgType === 'jiji') return jiji;
    if (imgType === 'jumia') return jumia;
    if (imgType === 'konga') return konga;
    if (imgType === 'others') return others;
}
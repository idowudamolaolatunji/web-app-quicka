

import facebook from './facebook-48.png'
import online_store from './online-shop-48.png'
import physical_store from './store-48.png'
import instagram from './instagram-48.png'
import whatsapp from './whatsapp-48.png'
import twitter from './twitterx-48.png'
import flutterwave_store from './flutterwave-store.png'
import others from './others-48.png'
import jiji from './jiji.png'
import jumia from './jumia.jpeg'
import konga from './konga.jpeg'


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
    if (imgType === 'flutterwave') return flutterwave_store;
    if (imgType === 'jiji') return jiji;
    if (imgType === 'jumia') return jumia;
    if (imgType === 'konga') return konga;
    if (imgType === 'others') return others;
}
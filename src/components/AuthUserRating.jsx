import React from 'react';
import { Rating } from '@mui/material';

import img_user1 from '../assets/images/user_faces/user-img.jpg'
import img_user2 from '../assets/images/user_faces/user-img2.jpg'
import img_user3 from '../assets/images/user_faces/user-img3.jpg'
import img_user0 from '../assets/images/user_faces/user-img4.jpg'


function AuthUserRating() {
    return (
        <div className='auth--right-details'>
            <div className="auth--right-users">
                <img src={img_user0} />
                <img src={img_user1} />
                <img src={img_user2} />
                <img src={img_user3} />
            </div>

            <span className='auth--right-rating'>
                <span>
                    <Rating name="read-only" value={5} readOnly />
                    <p>5.0</p>
                </span>
                <p>from 20+ businesses</p>
            </span>
        </div>
    )
}

export default AuthUserRating
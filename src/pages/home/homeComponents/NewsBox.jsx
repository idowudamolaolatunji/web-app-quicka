import React from 'react';

// import news_mask from "../../../assets/images/resources/new-mask.png"

function NewsBox() {
    return (
        <section className='card news-section'>
            <div className="section--heading">
                <h2>News and Updates</h2>
                <p>Three new & recent order for you!</p>
            </div>

            {/* <img src={news_mask} alt="" style={{ marginTop: "2rem", borderRadius: "0.4rem"}} /> */}
        </section>
    )
}

export default NewsBox
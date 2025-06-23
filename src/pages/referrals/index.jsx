import React from 'react'
import ComingSoon from '../../components/layout/ComingSoon';


function index() {

    useEffect(function () {
        document.title = "Quicka - Referals | Business Management Tool for SME's";
        window.scrollTo(0, 0);
    }, [])
  
  return (
    <React.Fragment>
        {/*
        <div className='page__section--heading'>
            <h2 className="page__section--title">Referrals</h2>
        </div>
        */}

        <ComingSoon feature="Referrals" navigateBack={false} />
    </React.Fragment>
  )
}

export default index

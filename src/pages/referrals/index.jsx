import React from 'react'
// import ConnectionError from '../../components/layout/ConnectionError';
import ComingSoon from '../../components/layout/ComingSoon';


function index() {
  // const { globalConnectionError } = useFetchedContext();
  
  return (
    <React.Fragment>
      {/* {globalConnectionError && <ConnectionError /> }
      <div className='page__section--heading'>
        <h2 className="page__section--title">Referrals</h2>
      </div> */}

      <ComingSoon feature="Referrals" />
    </React.Fragment>
  )
}

export default index

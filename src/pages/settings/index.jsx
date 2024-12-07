import React from 'react'
import { useFetchedContext } from '../../context/FetchedContext';
import ConnectionError from '../../components/ConnectionError';

function index() {
  const { globalConnectionError } = useFetchedContext();

  return (
    <>
      {globalConnectionError && <ConnectionError />}
      <div className='page__section--heading'>
        <h2 className="page__section--title">Settings</h2>
      </div>
    </>
  )
}

export default index
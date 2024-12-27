import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { useWindowSize } from 'react-use'

function ProductCardSkeleton() {
  const { width } = useWindowSize();

  return (
    <div className='product__figure'>
        <Skeleton height={width < 450 ? 120 : 200} />
        <div>
            <Skeleton height={10} />
            <div style={{ width: "45%" }}>
              <Skeleton height={10} />
            </div>
        </div>
        <div style={{ width: "70%" }}>
            <Skeleton height={10} />
            <Skeleton height={10} />
        </div>

        <div className='product__figure--actions'>
            <Skeleton height={40} width={width < 450 ? 35 : 75} />
            <Skeleton height={40} width={width < 450 ? 35 : 75} />
        </div>
    </div>
  )
}

export default ProductCardSkeleton
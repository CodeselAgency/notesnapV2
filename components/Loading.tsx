import React from 'react'
import Image from 'next/image'
const Loading = () => {
  return (
    <div>
        <Image src="/images/loading.gif" alt="loading" width={100} height={100} />
    </div>
  )
}

export default Loading
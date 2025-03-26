import React from 'react'
import { DotLoader} from 'react-spinners'

const StaticLoader = () => {
       return (
              <>
                     <div className='w-full h-full flex justify-center items-center'>
                            <DotLoader color='#0D47A1' size={60} />
                     </div>
              </>
       )
}

export default StaticLoader
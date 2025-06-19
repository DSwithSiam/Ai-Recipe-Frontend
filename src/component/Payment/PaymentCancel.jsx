import React from 'react'
import { Link } from 'react-router-dom'

function PaymentCancel() {
  return (
    <div className='flex justify-center items-center h-screen '>

        <div className='flex flex-col items-center justify-center'>
            <p className='text-red-400 text-center text-2xl'>Something error....</p>
             <Link to='/'>
            <button className='bg-[#5B21BD] text-white rounded-lg px-6 py-2 mt-4 text-lg font-semibold transition-opacity cursor-pointer w-26 '>
                Back
            </button>
        </Link>
        </div>
    </div>
  )
}

export default PaymentCancel
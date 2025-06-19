import React from 'react'

export const Chat = () => {

    const handlesubmit = (data) =>{

        const response = createMssage({message:data}).unwrap()
    }
  return (
    <div>



    <input
    onSubmit={handlesubmit}
    type="text" />

    </div>
  )
}

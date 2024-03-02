import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className='flex-1 flex justify-center flex-col'>
        <h2 className='text-2xl'>Learn More about Java</h2>
        <p className='text-gary-500 my-2'>Check out Java Project 100+ on the internet</p>
        <Button className='rounded-tl-xl rounded-bl-none' gradientDuoTone="purpleToPink">
            <a href='#' target='_blank' rel='noopener noreferrer'>My Projects</a>
        </Button>
      </div>
      <div className='p-7 flex-1'>
        <img src='https://miro.medium.com/v2/resize:fit:1200/1*LyZcwuLWv2FArOumCxobpA.png'/>
      </div>
    </div>
  )
}

export default CallToAction

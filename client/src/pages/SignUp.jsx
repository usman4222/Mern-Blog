import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to="/" className=' text-4xl font-bold dark:text-white'>
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Daily</span>Blog
          </Link>
          <p className='text-sm mt-5'>Find the right instructor for you. Choose from many topics, skill levels, and languages. Download To Your Phone. Courses in 75 Languages. Learn ChatGPT. Stay Updated with AI.
          </p>
        </div>
        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4'>
            <div>
              <Label value='Your Username' />
              <TextInput
                type='text'
                placeholder='username'
                id='username'
              />
            </div>
            <div>
              <Label value='Your Email' />
              <TextInput
                type='text'
                placeholder='Email'
                id='email'
              />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput
                type='text'
                placeholder='Password'
                id='Password'
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit'>Sign Up</Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span >Have an Account?</span>
            <Link className='text-blue-500' to="/sign-in">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp

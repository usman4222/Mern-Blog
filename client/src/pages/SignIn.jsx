import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../components/OAuth'

const SignIn = () => {

  const [formData, setFormData] = useState({})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error: errorMessage, user } = useSelector(state => state.user)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }

  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"))
    }
    try {
      dispatch(signInStart())
      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      console.log("This is user data", data);
      if (data.success === false) {
        dispatch(signInFailure(data.message))
      }
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

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
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Email' />
              <TextInput
                type='email'
                placeholder='Email'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput
                type='password'
                placeholder='********'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : 'Sign In'}
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span >Don't have an Account?</span>
            <Link className='text-blue-500' to="/sign-up">Sign Up</Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color="failure" >
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignIn

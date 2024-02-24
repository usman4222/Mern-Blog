import { Button, TextInput } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux'

const DashProfile = () => {

    const { currentUser } = useSelector(state => state.user)

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    <img src={currentUser.profileImage} alt="user" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
                </div>
                <TextInput
                    type='text'
                    id='username'
                    placeholder='username'
                    defaultValue={currentUser.username}
                />
                <TextInput
                    type='email'
                    id='email'
                    placeholder='email'
                    defaultValue={currentUser.email}
                />
                <TextInput
                    type='password'
                    id='password'
                    placeholder='password'
                />
                <Button type='submit' gradientDuoTone="purpleToBlue" outline>Update</Button>
            </form>
            <div className='flex justify-between mt-5 mb-10 md:mb-0'>
                <span className='px-3 py-2 cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Delete</span>
                <span className='px-3 py-2 cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Sign Out</span>
            </div>
        </div>
    )
}

export default DashProfile

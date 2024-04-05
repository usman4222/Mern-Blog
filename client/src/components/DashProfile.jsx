import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { app } from '../firebase'
import { Link } from 'react-router-dom'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {
    updateFailure,
    updateStart,
    updateSuccess,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutSuccess
} from '../redux/user/userSlice'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const DashProfile = () => {

    const { currentUser, error, loading } = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const filePickerRef = useRef()
    const dispatch = useDispatch()
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [delShowModal, setDelShowModal] = useState(false)

    //fire base rule for image*********
    //     rules_version = '2';
    // service firebase.storage {
    //         match / b / { bucket } / o {
    //             match / { allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //                     request.resource.contentType.matches('image/.*')
    //     }
    //         }
    //     }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }

    const uploadImage = async () => {
        setImageFileUploading(true)
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError('Could not Upload image (File must be less than 2MB')
                setImageFileUploadProgress(null)
                setImageFile(null)
                setImageFileUrl(null)
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                    setFormData({
                        ...formData, profileImage: downloadURL
                    })
                    setImageFileUploading(false)
                })
            }
        )
    }

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdateUserError(null)
        setUpdateUserSuccess(null)
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes occur.")
            return
        }
        if (imageFileUploading) {
            setUpdateUserError("Please with to upload image.")
            return
        }
        try {
            dispatch(updateStart())
            const res = await fetch(`https://blog-backend-ashen.vercel.app/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) {
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
            }
            else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User Updated Successfully.")
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message)
        }
    }

    const handleDeleteUser = async () => {
        setDelShowModal(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`https://blog-backend-ashen.vercel.app/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message))
            }
            else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignOut = async () => {
        try {
            const res = await fetch('https://blog-backend-ashen.vercel.app/api/user/signout', {
                method: 'POST'
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(error.message);
            } else {
                setShowModal(false)
                dispatch(signOutSuccess())
            }
        } catch (error) {

        }
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />
                <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`
                                }
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profileImage}
                        alt="user"
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
                        ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
                    />
                </div>
                {imageFileUploadError && (
                    <Alert className='failure'>
                        {imageFileUploadError}
                    </Alert>
                )}
                <TextInput
                    type='text'
                    id='username'
                    placeholder='username'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput
                    type='email'
                    id='email'
                    placeholder='email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    type='password'
                    id='password'
                    placeholder='******'
                    onChange={handleChange}
                />
                <Button
                    type='submit'
                    gradientDuoTone="purpleToBlue"
                    outline
                    disabled={loading || imageFileUploading}
                >
                    {loading ? 'Loading...' : 'Update'}
                </Button>
                {currentUser.isAdmin && (
                    <Link to={'/create-post'}>
                        <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
                            Create a post
                        </Button>
                    </Link>
                )}
            </form>
            <div className='flex justify-between mt-5 mb-10 md:mb-0'>
                <span onClick={() => setDelShowModal(true)} className='px-3 py-2 cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Delete</span>
                <span onClick={() => setShowModal(true)} className='px-3 py-2 cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color="success" className='mt-5'>{updateUserSuccess}</Alert>
            )}
            {updateUserError && (
                <Alert color="failure" className='mt-5'>{updateUserError}</Alert>
            )}
            {error && (
                <Alert color="failure" className='mt-5'>{error}</Alert>
            )}
            <Modal show={delShowModal} onClose={() => setDelShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gary-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-4 text-gray-500 text-lg dark:text-gary-400'>Are you sure to delete your account?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button onClick={handleDeleteUser} color='failure'>Yes, I'm sure</Button>
                            <Button onClick={() => setDelShowModal(false)} color='gray'>No, Cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gary-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-4 text-gray-500 text-lg dark:text-gary-400'>Are you sure to Sign Out?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button onClick={handleSignOut} color='failure'>Yes, I'm sure</Button>
                            <Button onClick={() => setShowModal(false)} color='gray'>No, Cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashProfile

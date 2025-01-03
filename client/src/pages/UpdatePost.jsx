import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';

const UpdatePost = () => {

    const { currentUser } = useSelector((state) => state.user)
    const [file, setFile] = useState()
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)
    const navigate = useNavigate()
    const { postId } = useParams()

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await fetch(`https://mern-blog-brown-beta.vercel.app/api/post/getposts?postId=${postId}`);
                const data = await res.json()
                if (!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message)
                    return
                }
                if (res.ok) {
                    setPublishError(null)
                    setFormData(data.posts[0])
                }
            }
            fetchPost()
        } catch (error) {
            console.log(error);
        }
    }, [postId])

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError("Please select an image")
                return
            }
            setImageUploadError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name
            const storageRef = ref(storage, fileName)
            const uploadedTask = uploadBytesResumable(storageRef, file)
            uploadedTask.on(
                'state_changed',
                (snapshot) => {
                    const progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setImageUploadProgress(progess.toFixed(0))
                },
                (error) => {
                    setImageUploadError('Image upload failed')
                    setImageUploadProgress(null)
                }
                , () => {
                    getDownloadURL(uploadedTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadError(null)
                        setImageUploadProgress(null)
                        setFormData({ ...formData, image: downloadURL })
                    })
                }
            )
        } catch (error) {
            setImageUploadError("Image Upload Failed")
            setImageUploadProgress(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`https://mern-blog-brown-beta.vercel.app/api/post/updatepost/${postId}/${currentUser.user._id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) {
                setPublishError(data.message)
                return
            }
            if (res.ok) {
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setPublishError('Something went wrong')
        }
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl py-7 font-semibold'>Update Post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        value={formData.title}
                    />
                    <Select
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        value={formData.category}
                    >
                        <option value="uncategorized">Select a Categpory</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </Select>
                </div>
                <div className='flex justify-between items-center gap-4 border-4 border-teal-500 border-dotted p-3'>
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button
                        type='button'
                        gradientDuoTone="purpleToBlue"
                        size="sm"
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {
                            imageUploadProgress ? (
                                <div className='w-16 h-16'>
                                    <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                                </div>
                            ) : (
                                'Upload Image'
                            )
                        }
                    </Button>
                </div>
                {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required
                    onChange={(value) => { setFormData({ ...formData, content: value }) }}
                    value={formData.content}
                />
                <Button type='submit' gradientDuoTone="purpleToPink" className='mb-5'>Update Post</Button>
                {
                    publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>
                }
            </form>
        </div>
    )
}

export default UpdatePost

import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Comments from './Comments';

const CommentSection = ({ postId }) => {

    const { currentUser } = useSelector((state) => state.user)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])
    const [commentError, setCommentError] = useState(null)
    // console.log(comments);

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (comment.length > 200) {
            return
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
            })
            const data = await res.json()
            if (res.ok) {
                setComment('')
                setCommentError(null)
                setComments([data, ...comments])
            }
        } catch (error) {
            setCommentError(error.message)
            console.log(error);
        }
    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getpostcomments/${postId}`);
                if (res.ok) {
                    const data = await res.json()
                    setComments(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getComments();
    }, [postId]);


    return (
        <div className='max-w-xl mx-auto p-3 w-full'>
            {
                currentUser ? (
                    <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                        <p>Signed In</p>
                        <img className="h-5 w-5 object-cover rounded-full" src={currentUser.profileImage} />
                        <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                            @{currentUser.username}
                        </Link>
                    </div>
                ) : (
                    <div className='text-teal-500 text-sm my-5 flex gap-1'>
                        You must be login to comment.
                        <Link to={'/sign-in'} className='text-blue-500 hover:underline'>Sin In</Link>
                    </div>
                )
            }
            {currentUser && (
                <form className='border border-tael-500 rounded-md p-3' onSubmit={handleSubmit}>
                    <Textarea
                        placeholder='Add a comment'
                        row='3'
                        maxLength='200'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>{200 - comment.length} Characters remaining</p>
                        <Button outline gradientDuoTone='purpleToBlue' type='submit'>Submit</Button>
                    </div>
                    {commentError && (<Alert color='failure' className='mt-5'>{commentError}</Alert>)}
                </form>
            )}
            {comments.length === 0 ? (
                <p className='text-sm my-5'>No Comment Yet</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map((comment) => (
                        <Comments key={comment._id} comment={comment} />
                    ))}
                </>
            )}
        </div>
    )
}

export default CommentSection

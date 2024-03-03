import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const Comments = ({ comment, onLike }) => {

    const [user, setUser] = useState({})
    const { currentUser } = useSelector((state) => state.user)
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json()
                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser()
    }, [comment])
    // console.log('Comment ID:', comment._id);
    // console.log('Comment Likes:', comment.likes);
    // console.log('Current User ID:', currentUser ? currentUser._id : 'No Current User');
    // console.log('Is Liked:', currentUser && comment.likes.includes(currentUser._id));


    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='mr-3 flex-shrink-0'>
                <img className='w-10 h-10 rounded-full bg-gray-500' src={user.profileImage} alt={user.username} />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : 'anonymous user'}</span>
                    <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                <div>
                    <p className='text-gray-500 pb-2'>{comment.content}</p>
                </div>
                <div className='flex items-center gap-2 pt-2 text-xs max-w-fit'>
                    <button
                        type='button'
                        onClick={() => onLike(comment._id)}
                        className={`text-gray-400 hover:text-blue-500 ${currentUser &&
                            comment.likes.includes(currentUser._id) &&
                            '!text-blue-500'
                            }`}
                    >
                        <FaThumbsUp className='text-sm' />
                    </button>
                    <p className='text-gray-400'>
                        {comment.numberOfLikes > 0 &&
                            comment.numberOfLikes +
                            ' ' +
                            (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                    </p>
                </div>
            </div>
        </div >
    )
}

export default Comments

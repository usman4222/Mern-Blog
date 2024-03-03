import { current, isAction } from '@reduxjs/toolkit'
import { Button, Modal, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Post from '../../../api/models/postModel'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck, FaTimes } from 'react-icons/fa'

const DashComments = () => {

    const { currentUser } = useSelector((state) => state.user)
    const [comments, setComments] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [commentIdToDelete, setCommentIdToDelete] = useState(null)

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    if (data.comments.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchComments();
        }
    }, []);

    const handleShowMore = async () => {
        const startIndex = comments.length
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
            const data = await res.json()
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments])
                if (data.comments.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteComment = async () => {
        setShowModal(false)
        try {
            const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete))
                setShowModal(false)
            }
            else {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete))
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && (comments && comments.length) > 0 ? (
                <>
                    <Table className='shadow-md' hoverable>
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Comment Content</Table.HeadCell>
                            <Table.HeadCell>No of Likes</Table.HeadCell>
                            <Table.HeadCell>Post Id</Table.HeadCell>
                            <Table.HeadCell>User Id</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {comments.map((comment) => (
                            <Table.Body className='divide-y' key={comment._id} >
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(comment.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.content}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell>{comment.postId}</Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                            onClick={() => {
                                                setShowModal(true)
                                                setCommentIdToDelete(comment._id)
                                            }}
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    <div className='flex justify-center mt-5'>
                        {showMore && (
                            <Button onClick={handleShowMore} gradientDuoTone="purpleToPink" className='mb-5  text-white self-center text-sm px-4 py-2'>Show More</Button>
                        )}
                    </div>
                </>
            ) : <p>You have not comments yet.</p>}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gary-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-4 text-gray-500 text-lg dark:text-gary-400'>Are you sure to delete this Comment?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button onClick={handleDeleteComment} color='failure'>Yes, I'm sure</Button>
                            <Button onClick={() => setShowModal(false)} color='gray'>No, Cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>

    )
}

export default DashComments 

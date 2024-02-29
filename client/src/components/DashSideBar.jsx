import { Button, Modal, Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiArrowRight, HiDocumentText, HiOutlineExclamationCircle, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { signOutSuccess } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'

const DashSideBar = () => {

    const location = useLocation()
    const [tab, setTab] = useState('')
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.user)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFormUrl = urlParams.get('tab')
        if (tabFormUrl) {
            setTab(tabFormUrl)
        }
    }, [location.search])

    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST'
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(error.message);
            } else {
                dispatch(signOutSuccess())
            }
        } catch (error) {

        }
    }

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item active={tab === "profile"} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor="dark" as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && (
                        <Link to="/dashboard?tab=posts">
                            <Sidebar.Item active={tab === "posts"} icon={HiDocumentText} labelColor="dark" as='div'>
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}
                    <Sidebar.Item icon={HiArrowRight} className="cursor-pointer" onClick={() => setShowModal(true)}>
                        Sign Out
                    </Sidebar.Item>
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
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSideBar

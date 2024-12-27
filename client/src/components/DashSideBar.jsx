import { Button, Modal, Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiAnnotation, HiArrowRight, HiChartPie, HiDocumentText, HiOutlineExclamationCircle, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { signOutSuccess } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'

const DashSideBar = () => {

    const location = useLocation()
    const [tab, setTab] = useState('')
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.user)
    const [showModal, setShowModal] = useState(false)

    console.log("This is current user",currentUser.user);
    

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFormUrl = urlParams.get('tab')
        if (tabFormUrl) {
            setTab(tabFormUrl)
        }
    }, [location.search])

    const handleSignOut = async () => {
        try {
            const res = await fetch('https://mern-blog-brown-beta.vercel.app/api/user/signout', {
                method: 'POST',
                credentials: 'include',
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
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    {currentUser && currentUser.user && currentUser.user.isAdmin && (
                        <Link to="/dashboard?tab=dash">
                            <Sidebar.Item active={tab === "dash" || !tab} icon={HiChartPie} labelColor="dark" as='div'>
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )}
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item active={tab === "profile"} icon={HiUser} label={currentUser && currentUser.user && currentUser.user.isAdmin ? 'Admin' : 'User'} labelColor="dark" as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser && currentUser.user && currentUser.user.isAdmin && (
                        <Link to="/dashboard?tab=posts">
                            <Sidebar.Item active={tab === "posts"} icon={HiDocumentText} labelColor="dark" as='div'>
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser && currentUser.user && currentUser.user.isAdmin && (
                        <Link to="/dashboard?tab=comments">
                            <Sidebar.Item active={tab === "comments"} icon={HiAnnotation} labelColor="dark" as='div'>
                                Comments
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser && currentUser.user && currentUser.user.isAdmin && (
                        <Link to="/dashboard?tab=users">
                            <Sidebar.Item active={tab === "users"} icon={HiOutlineUserGroup} labelColor="dark" as='div'>
                                Users
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

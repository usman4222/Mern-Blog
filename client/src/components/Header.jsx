import { Avatar, Button, Dropdown, Modal, Navbar, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import DashBoard from '../pages/DashBoard'
import { toogleTheme } from '../redux/theme/themeSlice'
import { signOutSuccess } from '../redux/user/userSlice'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const Header = () => {

    const path = useLocation().pathname
    const { currentUser } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const { theme } = useSelector(state => state.theme)
    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
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
                setShowModal(false)
                dispatch(signOutSuccess())
            }
        } catch (error) {

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    return (
        <Navbar className='border-b-2'>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Daily</span>Blog
            </Link>
            <form onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Search'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <Link to={'/search'}>
                <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                    <AiOutlineSearch />
                </Button>
            </Link>
            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toogleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
                {currentUser ? (
                    <div>
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt='user'
                                    img={currentUser.profileImage}
                                    rounded
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className='block text-sm'>@{currentUser.username}</span>
                                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Link>
                                <Dropdown.Item onClick={() => setShowModal(true)}>Sign Out</Dropdown.Item>
                            </Link>
                        </Dropdown>
                    </div>
                ) : (
                    <Link to="/sign-in">
                        <Button gradientDuoTone={'purpleToBlue'} outline >
                            Sign In
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div >
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
            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={'div'}>   {/*We use "as" because we cannot use 'a'(anchor tag) in 'a'*/}
                    <Link to="/">Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={'div'}>
                    <Link to="/about">About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/projects"} as={'div'}>
                    <Link to="/projects">Project</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar >
    )
}

export default Header

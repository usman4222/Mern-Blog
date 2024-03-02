import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import DashBoard from './pages/DashBoard';
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPages from './pages/PostPages';
import ScrollToTop from './components/ScrollToTop';

function App() {

  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/post/:postSlug' element={<PostPages />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<DashBoard />} />
        </Route>
        <Route element={<AdminProtectedRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App

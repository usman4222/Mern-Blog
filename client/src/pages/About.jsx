import React, { Fragment } from 'react'

const About = () => {
    return (
        <Fragment>
            <div class="container">
                <header>
                    <h1>Welcome to My Website</h1>
                </header>

                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>

                <section id="home">
                    <h2>Home Section</h2>
                    <p>This is the home section of my website.</p>
                </section>

                <section id="about">
                    <h2>About Section</h2>
                    <p>This is the about section. Here you can learn more about me.</p>
                </section>

                <section id="services">
                    <h2>Services Section</h2>
                    <p>Explore the services I offer on this page.</p>
                </section>

                <section id="contact">
                    <h2>Contact Section</h2>
                    <p>Feel free to reach out to me using the contact information provided.</p>
                </section>

                <footer>
                    <p>&copy; 2024 My Website. All rights reserved.</p>
                </footer>
            </div>

        </Fragment>
    )
}

export default About

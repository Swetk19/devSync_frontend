import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    BsLightningChargeFill, BsX, BsHeartFill, BsCodeSlash, BsFilter, BsChatDotsFill,
    BsTwitter, BsLinkedin, BsInstagram, BsHeartFill as BsHeart, BsGithub
} from 'react-icons/bs'
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiSocketdotio } from "react-icons/si"
import ThemeToggle from './ThemeToggle'

const HomePage = () => {
    const [text, setText] = useState("React")
    const [isScrolled, setIsScrolled] = useState(false)
    const skills = ["React", "Node.js", "DevOps", "MERN", "Java"]

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % skills.length;
            setText(skills[i]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="bg-base-100 min-h-screen font-sans selection:bg-primary selection:text-white">

            {/* NAVBAR */}
            <div className={`navbar fixed top-0 z-50 w-full px-6 transition-all duration-300 border-b ${
                isScrolled
                    ? 'bg-base-100/90 backdrop-blur-lg border-base-200 shadow-sm'
                    : 'bg-transparent border-transparent'
            }`}>
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost tracking-wide text-2xl">
                        👨‍💻
                        <span className="font-extrabold leading-none">
                            <span className="text-teal-300" style={{ fontSize: "22px" }}>Dev</span>
                            <span className="text-rose-400" style={{ fontSize: "32px" }}>Sync</span>
                        </span>
                    </Link>
                </div>
                <ThemeToggle />
                <Link to="/login" className="btn btn-primary rounded-full px-6 text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform border-none">
                    Authenticate
                </Link>
            </div>

            {/* HERO SECTION */}
            <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-16">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

                <div className="max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">

                    {/* LEFT CONTENT */}
                    <div className="text-center lg:text-left space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black leading-tight text-base-content">
                            Find your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {text}
                            </span> Duo.
                        </h1>

                        <p className="text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed font-black animate-fade-in">
                            <span className="text-purple-500">Match.</span>
                            {" "}
                            <span className="text-pink-500">Collaborate.</span>
                            {" "}
                            <span className="text-blue-500">Build.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Link to="/login" className="btn btn-primary btn-lg h-14 px-8 rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 transition-transform text-white border-none">
                                Start Matching <BsLightningChargeFill />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT - PROFILE CARD */}
                    <div className="relative h-[460px] hidden lg:flex items-center justify-center">
                        <div className="absolute w-64 h-[360px] bg-base-300 rounded-3xl transform rotate-[-6deg] translate-x-[-20px] opacity-40 scale-95"></div>
                        <div className="absolute w-64 h-[360px] bg-base-200 rounded-3xl transform rotate-[-3deg] translate-x-[-10px] opacity-70 scale-95"></div>

                        <div className="relative w-64 bg-white dark:bg-neutral rounded-3xl shadow-2xl border border-base-200 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                            {/* Profile Header */}
                            <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                                <div className="absolute bottom-[-36px] left-5 border-4 border-white dark:border-neutral rounded-full w-20 h-20 bg-base-100 overflow-hidden">
                                    <img src="https://i.pravatar.cc/300?img=12" alt="Dev" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="pt-10 px-5 pb-6">
                                <h3 className="text-lg font-bold">Ryan Park <span className="text-blue-500">✔</span></h3>
                                <p className="text-xs text-gray-500 font-medium">Full Stack • Google</p>

                                {/* Tech Skills */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="badge badge-primary badge-outline text-xs">React</span>
                                    <span className="badge badge-secondary badge-outline text-xs">Node</span>
                                    <span className="badge badge-accent badge-outline text-xs">AWS</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 mt-5 justify-center">
                                    <button className="btn btn-circle btn-outline btn-error hover:scale-110 hover:bg-error hover:text-white transition-all">
                                        <BsX className="text-2xl" />
                                    </button>
                                    <button className="btn btn-circle btn-primary shadow-lg shadow-primary/40 hover:scale-110 transition-all text-white">
                                        <BsHeartFill className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TECH STACK SECTION */}
            <div className="bg-base-200/50 border-y border-base-200 py-6">
                <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="font-bold text-sm uppercase tracking-widest text-gray-400">Powered By:</span>
                    <div className="flex items-center gap-2 text-green-600"><SiMongodb size={24} /> <span className="font-bold">MongoDB</span></div>
                    <div className="flex items-center gap-2 text-gray-600"><SiExpress size={24} /> <span className="font-bold">Express</span></div>
                    <div className="flex items-center gap-2 text-blue-400"><SiReact size={24} /> <span className="font-bold">React</span></div>
                    <div className="flex items-center gap-2 text-green-500"><SiNodedotjs size={24} /> <span className="font-bold">Node.js</span></div>
                    <div className="flex items-center gap-2 text-gray-800"><SiSocketdotio size={24} /> <span className="font-bold">Socket.io</span></div>
                </div>
            </div>

            {/* FEATURES SECTION */}
            <div className="py-24 bg-base-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Under the hood</span>
                        <h2 className="text-3xl md:text-4xl font-black mt-2 text-base-content">
                            More than just a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Clone</span>.
                        </h2>
                        <p className="text-gray-500 mt-4">A fully functional social network built for the modern developer.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary transition-colors">
                            <div className="card-body items-center text-center">
                                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl mb-4">
                                    <BsCodeSlash />
                                </div>
                                <h3 className="text-xl font-bold">Tech-Stack Matching</h3>
                                <p className="text-sm text-gray-500 mt-2">Our algorithm filters profiles based on skills. Java devs meet Java devs. React meets Node.</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-secondary transition-colors">
                            <div className="card-body items-center text-center">
                                <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-2xl mb-4">
                                    <BsChatDotsFill />
                                </div>
                                <h3 className="text-xl font-bold">Real-time Chat</h3>
                                <p className="text-sm text-gray-500 mt-2">Instant messaging powered by <b>Socket.io</b>. Low latency connections to share code snippets.</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-accent transition-colors">
                            <div className="card-body items-center text-center">
                                <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center text-2xl mb-4">
                                    <BsFilter />
                                </div>
                                <h3 className="text-xl font-bold">Premium Features</h3>
                                <p className="text-sm text-gray-500 mt-2">Integrated <b>Razorpay</b> for Gold Membership. Unlock 'Rewind', Unlimited Swipes, and more.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FINAL CTA SECTION */}
            <div className="py-20 text-center bg-base-200/30">
                <h2 className="text-3xl font-black mb-6">Experience the Code.</h2>
                <Link to="/login" className="btn btn-primary btn-lg rounded-full px-12 shadow-2xl shadow-primary/50 text-white hover:scale-105 transition-transform border-none">
                    Create Developer Profile
                </Link>
            </div>

            {/* FOOTER */}
            <footer className="bg-base-300 text-base-content pt-10 pb-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
                        {/* Brand Section */}
                        <aside className="col-span-1 sm:col-span-2">
                            <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
                                <span className="font-extrabold">
                                    <span className="text-teal-300">Dev</span>
                                    <span className="text-rose-400">Sync</span>
                                </span>
                            </Link>
                            <p className="mt-4 text-gray-500 max-w-xs leading-relaxed text-sm">
                                Match, Chat, and Code. The ultimate platform for developers to connect, collaborate, and build the future together.
                            </p>
                        </aside>

                        {/* Services Links */}
                        <nav className="flex flex-col gap-2">
                            <h6 className="footer-title opacity-100 text-primary uppercase tracking-wider text-xs">Services</h6>
                            <Link to="/login" className="link link-hover hover:text-primary transition-colors text-sm">Premium Plans</Link>
                            <Link to="/login" className="link link-hover hover:text-primary transition-colors text-sm">AI Career Coach</Link>
                            <Link to="/login" className="link link-hover hover:text-primary transition-colors text-sm">Find Developers</Link>
                            <Link to="/login" className="link link-hover hover:text-primary transition-colors text-sm">Success Stories</Link>
                        </nav>

                        {/* Company Links */}
                        <nav className="flex flex-col gap-2">
                            <h6 className="footer-title opacity-100 text-primary uppercase tracking-wider text-xs">Company</h6>
                            <a className="link link-hover hover:text-primary transition-colors text-sm">About us</a>
                            <a className="link link-hover hover:text-primary transition-colors text-sm">Contact</a>
                            <a className="link link-hover hover:text-primary transition-colors text-sm">Privacy Policy</a>
                            <a className="link link-hover hover:text-primary transition-colors text-sm">Terms of Use</a>
                        </nav>
                    </div>

                    <div className="divider my-0"></div>

                    {/* Footer Bottom */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 py-6">
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                            Built with <BsHeart className="text-error animate-pulse" /> in India © {new Date().getFullYear()} - DevSync
                        </p>
                        <nav className="flex gap-6">
                            <a href="https://github.com/Swetk19/" target="_blank" rel="noreferrer" className="text-2xl text-gray-500 hover:text-black hover:-translate-y-1 transition-all duration-300">
                                <BsGithub />
                            </a>
                            <a href="#" rel="noreferrer" className="text-2xl text-gray-500 hover:text-blue-400 hover:-translate-y-1 transition-all duration-300">
                                <BsTwitter />
                            </a>
                            <a href="https://www.linkedin.com/in/issweta/" rel="noreferrer" className="text-2xl text-gray-500 hover:text-blue-600 hover:-translate-y-1 transition-all duration-300">
                                <BsLinkedin />
                            </a>
                            <a href="#" rel="noreferrer" className="text-2xl text-gray-500 hover:text-pink-500 hover:-translate-y-1 transition-all duration-300">
                                <BsInstagram />
                            </a>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomePage
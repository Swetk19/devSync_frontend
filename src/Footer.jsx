const Footer = () => {
  return (
    <footer className="bg-base-300 border-t border-base-content/10 px-8 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">

        {/* Left: Brand + tagline */}
        <div className="flex items-center gap-6">
          <div className="text-lg font-extrabold shrink-0">
            <span className="text-teal-400">Dev</span>
            <span className="text-rose-400">Tinder</span>
          </div>

          <p className="text-base-content/70 text-xs leading-relaxed max-w-xs hidden md:block">
            Swipe right on your next tech collaboration. Connect with developers
            who share your stack, your passion, and your ambition.
          </p>
        </div>

        {/* Right: Icons stacked above copyright */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex gap-1">
            <a href="#" className="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-base-content transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </a>
            <a href="#" className="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-base-content transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a href="#" className="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-base-content transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>

          <p className="text-xs text-base-content/70">
            © 2026 DevTinder. Made with ❤️ for developers.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
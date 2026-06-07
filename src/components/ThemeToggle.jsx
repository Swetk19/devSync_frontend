import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(
        () => localStorage.getItem('theme') || 'light'
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
            {theme === 'light'
                ? <MoonIcon className='w-5 h-5' />
                : <SunIcon className='w-5 h-5' />
            }
        </button>
    );
};

export default ThemeToggle;
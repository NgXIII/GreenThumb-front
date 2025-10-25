import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, BookOpen, User, LogOut } from 'lucide-react'
import logo from '../../../assets/logo.png'

type NavBarProps = {
  isAuthenticated?: boolean
}

// Mettre true ou false selon si on est connecté ou non
export default function NavBar({ isAuthenticated = true }: NavBarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Communauté', icon: Users, path: '/community' },
    { name: 'Ressources', icon: BookOpen, path: '/ressources' },
  ]

  const isActive = (path: string) => location.pathname === path

  const onLogout = () => {
    // remplacer par la logique réelle
    console.log('logout')
    navigate('/login')
    setMobileProfileOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileProfileOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setMobileProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileProfileOpen])

  function AuthenticatedView() {
    return (
      <>
        {/* Desktop - connecté */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 hidden md:block">
          <div className="px-4">
            <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} className="w-10 h-auto" alt="logo" />
                <span className="text-xl text-gt-green font-bold gradient-text">GreenThumb</span>
              </Link>

              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      isActive(item.path) ? 'bg-gt-green text-white' : 'text-gt-dark-green hover:bg-gt-light-grey'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gt-green hover:bg-gt-dark-green"
                >
                  <User size={20} className="text-white" />
                </Link>

                <button className="flex items-center gap-2 text-gt-dark-green hover:text-red-600 transition-colors" onClick={onLogout}>
                  <LogOut size={20} />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile - logo top */}
        <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 h-16 flex items-center justify-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} className="w-10 h-auto" alt="logo" />
              <span className="text-xl text-gt-green font-bold gradient-text">GreenThumb</span>
            </Link>
          </div>
        </div>

        {/* Mobile - bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileProfileOpen(false)}
                className="flex items-center justify-center transition-colors flex-1 py-2"
              >
                <div className={`px-3 py-2 rounded-full transition-colors ${isActive(item.path) ? 'bg-gt-green' : ''}`}>
                  <item.icon size={24} className={isActive(item.path) ? 'text-white' : 'text-gt-dark-green'} />
                </div>
              </Link>
            ))}

            <div ref={profileRef} className="flex items-center justify-center flex-1 py-2 relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={mobileProfileOpen}
                onClick={() => setMobileProfileOpen((s) => !s)}
                className={`px-3 py-2 rounded-full transition-colors ${isActive('/profile') ? 'bg-gt-green' : ''}`}
              >
                <User size={24} className={isActive('/profile') ? 'text-white' : 'text-gt-dark-green'} />
              </button>

              {mobileProfileOpen && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-44 bg-white rounded-lg shadow-lg z-50">
                  <Link to="/profile" onClick={() => setMobileProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gt-light-grey rounded-t-md">
                    <User size={18} className="text-gt-dark-green" />
                    <span className="text-sm">Profil</span>
                  </Link>
                  <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gt-light-grey rounded-b-md">
                    <LogOut size={18} className="text-gt-dark-green" />
                    <span className="text-sm">Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="md:hidden h-16"></div>
      </>
    )
  }

  function DisconnectedView() {
    return (
      <>
        {/* Desktop - déconnecté */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 hidden md:block">
          <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} className="w-10 h-auto" alt="logo" />
              <span className="text-xl text-gt-green font-bold gradient-text">GreenThumb</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/login" className="px-3 py-2 rounded-full text-gt-dark-green hover:bg-gt-light-grey transition-colors">
                Se connecter
              </Link>

              <Link to="/signup" className="px-3 py-2 rounded-full bg-gt-green text-white hover:bg-gt-dark-green transition-colors">
                Créer un compte
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile - logo top */}
        <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 h-16 flex items-center justify-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} className="w-10 h-auto" alt="logo" />
              <span className="text-xl text-gt-green font-bold gradient-text">GreenThumb</span>
            </Link>
          </div>
        </div>

        {/* Mobile - bottom actions */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex">
            <Link to="/login" className="flex-1 py-3 text-center text-gt-dark-green hover:bg-gt-light-grey transition-colors">
              Connexion
            </Link>

            <Link to="/signup" className="flex-1 py-3 text-center bg-gt-green text-white hover:bg-gt-dark-green transition-colors">
              Inscription
            </Link>
          </div>
        </nav>

        <div className="md:hidden h-16" />
      </>
    )
  }

  return isAuthenticated ? <AuthenticatedView /> : <DisconnectedView />
}
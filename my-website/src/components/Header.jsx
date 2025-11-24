import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <Link to="/">
            <h2>Kashmira Shah</h2>
          </Link>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/#about" className="nav-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/catalog" className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}>
              Products
            </Link>
          </li>
          <li>
            <Link to="/#contact" className="nav-link">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}


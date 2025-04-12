import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaBars, FaHome } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setLogout } from '../redux/state';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHamburgerClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        <Link to='/' style={styles.link}>
          <FaHome style={styles.logo} />
          <span style={styles.logoText}>Room</span>
          <span style={styles.logoText2}>Maven</span>
        </Link>
      </div>

      {/* Search */}
      {!isMobile && (
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search..."
            style={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch
            style={styles.searchIcon}
            onClick={() => navigate(`properties/search/${search}`)}
          />
        </div>
      )}

      {/* Become a Landlord & Profile Menu */}
      <div style={styles.actionsWrapper}>
        {!isMobile && (
          <Link
            to={user ? "/create-listing" : "/login"}
            style={styles.landlordText}
          >
            Become A Landlord
          </Link>
        )}

        <div style={styles.profileContainer}>
          <FaBars style={styles.hamburgerIcon} onClick={handleHamburgerClick} />
          {user ? (
            <img
              src={`http://localhost:3000/${user.profileImagePath.replace("public", "")}`}
              alt="profile"
              style={styles.profileImage}
            />
          ) : (
            <FaUser style={styles.profileIcon} />
          )}

          {/* Dropdown */}
          {isDropdownOpen && (
            <div style={isMobile ? styles.dropdownContentMobile : styles.dropdownContent}>
              {user ? (
                <>
                  <Link style={styles.dropdownItem} to={`/${user._id}/trips`}>Trip List</Link>
                  <Link style={styles.dropdownItem} to={`/${user._id}/wishList`}>Wish List</Link>
                  <Link style={styles.dropdownItem} to={`/${user._id}/properties`}>Property List</Link>
                  <Link style={styles.dropdownItem} to={`/${user._id}/reservations`}>Reservation List</Link>
                  <Link style={styles.dropdownItem} to="/create-listing">Become A Landlord</Link>
                  <Link to="/" style={styles.dropdownItem} onClick={() => dispatch(setLogout())}>Logout</Link>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.dropdownButton}>Login</Link>
                  <Link to="/register" style={styles.dropdownButton}>Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#333',
    position: 'relative',
    zIndex: 999,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  logo: {
    color: "white",
    fontSize: "2rem"
  },
  logoText: {
    fontSize: "1.6rem",
    color: "#76ABAE",
    fontWeight: "bold"
  },
  logoText2: {
    fontSize: "1.4rem",
    color: "#fff"
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#555',
    borderRadius: '5px',
    padding: '4px 8px',
    flexGrow: 1,
    margin: '10px 20px',
    maxWidth: '300px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#fff',
    padding: '8px',
    width: '100%',
  },
  searchIcon: {
    color: '#fff',
    cursor: 'pointer',
    marginLeft: '8px'
  },
  actionsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  landlordText: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #c5c5c5',
    padding: '0.4rem 0.8rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    position: 'relative',
    gap: '8px'
  },
  hamburgerIcon: {
    color: '#fff',
  },
  profileIcon: {
    color: '#fff',
  },
  profileImage: {
    objectFit: "cover",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  dropdownContent: {
    position: 'absolute',
    top: '60px',
    right: '10px',
    backgroundColor: '#333',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    minWidth: '140px',
  },

  dropdownContentMobile: {
    position: 'absolute',
    top: '55px',
    right: '0',
    left: '0',
    backgroundColor: '#333',
    borderRadius: '5px',
    padding: '10px',
    maxWidth: '100%',  // Ensures the dropdown takes full width
    zIndex: '999',
    width: '100%',
    boxSizing: 'border-box',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },

  dropdownItem: {
    display: 'block',
    width: '100%',
    backgroundColor: '#76ABAE',
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 16px',  // Increased padding for better alignment
    borderRadius: '4px',
    fontSize: '1rem',
    textAlign: 'center',
    whiteSpace: 'nowrap',  // Prevents wrapping
    overflow: 'hidden',
    marginTop: '8px',
  },

  dropdownButton: {
    display: 'block',
    backgroundColor: '#76ABAE',
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 16px',
    marginTop: '8px',
    borderRadius: '4px',
    fontSize: '1rem',
    textAlign: 'center',
    width: '100%',  // Ensures full width button
    whiteSpace: 'nowrap',  // Prevents wrapping
    overflow: 'visible',
    textOverflow: 'clip',  // Ensures no text gets cut off
    boxSizing: 'border-box',
  },

  link: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center'
  }
};

export default Navbar;

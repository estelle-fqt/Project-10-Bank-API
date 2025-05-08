import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

import "../assets/styles/main.css";
import BankLogo from "../assets/img/argentBankLogo.webp";

function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // rediriger après la déconnexion

  // Gérer la déconnexion
  const signOut = () => {
    dispatch(logout()); // Déconnexion de l'utilisateur
    navigate("/");
  };

  return (
    <nav className="main-nav">
      <>
        <Link to="/" className="main-nav-logo">
          <img
            className="main-nav-logo-image"
            src={BankLogo}
            alt="Argent Bank Logo"
          />
          <h1 className="sr-only">Argent Bank</h1>
        </Link>
      </>

      {/* affiche Sign In ou Sign Out et Prénom user en fct de l'état d'authentification */}
      {isAuthenticated ? (
        <>
          {/* Lien vers profil avc prénom */}
          <Link to="/profile" className="main-nav-item">
            <i className="fa fa-user-circle"></i>
            {user?.userName}
          </Link>
          {/* Btn Sign Out */}
          <button className="sign-out-btn" onClick={signOut}>
            <i className="fa fa-user-circle"></i>
            Sign Out
          </button>{" "}
          {/*action*/}
        </>
      ) : (
        <Link to="/login" className="main-nav-item">
          <i className="fa fa-user-circle"></i>
          Sign In
        </Link> // redirection
      )}
    </nav>
  );
}

export default Header;

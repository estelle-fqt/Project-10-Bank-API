import "../assets/styles/main.css";

import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";

function Login() {
  return (
    <>
      <Header />
      <main className="main bg-dark">
        <section className="sign-in-content">
          <i className="fa fa-user-circle sign-in-icon"></i>
          <h1>Sign In</h1>
          <LoginForm />
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Login;

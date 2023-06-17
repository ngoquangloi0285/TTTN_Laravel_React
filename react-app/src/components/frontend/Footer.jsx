import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook,BsLinkedin,BsYoutube,BsInstagram,BsGithub } from "react-icons/bs";
const Footer = () => {
  return (
    <>
      {/* <footer className="py-4">
        <div className="container-xxl">
          <div className="row  align-items-center">
            <div className="col-5">
              <div className="footer-top-data d-flex gap-30 align-items-center">
                <img src="images/newsletter.png" alt="newsletter" />
                <h2 className="mb-0 text-white">Sign Up for Newsletter</h2>
              </div>
            </div>
            <div className="col-7">
              <div className="input-group">
                <input
                style={{
                  height: '41.6px',
                }}
                  type="text"
                  class="form-control py-2"
                  placeholder="Your Email Address..."
                  aria-label="Your Email Address..."
                  aria-describedby="basic-addon2"
                />
                <span className="header-link input-group-text py-2" id="basic-addon2">
                  Subscribe
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer> */}

      {/* <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-4">
              <h4 className="text-white mb-4">Contact</h4>
              <div>
                <address className="text-white fs-6 mb-0">
                  Location: Ho Chi Minh city <br/>
                </address>
                <a className="text-white mt-3" href="tel: (+84) 0352412318">Number Phone: (+84) 0352412318</a>
                <br />
                <a className="text-white mt-2" href="mailto: nqlit2109@gmail.com">Emaill: nqlit2109@gmail.com</a>
              </div>
              <div className="social-icons d-flex gap-30 align-items-center mt-4">
                <Link to="/" className="header-link text-white"><BsLinkedin/></Link>
                <Link to="/" className="header-link text-white"><BsGithub/></Link>
                <Link to="/" className="header-link text-white"><BsFacebook/></Link>
                <Link to="/" className="header-link text-white"><BsYoutube/></Link>
                <Link to="/" className="header-link text-white"><BsInstagram/></Link>
              </div>
            </div>
            <div className="col-3">
              <h4 className="text-white mb-4">Infomattion</h4>
              <div className="footer-links d-flex flex-column">
                <Link to="/" className="header-link text-white mb-1 py-2">Privacy Policy</Link>
                <Link to="/" className="header-link text-white mb-1 py-2">Refund Policy</Link>
                <Link to="/" className="header-link text-white mb-1 py-2">Shipping Policy</Link>
                <Link to="/" className="header-link text-white mb-1 py-2">Terms & Condition</Link>
                <Link to="/" className="header-link text-white mb-1 py-2">Blogs</Link>
              </div>
            </div>
            <div className="col-3">
              <h4 className="text-white mb-4">Account</h4>
              <div className="footer-links d-flex flex-column">
                <Link to="/" className="header-link text-white mb-1 py-2">About US</Link>
                <Link to="/" className="header-link text-white mb-1 py-2">Faq</Link>
                <Link to="/" className="header-link text-white mb-1 py-2">Contact</Link>
              </div>
            </div>
            <div className="col-2">
              <h4 className="text-white mb-4">Quick Links</h4>
              <div className="footer-links d-flex flex-column">
                <Link to="/" className="header-link text-white mb-1 py-2">Laptops</Link>
                <Link to="/" className="header-link text-white mb-1 py-2">Headphones</Link>
                <Link to="/" className="header-link text-white mb-1 py-2">Tablets</Link>
                <Link to="/" className="header-link text-white mb-1 py-2">Watch</Link>
              </div>
            </div>
          </div>
        </div>
      </footer> */}

      <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <p className="text-center mb-0 text-white">
                &copy; {new Date().getFullYear()} Development by Ngo Quang Loi
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
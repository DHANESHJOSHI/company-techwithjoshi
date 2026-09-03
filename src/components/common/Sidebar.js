import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useRef } from "react";

const initialState = {
  activeMenu: "",
  activeSubMenu: "",
  isSidebarOpen: false
};

function reducer(state, action) {
    switch (action.type) {
      case "TOGGLE_MENU":
        return {
          ...state,
          
          activeMenu: state.activeMenu === action.menu ? "" : action.menu,
          activeSubMenu: state.activeMenu === action.menu ? state.activeSubMenu : ""
        };
      case "TOGGLE_SUB_MENU":
        return {
          ...state,
          activeSubMenu: state.activeSubMenu === action.subMenu ? "" : action.subMenu
        };
        case "TOGGLE_SIDEBAR":
            return {
              ...state,
              isSidebarOpen: !state.isSidebarOpen
            };
            case "setScrollY":
              return { ...state, scrollY: action.payload };
      default:
        return state;
    }
  }
function Sidebar( { isMenuOpen, toggleMenu  }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const collapseMenu = (menu) => {
    dispatch({ type: "TOGGLE_MENU", menu });
  };
  const toggleSubMenu = (subMenu) => {
    dispatch({ type: "TOGGLE_SUB_MENU", subMenu });
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <div className={`main-nav-wrapper ${isMenuOpen ? "menu-open" : ""}`}>
      <div className={`main-nav2 ${isMenuOpen ? "show-menu" : ""}`}>
        <div className="mobile-logo-area d-flex justify-content-between align-items-center w-100 mb-4">
          <div className="header-logo">
            <Link legacyBehavior href="/">
              <a onClick={toggleMenu}>
                <img alt="TechWithJoshi" className="img-fluid" src="/assets/img/techwithjoshi-logo.svg?v=4" style={{ height: "36px", width: "auto" }} />
              </a>
            </Link>
          </div>
          <button
            type="button"
            aria-label="Close Menu"
            className="menu-close-btn"
            onClick={toggleMenu}
            style={{
              cursor: "pointer"
            }}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="sidebar-menu-area">
          <ul className="menu-list">
            <li className="menu-item"><Link legacyBehavior href="/"><a data-hover="Home" onClick={toggleMenu}>Home</a></Link></li>
            <li className="menu-item"><Link legacyBehavior href="/about"><a data-hover="About" onClick={toggleMenu}>About</a></Link></li>
            <li className="menu-item"><Link legacyBehavior href="/service"><a data-hover="Service" onClick={toggleMenu}>Service</a></Link></li>
            <li className="menu-item-has-children menu-item">
              <Link legacyBehavior href="/project"><a data-hover="Project" onClick={toggleMenu}>Project</a></Link><i className={`bi dropdown-icon2 ${state.activeMenu === "projects" ? "bi-dash-lg" : "bi-plus-lg"}`} onClick={() => collapseMenu("projects")}/>
              <ul className={`sub-menu ${state.activeMenu === "projects" ? "d-block" : ""}`}>
                <li><Link legacyBehavior href="/project"><a onClick={toggleMenu}>All Projects</a></Link></li>
                <li><Link legacyBehavior href="/case-study"><a onClick={toggleMenu}>Featured Case Studies</a></Link></li>
              </ul>
            </li>
            <li className="menu-item-has-children menu-item">
              <Link legacyBehavior href="/case-study"><a data-hover="Case Study" onClick={toggleMenu}>Case Study</a></Link><i className={`bi dropdown-icon2 ${state.activeMenu === "case" ? "bi-dash-lg" : "bi-plus-lg"}`} onClick={() => collapseMenu("case")}/>
              <ul className={`sub-menu ${state.activeMenu === "case" ? "d-block" : ""}`}>
                <li><Link legacyBehavior href="/case-study"><a onClick={toggleMenu}>All Success Stories</a></Link></li>
                <li><Link legacyBehavior href="/case-study-details?slug=building-scalable-cloud-infrastructure"><a onClick={toggleMenu}>Cloud Infrastructure</a></Link></li>
                <li><Link legacyBehavior href="/case-study-details?slug=leveraging-data-analytics-for-business-insights"><a onClick={toggleMenu}>Data Analytics &amp; BI</a></Link></li>
                <li><Link legacyBehavior href="/case-study-details?slug=optimizing-it-infrastructure-for-cost-efficiency"><a onClick={toggleMenu}>Cost Optimization</a></Link></li>
              </ul>
            </li>
            <li className="menu-item">
              <Link legacyBehavior href="/blog"><a data-hover="Blog" onClick={toggleMenu}>Blog</a></Link>
            </li>
            <li className="menu-item">
              <Link legacyBehavior href="/faq"><a data-hover="FAQ" onClick={toggleMenu}>FAQ</a></Link>
            </li>
            <li className="menu-item"><Link legacyBehavior href="/contact"><a data-hover="Contact" onClick={toggleMenu}>Contact</a></Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar

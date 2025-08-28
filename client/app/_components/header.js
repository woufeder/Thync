"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import HeaderUser from "./headerUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="container header">
        {isMobile ? (
          // 手機版結構
          <header>
            <nav className="navbar ">
              <div className="container-fluid">
                <a className="navbar-brand" href="/">
                  <Image
                    src="/images/LOGO.png"
                    alt="Logo"
                    width={129}
                    height={40}
                  />
                </a>
                <div className="d-flex align-items-center gap-2">
                  <form className="d-flex" role="search">
                    <input
                      className="form-control me-2"
                      type="text"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <button className="btn" type="submit">
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="icon-search"
                      />
                    </button>
                  </form>
                  <a href="/cart" className="btn">
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      className="icon-cart"
                    />
                  </a>
                  <div className="user">
                    {user ? (
                      <HeaderUser />
                    ) : (
                      <>
                        {" "}
                        <Link href="/user/login" className="btn link">
                          登入
                        </Link>{" "}
                        <Link href="/user/register" className="btn link">
                          註冊
                        </Link>{" "}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>

            <nav className="navbar navbar-expand-lg ">
              <div className="container-fluid">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        aria-current="page"
                        href="#"
                      >
                        Home
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Link
                      </a>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Dropdown
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a className="dropdown-item" href="#">
                            Action
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Another action
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Something else here
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link disabled" aria-disabled="true">
                        Disabled
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </header>
        ) : (
          // 桌機版結構
          <header>
            <nav className="navbar ">
              <div className="container-fluid">
                <a className="navbar-brand" href="/">
                  <Image
                    src="/images/LOGO.png"
                    alt="Logo"
                    width={129}
                    height={40}
                  />
                </a>
                <div className="d-flex align-items-center gap-2">
                  <form className="d-flex" role="search">
                    <input
                      className="form-control me-2"
                      type="text"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <button className="btn" type="submit">
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="icon-search"
                      />
                    </button>
                  </form>
                  <a href="/cart" className="btn">
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      className="icon-cart"
                    />
                  </a>
                  <div className="user">
                    {user ? (
                      <HeaderUser />
                    ) : (
                      <>
                        {" "}
                        <Link href="/user/login" className="btn link">
                          登入
                        </Link>{" "}
                        <Link href="/user/register" className="btn link">
                          註冊
                        </Link>{" "}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>

            <nav className="navbar navbar-expand-md ">
              <div className="w-100">
                <ul className="navbar-nav mb-2 mb-lg-0 w-100 text-center">
                  <li className="nav-item">
                    <Link
                      href="/products"
                      className={`nav-link${pathname === "/" ? " active" : ""}`}
                    >
                      所有商品
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/products/brands"
                      className={`nav-link${
                        pathname === "/products/brands" ? " active" : ""
                      }`}
                    >
                      所有品牌
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" aria-current="page" href="/#events">
                      活動消息
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/products/sales"
                      className={`nav-link${
                        pathname === "/sales" ? " active" : ""
                      }`}
                    >
                      限時出清
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/articles"
                      className={`nav-link${
                        pathname === "/articles" ? " active" : ""
                      }`}
                    >
                      文章分享
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
        )}
      </div>
    </>
  );
}

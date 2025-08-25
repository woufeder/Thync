'use client'
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import styles from "@/styles/index.css";
import Link from "next/link";

import Header from "./_components/header";
import Footer from "./_components/footer";
import ArticleCard from "./_components/articleCard";

export default function Home() {
	const [isMobile, setIsMobile] = useState(false);
	const [showHeader, setShowHeader] = useState(false);
	const topImgRef = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
			if (topImgRef.current) {
				const rect = topImgRef.current.getBoundingClientRect();
				setShowHeader(rect.bottom < rect.height / 1.5);
			}
		};
		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);


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

			{isMobile ? (
				// 手機版結構
				<header>
					<img src="/images/index/header.png" alt="header" className="img-fluid" ref={topImgRef} />
					<div className="showheader">
						<Header />
					</div>
				</header>
			) : (
				// 桌機版結構
				<header>
					<img src="/images/index/header.png" alt="header" className="img-fluid" ref={topImgRef} />
					<div className={`${showHeader ? "showheader" : "fade"} `}>
						<Header />
					</div>
				</header>
			)}

			<section id="products">
				<h1 className="sectionName">Products</h1>
				<div className="container">
					<h4 className="sectionSubtitle">──“Select your vibe, link your tribe.”</h4>
				</div>
				<div className="p-cards">
					<div className="row">
						<a className="col keyboard" href="/products/keyboard">
							<h1>KEYBOARD</h1>
						</a>
						<a className="col monitor" href="/products/monitor">
							<h1>MONITOR</h1>
						</a>
					</div>
					<div className="row">
						<a className="col mouse" href="/products/mouse">
							<h1>MOUSE</h1>
						</a>
						<a className="col audio" href="/products/audio">
							<h1>AUDIO</h1>
						</a>
						<a className="col case" href="/products/case">
							<h1>CASE</h1>
						</a>
					</div>
				</div>
			</section>

			<section id="marquee">
				<div className="marquee-content">
					<img src="/images/index/carousels (1).png" alt="slide1" />
					<img src="/images/index/carousels (2).png" alt="slide2" />
					<img src="/images/index/carousels (3).png" alt="slide3" />
					<img src="/images/index/carousels (4).png" alt="slide4" />
					<img src="/images/index/carousels (5).png" alt="slide5" />
					<img src="/images/index/carousels (6).png" alt="slide6" />
					<img src="/images/index/carousels (7).png" alt="slide7" />
					<img src="/images/index/carousels (1).png" alt="slide1" />
					<img src="/images/index/carousels (2).png" alt="slide2" />
					<img src="/images/index/carousels (3).png" alt="slide3" />
					<img src="/images/index/carousels (4).png" alt="slide4" />
					<img src="/images/index/carousels (5).png" alt="slide5" />
					<img src="/images/index/carousels (6).png" alt="slide6" />
					<img src="/images/index/carousels (7).png" alt="slide7" />
				</div>
			</section>

			<section id="articles">
				<h1 className="sectionName">Articles</h1>
				<div className="container">
					<h4 className="sectionSubtitle">──“Skim for the traces, dive for the basis.”</h4>
				</div>
				<div className="container ">
					<div className="a-cards">
						<div className="row">
							<div className="col " href="/products/keyboard">
								<ArticleCard />
							</div>
							<div className="col" href="/products/monitor">
								<ArticleCard />
							</div>
							<div className="col" href="/products/monitor">
								<ArticleCard />
							</div>
							<div className="col" href="/products/monitor">
								<ArticleCard />
							</div>
							<div className="col" href="/products/monitor">
								<ArticleCard />
							</div>
							<div className="col" href="/products/monitor">
								<ArticleCard />
							</div>
						</div>
					</div>

				</div>
			</section>

			<section id="events">
				<h1 className="sectionName">Events</h1>
				<div className="container">
					<h4 className="sectionSubtitle">──“Freshly dropped, sharply locked.”</h4>
				</div>
				<div className="container">
				</div>
			</section>

			<footer>
				<Footer />
			</footer>
		</>
	);

}
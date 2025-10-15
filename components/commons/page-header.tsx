"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode; // Custom buttons/actions
}

const PageHeader = ({
  title,
  subtitle,
  actions, // Custom buttons/actions
}: PageHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scrolling within the main content
  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        setIsScrolled(mainContent.scrollTop > 70);
      }
    };
    const mainContent = document.getElementById("main-content");
    mainContent?.addEventListener("scroll", handleScroll);
    return () => mainContent?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={clsx(
        "sticky top-0 z-40 transition-all duration-300 bg-white",
        isScrolled ? "py-3 shadow-md" : "py-3"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Left - Title & Subtitle */}
        <div className="flex">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-gray-500">{subtitle}</p>}
          </div>
        </div>

        {/* Right - Buttons & Dropdown */}
        <div className="flex items-center space-x-3">{actions}</div>
      </div>
    </div>
  );
};

export default PageHeader;

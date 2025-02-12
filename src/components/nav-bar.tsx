"use client";

import { MenuType } from "@/types/interface";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineQuestionCircle
} from "react-icons/ai";
import {
  BiCalendarEvent,
  BiHomeAlt,
  BiLogOut,
  BiUserCircle
} from "react-icons/bi";
import { BsDiscord, BsLightbulb } from "react-icons/bs";
import { HiMenu, HiOutlineSpeakerphone } from "react-icons/hi";
import { HiOutlineTrophy } from "react-icons/hi2";
import { IoArrowBackSharp } from "react-icons/io5";
import { SlEnergy } from "react-icons/sl";
import links from "@/lib/data/links.json";

export const NavBarLanding: React.FC = () => {
  const menuList: MenuType[] = [
    {
      id: "about",
      name: "About",
      href: "#about-fullyhacks",
      mobile: 24,
      desktop: 24
    },
    {
      id: "sponsors",
      name: "Sponsors",
      href: "#sponsors",
      mobile: 24,
      desktop: 24
    },
    {
      id: "team",
      name: "Team",
      href: "#team",
      mobile: 24,
      desktop: 24
    },
    {
      id: "faq",
      name: "FAQ",
      href: "#frequently-asked-questions",
      mobile: 24,
      desktop: 24
    },
    {
      id: "portal",
      name: "User Portal",
      href: "/portal",
      mobile: 24,
      desktop: 24
    }
  ];

  return (
    <nav className="navbar relative z-[30] text-white">
      {/* Desktop Navigation */}
      <div className="hidden w-full items-center justify-between px-4 py-4 sm:px-6 lg:flex lg:px-8">
        <Link href="/" className="flex-shrink-0">
          <img
            src="/assets/fullyhacks_logo.png"
            alt="FullyHacks 2025"
            className="w-16 md:w-24"
          />
        </Link>

        <ul className="flex items-center gap-4">
          {menuList.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 whitespace-nowrap">
              <Link
                href={item.href}
                className="group relative py-2 text-sm sm:text-base lg:text-lg xl:text-xl">
                {item.name}
                <span className="absolute bottom-0 block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full group-focus:w-full" />
              </Link>
              {index < menuList.length - 1 && (
                <span className="h-[1.5em] w-[3px] bg-white" />
              )}
            </div>
          ))}
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div className="flex w-full items-center justify-between px-4 lg:hidden">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn p-2">
            <HiMenu className="h-12 w-12 opacity-80" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact z-[3] mt-3 min-w-max scale-110 bg-[#27233f] p-4 shadow">
            {menuList.map((item) => (
              <div key={item.id} className="flex">
                <Link href={item.href} className="w-full px-6 py-2.5">
                  <p className="cursor-pointer whitespace-nowrap text-base transition-all duration-200 hover:text-purple_main_hover sm:text-lg">
                    {item.name}
                  </p>
                </Link>
              </div>
            ))}
          </ul>
        </div>
        <img
          src="/assets/fullyhacks_logo.png"
          alt="FullyHacks 2025"
          className="h-16 w-16 transition-all duration-200 sm:h-20 sm:w-20"
        />
      </div>
    </nav>
  );
};

export const GenericNavBar = () => {
  return (
    <nav className="flex flex-row-reverse items-center justify-center px-4 py-8">
      <Link
        href="/"
        className="z-10 ml-auto flex cursor-pointer items-center gap-4 rounded-md bg-gradient-to-r from-[#72D6E6] to-[#173162] p-2 text-white transition-all duration-300 hover:brightness-110">
        <button className="text-sm font-semibold md:text-md">
          Back to Home
        </button>
        <IoArrowBackSharp className="h-8 w-8 scale-x-[-1] cursor-pointer" />
      </Link>
    </nav>
  );
};

export const AuthNavBar = () => {
  return (
    <nav className="z-10 flex flex-row-reverse items-center justify-between px-4 py-8 md:flex-row md:py-4">
      <Link href="/" className="z-10 hidden md:block">
        <img
          alt="nav bar logo"
          src="/assets/fullyhacks_logo.png"
          className="w-16 md:w-24"
        />
      </Link>
      <div className="z-10 text-md text-white">
        <button
          onClick={() => signOut()}
          className="group relative py-1 text-md">
          Sign out
          <span className="absolute bottom-1 block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full group-focus:w-full" />
        </button>
      </div>
    </nav>
  );
};

export const FeedNavBar = () => {
  return (
    <nav className="flex items-center text-purple_main">
      <Link href="/">
        <img
          alt="nav bar logo"
          src="/assets/logo.svg"
          className="my-4 ml-4 h-16 w-16 cursor-pointer md:ml-10 md:h-20 md:w-20"
        />
        <div className="mr-4 ml-auto text-md text-white md:mr-10">
          <button onClick={() => signOut()}> Sign out</button>
        </div>
      </Link>
    </nav>
  );
};

interface FeedSideBarProps {
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

export const FeedSideBar: React.FC<FeedSideBarProps> = ({ setLocation }) => {
  const [currIdx, setIdx] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const feedItems = [
    {
      id: "feed01",
      name: "Home",
      icon: <BiHomeAlt size={28} />
    },
    {
      id: "feed02",
      name: "Announcements",
      icon: <HiOutlineSpeakerphone size={28} />
    },
    {
      id: "feed03",
      name: "Events",
      icon: <BiCalendarEvent size={28} />
    },
    {
      id: "feed07",
      name: "Tracks & Prizes",
      icon: <HiOutlineTrophy size={28} />
    },
    {
      id: "feed04",
      name: "FullyPacks",
      icon: <SlEnergy size={28} />
    },
    {
      id: "feed05",
      name: "Resources",
      icon: <BsLightbulb size={28} />
    },
    {
      id: "feed08",
      name: "FAQs",
      icon: <AiOutlineQuestionCircle size={28} />
    },
    {
      id: "feed06",
      name: "Profile",
      icon: <BiUserCircle size={28} />
    }
  ];

  return (
    <>
      {!isOpen && (
        <AiOutlineMenu
          onClick={() => setOpen(true)}
          className="fixed top-[5rem] left-4 z-20 cursor-pointer stroke-[2] text-[#EF4DB3]"
          size={24}
        />
      )}

      {/* Blur overlay */}
      <div
        className={`fixed inset-0 z-40 bg-purple_dark/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="h-full w-80 bg-purple_dark p-8 text-sm font-semibold text-[#EF4DB3]">
          <div className="mb-8 flex items-center justify-between">
            <img
              src="/assets/logo.svg"
              alt="Fully logo"
              className="h-10 w-10"
            />
            <AiOutlineClose
              onClick={() => setOpen(false)}
              size={24}
              className="cursor-pointer"
            />
          </div>

          <ul className="space-y-4">
            {feedItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setLocation(item.name);
                  setIdx(idx);
                  setOpen(false);
                }}
                className={`flex w-full items-center rounded-lg p-3 transition-colors duration-200 ${
                  currIdx === idx
                    ? "bg-[rgba(255,136,229,0.4)] text-white"
                    : "hover:bg-[rgba(255,136,229,0.2)]"
                }`}>
                {item.icon}
                <span className="ml-4 text-white">{item.name}</span>
              </button>
            ))}
          </ul>

          <div className="mt-8 border-t border-[#EF4DB3] pt-8">
            <button
              onClick={() => signOut()}
              className="flex w-full items-center rounded-lg p-3 text-red-400 transition-colors duration-200 hover:bg-red-400/10">
              <BiLogOut size={28} />
              <span className="ml-4">Sign Out</span>
            </button>
          </div>

          <div className="absolute bottom-8 left-8 flex items-center gap-4">
            <BsDiscord size={28} />
            <a
              target="_blank"
              href={links.discord}
              className="text-white transition-colors duration-200 hover:text-[#EF4DB3]">
              Discord Server
            </a>
          </div>
        </div>
      </div>

      {/* Desktop sidebar*/}
      <div className="mx-4 mt-12 hidden basis-1/5 text-sm font-semibold text-[#EF4DB3] md:mx-10 md:block md:text-md">
        <ul className="border-b-2 p-2">
          {feedItems.map((item, idx) => {
            return (
              <button
                key={item.id}
                onClick={() => {
                  setLocation(item.name), setIdx(idx);
                }}
                className={`my-4 flex w-full items-center rounded-lg p-2 ${
                  currIdx == idx ? "bg-[rgba(255,136,229,0.4)] text-white" : ""
                }`}>
                {item.icon}
                <li className="ml-4 text-white">{item.name}</li>
              </button>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center gap-4 text-center">
          <BsDiscord size={28} />
          <a target={"_blank"} href={links.discord} className="text-white">
            Discord Server
          </a>
        </div>
      </div>
    </>
  );
};

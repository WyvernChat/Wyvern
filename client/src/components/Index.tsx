import React from "react"
import { FaArrowCircleRight, FaDoorOpen, FaDownload } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import logoUrl from "../img/logos/WyvernLogo-96x96.png"
import { useAuth } from "./Auth"

export function Index() {
    const navigate = useNavigate()
    const { authenticated } = useAuth()
    const links = [
        {
            title: "Download",
            url: "/download",
            icon: <FaDownload />,
            important: true,
            predicate: () => {
                return true
            }
        },
        {
            title: "Login",
            url: "/login",
            icon: <FaDoorOpen />,
            important: false,
            predicate: () => !authenticated
        },
        {
            title: "Register",
            url: "/register",
            icon: <FaArrowCircleRight />,
            important: false,
            predicate: () => !authenticated
        },
        {
            title: "Launch Wyvern",
            url: "/channels/@me",
            icon: <FaDoorOpen />,
            important: false,
            predicate: () => authenticated
        }
    ]

    return (
        <div>
            <nav>
                <Link to="#">
                    <img
                        src={logoUrl}
                        style={{
                            maxWidth: 40,
                            borderRadius: "50%"
                        }}
                    />
                    Wyvern
                </Link>
                {links.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: !item.predicate() ? "none" : ""
                        }}
                    >
                        <Link
                            style={{
                                color: item.important ? "#584EFF" : ""
                            }}
                            to={item.url}
                        >
                            {item.icon}
                            {item.title}
                        </Link>
                    </div>
                ))}
            </nav>
            <div>
                <p>
                    Hello there! It&apos; me, TKDKid1000, aka the lead, aka only developer of
                    Wyvern.
                </p>
                <p>
                    Just wanted to get a quick note that this is beta software and not complete in
                    the slightest. Here is a list of known bugs/errors that you shouldn&apos;t tell
                    me about, I know about them, am in the progress of fixing (pulled from text
                    messages, ignore abbreviations):
                </p>
                <ul>
                    <li>
                        if it&apos;s an on screen button and doesnt do anything, trust me i know
                        about it.
                    </li>
                    <li>
                        if chat stops working and you see &quot;polling&quot; or
                        &quot;websocket&quot; or &quot;socket.io&quot; anywhere in the console, lmk
                    </li>
                    <li>online/offline user thing kinda buggy fyi</li>
                    <li>
                        the message infinite scroll (where it loads more when you scroll to top)
                        isnt functional rn cuz in my sorta rewriting of the general way it works i
                        broke that and havent gotten around to fixing it
                    </li>
                    <li>
                        i have the ui of the channel editor made, i just havent implemented the
                        backend yet. my old implementation wasnt realtime and required a refresh of
                        browser.
                    </li>
                    <li>
                        any of the things that should be popups (join server button, create channel
                        button, etc) are gonna appear at the bottom of the screen because i was
                        using a library to handle modals earlier, but that library took over too
                        much of the apps styling so i removed it (rewrote a lot of frontend too) and
                        havent gotten around to fixing modals yet. i know abt it, just lazy.
                    </li>
                </ul>
                <p>
                    If you find bugs/errors other than these, make a GitHub issue at{" "}
                    <a href="https://github.com/WyvernChat/Wyvern">
                        https://github.com/WyvernChat/Wyvern
                    </a>
                    , or, if it&apos;s urgent (server crash), email me at{" "}
                    <a href="mailto:mail@tkdkid1000.net">mail@tkdkid1000.net</a>
                </p>
            </div>
        </div>
    )
}

import React from "react"
import { Container, Nav, Navbar } from "react-bootstrap"
import { FaArrowCircleRight, FaDoorOpen, FaDownload } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./Auth"

export function Index() {
    const navigate = useNavigate()
    const { authenticated } = useAuth()

    return (
        <div>
            <Navbar expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#">
                        <img
                            src="/img/logos/WyvernLogo-96x96.png"
                            style={{
                                maxWidth: 40,
                                borderRadius: "50%"
                            }}
                        />
                        Wyvern
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            {[
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
                            ].map((item, index) => (
                                <Nav.Item
                                    key={index}
                                    style={{
                                        display: !item.predicate() ? "none" : ""
                                    }}
                                >
                                    <Nav.Link
                                        style={{
                                            color: item.important ? "#584EFF" : ""
                                        }}
                                        onClick={() => {
                                            navigate(item.url)
                                        }}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

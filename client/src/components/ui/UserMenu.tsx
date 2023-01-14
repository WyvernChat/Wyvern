import { Modal, Overlay } from "@restart/ui"
import { Offset, Placement } from "@restart/ui/usePopper"
import React, { cloneElement, ReactElement, useEffect, useRef, useState } from "react"
import { FaCamera, FaCommentAlt, FaPhoneAlt } from "react-icons/fa"
import { useCachedUser } from "../../hooks/user"
import modalClasses from "../../scss/ui/modal.module.scss"
import classes from "../../scss/ui/usermenu.module.scss"
import { useLocalStorage } from "../../utils"
import Button from "./Button"
import TextInput from "./TextInput"
import { FadeTransition } from "./Transitions"

type UserMenuProps = {
    userId: string
    placement: Placement
    offset: Offset
    children: ReactElement
}

const UserMenu = ({ userId, placement, offset, children }: UserMenuProps) => {
    const [open, setOpen] = useState(false)
    const user = useCachedUser(userId)
    const [notes, setNotes] = useLocalStorage<{ [user: string]: string }>("usernotes", {})

    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)
    const closeMenu = (event: MouseEvent) => {
        if (menuRef.current) {
            if (
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }
    }
    const closeMenuKey = (event: KeyboardEvent) => {
        if (event.repeat) return
        if (event.key === "Escape") {
            setOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", closeMenu)
        document.addEventListener("keydown", closeMenuKey)
        return () => {
            document.removeEventListener("mousedown", closeMenu)
            document.removeEventListener("keydown", closeMenuKey)
        }
    }, [])

    useEffect(() => {
        return () => {
            setOpen(false)
            document.removeEventListener("mousedown", closeMenu)
            document.removeEventListener("keydown", closeMenuKey)
        }
    }, [])

    const [modal, setModal] = useState(false)
    const [verification, setVerification] = useState(0)

    const openCallVerificationMenuThingyThatIsReallyLongAndTotallyAJokeSoThatIsWhyIAmMakingThisFunctionNameSoLongAsWellLolThisIsGonnaSuck =
        () => {
            setModal(true)
        }

    return (
        <>
            <Overlay
                transition={FadeTransition}
                placement={placement}
                ref={menuRef}
                target={buttonRef}
                offset={offset}
                show={open}
            >
                {(props) => (
                    <div className={classes.usermenu} {...props}>
                        <div className={classes.picture}></div>
                        <div className={classes.section}>
                            <span className={classes.user}>
                                {user?.username}
                                <span className={classes.tag}>#{user?.tag}</span>
                            </span>
                            <div className={classes.separator}></div>
                            <div className={classes.buttons}>
                                <button className={classes.button}>
                                    Message
                                    <FaCommentAlt />
                                </button>
                                <button className={classes.button}>
                                    Audio Call
                                    <FaPhoneAlt />
                                </button>
                                <button
                                    className={classes.button}
                                    onClick={openCallVerificationMenuThingyThatIsReallyLongAndTotallyAJokeSoThatIsWhyIAmMakingThisFunctionNameSoLongAsWellLolThisIsGonnaSuck.bind(
                                        this
                                    )}
                                >
                                    Video Call
                                    <FaCamera />
                                </button>
                            </div>
                        </div>
                        <div className={classes.section}>
                            <div className={classes.title}>About Me</div>
                            <div className={classes.aboutme}>
                                This is the demo bio. You need to add this feature.
                            </div>
                            <div className={classes.separator}></div>
                            <div className={classes.title}>Note</div>
                            <TextInput
                                placeholder="Click to add a note"
                                value={notes[userId] || ""}
                                style={{
                                    width: "100%"
                                }}
                                onChange={(event) =>
                                    setNotes({
                                        ...notes,
                                        [userId]: (event.target as HTMLInputElement).value
                                    })
                                }
                            />
                        </div>
                    </div>
                )}
            </Overlay>
            {cloneElement(children, {
                ref: buttonRef,
                onClick() {
                    setOpen(true)
                },
                onKeyDown(event: KeyboardEvent) {
                    if (event.key === "Enter") setOpen(true)
                }
            })}
            <Modal
                show={modal}
                onHide={() => setModal(false)}
                className={modalClasses.modal}
                renderBackdrop={(props) => <div {...props} className={modalClasses.background} />}
            >
                <div className="FadeTransition">
                    <div>
                        <h2>
                            {verification === 5 ? "Connected: Dwayne" : "Are you sure about that?"}
                        </h2>
                    </div>
                    <div>
                        <div className="VStack-3">
                            {verification === 0 && (
                                <>
                                    <span>
                                        You are about to <em>call</em> someone, I mean like, this
                                        will ring on their device. They will <em>know it</em>. If
                                        you do this, you might be blocked by them, nobody likes
                                        getting calls. Do you? Didn&apos;t think so. Just turn back
                                        now, before it is too late.
                                    </span>
                                    <Button variant="danger" onClick={() => setVerification(1)}>
                                        Proceed (bad idea...)
                                    </Button>
                                </>
                            )}
                            {verification === 1 && (
                                <>
                                    <span>Please authorize with your ssn:</span>
                                    <TextInput
                                        placeholder="Social Security Number"
                                        type="password"
                                    />
                                    <Button variant="danger" onClick={() => setVerification(2)}>
                                        Verify (bad idea...)
                                    </Button>
                                </>
                            )}
                            {verification === 2 && (
                                <>
                                    <span>Please authorize with with touch id:</span>
                                    <Button variant="danger" onClick={() => setVerification(3)}>
                                        Authorize Touch ID on Mobile Device (bad idea...)
                                    </Button>
                                </>
                            )}
                            {verification === 3 && (
                                <>
                                    <span>Please authorize with with fade id:</span>
                                    <Button variant="danger" onClick={() => setVerification(4)}>
                                        Authorize Fade ID on Mobile Device (bad idea...)
                                    </Button>
                                </>
                            )}
                            {verification === 4 && (
                                <>
                                    <span>Please enter your mom&apos;s phone number:</span>
                                    <TextInput type="tel" placeholder="Mom's phone number" />
                                    <Button variant="danger" onClick={() => setVerification(5)}>
                                        Verify (bad idea...)
                                    </Button>
                                </>
                            )}
                            {verification === 5 && (
                                <>
                                    <div>You asked for this...</div>
                                    <div>
                                        <img
                                            src="https://media.tenor.com/kHcmsxlKHEAAAAAC/rock-one-eyebrow-raised-rock-staring.gif"
                                            className={classes.dwayne}
                                        />
                                    </div>
                                    <div>Unfortunately, you cannot hang up. Tis Dwayne.</div>
                                </>
                            )}
                            {verification == 5 ? (
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setModal(false)
                                        setVerification(0)
                                    }}
                                    disabled
                                >
                                    Hang Up
                                </Button>
                            ) : (
                                <Button
                                    variant="success"
                                    onClick={() => {
                                        setModal(false)
                                        setVerification(0)
                                    }}
                                >
                                    Turn Back Now (click this)
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default UserMenu

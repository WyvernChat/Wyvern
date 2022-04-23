import axios from "axios"
import React, { useState } from "react"
import { Button, Stack } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

export function Register() {
    const [emailTaken, setEmailTaken] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    return (
        <div className="Login-Card">
            <form
                onSubmit={async (event) => {
                    event.preventDefault()
                    const result = await axios.post("/api/auth/register", {
                        email: email,
                        password: password,
                        username: username
                    })
                    if (result.status >= 400) {
                        console.log(result.data.error)
                    } else if (result.status === 201) {
                        navigate("/login")
                    }
                }}
                noValidate
                autoComplete="off"
            >
                <div className="text-center">
                    <h4>Create an account</h4>
                </div>
                <Stack gap={4}>
                    <div className="Input-Form">
                        <div>Email</div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="Input-Form">
                        <div>Username</div>
                        <input
                            id="username"
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="Input-Form">
                        <div>Password</div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="Input-Form">
                        <Button
                            type="submit"
                            variant="primary"
                            style={{
                                width: "100%"
                            }}
                        >
                            Login
                        </Button>
                        <div>
                            Already have an account? <Link to="/login">Login</Link>
                        </div>
                    </div>
                </Stack>
            </form>
        </div>
    )
}

// export class Register extends Component<
//     {},
//     {
//         emailTaken: boolean
//         email: string
//         password: string
//         username: string
//         registerError?: string
//     }
// > {
//     constructor(props: {}) {
//         super(props)
//         this.state = {
//             emailTaken: false,
//             email: "",
//             password: "",
//             username: ""
//         }
//     }

//     render() {
//         return (
//             <div>
//                 <Box display="block" width="100%" height="100%">
//                     <form
//                         onSubmit={async (event) => {
//                             event.preventDefault()
//                             const result = await axios.post("/api/auth/register", {
//                                 email: this.state.email,
//                                 password: this.state.password,
//                                 username: this.state.username
//                             })
//                             if (result.status === 400) {
//                                 this.setState({
//                                     registerError: result.data.error
//                                 })
//                             } else if (result.status === 201) {
//                                 window.location.replace("/login")
//                             }
//                         }}
//                         noValidate
//                         autoComplete="off"
//                     >
//                         <Grid
//                             container
//                             spacing={0}
//                             direction="column"
//                             alignItems="center"
//                             justifyContent="center"
//                             style={{ minHeight: "100vh" }}
//                         >
//                             <Card
//                                 sx={{ minWidth: 750, justifySelf: "center", alignSelf: "center" }}
//                             >
//                                 <CardContent
//                                     sx={{
//                                         width: "100%"
//                                     }}
//                                 >
//                                     <h2>Register</h2>
//                                     <Grid container spacing={1} columns={1}>
//                                         <Grid item xs={1}>
//                                             <TextField
//                                                 id="email"
//                                                 error={this.state.emailTaken}
//                                                 helperText={
//                                                     this.state.emailTaken
//                                                         ? "The specified email is already in use!"
//                                                         : " "
//                                                 }
//                                                 label="Email"
//                                                 variant="outlined"
//                                                 fullWidth
//                                                 value={this.state.email}
//                                                 onChange={this.handleChange.bind(this)}
//                                             ></TextField>
//                                         </Grid>
//                                         <Grid item xs={1}>
//                                             <TextField
//                                                 id="password"
//                                                 helperText=" "
//                                                 label="Password"
//                                                 type="password"
//                                                 fullWidth
//                                                 variant="outlined"
//                                                 value={this.state.password}
//                                                 onChange={this.handleChange.bind(this)}
//                                             ></TextField>
//                                         </Grid>
//                                         <Grid item xs={1}>
//                                             <TextField
//                                                 id="username"
//                                                 helperText=" "
//                                                 label="Username"
//                                                 variant="outlined"
//                                                 fullWidth
//                                                 value={this.state.username}
//                                                 onChange={this.handleChange.bind(this)}
//                                             ></TextField>
//                                         </Grid>
//                                     </Grid>
//                                 </CardContent>
//                                 <CardActions>
//                                     <Button
//                                         type="submit"
//                                         size="large"
//                                         variant="outlined"
//                                         style={{ width: "100%" }}
//                                         disabled={this.state.emailTaken}
//                                     >
//                                         Register
//                                     </Button>
//                                 </CardActions>
//                             </Card>
//                         </Grid>
//                     </form>
//                     <Snackbar
//                         open={this.state.registerError !== undefined}
//                         autoHideDuration={10000}
//                     >
//                         <Alert severity="error" sx={{ width: "100%" }}>
//                             {this.state.registerError}
//                         </Alert>
//                     </Snackbar>
//                 </Box>
//             </div>
//         )
//     }

//     async handleChange(event: ChangeEvent<HTMLInputElement>) {
//         switch (event.target.id) {
//             case "email": {
//                 this.setState({
//                     email: event.target.value
//                 })
//                 this.checkEmail(event.target.value)
//                 break
//             }
//             case "password": {
//                 this.setState({
//                     password: event.target.value
//                 })
//                 break
//             }
//             case "username": {
//                 this.setState({
//                     username: event.target.value
//                 })
//                 break
//             }
//         }
//     }

//     async checkEmail(email: string) {
//         if (email.length === 0) {
//             this.setState({
//                 emailTaken: false
//             })
//         } else {
//             const emailAvailable = (await axios.get(`/api/auth/isEmailAvailable/${email}`)).data
//             this.setState({
//                 emailTaken: !emailAvailable.available
//             })
//         }
//     }
// }

import { useEffect, useState} from "react"
import AuthContext from "./AuthContext"

const AuthState = (props) => {
    const[isAuthenticated,setisAuthenticated]=useState(false)
    const[isSignUp,setisSignUp]=useState(false)
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setisAuthenticated(true)
        }
        else{
            setisAuthenticated(false)
        }
        if (localStorage.getItem("SignUptoken")) {
            setisSignUp(true)
          
        } else {
          setisSignUp(false)
        }
    }, [])
    const login = (token)=>{
        localStorage.setItem("token",token)
        setisAuthenticated(true)
    }
    const signUp = (token)=>{
        localStorage.setItem("SignUptoken",token)
        setisSignUp(true)
    }
    const logout = ()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("SignUptoken")
        setisAuthenticated(false)
        setisSignUp(false)
    }
  return (
    <AuthContext.Provider value={{isAuthenticated,isSignUp,login,signUp,logout}}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import SignIn from './SignIn'
import SignUp from './SignUp'
import PasswordReset from './PasswordReset'
import CodeInput from './CodeInput'
import PasswordChange from './PasswordChange'

const Auth = () => {

    const [authView, setAuthView] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    

    switch (authView) {
        
        case "login":
            
            return (
                <>
                
                <SignIn viewSetter={setAuthView}/>
                </>
                
            )
        case "register":
            
            return (
                <SignUp viewSetter={setAuthView} emailSentSetter={setEmailSent}/>
            )
        case "passwordReset":
            return (
                <PasswordReset viewSetter={setAuthView} emailSentSetter={setEmailSent}/>
            )
        case "codeInput":
            return (
                <CodeInput viewSetter={setAuthView}/>
            )
        case "passwordChangeInput":
            return (
                <PasswordChange viewSetter={setAuthView}/>
            )
        default:
            return (
                <SignIn viewSetter={setAuthView}/>
            )
    }


}

export default Auth
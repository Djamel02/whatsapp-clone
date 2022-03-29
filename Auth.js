
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "./components/Loading";
import { auth, db } from "./firebase";
import Login from './pages/login'

const AuthContext = createContext({});
export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loding, setLoding] = useState(false)
    useEffect(() => {
    
      return auth.onIdTokenChanged(async (user) => {
          if(!user) {
                console.log('no user');
                setCurrentUser(null)
                setLoding(false)
                return;
          }
          const token = await user.getIdToken()
          const userData = {
              displayName: user.displayName,
              email: user.email,
              lastSeen: serverTimestamp(),
              photoUrl: user.photoURL
          }
          await setDoc(doc(db, 'users', user.uid), userData)
          console.log('user token', token);
          setCurrentUser(user)
          setLoding(false)
          return;
      })
    }, [])

    if(loding){
        return <Loading type='bubbles' color='rgb(0,150,136)' />
    }
    if(!currentUser) {
        return <Login />
    }
    else{
        return (
            <AuthContext.Provider value={{ currentUser }} >
                {children}
            </AuthContext.Provider>
        )   
    }
}
export const useAuth = () => useContext(AuthContext)
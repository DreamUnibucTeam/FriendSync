import React, { useEffect, useState, createContext } from "react";
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { clearIntervalAsync } from 'set-interval-async'
import { useHttp } from '../hooks/http.hook'
import { auth } from '../firebase/firebase'

const UserContext = createContext([{}, () => {}]);


const UserProvider = (props) => {
  useEffect(() => {
    
  }, [])

  const [state, setState] = useState({
    uid: "",
    displayName: "",
    email: "",
    isLoggedIn: false,
    profilePhotoUrl: "default",
  });

  return (
    <UserContext.Provider value={[state, setState]}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

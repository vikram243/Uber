import React, {useState} from 'react'
import { UserDataContext } from './UserDataContext';

const UserContext = ({children}) => {
  
  // State to hold user data, initialized with null values
  const [userData, setUserData] = useState({
    fullname:{
      firstname: null,
      lastname: null,
    },
    email: null,
  })

  return (
    <div>
      <UserDataContext.Provider value={{userData, setUserData}}>
        {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default UserContext

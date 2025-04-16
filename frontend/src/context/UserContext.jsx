import React, {createContext} from 'react'
export const UserDataContext = createContext()


const UserContext = ({children}) => {
  const [userData, setUserData] = React.useState({
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

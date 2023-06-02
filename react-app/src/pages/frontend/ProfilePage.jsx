import React from 'react'
import Profile from '../../components/frontend/Profile'
import Meta from '../../components/frontend/Meta'
import Maps from '../../components/frontend/Maps'

const ProfilePage = () => {
  return (
    <>
      <Meta title={"Thông tin người dùng"} />
      <Maps title="Thông tin người dùng" />
      <Profile />
    </>
  )
}

export default ProfilePage
import React, { useEffect } from 'react'
import Signup from '../components/Signup/Signup'

const SignupPage = () => {

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((slate) => slate.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/")
    }
  }, [])
  
  return (
    <div>
      <Signup />
    </div>
  )
}

export default SignupPage

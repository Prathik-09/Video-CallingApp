import { useMutation, useQueryClient } from '@tanstack/react-query';
import  { useState } from 'react'
import { login } from '../lib/api';
import { ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
function Login() {
  const [loginData,setloginData]=useState({
    email:"",
    password:"",
  });

  const{error,isPending,loginMutation}=useLogin();

  const handleLogin=(e)=>{
    e.preventDefault();
    loginMutation(loginData);
  }
  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
      {/*Login form Section */}
      <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
      {/*Logo */}
      <div className="mb-4 flex items-center justify-start gap-2">
        <ShipWheelIcon className='size-9 text-primary'/>
        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
          Streamify
        </span>
      </div>

        {error&&(
          <div className="alert alert-error mb-4">
            <span>{error.response.data.message}</span>
          </div>
        )}
        <div className="w-full">
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
              <h2 className="text-xl font-semibold">
                WelCome Back
              </h2>
              <p className="text-sm opacity-70">
                Sign in to your account to continue your language journey
              </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="form-control w-full space-y-2">
                  <label className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                  <input type="email" 
                  placeholder='hello@exsmple.com' 
                  value={loginData.email} 
                  className='input input-bordered w-full' 
                  onChange={(e)=>setloginData({...loginData,email:e.target.value})} 
                  required
                  />
                </div>
                <div className="form-control w-full space-y-2">
                  <label className='label'>
                    <span className='label-text'>Password</span>
                  </label>
                  <input type="password" 
                  placeholder='********' 
                  value={loginData.password} 
                  className='input input-bordered w-full' 
                  onChange={(e)=>setloginData({...loginData,password:e.target.value})} 
                  required
                  />
                </div>

                <button type='submit' className='btn btn-primary w-full' disabled={isPending}>
                  {
                    isPending?(
                    <>
                    <span className='loading loading-spinner loading-xs'></span>
                    Signing in...
                    </>
                    ):(
                      "Sign In"
                    )
                  }
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                    Create one
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/Video call-bro.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

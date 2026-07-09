import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import styles from '../../styles/styles'
import { Link, useNavigate } from 'react-router-dom'
import { RxAvatar } from 'react-icons/rx'
import axios from 'axios'
import { server } from '../../../server'

const Signup = () => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [avatar, setAvatar] = useState(null)
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError('');

        if (!avatar) {
            setError('Please upload an avatar file');
            return;
        }

        const config = {headers: {"Content-Type": "multipart/form-data"}}
        const newform = new FormData();

        newform.append("file", avatar);
        newform.append('name', name);
        newform.append("email", email);
        newform.append("password", password);
        axios.post(`${server}/user/create-user`, newform, config)
        .then((res)=>{
            if(res.data.success === true){
                navigate('/')
            }
        }).catch((err)=>{
            const message = err.response?.data?.message || err.message;
            setError(message);
            console.log(message)
        })
    };

    const handlefileInputChnage = (e) => {
        const file = e.target.files[0];
        setAvatar(file)
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto md:w-full sm:max-w-md'>
                <h2 className='poppins mt-6 text-center text-3xl font-bold text-gray-900'>Sign Up</h2>
            </div>
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <p className='text-sm text-red-600'>{error}</p>
                        )}
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                                Full Name
                                <div className='mt-1'>
                                    <input type="text" name="text" autoComplete='name' value={name} onChange={(e) => setName(e.target.value)} className='appearance-none block w-full px-3 py-2 border border-gray rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' required />
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                                Email address
                                <div className='mt-1'>
                                    <input type="email" name="email" autoComplete='email' value={email} onChange={(e) => setEmail(e.target.value)} className='appearance-none block w-full px-3 py-2 border border-gray rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' required />
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700'>
                                Password
                            </label>
                            <div className='mt-1 relative'>
                                <input type={visible ? "text" : "password"} name="password" autoComplete='current-password' value={password} onChange={(e) => setPassword(e.target.value)} className='appearance-none block w-full px-3 py-2 border border-gray rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' required />
                                {visible ?
                                    (<AiOutlineEye className='absolute right-2 top-2 cursor-pointer' size={25} onClick={() => setVisible(false)} />)
                                    : (<AiOutlineEyeInvisible className='absolute right-2 top-2 cursor-pointer' size={25} onClick={() => setVisible(true)} />)
                                }
                            </div>
                        </div>
                        <div className={`${styles.normalFlex} justify-between`}>
                            <div className={`${styles.normalFlex}`}>
                                <input type="checkbox" name="remember-me" id="remember-me" 
                                className='h4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'/>
                                <label htmlFor="remember-me" className='ml-2 block text-sm text-gray-900'>
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href=".forgot-password" className='font-medium text-blue-600 hover:text-blue-500'>
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="avatar" className='block text-sm font-medium text-gray-700'></label>
                            <div className="mt-2 flex items-center">
                                <span className='inline-block h-8 w-8 rounded-full overflow-hiddden'>
                                    {
                                        avatar ? 
                                        <img src={URL.createObjectURL(avatar)} alt=""  className='h-full w-full object-cover rounded-full'/> : 
                                        <RxAvatar className='h-8 w-8'/>
                                    }
                                </span>
                                <label htmlFor="file-input" className='ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
                                    <span>Upload a file</span>
                                    <input type="file" name="avatar" id="file-input" accept='.jpg,.jpeg,.png' onChange={handlefileInputChnage} className='sr-only'/>
                                </label>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className='group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'>
                                Sign Up
                            </button>
                        </div>
                        <div className={`${styles.normalFlex} w-full`}>
                            <h4>Already have an account</h4>
                            <Link to='/' className='text-blue-600 pl-2'>Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../lib/axios';

const ProfilePage = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            const res = await axiosInstance.get(`/auth/users/${username}`);
            setUser(res.data);
        } catch (error) {
            console.log("error in getting user: ", error);
        }
    };

    useEffect(() => {
        getUser();
    }, [username]);

    return (
        <div className='h-100% pt-20'>
            <div className='max-w-2xl mx-auto p-4 py-8'>
                <div className='bg-base-300 rounded-xl p-6 space-y-8 '>
                    <h1 className='text-2xl font-semibold text-center'>{username}</h1>
                </div>

                <div className='text-center mt-5'>
                    <img
                        src={user?.profilePic || "/avatar.png"}
                        alt="Profile"
                        className="size-32 rounded-full object-cover border-4 mx-auto"
                    />
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
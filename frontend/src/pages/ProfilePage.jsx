import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../lib/axios';
import ViewImage from '../components/viewImage';
import { Languages, ScrollText, User } from 'lucide-react';

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
                    <ViewImage
                        classes="size-32 rounded-full object-cover border-4 mx-auto"
                        src={user?.profilePic || "/avatar.png"}
                        alt="Profile"
                    />
                </div>

                {/* bio Section */}
                <div className="relative space-y-1.5">
                    <div className="text-sm text-zinc-400 flex items-center gap-2">
                        <ScrollText className="w-4 h-4" />
                        Biography
                    </div>
                    {(
                        <p className="px-4 py-2.5 bg-base-300 rounded-lg border w-full" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{user?.bio}</p>
                    )}
                </div>

                {/* Fluent Languages*/}
                <div className="relative space-y-1.5 mt-5">
                    <div className="text-sm text-zinc-400 flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        Fluent Languages
                    </div>

                    <p className="px-4 py-2.5 bg-base-300 rounded-lg border w-full">
                        {user?.speaks.join(', ') || 'No languages selected'}
                    </p>

                </div>

                {/* Studied Languages*/}
                <div className="relative space-y-1.5">
                    <div className="text-sm text-zinc-400 flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        Studied Languages
                    </div>

                    <p className="px-4 py-2.5 bg-base-300 rounded-lg border w-full">
                        {user?.learns.join(', ') || 'No languages selected'}
                    </p>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
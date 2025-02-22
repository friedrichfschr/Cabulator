import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Languages, Mail, ScrollText, User } from 'lucide-react'
import Select from 'react-select';

const customSelectStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: 'var(--daisyui-bg-base-200)',
        borderColor: 'var(--daisyui-border-base-300)',
        borderRadius: '0.5rem',
        padding: '0.5rem',
        color: 'var(--daisyui-text-primary-content)',
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: 'var(--daisyui-bg-primary)',
        color: 'var(--daisyui-text-primary-content)',

    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: 'var(--daisyui-text-primary-content)',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: 'var(--daisyui-text-primary-content)',
        ':hover': {
            backgroundColor: 'var(--daisyui-bg-primary-focus)',
            color: 'var(--daisyui-text-secondary)',
        },
    }),
    input: (provided) => ({
        ...provided,
        color: 'var(--daisyui-text-primary)', // Change the color of the search input text
    }),
};

const languagesOptions = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' },
    // Add more languages as needed
];

const EditProfilePage = () => {

    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(authUser?.Username || '');
    const [newBio, setNewBio] = useState(authUser?.bio || '');
    const [selectedFluentLanguages, setSelectedFluentLanguages] = useState(authUser?.speaks || []);
    const [selectedStudiedLanguages, setSelectedStudiedLanguages] = useState(authUser?.learns || []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file)

        reader.onload = async () => {
            const base64Image = reader.result;
            await updateProfile({ profilePic: base64Image })
        }
    };

    const handleSave = async () => {
        await updateProfile({ Username: newUsername, bio: newBio, speaks: selectedFluentLanguages, learns: selectedStudiedLanguages });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setNewUsername(authUser?.Username || '');
        setNewBio(authUser?.bio || '');
        setIsEditing(false);
    };


    return (
        <div className='h-100% pt-20'>
            <div className='max-w-2xl mx-auto p-4 py-8'>
                <div className='bg-base-300 rounded-xl p-6 space-y-8 '>

                    <h1 className='text-2xl font-semibold text-center'>Your Profile</h1>

                </div>

                {/* avatar upload section */}
                <div className="flex flex-col items-center gap-4 mt-5">
                    <div className="relative">
                        <img
                            src={authUser.profilePic || "/avatar.png"}
                            alt="Profile"
                            className="size-32 rounded-full object-cover border-4 "
                        />
                        <label
                            htmlFor="avatar-upload"
                            className={`
                            absolute bottom-0 right-0 
                            bg-base-content hover:scale-105
                            p-2 rounded-full cursor-pointer 
                            transition-all duration-200
                            ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                            `}
                        >
                            <Camera className="w-5 h-5 text-base-200" />
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUpdatingProfile}
                            />
                        </label>
                    </div>
                    <p className="text-sm text-zinc-400">
                        {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                    </p>
                </div>

                {/* Information section */}
                <div className="space-y-6 mt-4">

                    {/* Email Section */}
                    <div className="space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </div>
                        <p className="px-4 py-2.5 bg-base-300 rounded-lg border">{authUser?.email}</p>
                    </div>

                    {/* Username section */}
                    <div className="relative space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Username
                        </div>
                        {isEditing ? (
                            <textarea
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="px-4 py-2.5  rounded-lg border w-full"
                                maxLength={20}
                                rows={1}
                                style={{ resize: 'none' }}
                            />
                        ) : (
                            <p className="px-4 py-2.5 bg-base-300 rounded-lg border">{authUser?.Username}</p>
                        )}
                    </div>

                    {/* bio Section */}
                    <div className="relative space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <ScrollText className="w-4 h-4" />
                            Biography
                        </div>
                        {isEditing ? (
                            <textarea
                                value={newBio}
                                onChange={(e) => {
                                    const lineBreaks = (e.target.value.match(/\n/g) || []).length;

                                    if (lineBreaks <= 5) {
                                        setNewBio(e.target.value);
                                    }

                                }}
                                className="px-4 py-2.5 rounded-lg border w-full"
                                maxLength={300}
                                rows={3}
                                style={{ resize: 'none' }}
                            />
                        ) : (
                            <p className="px-4 py-2.5 bg-base-300 rounded-lg border w-full" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{authUser?.bio}</p>
                        )}
                    </div>


                    {/* Fluent Languages*/}
                    <div className="relative space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <Languages className="w-4 h-4" />
                            Fluent Languages
                        </div>
                        {isEditing ? (
                            <Select
                                isMulti
                                value={selectedFluentLanguages.map(lang => ({ value: lang, label: lang }))}
                                onChange={(selectedOptions) => setSelectedFluentLanguages(selectedOptions.map(option => option.value))}
                                options={languagesOptions}
                                className="basic-multi-select "
                                classNamePrefix="select"
                                styles={customSelectStyles}
                            />
                        ) : (
                            <p className="px-4 py-2.5 bg-base-300 rounded-lg border w-full">
                                {authUser?.speaks?.join(', ')}
                            </p>
                        )}
                    </div>

                    {/* Studied Languages*/}
                    <div className="relative space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <Languages className="w-4 h-4" />
                            Studied Languages
                        </div>
                        {isEditing ? (
                            <Select
                                isMulti
                                value={selectedStudiedLanguages.map(lang => ({ value: lang, label: lang }))}
                                onChange={(selectedOptions) => setSelectedStudiedLanguages(selectedOptions.map(option => option.value))}
                                options={languagesOptions}
                                className="basic-multi-select "
                                classNamePrefix="select"
                                styles={customSelectStyles}

                            />
                        ) : (
                            <p className="px-4 py-2.5 bg-base-300 rounded-lg border w-full">
                                {authUser.learns ? authUser.learns.join(', ') : 'none'}
                            </p>
                        )}
                    </div>

                    {/* Edit/Save/Cancel Buttons */}
                    <div className="flex justify-center gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            >
                                Edit
                            </button>
                        )}
                    </div>


                </div>
            </div>
        </div>
    )
}

export default EditProfilePage
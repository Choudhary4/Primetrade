import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import { IconCamera, IconUser, IconMail, IconLock, IconDeviceFloppy } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { FileUpload } from '../components/ui/file-upload';
import { Modal } from '../components/ui/modal';

import { Spotlight } from '../components/ui/spotlight';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPreview(user.profilePicture);
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        if (!isEditing) return;
        setShowUploadModal(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setName(user.name);
        setEmail(user.email);
        setPreview(user.profilePicture);
        setPassword('');
        setConfirmPassword('');
        setImage(null);
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password && password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (password) formData.append('password', password);
        if (image) formData.append('profilePicture', image);

        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            updateUser({ ...data, token: user.token });
            setMessage('Profile updated successfully');
            setTimeout(() => setMessage(''), 3000);
            setIsEditing(false);
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
            <Spotlight className="-top-10 left-0 md:left-60 md:-top-20" fill="white" />
            <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Update Profile Picture</h3>
                    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <FileUpload onChange={(files) => {
                            if (files.length > 0) {
                                const file = files[0];
                                setImage(file);
                                setPreview(URL.createObjectURL(file));
                                setShowUploadModal(false);
                            }
                        }} />
                    </div>
                </div>
            </Modal>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl"
            >
                <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20 dark:border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        {/* Sidebar / Profile Picture Section */}
                        <div className="md:col-span-1 bg-white/5 dark:bg-black/20 p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                            <div className={`relative group ${isEditing ? 'cursor-pointer' : ''}`} onClick={triggerFileInput}>
                                <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 border-4 border-white/20 shadow-lg">
                                    {preview ? (
                                        <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-neutral-400">
                                            <IconUser className="w-16 h-16 md:w-20 md:h-20 opacity-50" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <IconCamera className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                    </div>
                                )}
                            </div>
                            <h2 className="mt-4 md:mt-6 text-xl md:text-2xl font-bold text-neutral-800 dark:text-white text-center">{user?.name}</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center">{user?.email}</p>
                        </div>

                        {/* Main Content / Form Section */}
                        <div className="md:col-span-2 p-6 md:p-12">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                                <h3 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-white">Profile Details</h3>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm font-medium border border-emerald-500/20 text-center"
                                    >
                                        {message}
                                    </motion.div>
                                )}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20 text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h4 className="text-xs md:text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Personal Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <LabelInputContainer>
                                            <Label htmlFor="name" className="text-neutral-700 dark:text-neutral-300">Full Name</Label>
                                            <div className="relative">
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    disabled={!isEditing}
                                                    className={cn(
                                                        "pl-10 bg-white/50 dark:bg-neutral-900/50",
                                                        !isEditing && "opacity-70 cursor-not-allowed"
                                                    )}
                                                    placeholder="Your name"
                                                />
                                                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                            </div>
                                        </LabelInputContainer>
                                        <LabelInputContainer>
                                            <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300">Email Address</Label>
                                            <div className="relative">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    disabled={!isEditing}
                                                    className={cn(
                                                        "pl-10 bg-white/50 dark:bg-neutral-900/50",
                                                        !isEditing && "opacity-70 cursor-not-allowed"
                                                    )}
                                                    placeholder="your.email@example.com"
                                                />
                                                <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                            </div>
                                        </LabelInputContainer>
                                    </div>
                                </div>

                                {/* Security */}
                                <div className="space-y-4">
                                    <h4 className="text-xs md:text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Security</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <LabelInputContainer>
                                            <Label htmlFor="password" className="text-neutral-700 dark:text-neutral-300">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    disabled={!isEditing}
                                                    className={cn(
                                                        "pl-10 bg-white/50 dark:bg-neutral-900/50",
                                                        !isEditing && "opacity-70 cursor-not-allowed"
                                                    )}
                                                    placeholder={isEditing ? "Leave blank to keep" : "••••••••"}
                                                />
                                                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                            </div>
                                        </LabelInputContainer>
                                        <LabelInputContainer>
                                            <Label htmlFor="confirmPassword" className="text-neutral-700 dark:text-neutral-300">Confirm Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    disabled={!isEditing}
                                                    className={cn(
                                                        "pl-10 bg-white/50 dark:bg-neutral-900/50",
                                                        !isEditing && "opacity-70 cursor-not-allowed"
                                                    )}
                                                    placeholder={isEditing ? "Leave blank to keep" : "••••••••"}
                                                />
                                                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                            </div>
                                        </LabelInputContainer>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white font-bold shadow-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-200"
                                        >
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full sm:w-auto relative px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        <span>Saving...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconDeviceFloppy className="w-5 h-5" />
                                                        <span>Save Changes</span>
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn('flex flex-col space-y-2 w-full', className)}>
            {children}
        </div>
    );
};

export default Profile;

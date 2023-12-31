import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageCard from './ImageCard';
import toast from 'react-hot-toast'
import UserStorage from './UserStorage';
import UserUsage from './UserUsage';
import { useAuth } from '../context/auth'
export default function Drive() {
    const [updateUI, setUpdateUI] = useState(false)
    const [images, setImages] = useState([])

    const auth = useAuth()
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleUpload(file)
        }
        event.target.value = null

    };

    const handleUpload = async (selectedFile) => {
        if (!selectedFile) {
            alert('Please select a file before uploading');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('userId', auth.user._id)

            const response = axios.post(`${process.env.REACT_APP_IMAGE_SERV}/api/photo/upload`, formData);

            const { error } = await toast.promise(response, {
                loading: 'Uploading image...',
                success: 'Image uploaded successfully',
                error: (err) => err.response.data.msg,
            }
            )
            if (!error) {
                setUpdateUI(!updateUI)
            }

        } catch (error) {
            console.log(error)

        }
    };

    const fetchImages = () => {
        axios.get(`${process.env.REACT_APP_IMAGE_SERV}/api/photo/user/${auth.user?._id}`)
            .then((res) => {
                setImages(res.data)
            })
            .catch((err) => {
                console.log('error')
            })
    }

    useEffect(() => {
        fetchImages();
    }, [updateUI])

    return (
        <div className='m-8 mt-10'>

            <div className='mb-5 flex flex-col md:flex-row w-full'>

                <div class="flex items-center justify-center w-full md:w-1/2 mb-4">
                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-emerald-300 border-dashed rounded-lg cursor-pointer bg-emerald-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-emerald-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center justify-center pt-3 pb-6">
                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span></p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF </p>
                        </div>
                        <input onChange={(e)=>handleFileChange(e)} id="dropzone-file" type="file" class="hidden" />
                    </label>
                </div>

                <div className='flex flex-col md:w-1/2 w-full md:ml-5 ml-0'>
                    <UserStorage updateUI={updateUI} />
                    <UserUsage updateUI={updateUI} />
                </div>

            </div>


            <div className="flex flex-wrap gap-6">
                {images.map((image) => (
                    <ImageCard url={image.url} image={image._id} setUpdateUI={setUpdateUI} />
                ))}
            </div>
        </div>
    );
}

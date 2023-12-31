import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';

export default function ImageCard({ url, image, setUpdateUI }) {

    const deleteImage = (e) => {
        e.stopPropagation(); // Stop event propagation to prevent the anchor link from being triggered
        axios.delete(`${process.env.REACT_APP_IMAGE_SERV}/api/photo/${image}`)
            .then((res) => {
                toast.success('Image deleted successfully.');
                setUpdateUI((cur) => !cur);
            })
            .catch((err) => {
                toast.error('Error in deleting image.');
            });
    }

    return (
        <div>
            <div className='relative border border-gray-400 rounded-lg h-64 w-72 hover:scale-105 transition-all cursor-pointer'>
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <img className="h-auto max-w-full rounded-lg" src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </a>
                <div onClick={(e) => deleteImage(e)} className='absolute top-0 right-0 m-2 p-2 rounded-full bg-red-50 hover:bg-red-200 hover:scale-110 cursor-pointer transition-all'>
                    <img src="trash-bin.png" className='h-8 w-8' alt="img" />
                </div>
            </div>
        </div>
    );
}

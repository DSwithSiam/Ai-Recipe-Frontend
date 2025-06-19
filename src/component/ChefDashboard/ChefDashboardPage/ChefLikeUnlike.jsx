

import React, { useEffect, useState } from 'react';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { usePostLikeUnlikeMutation } from '../../../Rudux/feature/ApiSlice';
import toast from 'react-hot-toast';

function ChefLikeUnlike({ post }) {
    const [PostLikeUnlike, { isLoading }] = usePostLikeUnlikeMutation();
    
    const [likes, setLikes] = useState(post.like_count || 0);
    const [isLiked, setIsLiked] = useState(post.is_liked || false); // ← from backend

    // Reset like state when post changes (e.g. on reload)
    useEffect(() => {
        setLikes(post.like_count || 0);
        setIsLiked(post.is_liked || false);
    }, [post]);

    const handleLike = async () => {
        try {
            await PostLikeUnlike({ id: post.id }).unwrap();
            const updatedLiked = !isLiked;
            setIsLiked(updatedLiked);
            setLikes(prev => updatedLiked ? prev + 1 : prev - 1);
            toast.success(updatedLiked ? 'Liked!' : 'Unliked!');
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className="flex items-center space-x-1 cursor-pointer text-[#5B21BD]"
        >
            {isLiked ? <IoIosHeart className="text-[#5B21BD]" /> : <IoIosHeartEmpty />}
            <span className="ml-1 text-base">{likes}</span>
        </button>
    );
}

export default ChefLikeUnlike;




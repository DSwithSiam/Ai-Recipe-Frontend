import React from 'react';
import { useShareChefPostMutation } from '../../../Rudux/feature/ApiSlice';
import { BsShare } from 'react-icons/bs';
import toast from 'react-hot-toast';

function ChefSharePost({ postId }) {
    const [ShareChefPost, { isLoading }] = useShareChefPostMutation();

    const handleShare = async () => {
        try {
            await ShareChefPost({ id: postId }).unwrap();
            toast.success("Post shared successfully!");
        } catch (error) {
            toast.error("Failed to share post.");
        }
    };

    return (
        <button
            onClick={handleShare}
            disabled={isLoading}
            className="flex items-center gap-2 cursor-pointer"
        >
            <BsShare />
            <span className="text-base">Share</span>
        </button>
    );
}

export default ChefSharePost;

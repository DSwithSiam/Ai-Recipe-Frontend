


import { useEffect, useState } from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { usePostBookmarkMutation } from '../../../Rudux/feature/ApiSlice';
import toast from 'react-hot-toast';

function ChefBookmark({ postId, onToggle }) {
    const localStorageKey = `bookmark-${postId}`;
    const initialBookmarkState = localStorage.getItem(localStorageKey) === 'true';
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarkState);
    const [PostBookmark, { isLoading }] = usePostBookmarkMutation();

    useEffect(() => {
        const stored = localStorage.getItem(localStorageKey) === 'true';
        setIsBookmarked(stored);
    }, [postId]);

    const handleBookmarkToggle = async () => {
        try {
            await PostBookmark({ id: postId, formData: {} }).unwrap();
            const newState = !isBookmarked;
            setIsBookmarked(newState);
            localStorage.setItem(localStorageKey, newState);
            onToggle && onToggle(newState);
            toast.success(newState ? 'Post saved' : 'Post unsaved');
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <button
            onClick={handleBookmarkToggle}
            disabled={isLoading}
            className="flex items-center gap-2 cursor-pointer text-[#5B21BD]"
        >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
            <span className="text-base">{isBookmarked ? 'Unsave' : 'Save'}</span>
        </button>
    );
}

export default ChefBookmark;

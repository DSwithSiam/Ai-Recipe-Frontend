





import { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { PiChefHatFill, PiDotsThreeOutlineFill } from 'react-icons/pi';
import { MdOutlineFileUpload } from 'react-icons/md';
import { FaRegCommentAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import {
  useChefCommentPostMutation,
  useDeletCommunityPostListMutation,
  useGetCommunityPostListQuery,
} from '../../../Rudux/feature/ApiSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import ChefLikeUnlike from '../../ChefDashboard/ChefDashboardPage/ChefLikeUnlike';
import ChefBookmark from '../../ChefDashboard/ChefDashboardPage/chefBookmark.jsx';
import ChefSharePost from '../../ChefDashboard/ChefDashboardPage/ChefSharePost.jsx';

const POSTS_PER_PAGE = 10;

const ChefCommunity = () => {
  const id = useParams();
  const [deletePost] = useDeletCommunityPostListMutation(id);
  const [chefCommentPost] = useChefCommentPostMutation();
  const [page, setPage] = useState(1);
  const { data: getCommunityPostList, refetch, isLoading } = useGetCommunityPostListQuery({ page });

  const communityPost = getCommunityPostList?.results?.data || [];
  const totalPosts = getCommunityPostList?.count || 0;
  const hasNextPage = !!getCommunityPostList?.next;
  const hasPreviousPage = page > 1;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const paginatedPosts = communityPost;
  console.log("paginatedPosts", paginatedPosts)

  const imageBaseUrl = 'https://bmn1212.duckdns.org';

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [viewCommentPostId, setViewCommentPostId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);

  useEffect(() => {
    console.log('Page:', page, 'Community Post:', communityPost, 'Paginated Posts:', paginatedPosts, 'Total Posts:', totalPosts);
  }, [page, communityPost, paginatedPosts, totalPosts]);

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId).unwrap();
      toast.success('Post deleted successfully!');
      setActiveDropdownId(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete the post.');
    }
  };

  const toggleDropdown = (postId) => {
    setActiveDropdownId((prev) => (prev === postId ? null : postId));
  };

  const toggleAddChefModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      if (image?.preview) URL.revokeObjectURL(image.preview);
      setImage(null);
      setTitle('');
      setContent('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !image?.file) {
      toast.error('Please fill in all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image.file);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://bmn1212.duckdns.org/api/community/v1/post/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to share your creation.');

      toggleAddChefModal();
      toast.success('Your post was shared successfully!');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to share your creation.');
    }
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setTitle(post.title);
    setContent(post.content);
    setImage({
      preview: post.image?.startsWith('http') ? post.image : `${imageBaseUrl}${post.image}`,
      file: null // Reset file when opening edit modal
    });
    setIsEditModalOpen(true);
    setActiveDropdownId(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // Only append image if a new one was selected
    if (image?.file) {
      formData.append('image', image.file);
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://bmn1212.duckdns.org/api/community/v1/post/update/${editPost.id}/`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update the post');
      }

      const data = await response.json();
      toast.success(data.message || 'Post updated successfully!');
      setIsEditModalOpen(false);
      if (image?.preview) URL.revokeObjectURL(image.preview);
      setImage(null);
      setTitle('');
      setContent('');
      setEditPost(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update the post.');
      console.error('Update error:', err);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (hasPreviousPage) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="px-10 md:w-4/5 w-full py-4 lora mx-auto">
      <div className='flex items-center justify-between'>
        <div>
          <h1 className="text-[#5B21BD] text-4xl md:text-[45px] font-semibold">Community</h1>
          <p className="text-[#A2A2A2] text-lg md:text-xl mt-2">
            Connect with other culinary enthusiasts, share your creations, and get inspired.
          </p>
        </div>
        <button
          onClick={toggleAddChefModal}
          className="flex items-center gap-2 px-4 py-2 text-white bg-[#5B21BD] rounded-[10px] cursor-pointer"
        >
          <span className="font-medium ">Share Creation</span>
          <IoMdAdd />
        </button>
      </div>

      <div className="space-y-8 mt-4">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <div key={post.id} className="border border-white bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center">
        

                <div className="flex items-center">
                  <img
                    src={
                      post.user.profile_image?.startsWith('http')
                        ? post.user.profile_image
                        : `${imageBaseUrl}${post.user.profile_image}`
                    }
                    alt="user/chef"
                    className="w-10 h-10 bg-gray-300 rounded-full mr-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div>
                    <p className="font-semibold text-[#5B21BD] capitalize">{post.user.username}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: true })}
                    </p>
                  </div>
                </div>
                <div className="relative flex items-center gap-6">
                  {post.user.role === 'Chef' && (
                    <span className="flex items-center gap-2 bg-[#EFE9F8] px-2 py-1 rounded text-[#5B21BD]">
                      Chef <PiChefHatFill />
                    </span>
                  )}
                  <PiDotsThreeOutlineFill
                    className="text-[#A2A2A2] cursor-pointer"
                    onClick={() => toggleDropdown(post.id)}
                  />
                  {activeDropdownId === post.id && (
                    <div className="absolute right-0 top-8 bg-white border shadow-md rounded-lg z-50 w-32">
                      <button
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700"
                        onClick={() => handleEditPost(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-sm text-red-600"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-[#5B21BD] font-semibold capitalize">{post.title}</p>
                <p className="text-[#A2A2A2] text-sm mt-1">{post.content}</p>
              </div>
              <div className="mt-3 flex justify-center">
                <img
                  src={
                    post.image?.startsWith('http')
                      ? post.image
                      : `${imageBaseUrl}${post.image}`
                  }
                  alt="Post"
                  className=" rounded-lg lg:h-1/2 lg:w-1/2 h-full w-full  object-cover"
                />
              </div>
              <div className="flex justify-center items-center mt-3 text-[#5B21BD] py-6">
                <div className="flex text-3xl space-x-6">
                  <ChefLikeUnlike post={post} />
                  <button
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => {
                      setSelectedPostId(post.id);
                      setIsCommentModalOpen(true);
                    }}
                  >
                    <FaRegCommentAlt />
                  </button>
                  <span
                    onClick={() => setViewCommentPostId(post.id)}
                    className="text-base font-bold cursor-pointer"
                  >
                    {Array.isArray(post.comments) && post.comments.length > 0 && (
                      <span>{post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}</span>
                    )}
                  </span>
                  <ChefBookmark postId={post.id} isInitiallyBookmarked={post.is_bookmarked} />
                  <ChefSharePost postId={post.id} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No posts found</p>
          </div>
        )}
      </div>

      {totalPosts > POSTS_PER_PAGE && (
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevPage}
            disabled={!hasPreviousPage}
            className={`flex items-center px-4 py-2 rounded-lg ${hasPreviousPage ? 'bg-[#5B21BD] text-white hover:bg-[#4a1a9a]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors duration-200 cursor-pointer`}
          >
            <FaArrowLeft className="mr-2" />
            Previous
          </button>
          <div className="text-[#5B21BD] font-medium">
            Page {page} of {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={`flex items-center px-4 py-2 rounded-lg ${hasNextPage ? 'bg-[#5B21BD] text-white hover:bg-[#4a1a9a]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors duration-200 cursor-pointer`}
          >
            Next
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      )}

      {isCommentModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur bg-opacity-30">
          <div className="bg-white rounded-lg shadow w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsCommentModalOpen(false)}
              className="absolute top-2 right-3 text-gray-600 text-xl cursor-pointer"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-[#5B21BD] mb-4">Comment</h2>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="4"
              placeholder="Write your comment"
              className="w-full p-3 border text-gray-400 text-xl border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21BD]"
            ></textarea>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={async () => {
                  if (!commentText.trim()) {
                    toast.error('Comment cannot be empty');
                    return;
                  }
                  try {
                    await chefCommentPost({
                      id: selectedPostId,
                      formData: { content: commentText },
                    }).unwrap();
                    toast.success('Comment posted!');
                    setCommentText('');
                    setIsCommentModalOpen(false);
                    refetch();
                  } catch (err) {
                    toast.error('Failed to post comment.');
                  }
                }}
                className="px-4 py-2 bg-[#5B21BD] text-white rounded-lg cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {viewCommentPostId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur bg-opacity-30">
          <div className="bg-white rounded-lg shadow w-full max-w-md p-6 relative">
            <button
              onClick={() => setViewCommentPostId(null)}
              className="absolute top-2 right-3 text-gray-600 text-xl cursor-pointer"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-[#5B21BD] mb-4">Comments</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {communityPost.find(post => post.id === viewCommentPostId)?.comments?.length > 0 ? (
                communityPost
                  .find(post => post.id === viewCommentPostId)
                  .comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <img
                        src={comment.user.image || '/default-avatar.png'}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-gray-800 font-semibold">{comment.user?.username || 'Anonymous'}</p>
                        <p className="text-sm text-gray-600">{comment.content}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#5B21BDCC] bg-opacity-50 flex items-center justify-center z-100">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#5B21BD]">Share Your Creation</h2>
              <button
                onClick={toggleAddChefModal}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-xl">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#5B21BD]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-xl mb-2">Description</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#5B21BD]"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 text-xl">Photo</label>
                <div
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  {image?.preview ? (
                    <img
                      src={image.preview}
                      className="max-w-full max-h-48 object-contain mb-2"
                      alt="Preview"
                    />
                  ) : (
                    <>
                      <MdOutlineFileUpload className="text-[25px] text-gray-500" />
                      <span className="text-gray-500">Upload Image</span>
                    </>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    required={!isEditModalOpen}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={toggleAddChefModal}
                  className="px-4 py-2 border border-[#B0BFB6] rounded-[10px] text-[#5B21BD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5B21BD] text-white rounded-[10px] cursor-pointer"
                >
                  Share Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#5B21BDCC] bg-opacity-50 flex items-center justify-center z-100">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#5B21BD]">Edit Your Post</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  if (image?.preview) URL.revokeObjectURL(image.preview);
                  setImage(null);
                  setTitle('');
                  setContent('');
                  setEditPost(null);
                }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-xl">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#5B21BD]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-xl mb-2">Description</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#5B21BD]"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 text-xl">Photo</label>
                <div
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => document.getElementById('editFileInput').click()}
                >
                  {image?.preview ? (
                    <img
                      src={image.preview}
                      className="max-w-full max-h-48 object-contain mb-2 rounded-lg"
                      alt="Preview"
                    />
                  ) : (
                    <>
                      <MdOutlineFileUpload className="text-[25px] text-gray-500" />
                      <span className="text-gray-500">Upload New Image</span>
                    </>
                  )}
                  <input
                    id="editFileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                {editPost?.image && !image?.file && (
                  <p className="text-sm text-gray-500 mt-2">Current image will be kept if no new image is selected</p>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    if (image?.preview) URL.revokeObjectURL(image.preview);
                    setImage(null);
                    setTitle('');
                    setContent('');
                    setEditPost(null);
                  }}
                  className="px-4 py-2 border border-[#B0BFB6] rounded-[10px] text-[#5B21BD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5B21BD] text-white rounded-[10px] cursor-pointer"
                >
                  Update Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toaster position='top-right' />
    </div>
  );
};

export default ChefCommunity;
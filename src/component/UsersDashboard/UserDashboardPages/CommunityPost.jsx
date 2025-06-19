import { Link, useNavigate } from "react-router-dom";

function CommunityPost({ posts }) {
  console.log("posts", posts);
const navigate = useNavigate();
  return (
    <div className="px-10 py-4 lora">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="rounded-lg overflow-hidden shadow bg-white"
          >
            {/* Post Image */}
            <div>
              <img
                src={`https://bmn1212.duckdns.org${post.image}`}
                alt={post.title}
                className="w-full h-54 "
              />
            </div>

            {/* Content */}
            <div className="p-6 ">
              <div>
                <h2 className="text-xl font-bold text-[#5B21BD]">{post.user}</h2>
                <h3 className="text-lg font-semibold text-[#9A9A9A]">
                  {post.title}
                </h3>
                <p className="mt-2 text-[#9A9A9A] line-clamp-3">
                  {post.content}
                </p>
              </div>

              <Link
               onClick={() => navigate('/dashboard/community')}
                className="mt-4 text-white py-2 rounded-[29px] cursor-pointer"
              >
                <div className="mt-4 font-semibold w-full text-center text-white  bg-[#5B21BD] rounded-[29px] py-2 px-4 cursor-pointer">
                View Post
              </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityPost;

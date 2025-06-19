



import { useState } from "react";
import img from "../../../assets/image/subsbription.png";
import { Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useGetSubscriptionPlanListQuery, useSubscribtionDiscountMutation } from "../../../Rudux/feature/ApiSlice";
import toast, { Toaster } from "react-hot-toast";

const ChefSubscribtion = () => {
  const { data: getSubscriptionPlanList, isLoading, isError } = useGetSubscriptionPlanListQuery();
  const [subscribtionDiscount] = useSubscribtionDiscountMutation();

  const [billingCycle, setBillingCycle] = useState("monthly");
  const [price, setPrice] = useState(null);
  const [discountPlan, setDiscountPlan] = useState(null);
  console.log("adsdfsfd", getSubscriptionPlanList);
  // Fallback in case API data is not available or malformed
  const monthlyPlans = getSubscriptionPlanList?.data || []; // Adjust based on API response structure

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { y: -50, opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };






  const handleSubscribtionPlan = (plan) => {
    console.log("plan", plan);
    const discount = plan?.discount;
    // const planId = plan?.id;

    setPrice(discount);
    setDiscountPlan(plan);
  };




  const handleDiscountPlan = async (plan) => {
    if (!plan?.id || !price) {
      toast.e("Please select a plan and enter a discount amount.");
      return;
    }

    const payload = {
      plan_id: plan.id,
      discount: parseInt(price),
    };

    console.log("Sending payload:", payload);

    try {
      const response = await subscribtionDiscount(payload).unwrap();
      console.log("Discount applied:", response);
      toast.success("Discount applied successfully!");
    } catch (error) {
      console.error("Error applying discount:", error);
      toast.error("Failed to apply discount.");
    }
  };

  return (
    <div id="pricing" className="md:px-4 lora">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#5B21BD] mb-3 md:mb-4">
            Subscription Settings
          </h1>
          <p className="text-gray-600 text-[20px]">
            Manage your subscription plans and payment settings
          </p>
        </div>
        <div className="flex justify-end mb-4">
          <Link
            to="/chef_dashboard/add_new_plan"
            className="bg-[#5B21BD] px-4 py-2 rounded-xl text-white cursor-pointer"
          >
            Add New Plan +
          </Link>
        </div>

        {/* Pricing Cards Container */}
        <div className="relative">
          {isLoading ? (
            <p>Loading subscription plans...</p>
          ) : isError ? (
            <p>Error fetching subscription plans. Please try again later.</p>
          ) : (
            <AnimatePresence mode="wait">
              {billingCycle === "monthly" && monthlyPlans.length > 0 ? (
                <motion.div
                  key="monthly"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-14 w-full"
                  variants={cardContainerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {monthlyPlans.map((plan, index) => (
                    <motion.div
                      key={`monthly-${index}`}
                      className="bg-white hover:bg-[#CCBAEB] transition duration-500 rounded-3xl shadow-lg w-full min-h-[450px] md:min-h-[500px] flex flex-col relative" // Added relative here
                      variants={cardVariants}
                    >
                      <div className="p-4 md:p-8 flex flex-col flex-grow">
                        <h2 className="text-lg md:text-2xl font-bold text-[#5B21BD] mb-4 md:mb-8 text-center">
                          {plan.name}
                        </h2>
                        <div className="md:-mx-8 md:p-8 text-gray-100 md:mb-8 relative">
                          <img
                            src={img}
                            className="absolute md:h-32 md:top-3 md:-ml-[70px] z-50"
                            alt={`${plan.name} subscription plan`}
                          />

                          {/* Original Price */}
                          <div className="flex items-baseline justify-start">
                            <span className={`md:text-2xl md:font-bold z-50 ${plan.discount > 0 ? "line-through text-gray-200" : "text-gray-200"
                              }`}>
                              ${plan.price}
                            </span>
                            <span className={`md:text-xl ml-2 z-50 ${plan.discount > 0 ? " text-gray-200" : "text-gray-200"
                              }`}>
                              /month
                            </span>
                          </div>

                          {/* Discounted Price (only if discount > 0) */}
                          {plan.discount > 0 && (
                            <div className="flex items-baseline justify-start mt-1">
                              <p className="md:text-xl md:font-semibold text-gray-300 z-50">
                                ${plan.discount_price}
                              </p>
                              <span className="md:text-sm ml-2 z-50 text-gray-300 ">/month</span>
                            </div>
                          )}
                        </div>

                        <ul className="space-y-2 md:space-y-4 flex-grow flex flex-col">
                          {plan.features.split(", ").map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center">
                              <Check className="h-4 w-4 md:h-5 md:w-5 p-[2px] md:p-[3px] rounded-full bg-gray-200 text-[#5B21BD] dark:text-[#5B21BD] mr-2" />
                              <span className="text-[#5B21BD] text-xs md:text-base">{feature}</span>
                            </li>
                          ))}
                          <li className="flex items-center">
                            <Check className="h-4 w-4 md:h-5 md:w-5 p-[2px] md:p-[3px] rounded-full bg-gray-200 text-[#5B21BD] dark:text-[#5B21BD] mr-2" />
                            <span className="text-[#5B21BD] text-xs md:text-base">
                              {plan.storage_gb} GB Storage
                            </span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 md:h-5 md:w-5 p-[2px] md:p-[3px] rounded-full bg-gray-200 text-[#5B21BD] dark:text-[#5B21BD] mr-2" />
                            <span className="text-[#5B21BD] text-xs md:text-base">
                              {plan.ai_query_limit} AI Queries
                            </span>
                          </li>
                          {/* <li className="flex items-center">
                            <Check className="h-4 w-4 md:h-5 md:w-5 p-[2px] md:p-[3px] rounded-full bg-gray-200 text-[#5B21BD] dark:text-[#5B21BD] mr-2" />
                            <span className="text-[#5B21BD] text-xs md:text-base">
                              {plan.message_limit} Messages
                            </span>
                          </li> */}
                        </ul>
                        <button
                          onClick={() => handleSubscribtionPlan(plan)}
                          className="mt-4 md:mt-8 w-full bg-[#5B21BD] text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-medium flex items-center justify-center transition-colors duration-300 text-sm md:text-base cursor-pointer">
                          Get Started <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <p>No monthly plans available.</p>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="p-6 flex justify-center items-center">
          <div className="w-full py-10 space-y-4">
            <h1 className="text-[34px] font-semibold text-[#5B21BD] mb-2">Subscribtion plan discount (%) </h1>


            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">


                <input
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter discount amount(%)"
                  className="w-full p-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21BD]"
                />
              </div>

            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">



              <button
                onClick={() => handleDiscountPlan(discountPlan)}
                className="bg-[#5B21BD] cursor-pointer text-white px-4 py-2 rounded-lg">
                Save Changes
              </button>

            </div>
          </div>
        </div>
      </div>
      <Toaster position='top-right' />
    </div>
  );
};

export default ChefSubscribtion;
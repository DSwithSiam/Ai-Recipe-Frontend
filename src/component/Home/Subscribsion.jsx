


import img from "../../assets/image/pricing_img.png";
import { Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMainSubscriptionQuery, useSubscribtionPaymentMutation } from "../../Rudux/feature/ApiSlice";
import PropTypes from "prop-types";

const Subscribsion = ({ chefId }) => {
  const { data: getMainSubscription, isLoading, isError } = useGetMainSubscriptionQuery(chefId);
  console.log(getMainSubscription, "chef_data_here........................................")

  const [subscribtionPayment] = useSubscribtionPaymentMutation();
  const handleGetStarted = async (plan) => {
    if (!plan?.id) {
      console.log("No plan selected");
      return;
    }

    const getstartedData = {
      plan_id: plan.id,
      plan_type: "chef_subscription",
      successUrl: "localhost:5173/success",
      cancelUrl: "localhost:5173/cancel",
    };

    try {
      const response = await subscribtionPayment(getstartedData).unwrap();
      console.log("Stripe response:", response);

      //  Redirect to Stripe Checkout if URL exists
      if (response?.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        console.warn("No checkout URL received");
      }

    } catch (error) {
      console.error("Error during subscription payment:", error);
    }
  };


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

  const plans = getMainSubscription?.data || [];

  return (
    <div id="pricing" className="md:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 md:mb-0">
          <h3 className="text-[#2D4162] font-medium mb-2 text-sm md:text-2xl">
            Our Powerful Features
          </h3>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#5B21BD] mb-3 md:mb-4 capitalize">
            Choose your subscription
          </h1>
          <p className="text-gray-600 text-[20px] max-w-full md:max-w-2xl mx-auto text-xs md:text-base">
            There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form.
          </p>
        </div>

        <div className="relative mt-6">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : isError ? (
            <p className="text-center text-red-500">Failed to load subscription plans.</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="plans"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-14 w-full"
                variants={cardContainerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {plans.map((plan) => (
                  <motion.div
                    key={`plan-${plan.id}`}
                    className="bg-white hover:bg-[#EFE9F8] transition duration-500 rounded-3xl shadow-lg w-full min-h-[450px] flex flex-col"
                    variants={cardVariants}
                  >
                    <div className="p-4 md:p-8 flex flex-col flex-grow relative">
                      {/*  Plan Image - Keep as-is */}

                      {/*  Plan Name */}
                      <h2 className="text-lg md:text-2xl font-bold text-[#5B21BD] mb-4 md:mb-8 text-center">
                        {plan.name}
                      </h2>
                      <div className="md:-mx-8 md:p-8 text-gray-100 md:mb-8 relative">
                        <img
                          src={img}
                          className="absolute md:h-32 md:top-3 md:-ml-[70px] z-50"
                          alt={`${plan.name} subscription plan`}
                        />

                        {/*  Original Price */}
                        <div className="flex items-baseline justify-start">
                          <span
                            className={`md:text-2xl md:font-bold z-50 ${plan.discount > 0 ? "line-through text-gray-200" : "text-gray-200"
                              }`}
                          >
                            ${plan.price}
                          </span>
                          <span className="md:text-xl ml-2 z-50 text-gray-200">/month</span>
                        </div>

                        {/*  Discounted Price (if applicable) */}
                        {plan.discount > 0 && (
                          <div className="flex items-baseline justify-start mt-1">
                            <p className="md:text-xl md:font-semibold text-gray-300 z-50">
                              ${Number(plan.discount_price).toFixed(2)}
                            </p>
                            <span className="md:text-sm ml-2 z-50 text-gray-300">/month</span>
                          </div>
                        )}
                      </div>



                      {/*  Plan Features */}


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
                      
                      </ul>

                      {/*  Call-to-Action Button */}
                      <button
                        onClick={() => handleGetStarted(plan)}
                        className="mt-4 md:mt-8 w-full bg-[#5B21BD] text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-medium flex items-center justify-center transition-colors duration-300 text-sm md:text-base cursor-pointer"
                      >
                        Get Started <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

          )}
        </div>
      </div>
    </div>
  );
};
Subscribsion.propTypes = {
  chefId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Subscribsion;




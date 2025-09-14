import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import LocalAirportOutlinedIcon from "@mui/icons-material/LocalAirportOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import DirectionsBusFilledOutlinedIcon from "@mui/icons-material/DirectionsBusFilledOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import SecurityIcon from "@mui/icons-material/Security";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: <EmojiEventsOutlinedIcon style={{ fontSize: "60px" }} />,
      title: "Sports & Activities",
      description: "Organize and join sports events, find teammates, and stay active with your campus community.",
      color: "from-blue-500 to-blue-700"
    },
    {
      icon: <GroupsOutlinedIcon style={{ fontSize: "60px" }} />,
      title: "Find Teammates",
      description: "Connect with like-minded individuals for academic projects, hackathons, and collaborative endeavors.",
      color: "from-green-500 to-green-700"
    },
    {
      icon: <LocalAirportOutlinedIcon style={{ fontSize: "60px" }} />,
      title: "Travel Together",
      description: "Plan trips, find travel companions, and share costs for a more affordable experience.",
      color: "from-purple-500 to-purple-700"
    },
    {
      icon: <WindowOutlinedIcon style={{ fontSize: "60px" }} />,
      title: "Roommate Matching",
      description: "Find compatible roommates based on preferences, study habits, and lifestyle choices.",
      color: "from-red-500 to-red-700"
    },
    {
      icon: <QuestionMarkOutlinedIcon style={{ fontSize: "60px" }} />,
      title: "Lost & Found",
      description: "Quickly report and find lost items within the campus community.",
      color: "from-yellow-500 to-yellow-700"
    },
    {
      icon: <DirectionsBusFilledOutlinedIcon style={{ fontSize: "60px" }} />,
      title: "Campus Transportation",
      description: "Coordinate rides, share transportation costs, and never miss important events.",
      color: "from-indigo-500 to-indigo-700"
    }
  ];

  const benefits = [
    {
      icon: <ConnectWithoutContactIcon className="text-4xl text-[#4d6b2c]" />,
      title: "Real-time Connection",
      description: "Instantly connect with students who share your interests and activities."
    },
    {
      icon: <SecurityIcon className="text-4xl text-[#4d6b2c]" />,
      title: "Secure & Trusted",
      description: "Safe environment with SRM AP email verification and community guidelines."
    },
    {
      icon: <AccessTimeIcon className="text-4xl text-[#4d6b2c]" />,
      title: "Save Time & Money",
      description: "Efficient coordination reduces costs and eliminates the hassle of manual planning."
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4d6b2c] via-[#5e7b34] to-[#70703c] text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                Campus Connect
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              Your ultimate platform for campus collaboration. Connect with fellow students, 
              organize activities, find teammates, and make your college experience unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/login"
                className="group bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Get Started Now
                <ArrowForwardIcon className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-[#4d6b2c] font-bold py-4 px-8 rounded-full text-lg transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-white opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border border-yellow-400 opacity-30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-yellow-400 opacity-40 rounded-full animate-ping"></div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4d6b2c] to-[#70703c]">
                Connect
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover all the ways Campus Connect can enhance your college experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br ${feature.color} text-white`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: isVisible ? 'fadeInUp 0.8s ease-out forwards' : 'none'
                }}
              >
                <div className="text-center">
                  <div className="mb-6 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-100 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4d6b2c] to-[#70703c]">
                Campus Connect?
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6 flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4d6b2c] to-[#70703c] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of students who are already making the most of their college life through Campus Connect.
          </p>
          <Link
            to="/login"
            className="group inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-10 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Connecting Today
            <ArrowForwardIcon className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-[#4d6b2c] mb-2">1000+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#4d6b2c] mb-2">500+</div>
              <div className="text-gray-600">Events Organized</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#4d6b2c] mb-2">50+</div>
              <div className="text-gray-600">Sports Activities</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#4d6b2c] mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
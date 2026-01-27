import React, { useRef, useEffect, useState, useContext } from "react";
import { RiLeafFill } from "react-icons/ri";
import { FaApple, FaArrowLeftLong } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { Modal } from "rsuite";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/Auth";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [locationError, setLocationError] = useState("");
  const locationRef = useRef(null);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleNavigate = () => {
    navigate("/");
  };

  const fetchLocation = () => {
    setLoading(true);
    setShowModal(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        locationRef.current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        console.log("Location fetched: ", locationRef.current);
        setLocationError("");
      },
      (error) => {
        console.error("Error fetching location: ", error);
        setLocationError(
          "Unable to get location. Please enter your location manually."
        );
      }
    );

    setTimeout(() => {
      setShowModal(false);
      setLoading(false);
    }, 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLoading(false);
  };

  const handleManualLocation = () => {
    locationRef.current = {
      latitude: "Manual Latitude",
      longitude: "Manual Longitude",
    };
    setLocationError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !emailRef.current?.value ||
      !passwordRef.current?.value ||
      (!isLogin && !nameRef.current?.value)
    ) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    const formData = {
      userName: nameRef.current?.value || "",
      email: emailRef.current.value,
      password: passwordRef.current.value,
      userLocation: locationRef.current,
    };

    let isMounted = true;

    try {

      const response = await axios.post(
        `/user/${isLogin ? "login" : "register"}`,
        formData
      );
      console.log("Response Data: ", response.data);

      if (isMounted && response.status === 200) {
        if (isLogin) {
          const token = response.data.token;
          const user = response.data.user;
          console.log("User: ", user);
          login(token);
        }
        if (nameRef.current) nameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (passwordRef.current) passwordRef.current.value = "";
        if (locationRef.current) locationRef.current = "";
        navigate("/");
      }
    } catch (error) {
      console.error(
        `Error while ${isLogin ? "logging in" : "registering"}!`,
        error
      );
    } finally {
      isMounted = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLogin) {
      fetchLocation();
    }
  }, [isLogin]);

  return (
    <div
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}

      className="h-screen w-full flex justify-center items-center relative bg-cover"
    >
      <div
        onClick={handleNavigate}
        className="absolute lg:h-11 lg:w-11 h-8 w-8 rounded-full bg-black flex justify-center items-center left-2  top-1 sm:left-6 sm:top-6 hover:scale-105 cursor-pointer"
      >
        <FaArrowLeftLong className="text-md sm:text-xl" color="white" />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <PuffLoader color="#0d331c" size={150} />
        </div>
      )}

      {/* Location Fetching Modal */}
      <Modal
        backdrop="static"
        keyboard={false}
        open={showModal}
        onClose={handleCloseModal}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div className="bg-white rounded-xl shadow-lg w-11/12 sm:w-1/3 overflow-hidden absolute left-[5%] lg:left-[30vw] top-[10%]">
          <div className="bg-gray-100 border-b border-gray-200 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Fetching Location
            </h2>
          </div>
          <div className="p-6 bg-white text-center">
            <p className="text-gray-600 text-lg">
              We are determining your location to enhance your experience. This
              might take a few seconds.
            </p>
            {locationError && (
              <p className="text-red-500 text-sm mt-4">{locationError}</p>
            )}
            <button
              onClick={handleManualLocation}
              className="bg-blue-500 text-white font-medium px-6 py-2 rounded-full shadow-md hover:bg-blue-600 mt-4"
            >
              Enter Location Manually
            </button>
          </div>
          <div className="bg-gray-100 border-t border-gray-200 p-6 flex justify-center">
            <button
              onClick={handleCloseModal}
              className="bg-green-500 text-white font-medium px-6 py-2 rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Form Section */}
      <div className="w-[90%] sm:w-[80%] h-[87%] sm:h-[95%] flex flex-col sm:flex-row rounded-xl overflow-hidden mx-auto bg-white shadow-lg">
        <div className="h-full w-full sm:w-1/2 bg-white flex flex-col sm:mt-10 items-center p-2">
          <span className="relative flex w-32 mt-5 sm:ml-14 ml-20 sm:mt-5">
            <span className="h-12 w-12 border-[2px] border-[#0d331c] rounded-full"></span>
            <span className="absolute left-3 h-12 w-12 flex justify-center items-center rounded-full bg-black">
              <RiLeafFill size={27} color="#fff" />
            </span>
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold mt-2 sm:mt-2 font-[kurale]">
            {isLogin ? "Log In" : "Sign Up"}
          </h1>
          <p className="text-md font-medium text-zinc-400 mt-6 font-[kurale] sm:text-left text-center">
            Welcome to Farmisto -{" "}
            {isLogin ? "Log in to your account" : "Let's create an account"}
          </p>
          <div className="w-full flex sm:flex-row items-center justify-center gap-4 mt-3 px-10">
            <button className="lg:w-full sm:w-auto flex justify-center items-center hover:bg-zinc-100 gap-3 p-3 border-[1px] border-zinc-500 lg:rounded-2xl rounded-full">
              <FcGoogle size={22} />
              <span className="hidden lg:block text-md font-medium text-black">
                Log in with Google
              </span>
            </button>
            <button className="lg:w-full sm:w-auto flex justify-center items-center hover:bg-zinc-100 gap-3 p-3 border-[1px] border-zinc-500 lg:rounded-2xl rounded-full">
              <FaApple size={22} />
              <span className="hidden lg:block text-md font-medium text-black">
                Log in with Apple
              </span>
            </button>
          </div>

          {locationError && (
            <p className="text-red-500 text-sm mt-2">{locationError}</p>
          )}

          {/* Registration/Login Form */}
          <form
            className="w-full sm:mt-5 mt-2 px-6 sm:px-10"
            onSubmit={handleSubmit}
          >
            {!isLogin && (
              <input
                ref={nameRef}
                type="text"
                name="name"
                placeholder="Name"
                className="w-full py-3 px-5 border-[1px] border-zinc-500 rounded-2xl focus:outline-none mt-4"
                aria-label="Name"
              />
            )}
            <input
              ref={emailRef}
              type="text"
              name="email"
              placeholder="Email"
              className="w-full py-3 px-5 border-[1px] border-zinc-500 rounded-2xl focus:outline-none mt-4"
              aria-label="Email"
            />
            <input
              ref={passwordRef}
              type="password"
              name="password"
              placeholder="Password"
              className="w-full py-3 px-5 border-[1px] border-zinc-500 rounded-2xl focus:outline-none mt-4"
              aria-label="Password"
            />
            <button
              className="w-full h-14 mt-8 sm:mt-4 rounded-xl bg-black text-white font-semibold relative"
              type="submit"
              disabled={loading}
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already registered? "}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 font-medium cursor-pointer hover:underline"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </span>
            </p>
          </form>
        </div>

        {/* Image Section */}
        <div className="h-full w-full sm:w-1/2 bg-white p-2 sm:p-5">
          <img
            src="https://plus.unsplash.com/premium_photo-1661964436517-d977254ad1fe?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="h-full w-full object-cover rounded-lg hidden sm:block"
            alt="Background"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;

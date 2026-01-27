import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="h-auto w-full bg-gradient-to-b from-zinc-100 to-white">
      <NavBar />

      {/* Hero Section */}
      <div className="h-[20vh] flex items-center justify-center bg-green-800 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold font-[satoshi] leading-tight">
            Privacy <span className="text-yellow-400">Policy</span>
          </h1>
          <p className="text-md mt-2 font-medium leading-relaxed">
            Learn how we handle your information with care.
          </p>
        </div>
      </div>

      {/* Privacy Policy Details */}
      <div className="mt-20 px-10 space-y-20">
        {/* Information We Collect */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
              alt="Data Collection"
              className="h-[50vh] w-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl font-bold text-[#242424]">
              Information We Collect
            </h2>
            <ul className="list-disc mt-5 text-green-800 font-medium leading-relaxed">
              <li>Personal information like name, email, and address.</li>
              <li>Non-personal data such as IP addresses and browsing behavior.</li>
              <li>Cookies for a personalized user experience.</li>
            </ul>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl font-bold text-[#242424]">
              How We Use Your Information
            </h2>
            <p className="text-md mt-5 text-green-800 font-medium leading-relaxed">
              We use your data to:
              <br />
              - Provide and improve our services.
              <br />
              - Personalize your experience.
              <br />
              - Send updates and respond to queries.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
              alt="Usage"
              className="h-[50vh] w-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* How We Protect Your Information */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <img
              src="https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg"
              alt="Security"
              className="h-[50vh] w-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl font-bold text-[#242424]">
              How We Protect Your Information
            </h2>
            <p className="text-md mt-5 text-green-800 font-medium leading-relaxed">
              - Data encryption for sensitive information.
              <br />
              - Regular security checks.
              <br />
              - Limited access to personal data.
            </p>
          </div>
        </div>

        {/* Your Rights */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl font-bold text-[#242424]">Your Rights</h2>
            <ul className="list-disc mt-5 text-green-800 font-medium leading-relaxed">
              <li>Access your personal data.</li>
              <li>Request corrections or deletions.</li>
              <li>Opt out of marketing communications.</li>
            </ul>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src="https://images.pexels.com/photos/3184397/pexels-photo-3184397.jpeg"
              alt="User Rights"
              className="h-[50vh] w-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="mt-20 p-10 text-center bg-green-800 text-white">
        <h2 className="text-4xl font-bold">Questions About Privacy?</h2>
        <p className="text-lg mt-5">
          Contact us at <span className="font-bold">privacy@[farmisto].com</span>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

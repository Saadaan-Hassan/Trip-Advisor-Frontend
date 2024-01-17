import React, { useState } from "react";
import {
  CircleDollarSign,
  Globe2,
  Headphones,
  Megaphone,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import vendorWelcomeIllustration from "../assets/vendor-welcome.svg";
import vendorSupportIllustration from "../assets/vendor-support.svg";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const PerkCard = ({ icon, title, description }) => (
  <div className='bg-white p-6 rounded-lg shadow-green-300 shadow-lg mb-4 hover:shadow-green-400 '>
    <div className='flex items-center mb-4'>
      <div className='bg-green-200 p-3 rounded-full mr-2'>{icon}</div>
      <h3 className='text-xl font-bold'>{title}</h3>
    </div>
    <p className='text-slate-700 text-justify '>{description}</p>
  </div>
);

const VendorWelcomePage = () => {
  const { user, token, vendorLogin } = useUserContext();
  const [cnic, setCnic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validating the CNIC number using regex
    const regex = /^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/;
    if (!regex.test(cnic)) {
      toast.error("Please enter a valid CNIC number!");
      return;
    }

    if (!showTerms) {
      toast.error("Please agree to the Terms and Conditions!");
      return;
    }

    try {
      const response = await axios.post(
        "vendors/signup",
        {
          userId: user.userid,
          cnic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      vendorLogin(response.data.vendor, response.data.token);
      setShowModal(false);
      setCnic("");
      toast.success("Successfully signed up as a vendor!");
      navigate("/dashboard/vendor");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <div className='flex bg-cover bg-center h-screen bg-gradient-to-r from-[#040D12] to-green-300'>
        {/* Text Section */}
        <div className='flex flex-col justify-center max-w-xl px-8 py-12'>
          <h1 className='text-4xl font-bold mb-8 text-white'>
            Welcome to Our Exclusive Vendor Platform
          </h1>
          <p className='text-lg text-white mb-8'>
            Elevate your business by showcasing your extraordinary hotels and
            restaurants. Join us and experience the potential for your earnings
            to soar!
          </p>
          <button
            className='mt-6 bg-white text-slate-900 hover:bg-green-800 hover:text-white hover:shadow-md px-4 py-2 rounded-full font-semibold'
            onClick={() => setShowModal(true)}
          >
            Become a Vendor
          </button>
        </div>

        {/* Illustration Section */}
        <div className='hidden lg:flex lg:flex-grow lg:items-center lg:justify-center'>
          <img
            src={vendorWelcomeIllustration}
            alt=''
            className='max-w-md object-contain'
          />
        </div>
      </div>

      {/* Perks Section */}
      <div className='bg-white p-8 mt-8'>
        <h2 className='text-3xl font-bold mb-6 text-center'>
          Unlock Exclusive Perks as Our Vendor
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <PerkCard
            icon={<Globe2 />}
            title='Expanded Reach'
            description='Reach a diverse and extensive audience of potential customers. Our platform connects you with travelers and food enthusiasts globally, increasing your visibility and attracting new patrons to your establishments.'
          />
          <PerkCard
            icon={<SlidersHorizontal />}
            title='Effortless Management'
            description='Effortlessly manage your hotel and restaurant listings with our intuitive dashboard. Update details, showcase special offerings, and maintain an organized profile that captivates your audience with ease.'
          />
          <PerkCard
            icon={<Shield />}
            title='Secure Transactions'
            description='Rest easy knowing that our platform provides a secure and transparent payment system. We prioritize the safety of both vendors and customers, ensuring seamless transactions that foster trust and loyalty.'
          />
          <PerkCard
            icon={<CircleDollarSign />}
            title='Double Your Earnings'
            description='By featuring your hotels and restaurants on our platform, you have the opportunity to double your earnings. Benefit from increased bookings and reservations as our engaged community of users discovers and chooses your exceptional offerings.'
          />
          <PerkCard
            icon={<Megaphone />}
            title='Promotional Opportunities'
            description='Access exclusive promotional opportunities to showcase your establishments. From featured listings to special campaigns, our platform provides you with the tools to elevate your brand and attract a discerning audience.'
          />
          <PerkCard
            icon={<Headphones />}
            title='Dedicated Support'
            description='Enjoy personalized and dedicated support from our team. We are committed to your success and are here to assist you with any inquiries, technical support, or guidance to ensure a seamless experience on our platform.'
          />
        </div>
      </div>

      <div className='flex p-8 my-8 bg-cover bg-center h-screen'>
        {/* Illustration Section */}
        <div className='hidden lg:flex lg:flex-grow lg:items-center lg:justify-center lg:mr-8'>
          <img
            src={vendorSupportIllustration}
            alt=''
            className='max-w-md object-contain'
          />
        </div>

        {/* Text Section */}
        <div className='flex flex-col justify-center max-w-xl px-8 py-12 text-justify bg-gradient-to-tl from-[#040D12] to-green-300 rounded-lg shadow-green-300 shadow-lg text-white'>
          <h2 className='text-3xl font-bold mb-4 drop-shadow-lg'>
            Maximize Your Earnings Potential
          </h2>
          <p className='text-lg mb-3'>
            At TripAdvisor, we understand the importance of your success. By
            showcasing your hotels and restaurants, you not only gain exposure
            but also unlock a host of revenue-boosting opportunities. From
            special promotions to exclusive partnerships, our platform is
            designed to empower your business and help you achieve unparalleled
            success.
          </p>
          <p className='text-lg'>
            Join us today and take the first step towards a more lucrative
            future. Our team is dedicated to supporting you every step of the
            way, ensuring that your experience as a valued vendor is nothing
            short of exceptional.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className='bg-gradient-to-b from-[#040D12] to-green-300 text-white py-10'>
        <div className='container mx-auto text-center'>
          <h2 className='text-4xl font-bold mb-4'>
            Ready to Elevate Your Business?
          </h2>
          <p className='text-lg mb-8 w-3/4 mx-auto'>
            Join our exclusive vendor platform and showcase your hotels and
            restaurants to a global audience. Maximize your earnings potential
            and become part of a thriving community.
          </p>
          <button className='bg-green-900 hover:bg-white hover:text-green-900 text-white px-6 py-3 rounded-full font-semibold'>
            Become a Vendor
          </button>
        </div>
      </div>

      {/* Modal */}
      <div
        className={`${
          showModal ? "fixed" : "hidden"
        } z-10 inset-0 overflow-y-auto`}
        aria-labelledby='modal-title'
        role='dialog'
        aria-modal='true'
      >
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <div
            className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
            aria-hidden='true'
          ></div>

          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>

          <div
            className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
          >
            <form onSubmit={handleSubmit}>
              <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='sm:flex sm:items-start'>
                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <h3
                      className='text-lg leading-6 font-medium text-gray-900'
                      id='modal-headline'
                    >
                      Enter your CNIC number to become a vendor
                    </h3>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='cnic'
                        id='cnic'
                        value={cnic}
                        onChange={(e) => setCnic(e.target.value)}
                        placeholder='XXXXX-XXXXXXX-X'
                        className='shadow-sm block w-full sm:text-sm border-2 border-gray-300 rounded-md outline-green-500'
                      />
                    </div>

                    <div className='mt-2'>
                      <input
                        type='checkbox'
                        name='terms'
                        id='terms'
                        className='shadow-sm sm:text-sm border-2 border-gray-300 rounded-md outline-green-500'
                        onChange={(e) => setShowTerms(e.target.checked)}
                      />
                      <label
                        htmlFor='terms'
                        className='ml-2 text-sm text-gray-500'
                      >
                        I agree to the{" "}
                        <Link to='/terms-and-condition' target='_blank'>
                          Terms and Conditions
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                <button
                  type='submit'
                  disabled={!showTerms}
                  className={`${
                    !showTerms
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-700"
                  } w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  type='button'
                  className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorWelcomePage;

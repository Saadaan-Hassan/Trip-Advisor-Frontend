import { Link } from "react-router-dom";

export default function Header({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}) {
  return (
    <div className='mb-10'>
      <div className='flex justify-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='#14532d'
          className='w-16 h-16 -rotate-90'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
          />
        </svg>
      </div>
      <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
        {heading}
      </h2>
      <p className='mt-2 text-center text-sm text-gray-600'>
        {paragraph}{" "}
        <Link
          to={linkUrl}
          className='font-medium text-green-600 hover:text-green-500'
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
}

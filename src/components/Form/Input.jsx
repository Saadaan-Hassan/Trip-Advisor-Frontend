import { countries } from "countries-list";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm";

export default function Input({
  handleChange,
  value,
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired = false,
  placeholder,
  customClass,
  readOnly = false,
}) {
  return (
    <div className='my-5'>
      <label htmlFor={labelFor} className='sr-only'>
        {labelText}
      </label>
      {id !== "country" ? (
        <input
          onChange={handleChange}
          value={value}
          id={id}
          name={name}
          type={type}
          required={isRequired}
          className={fixedInputClass + customClass}
          placeholder={placeholder}
          readOnly={id === "email" && readOnly}
        />
      ) : (
        
        <select
          onChange={handleChange}
          value={value} 
          id={id}
          name={name}
          type={type}
          required={isRequired}
          className={fixedInputClass + customClass}
          placeholder={placeholder}
        >
          <option value=''>Select Country</option>
          {Object.keys(countries).map((country) => (
            <option value={country} key={country}>
              {countries[country].name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

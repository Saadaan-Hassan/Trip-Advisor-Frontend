import Header from "../components/Form/Header";
import Signup from "../components/Signup";

export default function SignupPage() {
  return (
    <div className='max-w-lg mx-auto mt-20'>
      <Header
        heading='Signup to create an account'
        paragraph='Already have an account? '
        linkName='Login'
        linkUrl='/login'
      />
      <Signup />
    </div>
  );
}

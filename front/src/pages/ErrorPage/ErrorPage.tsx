import { Link } from 'react-router-dom'
import './css/ErrorPage.scss'
import { APP_ROUTES } from 'utils/routing/routing'

interface ErrorPageProps {
  handleReset: () => void;
}

const ErrorPage:React.FC<ErrorPageProps> = ({handleReset}) => {


  return (
    <main className="error-page-main-container">
      <section className='error-page-sub-container'>
        Oops seems like there was an error...
      </section>
      <Link to={APP_ROUTES.HOME} className='corner-button' onClick={() => handleReset()}>
        <span>Go to home</span>
      </Link>



    </main>
  );
}

export default ErrorPage;
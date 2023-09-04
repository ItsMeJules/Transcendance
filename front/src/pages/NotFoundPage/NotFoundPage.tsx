import { Link } from 'react-router-dom';
import { APP_ROUTES } from 'utils/routing/routing';
import './css/NotFoundPage.scss'

const NotFoundPage = () => {

  return (
    <main className="not-found-main-container">
      <section className='not-found-sub-container'>
        404 Page not found
      </section>
      <Link to={APP_ROUTES.HOME} className='corner-button'>
        <span>Go to home</span>
      </Link>
    </main>
  );
}

export default NotFoundPage;
import { Link } from 'react-router-dom';
import { APP_ROUTES } from 'utils/routing/routing';
import './css/NotFoundPageDashboard.scss'

const NotFoundPageDashboard = () => {

  return (
    <main className="not-found-dash-main-container">
      <section className='not-found-dash-sub-container'>
        Nothing to see here
      </section>
    </main>
  );
}

export default NotFoundPageDashboard;
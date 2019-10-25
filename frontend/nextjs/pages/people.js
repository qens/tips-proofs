import withData from '../lib/apollo';
import PeopleList from '../components/PeopleList';

const People = () => {

    return <PeopleList />;
}

export default withData(People);
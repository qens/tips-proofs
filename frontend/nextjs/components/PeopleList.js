import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const PEOPLE_PER_PAGE = 5;

const GET_PEOPLE = gql`
query allPeople($first: Int!, $offset: Int!) {
    allPeople(orderBy: CREATED_AT_DESC, first: $first, offset: $offset) {
      nodes {
        firstName
        lastName
        postsByAuthorId {
          nodes {
            id
            topic
          }
        }
      }
      totalCount
    }
}
`;

const PeopleList = () => {
    const { loading, error, data, fetchMore } = useQuery(GET_PEOPLE, {
        variables: { offset: 0, first: PEOPLE_PER_PAGE },
        notifyOnNetworkStatusChange: true,
    });

    if (data && data.allPeople && data.allPeople.nodes) {
        const areMorePeople = data.allPeople.nodes.length < data.allPeople.totalCount;
        return (<div>
            {data.allPeople.nodes.map((person, index) => (
                <div key={person.id}>
                    <span>{index+1}</span>
                    <span>{person.firstName} {person.lastName}</span>
                    {person.postsByAuthorId && person.postsByAuthorId.nodes && person.postsByAuthorId.nodes.map(post=> (
                        <span key={post.id}>{post.id} + {post.topic}</span>
                    )) }
                </div>
            ))}
            {areMorePeople ? (
                <button onClick={() => loadMorePeople(data, fetchMore)}>
                    {loading ? 'Loading...' : 'Show more'}
                </button>
            ) : ( '' )
            }

        </div>)

    }
    return <div>Loading...</div>
}

function loadMorePeople(data, fetchMore) {
    return fetchMore({
        variables: {
            offset: data.allPeople.nodes.length
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
                return previousResult;
            }
            return {
                ...previousResult,
                allPeople: {
                    ...previousResult.allPeople,
                    nodes: [...previousResult.allPeople.nodes, ...fetchMoreResult.allPeople.nodes]
                }
            };
        }
    });
}

export default PeopleList;

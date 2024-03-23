import { useState, useEffect } from 'react';

import { createContextProvider } from '../src';

const {
  ContextProvider: PersonContextProvider,
  useContext: usePersonContext,
} = createContextProvider<PersonContextProviderProps, PersonContextValue>(
  function usePersonContextInternals(props: PersonContextProviderProps): PersonContextValue {
    const [loaded, setLoaded] = useState(false);
    const [person, setPerson] = useState<Person|undefined>();

    useEffect(() => {
      (async () => {
        const fetchedPerson = await mockFetchPerson(props.id);
        setPerson(fetchedPerson);
        setLoaded(true);
      })();
    }, []);

    const updatePerson = (data: UpdatePersonData) => {
      setPerson(prev => {
        return prev ? { ...prev, ...data } : prev;
      });
    };

    return {
      loaded,
      person,
      updatePerson,
    };
  }
);

export interface PersonContextProviderProps {
  id: string;
}

export type PersonContextValue = {
  loaded: boolean;
  person?: Person;
  updatePerson: (data: UpdatePersonData) => void;
};

export interface Person {
  id: string;
  name: string;
  description: string;
}

export interface UpdatePersonData {
  name?: string;
  description?: string;
}

export function Example() {
  return (
    <PersonContextProvider id="mock-person-id">
      <PersonContent />
    </PersonContextProvider>
  );
}

const PersonContent = () => {
  const { loaded, person, updatePerson } = usePersonContext();

  if (!loaded) {
    return <p>Loading...</p>;
  }

  if (!person) {
    return <p>Failed to load person</p>;
  }

  return (
    <div>
      <div>
        <label htmlFor="name">Name: </label>
        <input
          name="name"
          value={person.name}
          onChange={e => {
            updatePerson({ name: e.target.value })
          }}
        />
      </div>

      <div>
        <label htmlFor="description">Description: </label>
        <input
          name="name"
          value={person.description}
          onChange={e => {
            updatePerson({ description: e.target.value })
          }}
        />
      </div>
    </div>
  );
}

function mockFetchPerson(id: string): Promise<Person> {
  return new Promise(res => setTimeout(() => {
    res({
      id,
      name: 'Percy McPerson',
      description: 'This is a mock person data'
    });
  }, 1000));
}

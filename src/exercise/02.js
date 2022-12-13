// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react';

// Custom Hooks in react // Start function name with 'use<name>', doing this we can use react hooks inside the function WO error
function useLocalstorageState(key, defaultValue = '', {
  serialize = JSON.stringify,
  deSerialize = JSON.parse
} = {}) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return deSerialize(valueInLocalStorage);
    }
    // return defaultValue; // if defaultValue is a single string or number
    return typeof defaultValue === "function" ? defaultValue() : defaultValue; // if defaultValue is a function
  })

  const previousKeyRef = React.useRef(key);

  React.useEffect(() => {
    const previousKey = previousKeyRef.current;
    if (previousKey !== key) {
      window.localStorage.removeItem(previousKey);
    }
    window.localStorage.setItem(key, serialize(state));
  }, [key, serialize, state]);

  return [state, setState];
}

function Greeting({ initialName = '' }) {
  const [name, setName] = useLocalstorageState('name', initialName);

  // const [name, setName] = React.useState( () => 
  //   window.localStorage.getItem('name') || initialName
  // )

  // React.useEffect(() => {
  //   window.localStorage.setItem('name', name);
  // }, [name]);

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  const [count, setCount] = React.useState(0);
  return (
    <>
      <button onClick={() => setCount(previousCount => previousCount + 1)}>
        {count}
      </button>
      <Greeting />
    </>
  )
}

export default App

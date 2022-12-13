// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import { PokemonForm, PokemonInfoFallback, PokemonDataView, fetchPokemon } from '../pokemon'

// class ErrorBoundary extends React.Component {
//   state = { error: null }
//   static getDerivedStateFromError(error) {
//     return { error }
//   }

//   render() {
//     const { error } = this.state;
//     if (error) {
//       return <this.props.FallbackComponent error={error}/>
//       // return (
//       //   <div role="alert">
//       //     There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
//       //   </div>
//       // )
//     }
//     return this.props.children;
//   }
// }

function PokemonInfo({ pokemonName }) {
  // const [status, setStatus] = React.useState("idle");
  // const [pokemon, setPokemon] = React.useState(null);
  // const [error, setError] = React.useState(null);
  const [state, setState] = React.useState({
    status: (pokemonName) ? 'pending' : "idle",
    pokemon: null,
    error: null
  });

  const { status, pokemon, error } = state;

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    // setError(null);
    // setPokemon(null);
    // setStatus('pending');
    setState({ status: 'pending' });
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({ status: 'resolved', pokemon: pokemonData });
      },
      error => {
        setState({ status: 'rejected', error: error });
      }
    )
  }, [pokemonName]);

  if (status === 'idle') {
    return 'Submit a Pokemon';
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    // return (
    //   <div role="alert">
    //     There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
    //   </div>
    // )
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new error("oops!! something went worng. Please try again");
  // if (error) {
  //   return (
  //     <div role="alert">
  //       There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
  //     </div>
  //   )
  // } else if (!pokemonName) {
  //   return 'Submit a Pokemon';
  // } else if (!pokemon) {
  //   return <PokemonInfoFallback name={pokemonName} />
  // } else {
  //   return <PokemonDataView pokemon={pokemon} />
  // }
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

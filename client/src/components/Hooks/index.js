import {useEffect, useState} from 'react'

export function useDebounce(value, delay) {

    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
  
        // Update debounced value after dela
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] // Only re-call effect if value or delay changes
    );

    return debouncedValue;
  }

export function useForm(initalState = {}){

  const [state, setState] = useState(initalState)

  function handleChange(e){
    e.persist()
    setState({...state, [e.target.name]: e.target.value})
  }

  function handleDate(name, date){
    setState({...state, [name]: date})
  }

  return [state, handleChange, handleDate]
}
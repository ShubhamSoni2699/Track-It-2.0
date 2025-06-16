import { useSearchParams } from 'react-router-dom';
import Select from './Select';

export default function SortBy({ options , intialValue }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || intialValue;
  function handleChange(e) {
    searchParams.set('sortBy', e.target.value);
    setSearchParams(searchParams);
  }
  return (
    <Select
      options={options}
      value={sortBy}
      type={'white'}
      onChange={handleChange}
    />
  );
}

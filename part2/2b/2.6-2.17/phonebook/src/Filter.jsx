/* eslint-disable react/prop-types */

const Filter = ({ searchValue, handleSearchValue}) => {
    return (
<div>
filter shown with 
<input value={searchValue} onChange={handleSearchValue} />

</div>
  );
};

export default Filter;
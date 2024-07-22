import React from 'react';
interface SearchBarProps {
    placeholder?: string;
  }

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Pesquisar...'}) => {
  return (
    <div className="flex justify-center items-center mx-8 w-full max-w-xl">
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full max-w-xl p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
      />
    </div>
  );
};

export default SearchBar;

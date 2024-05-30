import React, { ChangeEvent } from 'react';
import { Searchbar } from 'framework7-react';

interface SearchbarProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onClick: () => void;
}

const CustomSearchbar: React.FC<SearchbarProps> = ({ onChange, onClick }) => {
    return (
        <Searchbar
            onChange={onChange}
            onClickClear={onClick}
            onClickDisable={onClick}
            customSearch
        />
    );
};

export default CustomSearchbar;

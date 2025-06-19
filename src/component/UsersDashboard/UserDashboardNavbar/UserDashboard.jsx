import  { useState } from 'react';
import UserDashboardNavbar from './UserDashboardNavbar';
import AllRecipes from '../UserDashboardPages/AllRecipes/AllRecipes';




function UserDashboard() {
    const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
    <UserDashboardNavbar onSearch={handleSearch} />
    <AllRecipes searchTerm={searchTerm} />
  </div>
  );
}

export default UserDashboard;
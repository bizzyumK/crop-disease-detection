import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout =()=>{
  return(
    <div className="min-h-screen bg-[#0d140d] text-white">
      <Navbar/>
      <main className="p-6">
        <Outlet/>
      </main>
    </div>
  );
};

export default Layout;
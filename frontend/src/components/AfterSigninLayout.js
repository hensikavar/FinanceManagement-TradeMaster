import React,{useState} from 'react'
import { Outlet,Link} from 'react-router-dom'
import "../components/AfterSigninLayout.css"

const AfterSigninLayout = () => {
  const [isSaleDropdownOpen, setIsSaleDropdownOpen] = useState(false);
  const [isPurchaseDropdownOpen, setIsPurchaseDropdownOpen] = useState(false);

  const toggleSaleDropdown = () => {
    setIsSaleDropdownOpen(!isSaleDropdownOpen);
    setIsPurchaseDropdownOpen(false); // Close purchase dropdown if open
  };

  const togglePurchaseDropdown = () => {
    setIsPurchaseDropdownOpen(!isPurchaseDropdownOpen);
    setIsSaleDropdownOpen(false); // Close sale dropdown if open
  };
  return (
    <div className='main-layout row'>
      <div className='sidebar  col-2'>
        <div className='profile'>
            <div className='icon'><i class="bi-person-bounding-box"></i></div>
            <div className='text'>Hensi Kavar</div>
            <i class="bi bi-chevron-right"></i>
        </div>
        <Link to="/layout" style={{textDecoration:'none', color:'white'}}>
            <div className='item'><div className='icon'><i class="bi bi-house-door-fill"></i></div><div className='text'>Dashboard</div></div>
        </Link>
        <Link to="/layout/parties" style={{textDecoration:'none', color:'white'}}>
            <div className='item'><div className='icon'><i class="bi bi-people-fill"></i></div><div className='text'>Parties</div></div>
        </Link>
        <Link to="/layout/items" style={{textDecoration:'none', color:'white'}}>
            <div className='item'><div className='icon'><i class="bi bi-box-seam-fill"></i></div><div className='text'>Items</div></div>
        </Link>
          <div className='item' onClick={toggleSaleDropdown}>
              <div className='icon'>
                <i class="bi bi-receipt"></i>
              </div>
              <div className='text'>Sale</div>
              <div style={{paddingLeft:"105px",color:"gray",paddingTop:"3px"}}>
                <i class="bi bi-caret-down"></i>
              </div>
            
          </div>
          {isSaleDropdownOpen && (
            <div className='dropdown-content'>
              <Link to="/layout/sales" style={{ textDecoration: 'none', color: 'white' }}>
                <div className='dropdown-item'>Sale Invoice</div>
              </Link>
              <Link to="/layout/paymentin" style={{ textDecoration: 'none', color: 'white' }}>
                <div className='dropdown-item'>Payment In</div>
              </Link>
            </div>
          )}
          <div className='item' onClick={togglePurchaseDropdown}><div className='icon'><i class="bi bi-cart-fill"></i></div><div className='text'>Purchase</div>
              <div style={{paddingLeft:"70px",color:"gray",paddingTop:"3px"}}>
                <i class="bi bi-caret-down"></i>
              </div>
          </div>
          {isPurchaseDropdownOpen && (
            <div className='dropdown-content'>
              <Link to="/layout/purchase" style={{ textDecoration: 'none', color: 'white' }}>
                <div className='dropdown-item'>Purchase Bill</div>
              </Link>
              <Link to="/layout/paymentout" style={{ textDecoration: 'none', color: 'white' }}>
                <div className='dropdown-item'>Payment Out</div>
              </Link>
            </div>
          )}
        <Link to="/layout" style={{textDecoration:'none', color:'white'}}>
            <div className='item'><div className='icon'><i class="bi bi-bar-chart-fill"></i></div><div className='text'>Reports</div></div>
        </Link>
        <Link to="/" style={{textDecoration:'none', color:'white'}}>
            <div className='item'><div className='icon'><i class="bi bi-box-arrow-left"></i></div><div className='text'>log out</div></div>
        </Link>
        {/* <div className='item'><div className='icon'><i class="bi bi-bar-chart-fill"></i></div><div className='text'>Reports</div></div> */}
      </div>
      <div className='rendering col'>
        <Outlet/>
      </div>
    </div>
  )
}

export default AfterSigninLayout

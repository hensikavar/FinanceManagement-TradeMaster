import React from 'react'
import billing from '../images/titleimage.png'
import stock from "../images/stock.png"
import gstbill from "../images/gstbill.png"
import report from "../images/report.png"
import "./Home.css"
import Navebar from './Navebar'

const Home = () => {
  return (
    <>
    <Navebar/>
    <div className='home'>
        <div className='part1 row'>
            <div className='home-title col-6'>
                <div className='titletext'>
                    Trade Smarter with <br/>Trade Master. 
                </div>
                <p>
                <br/> 
                    Manage your business professionally with Trade Master .<br/>
                    Trade Master: Your Gateway to Seamless Business Management. <br/>
                    Unleash the Power of Effortless Billing, Stock Mastery,<br/> and Analytical Brilliance in One Dynamic App!
                </p>
            </div>
            <div className='home-title-img col-6' >
                <img src={billing} alt='' className='img-fluid h-100'/>
            </div>
        </div> 
        <div className='part2 row'>
            <div className='featurebanner col'>
                <div className='col-4 fs-2'>
                    <img src={gstbill} alt='' /><br/>
                    GST Billing
                </div>
                <div className='col-4 fs-2 '>
                    <img src={stock} alt=''/><br/>
                    Stock Maintaining
                </div>
                <div className='col-4 fs-2'>
                    <img src={report} alt='' /><br/>
                    Reports Analysing
                </div>
            </div>
        </div>  
        <div className='part3'>
            <div className='footer'>
                <div class="contact-info">
                    <p>Email: example@example.com</p>
                    <p>Phone: +1 123-456-7890</p>
                </div>
                
                <div class="social-icons">
                    <a href="https://www.instagram.com/" target="_blank"><i class="bi bi-instagram"></i></a>
                    <a href="https://www.facebook.com/" target="_blank"><i class="bi bi-facebook"></i></a>
                    <a href="https://twitter.com/" target="_blank"><i class="bi bi-twitter"></i></a>
                    <a href="https://www.linkedin.com/" target="_blank"><i class="bi bi-linkedin"></i></a>
                    <a href="https://api.whatsapp.com/send?phone=1234567890" target="_blank"><i class="bi bi-whatsapp"></i></a>
                </div>
            </div>
        </div> 
    </div>
    </>
  )
}

export default Home

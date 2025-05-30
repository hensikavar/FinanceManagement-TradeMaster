import React from 'react'
import { useState,useEffect } from "react"
import "./Paymentin.css"

const Paymentin = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get first day of the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 2).toISOString().split('T')[0]; // Format: YYYY-MM-DD
  // Get last day of the current month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 1).toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const [selectedCategory, setSelectedCategory] = useState('');

  // Function to handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);

    // Calculate default dates based on selected category
    switch (e.target.value) {
      case 'This Month':
        // Default dates are already set to this month
        break;
      case 'Last Month':
        // Calculate first and last day of last month
        const lastMonthFirstDay = new Date(currentYear, currentMonth - 1, 2).toISOString().split('T')[0];
        const lastMonthLastDay = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
        // Set default dates to last month
        setDefaultDates(lastMonthFirstDay, lastMonthLastDay);
        break;
      case 'Last Quarter':
        // Calculate first and last day of last quarter
        const lastQuarterFirstDay = new Date(currentYear, currentMonth - 3, 2).toISOString().split('T')[0];
        const lastQuarterLastDay = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
        // Set default dates to last quarter
        setDefaultDates(lastQuarterFirstDay, lastQuarterLastDay);
        break;
      case 'This Year':
        // Calculate first and last day of this year
        const thisYearFirstDay = new Date(currentYear, 0, 1).toISOString().split('T')[0];
        const thisYearLastDay = new Date(currentYear, 11, 31+1).toISOString().split('T')[0];
        // Set default dates to this year
        setDefaultDates(thisYearFirstDay, thisYearLastDay);
        break;
      default:
        // Default to this month if no category is selected
        setDefaultDates(firstDayOfMonth, lastDayOfMonth);
    }
  };

  // Function to set default dates
  const setDefaultDates = (startDate, endDate) => {
    document.getElementById('startDate').value = startDate;
    document.getElementById('endDate').value = endDate;
  };

  //setstates
  const [payinpartyname,setPayinpartyname] = useState("");
  const [payinpartyphoneno,setPayinpartyphoneno] = useState("");
  const [payinpaymenttype,setPayinpaymenttype] = useState("");
  const [payindescription,setPayindescription] = useState("");
  const [payinpaymentrefno,setPayinpaymentrefno] = useState("");
  const [payindate , setPayindate] = useState("");
  const [payinrec , setPayinrec] = useState("");


  const [showerror,setShowerror]=useState("");

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPayinBillMaker,setShowPayinBillMaker] = useState(false);
  // const [showAddItem,setShowAddItem] = useState(false);
  const [showrefno , setShowrefno] = useState(false);
  const [paymentintransaction,setPaymentintransaction]=useState([]);
  
  const checkType = (type)=>{
    
    if(type === "cheque"){
      setShowrefno(true);
    }
    else{
      setShowrefno(false);
    }
  }

  const postpayinbillData = ()=>{
    //fetching Api and sending data to server
    fetch("http://localhost:5000/paymentin/",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
          payin_partyname:payinpartyname,
          payin_phonenumber:payinpartyphoneno,
          payin_date:payindate,
          payin_description:payindescription,
          payin_payment_ref_no:payinpaymentrefno,
          payin_paymenttype:payinpaymenttype,
          payin_received:payinrec,
        })
    })
    .then(res=>res.json())
    .then((data)=>{
      
      if(data.error){
        setShowerror(data.error)
      }
      else{
        setShowerror("")
        // setSalebilltransaction([...salebilltransaction, data]);
          // setSaleBillItems([]);
          setPayinpartyname("");
          setPayinpartyphoneno("");
          setPayindate("");
          setPayindescription("");
          setPayinpaymenttype("");
          setShowPayinBillMaker(false);
          fetchPaymentinTransactions();
          // setSalebilltransaction([...salebilltransaction, data]);
        //   fetchParties();
      }
    })
    .catch(error => {
        console.log('Error during fetch:', error);
    });

  }

  const fetchPaymentinTransactions = () => {
    // Fetch updated sale bill transactions
    fetch("http://localhost:5000/paymentin")
      .then(res => res.json())
      .then(data => {setPaymentintransaction(data);console.log("data came")})
      .catch(error => console.error('Error fetching sale bill transactions:', error));
  }
  useEffect(() => {
    fetchPaymentinTransactions();
  }, []);


  // Filter transactions based on search query and date range
  const filteredpayintran = paymentintransaction.filter(sale =>
    sale.payin_partyname.toLowerCase().includes(searchQuery.toLowerCase()) 
    // &&
    // (new Date(sale.payin_date) >= new Date(startDate) &&
    // new Date(sale.sb_date) <= new Date(endDate))
  );

  const [partiesList, setPartiesList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/party")
      .then(res => res.json())
      .then(data => setPartiesList(data))
      .catch(error => console.error('Error fetching parties:', error));
  }, []);

  const totalamt = paymentintransaction.reduce((total, transaction) => total + transaction.payin_total_amt, 0) || 0;
  return (
    <div>
      <h2>Payment in</h2>
       {showPayinBillMaker && (
            <div className='payin-actual-form' style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 2 }}>
            <div className='payin-form'>
              <div className='form-box1'>
                <h1>Payment In</h1>
                <div className='input-grp '>
                          <div className="col-8">
                            <div className="name-phone">
                              <div className='input-fld'>
                                  <select className="type" value={payinpartyname} onChange={(e) => { setPayinpartyname(e.target.value) }} style={{height:"50px",textAlign:"left"}}>
                                    <option value="">Select Party</option>
                                    {partiesList.map((party, index) => (
                                      <option key={index} value={party.pname}>{party.pname}</option>
                                    ))}
                                  </select>
                              </div>
                              <div className='input-fld pt-1'>
                                  <input type='text' value={payinpartyphoneno} onChange={(e)=>{setPayinpartyphoneno(e.target.value)}} placeholder='Phone Number'/>
                              </div>
                              {/*  */}
                            </div>
                          </div>
                          <div className="col-4">
                            <table className="item-list">
                              <tr>
                                <td>Receipt No.</td>
                                <td>:</td>
                                <td><input type='text' placeholder='receipt No.'/></td>
                              </tr>
                              <tr>
                                <td>Date  </td>
                                <td>:</td>
                                <td><input type='date' value={payindate} onChange={(e)=>{setPayindate(e.target.value)}} placeholder='date'/></td>
                              </tr> 
                            </table>
                          </div>
                          
                      </div>
                      {/* it ends here */}
                      <div className='input-grp' style={{justifyContent:"space-between"}}>
                          
                          <div className='input-fld-s col-9' style={{ display:"flex",padding: "13px", width: "350px" }}>
                              <div>Payment Type:</div>
                              <div style={{ marginLeft: "10px" }}>
                                  <select className='type' style={{ width: "200px" }} value={payinpaymenttype} onChange={(e) => { setPayinpaymenttype(e.target.value); checkType(e.target.value); }}>
                                      <option value="">Select payment type</option>
                                      <option value="cash">cash</option>
                                      <option value="cheque">cheque</option>
                                  </select>
                              </div>
                          </div>
                          {showrefno && payinpaymenttype === "cheque" && (
                              <div className='input-fld-s' style={{padding:"3px", width: "200px" }}>
                                  {/* <div>Reference no :</div> */}
                                  <div><input type="text" value={payinpaymentrefno} onChange={(e)=>{setPayinpaymentrefno(e.target.value)}}  placeholder="enter Ref no"/></div>
                              </div>
                          )}
                          <div className="col-4">
                            <table className="item-list">
                              <tr>
                                <td>Received.</td>
                                <td>:</td>
                                <td><input type='text' value={payinrec} onChange={(e)=>{setPayinrec(e.target.value)}} placeholder='Received amt'/></td>
                              </tr>
                            </table>
                            
                          </div>
                      </div>
                      <div className='input-grp-s'style={{justifyContent:"space-between"}}>
                          <div className='input-fld-s col-9'style={{display:"flex",padding:"10px", width:"60%", marginTop:"30px"}}>
                            <div>decription : </div>
                            <div style={{width:"80%"}}><input type="text" value={payindescription} onChange={(e)=>{setPayindescription(e.target.value)}} placeholder="description"/></div>
                          </div>
                      
                      <div className='input-fld-s col-3' style={{display:"flex",padding:"10px", width:"200px"}}>
                              <div>total : </div>
                              <div style={{ width:"70%"}}>{payinrec}</div>
                      </div>
                      </div>
                      <span style={{color:"red"}}>{showerror}</span>
                      <div className='bottom-btn1'>
                        <div className='button btn btn-danger' onClick={()=>{
                          setShowPayinBillMaker(false);
                          }}>back</div>
                        <div className='button btn btn-primary' onClick={()=>{
                          postpayinbillData();
                          // setShowSalesBillMaker(false);
                        }}>Save</div>
                      </div>
              </div>
            </div>
          </div>
          )}
      
      <div className='row main_ps_page'>
        <div className='purchase-sale-header-out'>
          <div className='filters'>
            <div className='fil-cat'>
              <select className='btn btn-primary' style={{width:"200px"}} value={selectedCategory} onChange={handleCategoryChange} >
                <option value="">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Last Quarter">Last Quarter</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
            <div className='fil-date' onChange={(e)=>{setSearchQuery(e.target.value)}}>Between  <input type='date' id='startDate' defaultValue={firstDayOfMonth} onChange={(e)=>setStartDate(e.target.value)}/> to <input type='date' id='endDate' onChange={(e)=>setEndDate(e.target.value)} defaultValue={lastDayOfMonth}/></div>
          </div>
          
        </div>
        <div className='ps-tranc-out'>
            <h5>payment in Taransaction</h5>
            <div className='ps-search'>
              <div className='search-tran'><input type='text' placeholder='Search here ....' onChange={(e)=>{setSearchQuery(e.target.value)}}/></div>
              <input type='button' className='add-tran btn btn-primary' onClick={()=>{setShowPayinBillMaker(true)}} value={"Add Paymentin"}/>
            </div>
            <div className='ps-tranc-table'>
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Party</th>
                    <th scope="col">Payment Type</th>
                    <th scope="col">Ref no</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Received</th>
                  </tr>
                </thead>
                <tbody>
                {filteredpayintran.map((transaction, index) => (
                    <tr key={index}>
                      {/* <td scope="row">{transaction.sb_date}</td> */}
                      <td>{index+1}</td>
                      <td>{transaction.payin_partyname}</td>
                      <td>{transaction.payin_paymenttype}</td>
                      <td>{transaction.payin_paymenttype == "cheque"?transaction.payin_payment_ref_no:"-"}</td>
                      <td>{transaction.payin_total_amt}</td>
                      <td>{transaction.payin_received}</td>
                    </tr>
                  ))}
                
                </tbody>
              </table>
            </div> 
            <div className="grandtotal" style={{height:"8vh"}}>
              {/* <div className={`final-res ${closingBalanceClass}`}>Closing Balance: {closingBalance}</div>
              <div className='bottom'>cr: {totalCredit}</div> */}
              <div className='bottom1'>Total : {totalamt}</div>
            </div> 
        </div>
      </div>
    </div>
  )
}

export default Paymentin

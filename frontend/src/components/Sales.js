import { useState , useEffect} from "react"
import React  from 'react'
import {useNavigate} from "react-router-dom";
import "./Sales.css"

const Sales = () => {
  const nav = useNavigate();
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
        const thisYearFirstDay = new Date(currentYear, 1, 1).toISOString().split('T')[0];
        const thisYearLastDay = new Date(currentYear, 12, 31).toISOString().split('T')[0];
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

  //Rutul forms variables
  const [showSalesBillMaker,setShowSalesBillMaker] = useState(false);
  const [showAddItem,setShowAddItem] = useState(false);
  const [showrefno , setShowrefno] = useState(false);
  const checkType = (type)=>{
    
    if(type === "cheque"){
      setShowrefno(true);
    }
    else{
      setShowrefno(false);
    }
  }
  //posting
  const [sbpartyname,setSbpartyname] = useState("");
  const [sbpartyphoneno,setSbpartyphoneno] = useState("");
  const [sbpaymenttype,setSbpaymenttype] = useState("");
  const [sbdescription,setSbdescription] = useState("");
  const [sbpaymentrefno,setSbpaymentrefno] = useState("");
  const [sbdate , setSbdate] = useState("");
  const [sbstate, setSbstate]=useState("");
  const [sbitemname , setSbitemname] = useState("");
  const [sbitemquantity , setSbitemquantity] = useState("");
  const [sbitemrate, setSbitemrate] = useState("");
  const [sbitemdisc , setSbitemdisc] = useState("");
  const [sbitemtax , setSbitemtax] = useState("");

  //transaction
  const [salebilltransaction,setSalebilltransaction]=useState([]);
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [searchQuery, setSearchQuery] = useState("");

  const [saleBillItems, setSaleBillItems] = useState([]);

  const [itemerrorMessage, setItemerrorMessage] = useState("");
  const postitem = ()=>{
    if (!sbitemname || !sbitemquantity || !sbitemrate) {
      // Display an error message if any required detail is missing
      setItemerrorMessage("Please enter all the required details of the item");
      return; // Exit the function without posting if any required detail is missing
  }
    const newItem = {
      sb_items_name: sbitemname,
      sb_items_qty: sbitemquantity,
      sb_items_rate: sbitemrate,
      sb_items_disc: sbitemdisc,
      sb_items_tax: sbitemtax,
    };
    console.log(saleBillItems);
    // Add the new item to the existing items array
    const updatedItems = [...saleBillItems, newItem];
    setSaleBillItems(updatedItems);
    console.log(updatedItems)
    // Clear input fields after posting
    setSbitemname("");
    setSbitemquantity("");
    setSbitemrate("");
    setSbitemdisc("");
    setSbitemtax("");
    setShowAddItem(false);
  }
  const [showerror,setShowerror]=useState("");
  const postsalebillData = ()=>{
    //fetching Api and sending data to server
    fetch("http://localhost:5000/salebill/",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
          sb_items: saleBillItems, 
          sb_partyname:sbpartyname,
          sb_phonenumber:sbpartyphoneno,
          sb_date:sbdate,
          sb_description:sbdescription,
          sb_payment_ref_no:sbpaymentrefno,
          sb_paymenttype:sbpaymenttype,
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
          setSaleBillItems([]);
          setSbpartyname("");
          setSbpartyphoneno("");
          setSbdate("");
          setSbdescription("");
          setSbpaymenttype("");
          setShowSalesBillMaker(false);
          fetchSaleBillTransactions();
          // setSalebilltransaction([...salebilltransaction, data]);
        //   fetchParties();
      }
    })
    .catch(error => {
        console.log('Error during fetch:', error);
    });

  }
  //sell bill table of transaction
  const fetchSaleBillTransactions = () => {
    // Fetch updated sale bill transactions
    fetch("http://localhost:5000/salebill")
      .then(res => res.json())
      .then(data => setSalebilltransaction(data))
      .catch(error => console.error('Error fetching sale bill transactions:', error));
  }
  useEffect(() => {
    fetchSaleBillTransactions();
  }, []);


  // Filter transactions based on search query and date range
  const filteredsaletran = salebilltransaction.filter(sale =>
    sale.sb_partyname.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (new Date(sale.sb_date) >= new Date(startDate) &&
    new Date(sale.sb_date) <= new Date(endDate))
  );

  //party list
  const [partiesList, setPartiesList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/party")
      .then(res => res.json())
      .then(data => setPartiesList(data))
      .catch(error => console.error('Error fetching parties:', error));
  }, []);

  const [itemList ,setItemList]=useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/item")
      .then(res => res.json())
      .then(data => setItemList(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);
  //totals    
  const totalOfItems = saleBillItems.reduce((total, item) => {
  const subtotal = ((item.sb_items_qty * item.sb_items_rate) - ((item.sb_items_disc / 100) * (item.sb_items_qty * item.sb_items_rate)) + ((item.sb_items_tax / 100) * (item.sb_items_qty * item.sb_items_rate)));
  return total + subtotal;
  }, 0).toFixed(2);
  const totalamt = salebilltransaction.reduce((total, transaction) => total + transaction.sb_total_amt, 0);
  const totaldue  = salebilltransaction.reduce((total,transaction)=> total  + transaction.sb_balancedue , 0);

  return (
    <div>
      <h2>Sales</h2>
      {showSalesBillMaker && (
            <div className='sales-actual-form' style={{ position: 'absolute', top: 0, left: 0, width: '100%',marginTop:"0",height:"100%", zIndex: 3 }}>
              <div className='sales-party-form'>
              <div className='form-box-s'>
                  <h1>Sale Invoice</h1>
                      <div className='input-grp-s '>
                          <div className="col-8 ">
                            <div className="name-phone">
                              <div className='input-fld-s'>
                                  <select className="type" value={sbpartyname} onChange={(e) => { setSbpartyname(e.target.value) }} style={{height:"50px",textAlign:"left"}}>
                                    <option value="">Select Party</option>
                                    {partiesList.map((party, index) => (
                                      <option key={index} value={party.pname}>{party.pname}</option>
                                    ))}
                                  </select>
                              </div>
                              <div className='input-fld-s pt-1'>
                                  <input type='text' value={sbpartyphoneno} onChange={(e)=>{setSbpartyphoneno(e.target.value)}} placeholder='Phone Number'/>
                              </div>
                              {/*  */}
                            </div>
                            <div className="btn btn-primary mt-2" style={{marginRight:"780px"}} onClick={()=>{setShowAddItem(true)}}>Add item</div>
                          </div>
                          <div className="col-4">
                            <table className="item-list">
                              <tr>
                                <td>Invoice No.</td>
                                <td>:</td>
                                <td><input type='text' placeholder='Invoice No.'/></td>
                              </tr>
                              <tr>
                                <td>Date  </td>
                                <td>:</td>
                                <td><input type='date' value={sbdate} onChange={(e)=>{setSbdate(e.target.value)}} placeholder='date'/></td>
                              </tr>
                              <tr>
                                <td>State</td>
                                <td>:</td>
                                <td>
                                  <select className="states" value={sbstate} onChange={(e)=>{setSbstate(e.target.value)}}>
                                  <option value="">Select State</option>
                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                    <option value="Assam">Assam</option>
                                    <option value="Bihar">Bihar</option>
                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                    <option value="Jharkhand">Jharkhand</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Kerala">Kerala</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Manipur">Manipur</option>
                                    <option value="Meghalaya">Meghalaya</option>
                                    <option value="Mizoram">Mizoram</option>
                                    <option value="Nagaland">Nagaland</option>
                                    <option value="Odisha">Odisha</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Sikkim">Sikkim</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Telangana">Telangana</option>
                                    <option value="Tripura">Tripura</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                    <option value="West Bengal">West Bengal</option>
                                  </select> 
                                </td>
                              </tr>
                            </table>
                          </div>
                          
                      </div>
                      <div className='input-grp'>
                        <div className='ps-item-tranc-table'>
                          <table class="table table-hover">
                            <thead>
                              <tr>
                                <th scope="col">Sr no.</th>
                                <th scope="col">Item Name</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Rate</th>
                                <th scope="col">Discount (%)</th>
                                <th scope="col">tax (%)</th>
                                <th scope="col">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                            {saleBillItems.map((item, index) => (
                                <tr key={index}>
                                  <td>{index+1}</td>
                                  <td>{item.sb_items_name}</td>
                                  <td>{item.sb_items_qty}</td>
                                  <td>{item.sb_items_rate}</td>
                                  <td>{item.sb_items_disc}</td>
                                  <td>{item.sb_items_tax}</td>
                                  <td>{((item.sb_items_qty * item.sb_items_rate) - ((item.sb_items_disc / 100) * (item.sb_items_qty * item.sb_items_rate)) + ((item.sb_items_tax / 100) * (item.sb_items_qty * item.sb_items_rate))).toFixed(2)}</td>
                                </tr>
                              ))}
                      
                            </tbody>
                          </table>
                        </div> 
                      </div>
                      
                      <div className='input-grp-s' style={{justifyContent:"space-between"}}>
                          <div className='input-fld-s col-9'style={{display:"flex",padding:"10px", width:"35%"}}>
                              <div>decription : </div>
                              <div style={{width:"80%"}}><input type="text" value={sbdescription} onChange={(e)=>{setSbdescription(e.target.value)}} placeholder="description"/></div>
                          </div>
                          <div className='input-fld-s col-9' style={{ display:"flex",padding: "13px", width: "350px" }}>
                              <div>Payment Type:</div>
                              <div style={{ marginLeft: "10px" }}>
                                  <select className='type' style={{ width: "200px" }} value={sbpaymenttype} onChange={(e) => { setSbpaymenttype(e.target.value); checkType(e.target.value); }}>
                                      <option value="">Select payment type</option>
                                      <option value="cash">cash</option>
                                      <option value="cheque">cheque</option>
                                  </select>
                              </div>
                          </div>
                          {showrefno && sbpaymenttype === "cheque" && (
                              <div className='input-fld-s' style={{padding:"3px", width: "200px" }}>
                                  {/* <div>Reference no :</div> */}
                                  <div><input type="text" value={sbpaymentrefno} onChange={(e)=>{setSbpaymentrefno(e.target.value)}}  placeholder="enter Ref no"/></div>
                              </div>
                          )}
                          <div className='input-fld-s col-3' style={{display:"flex",padding:"10px", width:"200px"}}>
                              <div>total : </div>
                              <div style={{ width:"70%"}}>{totalOfItems}</div>
                          </div>
                      </div>
                      <span style={{color:"red"}}>{showerror}</span>
                      <div className='bottom-btn'>
                        <div className='button btn btn-danger' onClick={()=>{
                          setShowSalesBillMaker(false);
                          }}>back</div>
                        <div className='button btn btn-primary' onClick={()=>{
                          postsalebillData();
                          // setShowSalesBillMaker(false);
                        }}>Save</div>
                      </div>
                </div>
              </div>
            </div>
          )}
      {showAddItem && (
        <div className='actual-form' style={{ position: 'absolute'}}>
        <div className='item-form-s'>
          <div className='form-box1'>
            <h1>Add Item</h1>
                <div className='input-grp'>
                    {/* <div className='input-fld'> */}
                        {/* <input type='text' value={sbitemname} onChange={(e)=>{setSbitemname(e.target.value)}} placeholder='Item Name'/> */}
                        <div className='input-fld-s'>
                            <select className="type" value={sbitemname} onChange={(e)=>{setSbitemname(e.target.value)}} style={{height:"50px",textAlign:"left"}}>
                              <option value="">Select Item</option>
                              {itemList.map((item, index) => (
                                <option key={index} value={item.item_name}>{item.item_name}</option>
                              ))}
                            </select>
                        </div>
                    {/* </div> */}
                    <div className='input-fld'>
                        <input type='text' value={sbitemquantity} onChange={(e)=>{setSbitemquantity(e.target.value)}} placeholder='Item Quantity'/>
                    </div>
                    <div className='input-fld'>
                        <input type='text' value={sbitemrate} onChange={(e)=>{setSbitemrate(e.target.value)}} placeholder='Rate (Rs.)'/>
                    </div>
                </div>
                <div className='input-grp'>
                    <div className='input-fld'>
                        <input type='text' value={sbitemdisc} onChange={(e)=>{setSbitemdisc(e.target.value)}} placeholder='Discount in (%)'/>
                    </div>
                    <div className='input-fld'>
                        <input type='text' value={sbitemtax} onChange={(e)=>{setSbitemtax(e.target.value)}} placeholder='Tax in (%)'/>
                    </div>
                </div>
                <span style={{color:"red"}}>{itemerrorMessage}</span>
                <div className='bottom-btn'>
                  <div className='button btn btn-danger mb-3' onClick={()=>{
                    setShowAddItem(false);
                    }}>back</div>
                  <div className='button btn btn-primary mb-3' onClick={()=>{postitem()}} >Save</div>
                </div>
          </div>
        </div>
      </div>
      )}
      <div className='row main_ps_page'>
        <div className='purchase-sale-header'>
          <div className='filters'>
            <div className='fil-cat'>
              <select className='btn btn-primary' style={{width:"200px"}} value={selectedCategory} onChange={handleCategoryChange} >
              {/* value={pstate} onChange={(e) => { setPstate(e.target.value) }} */}
                <option value="">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Last Quarter">Last Quarter</option>
                <option value="This Year">This Year</option>
                {/* Add more options for other states */}
              </select>
            </div>
            <div className='fil-date' onChange={(e)=>{setSearchQuery(e.target.value)}}>Between  <input type='date' id='startDate' defaultValue={firstDayOfMonth} onChange={(e)=>setStartDate(e.target.value)}/> to <input type='date' id='endDate' onChange={(e)=>setEndDate(e.target.value)} defaultValue={lastDayOfMonth}/></div>
          </div>
          <div className='net-res'>
            <div className='paid'>paid<br/><i class="fa-solid fa-indian-rupee-sign"></i> {totalamt}</div><div className='sign'><i class="fa-solid fa-plus"></i></div>
            <div className='unpaid'>unpaid<br/><i class="fa-solid fa-indian-rupee-sign"></i> {totaldue}</div><div className='sign'><i class="fa-solid fa-equals"></i></div>
            <div className='total'>Total<br/><i class="fa-solid fa-indian-rupee-sign"></i> {totalamt+totaldue}</div>
          </div>
        </div>
        <div className='ps-tranc'>
            <h5>Purchase Taransaction</h5>
            <div className='ps-search'>
              <div className='search-tran'><input type='text' placeholder='Search here ....' onChange={(e)=>{setSearchQuery(e.target.value)}}/></div>
              <input type='button' className='add-tran btn btn-primary' onClick={()=>{setShowSalesBillMaker(true)}} value={"Add Purchase"}/>
            </div>
            <div className='ps-tranc-table'>
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Invoice</th>
                    <th scope="col">Party</th>
                    <th scope="col">Payment Type</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Balance Due</th>
                    {/* <th scope="col">options</th> */}
                  </tr>
                </thead>
                <tbody>
                {filteredsaletran.map((transaction, index) => (
                    <tr key={index}>
                      <td scope="row">{transaction.sb_date}</td>
                      <td>{index+1}</td>
                      <td>{transaction.sb_partyname}</td>
                      <td>{transaction.sb_paymenttype}</td>
                      <td>{transaction.sb_total_amt}</td>
                      <td>{transaction.sb_balancedue}</td>
                      {/* <td><div className="btn btn-danger" onClick={()=>{nav("/salepdf")}}>pdf</div></td> */}
                    </tr>
                  ))}
                {/* {itemtransactions.map((transaction, index) => (
                    <tr key={index}>
                      {/* <td scope="row">{index + 1}</td> 
                      <td>{transaction.tran_type}</td>
                      <td>{transaction.tran_pname}</td>
                      <td>{transaction.tran_date}</td>
                      <td>{transaction.tran_item_Qty}</td>
                      <td>{transaction.tran_item_Rate}</td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div> 
            {/* <div className="grandtotal">
              <div className={`final-res ${closingBalanceClass}`}>Closing Balance: {closingBalance}</div>
              <div className='bottom'>cr: {totalCredit}</div>
              <div className='bottom'>de: {totalDebit} </div>
            </div>  */}
        </div>
      </div>
    </div>
  )
}

export default Sales

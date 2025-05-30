import React,{useEffect, useState} from 'react'
import "./parties.css"

const Parties = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const[pname,setPname]=useState("");
  const[pcontact,setPcontact]=useState("");
  const[pemail,setPemail]=useState("");
  const[pstate,setPstate]=useState("");
  const[pGSTIN,setPGSTIN]=useState("");
  const[pshippingadd,setPshippingadd]=useState("");
  const[partyexisterr, setPartyexisterr]= useState("");
  const [partiesList, setPartiesList] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [transactions, setTransactions] = useState([]);

  //filter for search
  const filteredParties = partiesList.filter(party =>
    party.pname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //api call to set list
  useEffect(() => {
    fetch("http://localhost:5000/party")
      .then(res => res.json())
      .then(data => setPartiesList(data))
      .catch(error => console.error('Error fetching parties:', error));
  }, []);

  //after party data is posted fetchparties will be called to automaticall add data to party list
  const fetchParties = () => {
    fetch("http://localhost:5000/party")
      .then(res => res.json())
      .then(data => setPartiesList(data))
      .catch(error => console.error('Error fetching parties:', error));
  }

  //to set default party details
  useEffect(() => {
    if (partiesList.length > 0) {
      setSelectedParty(partiesList[0]);
    }
  }, [partiesList]);

  //to 
  const handlePartyClick = (party) => {
    setSelectedParty(party);
  }


  //to show the transaction of the selected party
  useEffect(() => {
    if (selectedParty) {
      fetch(`http://localhost:5000/transaction/${selectedParty._id}`)
        .then(res => res.json())
        .then(data => setTransactions(data))
        .catch(error => console.error('Error fetching transactions:', error));
    }
  }, [selectedParty]);

  const totalCredit = transactions.reduce((total, transaction) => total + transaction.tran_credit, 0) || 0;
  const totalDebit  = transactions.reduce((total,transaction)=> total  + transaction.tran_debit , 0) || 0;
  const closingBalance = totalCredit - totalDebit; // Or totalDebit - totalCredit depending on your requirement
  const closingBalanceClass = closingBalance < 0 ? 'negative-balance' : 'positive-balance';

  // const calculateClosingBalance = (partyId) => {
  //   const partyTransactions = transactions.filter(transaction => transaction.partyId === partyId);
  //   const totalCredit = partyTransactions.reduce((total, transaction) => total + transaction.tran_credit, 0);
  //   const totalDebit = partyTransactions.reduce((total, transaction) => total + transaction.tran_debit, 0);
  //   return totalCredit - totalDebit;
  // };

  const postpartyData = () => {
    if (selectedParty) {
      // Editing existing party
      editParty();
    } else {
      // Adding new party
      fetch("http://localhost:5000/party/", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pname: pname,
          pcontact: pcontact,
          pGSTIN: pGSTIN,
          pemail: pemail,
          pstate: pstate,
          pshippingAddress: pshippingadd
        })
      })
      .then(res => res.json())
      .then((data) => {
        if (data.error) {
          setPartyexisterr(data.error)
        } else {
          setPartyexisterr("");
          setPname("");
          setPcontact("");
          setPGSTIN("");
          setPemail("");
          setPstate("");
          setPshippingadd("");
          setShowForm(false);
          fetchParties();
        }
      })
      .catch(error => {
        console.log('Error during fetch:', error);
      });
    }
  }
  

  const editParty = () => {
    fetch(`http://localhost:5000/party/${selectedParty.p_id}`,{
      method:"put",
      headers:{
          "Content-Type":"application/json"
      },
      body:JSON.stringify({
        pname:pname,
        pcontact:pcontact,
        pGSTIN:pGSTIN,
        pemail:pemail,
        pstate:pstate,
        pshippingAddress:pshippingadd
      })
  })
  .then(res => res.json())
  .then((data) => {
    if (data.error) {
      setPartyexisterr(data.error)
    } else {
      setPartyexisterr("");
      setPname("");
      setPcontact("");
      setPGSTIN("");
      setPemail("");
      setPstate("");
      setPshippingadd("");
      setShowForm(false);
      fetchParties();
    }
  })
  .catch(error => console.error('Error fetching transactions:', error));
    // Your edit logic here
    console.log("Edit party clicked for party:", selectedParty);
    
  }

  // Delete party
  const deleteParty = () => {
    if (window.confirm("Are you sure you want to delete this party?")) {
      fetch(`http://localhost:5000/party/${selectedParty.p_id}`,{
        method:"Delete",
      }).then(
        () => {
          console.log("Data deleted successfully");
          // Reload the page
          window.location.reload();
        }
      )
      // Your delete logic here
      console.log("Delete party clicked for party:", selectedParty);
    }
  }
    
  return (
    <div style={{ position: 'relative' }}>
      {/* <div className='main-form' style={{ position: 'relative' }}> */}
          
        {/* </div> */}
        <h2 style={{fontSize:"46px"}}>Paarties</h2>
      {showForm && (
            <div className='actual-formp' style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 2 }}>
              <div className='party-formp'>
                <div className='form-box1p'>
                  <h1>Add party</h1>
                      <div className='input-grp'>
                          <div className='input-fld'>
                              <input type='text'value={pname} onChange={(e)=>{setPname(e.target.value)}} placeholder='Party Name'/>
                          </div>
                          <div className='input-fld'>
                              <input type='text'value={pcontact} onChange={(e)=>{setPcontact(e.target.value)}} placeholder='Phone Number'/>
                          </div>
                          <div className='input-fld'>
                              <input type='text'value={pGSTIN} onChange={(e)=>{setPGSTIN(e.target.value)}} placeholder='GSTIN'/>
                          </div>
                      </div>
                      <div className='input-grp'>
                          <div className='input-fld'>
                              <input type='email' value={pemail} onChange={(e)=>{setPemail(e.target.value)}} placeholder='email'/>
                          </div>
                          <div className='input-fld'>
                            <select className='dropdown' value={pstate} onChange={(e) => { setPstate(e.target.value) }}>
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
                              {/* Add more options for other states */}
                            </select>
                          </div>
                      </div>
                      <div className='input-grp'>
                          <div className='input-fld' style={{width:"100%"}}>
                              <input type='text'value={pshippingadd} onChange={(e)=>{setPshippingadd(e.target.value)}} placeholder='Shipping Address'/>
                          </div>
                      </div>
                      <span style={{color:"red"}}>{partyexisterr}</span>
                      {/* <input type='submit'  id='login-btn' value="Sign In"/> */}
                      <div className='bottom-btnp'>
                        <div className='button btn btn-danger' onClick={()=>{
                          setPartyexisterr("");
                          setPname("");
                          setPcontact("");
                          setPGSTIN("");
                          setPemail("");
                          setPstate("");
                          setPshippingadd("");
                          setShowForm(false);
                          }}>back</div>
                        <div className='button btn btn-primary' onClick={()=>{postpartyData()} }>Save</div>
                      </div>
                </div>
              </div>
            </div>
          )}
      <div className='main-party row'>
        <div className='list col-3'>
          <div className='search-party'>
            <input type='text' placeholder='Search party here....' onChange={(e)=>{setSearchQuery(e.target.value)}}/>
            {/* <button className='search-icon'><i class="bi bi-search"></i></button> */}
          </div>
          <div>
            Parties List
          </div>
          <div>
            <div class="list-group">
              {
                filteredParties.map((party, index) => (
                  <a href="#" key={index} className="list-group-item list-group-item-action listdet" aria-current="true" onClick={() => handlePartyClick(party)}>
                    <div>{party.pname}</div>
                    <div className={`${party.pclosingBalance < 0 ? 'negative-balance' : 'positive-balance'}`}>{party.pclosingBalance == 0 ? "-" : party.pclosingBalance}</div>
                  </a>
                ))
              }
              {/* <a href="#" class="list-group-item list-group-item-action listdet" aria-current="true">
                <div>Jeel Kavar</div>
                <div>amount</div>
              </a> */}
              {/* <a href="#" class="list-group-item list-group-item-action">A second link item</a>
              <a href="#" class="list-group-item list-group-item-action">A third link item</a>
              <a href="#" class="list-group-item list-group-item-action">A fourth link item</a>
              <a class="list-group-item list-group-item-action disabled" aria-disabled="true">A disabled link item</a> */}
            </div>
          </div>
          <div className='Addbuttonp' onClick={()=>{setShowForm(true);}}>
            <div><i class="bi bi-plus"></i></div>
            <div>Add Parties</div>
          </div>
        </div>
        
        <div className='col'>
          <div className='party-det table'>
            {selectedParty && (
              <>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                <div className='name'>{selectedParty.pname}</div>
                <div>
                <button style={{float:"right", paddingLeft:"20px", background:"none"}} onClick={deleteParty}><i class="bi bi-archive"></i></button>
                <button style={{float:"right", paddingLeft:"20px",background:"none"}} 
                onClick={()=>{setShowForm(true);
                    setPname(selectedParty.pname);
                    setPcontact(selectedParty.pcontact);
                    setPGSTIN(selectedParty.pGSTIN);
                    setPemail(selectedParty.pemail);
                    setPstate(selectedParty.pstate);
                    setPshippingadd(selectedParty.pshippingAddress);}}><i class="bi bi-pencil-square"></i></button>
                </div>
                </div>
                <div className='adddet'>
                  <div className='det' style={{width:"70%"}}>
                    <div>Phone: {selectedParty.pcontact}</div>
                    <div>Email: {selectedParty.pemail}</div>
                  </div>
                  <div className='det' style={{width:"30%"}}>
                    <div>Gstin : {selectedParty.pGSTIN}</div>
                    <div>Address : {selectedParty.pshippingAddress}</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='party-tranc'>
            Party Transactions
            <div className='tranc-table'>
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Number</th>
                    <th scope="col">Voucher</th>
                    <th scope="col">Credit</th>
                    <th scope="col">Debit</th>
                  </tr>
                </thead>
                <tbody>
                {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td scope="row">{index + 1}</td>
                      <td>{transaction.tran_type}</td>
                      <td>{transaction.tran_credit}</td>
                      <td>{transaction.tran_debit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grandtotal">
              <div className={`final-res ${closingBalanceClass}`}>Closing Balance: {closingBalance}</div>
              <div className='bottom'>cr: {totalCredit}</div>
              <div className='bottom'>de: {totalDebit} </div>
            </div> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default Parties

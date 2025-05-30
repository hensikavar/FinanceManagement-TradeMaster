import React , {useState,useEffect} from 'react'
import "../components/Items.css"

const Items = () => {
  const [showitemForm, setShowitemForm] = useState(false);
  const [searchitemQuery, setSearchitemQuery] = useState("");
  const[itemname,setItemname]=useState("");
  const[itemcategory,setItemcategory] = useState("");
  const[itemcode,setItemcode]=useState("");
  const[itemHSNSACCODE,setItemHSNSACCODE] = useState("");
  const[itemsaleprice,setItemsaleprice]=useState("");
  const[itempurchaseprice,setItempurchaseprice]=useState("");
  const[itemsalepricedisc,setItemsalepricedisc] =useState("");
  const[itempurchasepricedisc,setItempurchasepricedisc]=useState("");
  const[itemstockqty,setItemstockqty]=useState("");
  const[itemtaxes,setItemtaxes] = useState("");
  const[itemexisterr, setItemexisterr]= useState("");
  const [itemsList, setItemsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemtransactions, setItemtransactions] = useState([]);

  const filteredParties = itemsList.filter(item =>
    item.item_name.toLowerCase().includes(searchitemQuery.toLowerCase())
  );

  useEffect(() => {
    fetch("http://localhost:5000/item")
      .then(res => res.json())
      .then(data => setItemsList(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const fetchItems = () => {
    fetch("http://localhost:5000/item")
      .then(res => res.json())
      .then(data => setItemsList(data))
      .catch(error => console.error('Error fetching items:', error));
  }

  
  //to set default party details
  useEffect(() => {
    if (itemsList.length > 0) {
      setSelectedItem(itemsList[0]);
    }
  }, [itemsList]);

  //to 
  const handleItemClick = (item) => {
    setSelectedItem(item);
  }


  //to show the transaction of the selected party
  useEffect(() => {
    if (selectedItem) {
      fetch(`http://localhost:5000/transaction/${selectedItem._id}`)
        .then(res => res.json())
        .then(data => setItemtransactions(data))
        .catch(error => console.error('Error fetching transactions:', error));
    }
  }, [selectedItem]);

  const postitemData = ()=>{
    if (selectedItem) {
      // Editing existing party
      editItem();
    } else {

    //fetching Api and sending data to server
    fetch("http://localhost:5000/item/",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
          item_name:itemname,
          item_category:itemcategory,
          item_code:itemcode,
          item_HSN_SAC_CODE:itemHSNSACCODE,
          item_saleprice:itemsaleprice,
          item_saleprice_disc:itemsalepricedisc,
          item_purchaseprice:itempurchaseprice,
          item_purchaseprice_disc:itempurchasepricedisc,
          item_stockqty:itemstockqty,
          item_taxes:itemtaxes
        })
    })
    .then(res=>res.json())
    .then((data)=>{
        if(data.error){
          setItemexisterr(data.error)
        }
        else{
          setItemexisterr("");
          setItemname("");
          setItemcategory("");
          setItemcode("");
          setItemHSNSACCODE("");
          setItemsaleprice("");
          setItemsalepricedisc("");
          setItempurchaseprice("");
          setItempurchasepricedisc("");
          setShowitemForm(false);
          fetchItems();
        }
    })
    .catch(error => {
        console.log('Error during fetch:', error);
    });
    }
  }

  const editItem = () => {
    fetch(`http://localhost:5000/item/${selectedItem.item_id}`,{
      method:"put",
      headers:{
          "Content-Type":"application/json"
      },
      body:JSON.stringify({
        item_name:itemname,
          item_category:itemcategory,
          item_code:itemcode,
          item_HSN_SAC_CODE:itemHSNSACCODE,
          item_saleprice:itemsaleprice,
          item_saleprice_disc:itemsalepricedisc,
          item_purchaseprice:itempurchaseprice,
          item_purchaseprice_disc:itempurchasepricedisc,
          item_stockqty:itemstockqty,
          item_taxes:itemtaxes
      })
  })
  .then(res => res.json())
  .then((data) => {
    if (data.error) {
      setItemexisterr(data.error)
    } else {
      setItemexisterr("");
          setItemname("");
          setItemcategory("");
          setItemcode("");
          setItemHSNSACCODE("");
          setItemsaleprice("");
          setItemsalepricedisc("");
          setItempurchaseprice("");
          setItempurchasepricedisc("");
          setShowitemForm(false);
          fetchItems();
    }
  })
  .catch(error => console.error('Error fetching transactions:', error));
    // Your edit logic here
    console.log("Edit party clicked for party:", selectedItem);
    
  }

  // Delete party
  const deleteItem = () => {
    if (window.confirm("Are you sure you want to delete this party?")) {
      fetch(`http://localhost:5000/item/${selectedItem.item_id}`,{
        method:"Delete",
      }).then(
        () => {
          console.log("Data deleted successfully");
          // Reload the page
          window.location.reload();
        }
      )
      // Your delete logic here
      console.log("Delete party clicked for party:", selectedItem);
    }
  }
  
  const purchasepri = selectedItem ? parseFloat(selectedItem.item_purchaseprice) : 0;
  const stock = selectedItem ? parseFloat(selectedItem.item_stockqty) : 0;

  // const purchasepri = parseFloat(selectedItem.item_purchaseprice);
  // const stock = parseFloat(selectedItem.item_stockqty);
  const stockval = purchasepri * stock;
 
  return (
    // <div>
    //   <h1>Items</h1>
    // </div>
    <div style={{ position: 'relative' }}>
      {/* <div className='main-form' style={{ position: 'relative' }}> */}
          
        {/* </div> */}
        <h2 style={{fontSize:"46px"}}>Items</h2>
      {showitemForm && (
            <div className='actual-formi' style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 2 }}>
              <div className='party-formi'>
                <div className='form-box1i'>
                  <h1>Add Item</h1>
                      <div className='input-grp'>
                          <div className='input-fld'>
                              <input type='text'value={itemname} onChange={(e)=>{setItemname(e.target.value)}} placeholder='Item Name'/>
                          </div>
                          <div className='input-fld'>
                              <input type='text'value={itemcategory} onChange={(e)=>{setItemcategory(e.target.value)}} placeholder='Item category'/>
                          </div>
                          <div className='input-fld'>
                              <input type='text'value={itemcode} onChange={(e)=>{setItemcode(e.target.value)}} placeholder='Item code'/>
                          </div>
                      </div>
                      <div className='input-grp'>
                          <div className='input-fld'>
                              <input type='text' value={itemHSNSACCODE} onChange={(e)=>{setItemHSNSACCODE(e.target.value)}} placeholder='Item HSN-SAC-Code'/>
                          </div>
                          <div className='input-fld'>
                              <input type='text' value={itemtaxes} onChange={(e)=>{setItemtaxes(e.target.value)}} placeholder='Item Taxes'/>
                          </div>
                          <div className='input-fld'>
                              <input type='text' value={itemstockqty} onChange={(e)=>{setItemstockqty(e.target.value)}} placeholder='Item Stock Qunatity'/>
                          </div>
                      
                          {/* <div className='input-fld'>
                            <select className='dropdown' value={pstate} onChange={(e) => { setPstate(e.target.value) }}>
                              <option value="">Select State</option>
                              <option value="State 1">State 1</option>
                              <option value="State 2">State 2</option>
                              {/* Add more options for other states 
                            </select>
                          </div> */}
                      </div>
                      <div className='input-grp'>
                          <div className='input-fld'>
                              <input type='text'value={itemsaleprice} onChange={(e)=>{setItemsaleprice(e.target.value)}} placeholder='Sale price'/>
                          </div>
                          <div className='input-fld'>
                              <input type='text'value={itemsalepricedisc} onChange={(e)=>{setItemsalepricedisc(e.target.value)}} placeholder='Sale Price Disc'/>
                          </div>
                      </div>
                      <div className='input-grp'>
                          <div className='input-fld'>
                              <input type='text'value={itempurchaseprice} onChange={(e)=>{setItempurchaseprice(e.target.value)}} placeholder='Purchase price'/>
                          </div>
                          <div className='input-fld'>
                              <input type='text'value={itempurchasepricedisc} onChange={(e)=>{setItempurchasepricedisc(e.target.value)}} placeholder='Purchase Price Disc.'/>
                          </div>
                      </div>
                      <span style={{color:"red"}}>{itemexisterr}</span>
                      {/* <input type='submit'  id='login-btn' value="Sign In"/> */}
                      <div className='bottom-btni'>
                        <div className='button btn btn-danger' onClick={()=>{
                          setItemexisterr("");
                          setItemname("");
                          setItemcategory("");
                          setItemcode("");
                          setItemHSNSACCODE("");
                          setItemsaleprice("");
                          setItemsalepricedisc("");
                          setItempurchaseprice("");
                          setItempurchasepricedisc("");
                          setShowitemForm(false);
                          }}>back</div>
                        <div className='button btn btn-primary' onClick={()=>{postitemData()} }>Save</div>
                      </div>
                </div>
              </div>
            </div>
          )}
      <div className='main-party row'>
        <div className='list col-3'>
          <div className='search-party'>
            <input type='text' placeholder='Search party here....' onChange={(e)=>{setSearchitemQuery(e.target.value)}}/>
            {/* <button className='search-icon'><i class="bi bi-search"></i></button> */}
          </div>
          <div>
            Items List
          </div>
          <div>
            <div class="list-group">
              {
                filteredParties.map((item, index) => (
                  <a href="#" key={index} className="list-group-item list-group-item-action listdet" aria-current="true" onClick={() => handleItemClick(item)}>
                    <div>{item.item_name}</div>
                    <div className={`${item.item_stockqty < 1 ? 'negative-balance' : 'positive-balance'}`}>{item.item_stockqty}</div>
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
          <div className='Addbuttoni btn btn-danger' onClick={()=>{setShowitemForm(true);}}>
            <div><i class="bi bi-plus"></i></div>
            <div>Add button</div>
          </div>
        </div>
        
        <div className='col'>
          <div className='party-det table'>
            {selectedItem && (
              
              <>
              <div style={{display:"flex", justifyContent:"space-between"}}>
              <div className='name'>{selectedItem.item_name}</div>
                <div>
                <button style={{float:"right", paddingLeft:"20px", background:"none"}} onClick={deleteItem}><i class="bi bi-archive"></i></button>
                <button style={{float:"right", paddingLeft:"20px",background:"none"}} 
                onClick={()=>{  
                  setItemname(selectedItem.item_name);
                  setItemcategory(selectedItem.item_category);
                  setItemcode(selectedItem.item_code);
                  setItemHSNSACCODE(selectedItem.item_HSN_SAC_CODE);
                  setItemsaleprice(selectedItem.item_saleprice);
                  setItemsalepricedisc(selectedItem.item_saleprice_disc);
                  setItempurchaseprice(selectedItem.item_purchaseprice);
                  setItempurchasepricedisc(selectedItem.item_purchaseprice_disc);
                  setShowitemForm(true);}}><i class="bi bi-pencil-square"></i></button>
                </div>
                </div>
                {/* <div className='name'>{selectedItem.item_name}</div> */}
                <div className='adddet'>
                  <div className='det' style={{width:"70%"}}>
                    <div>Sale Price: {selectedItem.item_saleprice}</div>
                    <div>Purchase Price: {selectedItem.item_purchaseprice}</div>
                  </div>
                  <div className='det' style={{width:"30%"}}>
                    <div>Stock Qty. : {selectedItem.item_stockqty}</div>
                    <div>Stock Value: {stockval}</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='party-tranc'>
            <b>item tranc</b>
            <div className='tranc-tablei'>
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Party</th>
                    <th scope="col">Date</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price/unit</th>
                  </tr>
                </thead>
                <tbody>
                {itemtransactions.map((transaction, index) => (
                    <tr key={index}>
                      {/* <td scope="row">{index + 1}</td> */}
                      <td>{transaction.tran_type}</td>
                      <td>{transaction.tran_pname}</td>
                      <td>{transaction.tran_date? new Date(transaction.tran_date).toISOString().split('T')[0] : ''}</td>
                      <td>{transaction.tran_item_Qty}</td>
                      <td>{transaction.tran_item_Rate}</td>
                    </tr>
                  ))}
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
    </div>
  )
}

export default Items

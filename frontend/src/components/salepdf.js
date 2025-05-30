import "./salepdf.css";
import React from 'react'

const SalePdf = () => {
  return (
    <div class="bill-page">
		<div class="bill-title-name">
			<div style="float: right;padding-right: 20px" class="border-e-2 border-slate-950">
				<img src="btklogo.png" width="130px" height="130px" />
			</div>
			<div style="padding: 20px 0 0 30px">
				<span><b>BTK Enterprise</b></span><br/><span style="font-size: 20px">Rajkot-360007</span>
			</div>
		</div>
		<div class="bill-details">
			<div>
				<table>
				<tr>
					<div class="party-table"><b>Name : </b>Rutul Trivedi</div>
				</tr>
				<tr>
					<div class="party-table"><b>Contact : </b>9879879879</div>	
				</tr>
			</table>
			</div>	
			<div style=""><b>Date : </b>14/10/2004</div>
		</div>
		<div class="item-table">
			<table class="border-2 border-slate-950" width="100%" border="1">
				<tr class="border-b-2 border-slate-950">
					<th class="item-row" style="width:10%">Sr.No.</th>
					<th style="width: 50%">Item Name</th>
					<th style="width: 10%">Quantity</th>
					<th style="width: 15%">Rate</th>
					<th style="width: 15%">Total</th>
				</tr>
				<tr  class="border-b-2 border-slate-950">
					<td class="item-row">1.</td>
					<td>Wall Clock</td>
					<td>3</td>
					<td>1000</td>
					<td>3000</td>
				</tr>
				<tr>
					<td colspan="5" style="font-size: 25px" class="item-row"><b style="float: right;padding-right: 25px">Total : ₹10000</b></td>
				</tr>
			</table>
		</div>
		<div class="money-data">
			<b style="font-size: 30px;">Statistics :</b><br/>
			<b>Bill Total : </b>₹10000<br/>
			<b>Amount Received : </b>₹8000<br/>
			<b>Amount Due : </b>₹2000
			<div style="float: right;text-align: center;">_<br/><b>Signature</b></div>
		</div>
	</div>
  )
}

export default SalePdf;

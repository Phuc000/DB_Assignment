import React, { useState } from "react";
import InfoForm from "../InfoForm/InfoForm";
import axios from "axios";
import "./AccountDetail.scss";

const AccountDetails = () => {

    return (
        <div className="account_details_wrapper">
            <InfoForm title="Account Details" />
            {/* save button  */}
            <button className="save_button">Save</button>
        </div>
    );

}

export default AccountDetails;
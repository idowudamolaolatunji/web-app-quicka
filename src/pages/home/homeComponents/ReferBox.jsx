import React from 'react'
import img from "../../../assets/images/resources/megaphone.png"
import { MdContentCopy } from 'react-icons/md'
import { useAuthContext } from '../../../context/AuthContext'
import TooltipUI from '../../../components/layout/TooltipUI';
import { useWindowSize } from 'react-use';

function ReferBox() {
    const { width } = useWindowSize();
    const { store } = useAuthContext();

  return (
    <section className='card refer-section'>
        <div className="flex" style={{ alignItems: "flex-start", justifyContent: "space-between", flexDirection: "row" }}>
            <div className="section--heading">
                <h2>Refer and Earn</h2>
                <p>Refer other businesses and earn rewards!</p>
            </div>

            <img src={img} style={{ width: width > 450 ? "7.8rem" : "6rem" }} alt="" />
        </div>

        <div className="link--btn" style={{ marginTop: width > 450 && "-2rem" }}>
            Referral Code:{" "}
            <span className="value">{store?.referralCode}</span>
            <TooltipUI title="Copy Referal Code" placement="top">
                <span><MdContentCopy /></span>
            </TooltipUI>
        </div>
    </section>
  )
}

export default ReferBox

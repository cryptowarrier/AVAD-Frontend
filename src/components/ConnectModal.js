import React from 'react';



const ConnectModal = ({ open, connect, close }) => {
  const hidden = { display: 'none' };
  const show = { display: 'block' };
  const handleClick = (e) => {
    if(e.target.id === 'content') {

    } else {
      close();
    }
  }
  return (
    <div onClick={handleClick}  style={open ? show : hidden} className="wallet-modal">
      <div id="content" className="modal-content">
        <img id="metamask_button" onClick={connect} className="metamask-button" src="assets/metamask.png" alt="" />
      </div>
    </div>
  )
}

export default ConnectModal;
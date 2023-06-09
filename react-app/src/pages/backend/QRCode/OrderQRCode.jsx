import React from 'react'
import QRCode from 'qrcode.react';
export const OrderQRCode = (order) => {
    // Tạo nội dung mã QR từ thông tin đơn hàng
  const qrCodeData = JSON.stringify(order);
  return (
    <div className="text-center">
      <QRCode value={qrCodeData} size={128} />
    </div>
  )
}

import React from "react";
import { Receipt } from "../../pages/Admin/RecieptManager";
import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";
import { X } from "lucide-react";

interface invoiceProps {
  invoice: Receipt;
  SetShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const RecieptModal = ({ invoice, SetShowModal }: invoiceProps) => {
  return (
    <div className="fixed bg-gray top-0 right-0 left-0 bottom-0 z-40">
      <button type="button" className="absolute top-0 right-0 bg-white text-red-600 p-2 rounded-md z-50">
        <X className="text-red-600 w-4 h-4" onClick={() => SetShowModal(false)} />
      </button>
      <div className="flex items-center justify-center h-full px-4">
        <PDFViewer showToolbar={true} style={{ width: "100%", height: "100%" }}>
          <MyDocument currentInvoice={invoice} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default RecieptModal;

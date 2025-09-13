import {
  ArrowLeft,
  CheckCircle,
  Download,
  Eye,
  MessageCircleWarning,
  Plus,
  Trash,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecieptModal from "../../components/reciepts/RecieptModal";
import MyDocument from "../../components/reciepts/MyDocument";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

export type Receipt = {
  customer_name: string;
  sl: string;
  item: string[];
  date: string;
  description?: string[];
  price: number[];
  qty: number[];
  total?: number[];
  tax: number;
};

const ReceiptManager = () => {
  const [reciept, setReciept] = useState<Receipt>({
    customer_name: "",
    sl: "",
    item: [""],
    date: new Date().toISOString().split("T")[0], // Default to today's date
    description: [""],
    price: [200],
    qty: [1],
    total: [0], // Initialize total as an array
    tax: 0,
  });
  const [receipts, setReciepts] = useState<Receipt[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Receipt | null>(null);
  const [existingReciept, setExistingReciept] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [downloadReciept, setDownloadReciept] = useState<string | null>(null);

  //handle changes input fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { id, value } = e.target;
    setReciept((prev: Receipt) => {
      if (
        id === "item" ||
        id === "price" ||
        id === "qty" ||
        id === "description"
      ) {
        if (typeof index === "number" && Array.isArray(prev[id])) {
          const updateArray = [...(prev[id] as any[])];
          updateArray[index] = value;
          return { ...prev, [id]: updateArray };
        }
        return prev;
      } else {
        return { ...prev, [id]: value };
      }
    });
  };
  // Add functions for adding items, descriptions, prices, and quantities
  const addItem = (id: keyof Receipt) => {
    setReciept((prev: Receipt) => {
      if (Array.isArray(prev[id])) {
        return { ...prev, [id]: [...prev[id], ""] };
      }
      return prev;
    });
  };
  // Add functions for removing items, descriptions, prices, and quantities
  const removeItem = (id: keyof Receipt, index: number) => {
    setReciept((prev: Receipt) => {
      if (Array.isArray(prev[id]) && !isNaN(index)) {
        return { ...prev, [id]: prev[id].filter((_, i) => i !== index) };
      }
      return prev;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReciepts((prev) => {
      // Prevent adding duplicate receipts with the same serial number
      if (prev.some((r) => r.sl === reciept.sl)) {
        setExistingReciept(true);
        setTimeout(() => {
          setExistingReciept(false);
        }, 3000);
        return prev;
      }
      return [...prev, reciept];
    });
  };

  const addTotal = (price: (number | string)[], qty: number[]) => {
    if (price.length !== qty.length) return;

    const total = price.map((p, i) => {
      const priceValue = Number(p);
      const qtyValue = qty[i];
      return !isNaN(priceValue) && !isNaN(qtyValue) ? priceValue * qtyValue : 0;
    });

    setReciept((prev) => ({ ...prev, total }));
  };

  // download reciept as a pdf
  const generatePdf = async (invoice: Receipt) => {
    if (!invoice) return;
    try {
      const blob = await pdf(
        <MyDocument currentInvoice={invoice} />
      ).toBlob();

      saveAs(
        blob,
        `SRD-receipt-${invoice.sl.slice(0, 3) + invoice.customer_name.slice(0, 3)}.pdf`
      );
      setDownloadReciept(
        `downloaded SRD-receipt-${invoice.sl.slice(0, 3) + invoice.customer_name.slice(0, 3)}.pdf`
      );
    } catch (error) {
      console.error(error);
      setDownloadReciept("Error downloading receipt");
    } finally {
      setTimeout(() => {
        setDownloadReciept(null);
      }, 3000);
    }
  };

  useEffect(() => {
    addTotal(reciept.price, reciept.qty);
  }, [reciept.price, reciept.qty]);

  return (
    <div>
      {existingReciept ? (
        <div className="fixed bottom-0 right-0 rounded-md bg-red-600 p-2 text-orange-200 flex items-center gap-1">
          <MessageCircleWarning className="w-8 h-8 text-white-600" />{" "}
          <span>Reciept Serial Number Already Existing</span>
        </div>
      ) : (
        ""
      )}

      {downloadReciept ? (
        <div className="fixed bottom-0 right-0 rounded-md bg-white-600 p-2 text-gray-600 flex items-center gap-1">
          {downloadReciept === "Error downloading receipt" ? (
            <MessageCircleWarning className="w-8 h-8 text-red-600" />
          ) : (
            <CheckCircle className="w-8 h-8 text-green-600" />
          )}
          <span>{downloadReciept}</span>
        </div>
      ) : (
        ""
      )}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center text-gray hover:text-primary mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-dark">Reciept Manager</h1>
              <p className="text-gray">
                Create and manage reciepts for payments
              </p>
            </div>
            {/* <button
              onClick={() => {}}
              className="btn-primary inline-flex items-center"
            >
              <Eye className="w-5 h-5 mr-2" />
              view receipt
            </button> */}
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center items-center gap-8">
        <div className="py-4 px-4 max-w-[600px] w-[90%] rounded-lg bg-gray-700 shadow-sm border-b">
          <h1 className="text-lg font-bold text-white">create receipt</h1>
          <p className="text-sm text-gray-300 mb-4">
            Create a new receipt for payments
          </p>
          <form onSubmit={handleSubmit}>
            <div>
              <div>
                <div className="mb-4 flex items-center justify-between max-[550px]:flex-wrap">
                  <div className="mb-4 max-w-[250px] max-[500px]:max-w-full">
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      serial number
                    </p>
                    <input
                      type="text"
                      className="block w-full border border-gray-600 bg-gray-800 text-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter serial number"
                      value={reciept.sl}
                      id="sl"
                      onChange={(e) => handleChange(e)}
                      max={5}
                      required
                    />
                  </div>
                  <div className="mb-4 max-w-[250px] max-[500px]:max-w-full">
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      Date
                    </p>
                    <input
                      type="date"
                      className="block w-full border border-gray-600 bg-gray-800 text-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter date"
                      value={reciept.date}
                      id="date"
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4 ">
                  <div className="flex justify-between items-center ">
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      Item
                    </p>
                    <div className="flex gap-4 items-start">
                      <button
                        className=" mb-2 inline-flex"
                        type="button"
                        onClick={() => addItem("item")}
                      >
                        <Plus className="text-orange-500 w-8 h-8" />
                      </button>
                    </div>
                  </div>
                  {reciept.item.map((item, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex items-center">
                        <input
                          type="text"
                          className="block w-full border border-gray-600 bg-gray-800 text-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter item name"
                          value={item}
                          id="item"
                          onChange={(e) => {
                            handleChange(e, index);
                          }}
                          required
                        />
                        {index >= 1 ? (
                          <button
                            className="mn-2 inline-flex"
                            type="button"
                            onClick={() => removeItem("item", index)}
                          >
                            <X className="text-red-600 w-8 h-8" />
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center ">
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      Description
                    </p>
                    <div className="flex gap-4 items-start">
                      <button
                        className=" mb-2 inline-flex"
                        type="button"
                        onClick={() => addItem("description")}
                      >
                        <Plus className="text-orange-500 w-8 h-8" />
                      </button>
                    </div>
                  </div>
                  {reciept.description?.map((description, index) => (
                    <div key={index} className="mb-4 flex items-center">
                      <input
                        type="text"
                        className="block w-full border border-gray-600 bg-gray-800 text-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter description"
                        value={description}
                        id="description"
                        onChange={(e) => {
                          handleChange(e, index);
                        }}
                        required
                      />
                      {index >= 1 ? (
                        <button
                          className="mn-2 inline-flex"
                          type="button"
                          onClick={() => removeItem("description", index)}
                        >
                          <X className="text-red-600 w-8 h-8" />
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center ">
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      Price
                    </p>
                    <div className="flex gap-4 items-start">
                      <button
                        className=" mb-2 inline-flex"
                        type="button"
                        onClick={() => addItem("price")}
                      >
                        <Plus className="text-orange-500 w-8 h-8" />
                      </button>
                    </div>
                  </div>
                  {reciept.price.map((price, index) => (
                    <div key={index} className="mb-4 flex items-center">
                      <input
                        type="number"
                        className="block w-full border border-gray-600 bg-gray-800 text-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter price"
                        value={price}
                        id="price"
                        onChange={(e) => {
                          handleChange(e, index);
                        }}
                        required
                      />
                      {index >= 1 ? (
                        <button
                          className="mn-2 inline-flex"
                          type="button"
                          onClick={() => removeItem("price", index)}
                        >
                          <X className="text-red-600 w-8 h-8" />
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center ">
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      quantity
                    </p>
                    <div className="flex gap-4 items-start">
                      <button
                        className=" mb-2 inline-flex"
                        type="button"
                        onClick={() => addItem("qty")}
                      >
                        <Plus className="text-orange-500 w-8 h-8" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    {reciept.qty.map((qty, index) => (
                      <div key={index} className="mb-2 flex items-center">
                        <input
                          type="number"
                          className="block w-full border border-gray-600 bg-gray-800 text-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter quantity"
                          value={qty}
                          id="qty"
                          onChange={(e) => {
                            handleChange(e, index);
                          }}
                          required
                        />
                        {index >= 1 ? (
                          <button
                            className="mn-2 inline-flex"
                            type="button"
                            onClick={() => removeItem("qty", index)}
                          >
                            <X className="text-red-600 w-8 h-8" />
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between max-[550px]:flex-wrap">
                <div className="mb-4 max-w-[250px] max-[500px]:max-w-full">
                  <p className="text-sm font-medium text-gray-300 mb-1">
                    Send To
                  </p>
                  <div className="mb-4">
                    <input
                      type="text"
                      className="block w-full border border-gray-600 bg-gray-800 text-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter reciever name"
                      id="customer_name"
                      onChange={handleChange}
                      value={reciept.customer_name}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4 max-w-[250px] max-[500px]:max-w-full">
                  <div className="flex justify-between items-center ">
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      Tax(optional)
                    </p>
                  </div>
                  <div className="mb-4">
                    <input
                      type="number"
                      className="block w-full border border-gray-600 bg-gray-800 text-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter tax (optional)"
                      id="tax"
                      onChange={handleChange}
                      value={reciept.tax}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
            >
              Save Receipt
            </button>
          </form>
        </div>
        <div className="py-4 px-4 max-w-[600px] w-[90%] min-h-[300px] rounded-lg bg-gray-700 shadow-sm border-b">
          <ul className="flex gap-4 flex-col">
            <li>
              <span className="text-lg font-bold text-white flex justify-between">
                <span className="ml-2 flex gap-2">
                  <span>sl</span>
                  <span>date</span>
                </span>
                <span className="ml-2 flex gap-2">
                  <span>item</span>
                  <span>price</span>
                </span>
                <span className="flex gap-2 invisible">
                  <span>item</span>
                  <span>price</span>
                </span>
              </span>
            </li>
            {receipts.map((item, index) => (
              <li
                key={index}
                className="bg-orange-500 rounded-md p-4 flex justify-between"
              >
                <span className="flex gap-2">
                  <span>{item.sl.slice(0, 3) + "..."}</span>
                  <span>{item.date.slice(0, 3) + "..."}</span>
                </span>
                <span className="flex gap-2">
                  <span>{item.item.slice(0, 1) + "..."}</span>
                  <span>{item.price.slice(0, 1) + "..."}</span>
                </span>
                <span className="flex gap-2">
                  <button className="mr-2 bg-white p-1 rounded-md cursor-pointer">
                    <Trash className="text-red-600 w-4 h-4" />
                  </button>
                  <button className="bg-white p-1 rounded-md cursor-pointer">
                    <Eye
                      className="text-blue-600 w-4 h-4"
                      onClick={() => {
                        setCurrentInvoice(item);
                        setShowModal(true);
                      }}
                    />
                  </button>
                  <button className="ml-2 bg-white p-1 rounded-md cursor-pointer" onClick={() => generatePdf(item)}>
                    <Download className="text-green-600 w-4 h-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showModal && currentInvoice && (
        <RecieptModal SetShowModal={setShowModal} invoice={currentInvoice} />
      )}
    </div>
  );
};
export default ReceiptManager;

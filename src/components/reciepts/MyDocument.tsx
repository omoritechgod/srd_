import { Receipt } from "../../pages/Admin/RecieptManager";
import {
  Document,
  Text,
  Page,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "./assets/new_blapng.png";

interface MyDocumentProps {
  currentInvoice: Receipt;
}

const MyDocument = ({ currentInvoice }: MyDocumentProps) => {
  return (
    <Document
      title={`Invoice #${
        currentInvoice.sl.slice(0, 3) + currentInvoice.customer_name.slice(0, 3)
      }`}
      author="Nexa trux technologies"
      subject="SRD Consulting CMS Invoice"
      keywords="invoice, receipt, payment"
      creator="Nexa trux technologies"
      producer="react-pdf"
      language="en"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={{ width: 100, height: 100 }} />
          <Text style={styles.text_orange}>INVOICE</Text>
        </View>
        <View style={styles.bg_orange}></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            backgroundColor: "#000",
            color: "#fff",
            padding: "25px 25px",
          }}
        >
          <View style={{ flexDirection: "column", gap: 4 }}>
            <Text>Invoice to:</Text>
            <Text>{currentInvoice.customer_name}</Text>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <Text style={{ marginRight: 5 }}>Invoice#</Text>
              <Text>{currentInvoice.sl}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <Text style={{ marginRight: 5 }}>Date:</Text>
              <Text>{currentInvoice.date}</Text>
            </View>
          </View>
        </View>
        <View style={styles.flex}>
          <View style={styles.flex_col}>
            <Text>Items</Text>
            {currentInvoice.item.map((item, index) => (
              <Text key={index} style={styles.mt}>
                {item}
              </Text>
            ))}
          </View>
          {currentInvoice.description && (
            <View style={styles.flex_col}>
              <Text>Description</Text>
              {currentInvoice.description.map((item, index) => (
                <Text key={index} style={styles.mt}>
                  {item}
                </Text>
              ))}
            </View>
          )}
          <View style={styles.flex_col}>
            <Text>Price</Text>
            {currentInvoice.price.map((price, index) => (
              <Text key={index} style={styles.mt}>
                {price}
              </Text>
            ))}
          </View>
          <View style={styles.flex_col}>
            <Text>Qty</Text>
            {currentInvoice.qty.map((qty, index) => (
              <Text key={index} style={styles.mt}>
                {qty}
              </Text>
            ))}
          </View>
          <View style={styles.flex_col}>
            <Text>Total</Text>
            {currentInvoice.total?.map((total, index) => (
              <Text key={index} style={styles.mt}>
                {total}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.flex}>
          <View style={{marginTop: 50}}>
            <View>
              <Text>Thank You for trusting Us</Text>
              <Text style={{ marginTop: 20 }}>___________________</Text>
            </View>
            <View style={{ maxWidth: "250px", marginTop: 15 }}>
              <Text>Terms and Conditions</Text>
              <Text>All sales are final. no refunds or exchanges.</Text>
            </View>
          </View>
          <View>
            <View style={styles.flex}>
              <Text>Subtotal:</Text>
              <Text style={{ marginLeft: 10 }}>
                NGN
                {currentInvoice.total?.reduce(
                  (acc, curr) => Number(acc) + (Number(curr) || 0),
                  0
                )}
              </Text>
            </View>
            <View style={styles.flex}>
              <Text>Tax:</Text>
              <Text style={{ marginLeft: 10 }}>{currentInvoice.tax}</Text>
            </View>
            <View style={styles.flex}>
              <Text>Total:</Text>
              <Text style={{ marginLeft: 10 }}>
                NGN
                {currentInvoice.total?.reduce(
                  (acc, curr) => Number(acc) + (Number(curr) || 0),
                  0
                )}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#000",
            width: "100%",
            height: 40,
          }}
        ></View>
      </Page>
    </Document>
  );
};
const styles = StyleSheet.create({
  page: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: "5px 25px",
  },
  text_orange: {
    color: "orange",
    fontSize: 20,
    fontWeight: "bold",
  },
  bg_orange: {
    backgroundColor: "#ff9800",
    width: "100%",
    height: 10,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 25,
  },
  flex_col: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  mt: {
    paddingTop: 70,
    // borderBottom: "1px solid #000",
  },
  //   flex_on: {
  //     flexDirection: "row",
  //     justifyContent: "flex-start",
  //     alignItems: "center",
  //     padding: 25,
  //   },
});
export default MyDocument;

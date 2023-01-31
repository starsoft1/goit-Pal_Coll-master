import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import SendIcon from "@mui/icons-material/Send";
import { Formik } from "formik";
import { sendSmsSchema } from "../validation/Validation";

const SmsSendForm = () => {
  const [sms, setSMS] = useState();
  const [valueOption, setValueOption] = useState([]);
  const [sender, setSender] = useState("Pal&Collect");
  const user = JSON.parse(localStorage.getItem("user"));

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const querySnapshot = await getDocs(
      collection(db, "sms"),
      orderBy("createdAt")
    );
    const data = querySnapshot.docs;
    const options = data.map((d) => ({
      value: d.get("sms"),
      label: d.get("title"),
    }));
    setValueOption(options);
  }, []);

  return (
    <Formik
      validationSchema={sendSmsSchema}
      initialValues={{ phoneNumber: "970" }}
      onSubmit={async (values, { setSubmitting }) => {
        if (!sms) {
          alert("Please Select At Least One SMS Message");
        } else {
          try {
            var myHeaders = new Headers();
            myHeaders.append(
              "accept",
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
            );
            myHeaders.append("cache-control", "max-age=0");
            myHeaders.append("origin", "http://188.225.173.174:90");
            myHeaders.append("Host", "sms.htd.ps");
            myHeaders.append("Access-Control-Allow-Origin", "*");
            myHeaders.append(
              "Content-Type",
              "application/x-www-form-urlencoded"
            );

            var urlencoded = new URLSearchParams();
            urlencoded.append("MYID", "1ba6f68ab5c8c07cd228a6de44b6578c");
            urlencoded.append("Originator", sender);
            urlencoded.append("Destination", values.phoneNumber);
            urlencoded.append("GroupID", "");
            urlencoded.append("Message", sms);
            urlencoded.append("GetMsgID", "1");
            urlencoded.append("IsDemo", "");

            var requestOptions = {
              method: "POST",
              mode: "no-cors",
              headers: myHeaders,
              body: urlencoded,
              redirect: "follow",
            };

            fetch(
              "https://sms.htd.ps/API/SendSMS.asmx/SubmitSMS",
              requestOptions
            )
              .then((response) => response.text())
              .catch((error) => console.log("error", error));

            await addDoc(collection(db, "SendSms"), {
              email: user.email,
              sms: sms,
              smsTitle: document.getElementById('demo-simple-select-required').innerHTML,
              number: values.phoneNumber,
              sender: sender,
              createdAt: serverTimestamp(),
            });
            values.phoneNumber = "970";
          } catch (e) {
            console.log("error");
          }
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit} style={{ padding: "18px" }}>
          <Card padding={3} elevation={3}>
            <Grid container spacing={2} padding={3}>
              <Grid item xs={12}>
                <Item
                  style={{
                    backgroundColor: "#A5A3A3",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "25px",
                  }}
                >
                  <label>Send SMS Messages</label>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={values.phoneNumber}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  helperText={
                    !errors.phoneNumber || !touched.phoneNumber
                      ? ""
                      : errors.phoneNumber
                  }
                  error={errors.phoneNumber && touched.phoneNumber}
                  label="Phone Number"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl required fullWidth>
                  <InputLabel id="demo-simple-select-required-label">
                    SMS Title
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={sms}
                    label="SMS Title *"
                    onChange={(event) => setSMS(event.target.value)}
                  >
                    {valueOption.map((value) => (
                      <MenuItem value={value.value}>{value.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Item
                  style={{
                    backgroundColor: "#A5A3A3",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  <div className="message-filed">
                    <div className="message-header">Selected Message:</div>
                    <div className="message-sms">{sms}</div>
                  </div>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Button
                  style={{
                    backgroundColor: "#f48fb1",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                  fullWidth
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Send SMS
                </Button>
              </Grid>
            </Grid>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default SmsSendForm;

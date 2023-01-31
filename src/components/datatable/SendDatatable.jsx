import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { smsMessageColumns, userColumns } from "../../datatablesource";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,orderBy
} from "firebase/firestore";
import { db } from "../../firebase";

const SendDatatable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // LISTEN (REALTIME)
    const sub = onSnapshot(
      collection(db, "SendSms"),
      (snapShot) => {
        let list = snapShot.docs.map(doc=>{
          return {...doc.data(),id: doc.id}
        })
        setData(list);
      },
      (error) => {
        console.log('error');
      }
    );
    return sub;
  }, []);

  return (
    <div className="datatable">
      <div className="datatableTitle">
        SMS List
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={smsMessageColumns}
        pageSize={100}
        rowsPerPageOptions={[9]}
        sortingOrder = {['asc', 'desc', null]}
        initialState={{
          sorting: {
            sortModel: [{ field: 'createdAt', sort: 'desc' }],
          }}}
      />
    </div>
  );
};

export default SendDatatable;

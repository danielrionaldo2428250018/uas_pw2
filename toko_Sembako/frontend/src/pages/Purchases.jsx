import { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Purchases() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/purchases').then(res => setData(res.data));
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="w-100">
        <Navbar />
        <div className="p-4">
          <h4>Purchases</h4>

          <table className="table table-bordered">
            <thead>
              <tr><th>Supplier</th><th>Tanggal</th><th>Total</th></tr>
            </thead>
            <tbody>
              {data.map(p=>(
                <tr key={p.id}>
                  <td>{p.supplier}</td>
                  <td>{p.tanggal}</td>
                  <td>{p.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

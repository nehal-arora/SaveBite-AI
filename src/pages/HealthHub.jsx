import { useEffect, useState } from "react";
import "../styles/health.css";

import { auth } from "../services/firebase";
import {
  getMedicines,
  addMedicine,
  deleteMedicine,
} from "../services/medicineService";

import {
  Plus,
  Pill,
  CalendarClock,
  Trash2,
  HeartPulse,
  Bell,
  Search,
} from "lucide-react";


function HealthHub() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [medicine, setMedicine] = useState({
    name: "",
    expiry: "",
    quantity: "",
    reminder: "",
  });


  useEffect(() => {
    loadMedicines();
  }, []);


  const loadMedicines = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const data = await getMedicines(user.uid);

      setMedicines(data || []);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleAddMedicine = async (e) => {
    e.preventDefault();

    try {

      const user = auth.currentUser;

      if (!user) return;


      await addMedicine(user.uid, medicine);


      setMedicine({
        name: "",
        expiry: "",
        quantity: "",
        reminder: "",
      });


      setShowForm(false);

      loadMedicines();


    } catch (error) {
      console.log(error);
    }
  };


  const handleDelete = async (id) => {

    try {

      await deleteMedicine(id);

      setMedicines(
        medicines.filter((item) => item.id !== id)
      );

    } catch(error){
      console.log(error);
    }

  };


  return (
    <div className="health-page">


      {/* HEADER */}

      <div className="health-header">

        <div>
          <h1>
            Health Hub
          </h1>

          <p>
            Manage medicines, expiry dates and health reminders in one place.
          </p>

        </div>


        <button
          className="add-medicine-btn"
          onClick={() => setShowForm(true)}
        >

          <Plus size={20}/>

          Add Medicine

        </button>


      </div>



      {/* HEALTH STATS */}


      <div className="health-stats">


        <div className="health-stat-card">

          <div className="icon-box">
            <Pill/>
          </div>

          <div>

            <h3>
              {medicines.length}
            </h3>

            <p>
              Total Medicines
            </p>

          </div>

        </div>



        <div className="health-stat-card">

          <div className="icon-box warning">
            <CalendarClock/>
          </div>


          <div>

            <h3>
              {
                medicines.filter(
                  (m)=>m.expiry
                ).length
              }
            </h3>

            <p>
              Expiry Tracking
            </p>

          </div>


        </div>




        <div className="health-stat-card">

          <div className="icon-box success">
            <Bell/>
          </div>


          <div>

            <h3>
              {
                medicines.filter(
                  (m)=>m.reminder
                ).length
              }
            </h3>

            <p>
              Active Reminders
            </p>

          </div>


        </div>



      </div>




      {/* SEARCH BAR */}


      <div className="medicine-search">


        <Search size={20}/>


        <input
          placeholder="Search medicines..."
        />


      </div>
            {/* MEDICINE SECTION */}

      <div className="medicine-section">


        <div className="section-title">

          <div>

            <h2>
              Your Medicine Cabinet
            </h2>

            <p>
              Keep track of your medicines and never miss an expiry date.
            </p>

          </div>


          <HeartPulse size={28}/>

        </div>




        {
          loading ? (

            <div className="empty-health-card">

              <h3>
                Loading medicines...
              </h3>

            </div>


          ) : medicines.length === 0 ? (


            <div className="empty-health-card">


              <Pill size={45}/>


              <h3>
                No medicines added yet
              </h3>


              <p>
                Add your medicines to track expiry dates and set reminders.
              </p>



              <button
                className="empty-add-btn"
                onClick={()=>setShowForm(true)}
              >

                <Plus size={18}/>

                Add Your First Medicine

              </button>



            </div>



          ) : (


            <div className="medicine-grid">


              {
                medicines.map((item)=>(


                  <div
                    className="medicine-card"
                    key={item.id}
                  >



                    <div className="medicine-card-top">


                      <div className="medicine-icon">

                        <Pill size={25}/>

                      </div>



                      <button
                        className="delete-btn"
                        onClick={()=>handleDelete(item.id)}
                      >

                        <Trash2 size={18}/>

                      </button>


                    </div>




                    <h3>
                      {item.name}
                    </h3>



                    <div className="medicine-info">

                      <span>
                        Quantity:
                      </span>

                      <strong>
                        {item.quantity || "Not added"}
                      </strong>

                    </div>




                    <div className="medicine-info">

                      <span>
                        Expiry:
                      </span>

                      <strong>
                        {item.expiry || "Not added"}
                      </strong>

                    </div>




                    <div className="reminder-box">


                      <Bell size={16}/>


                      <span>

                        {
                          item.reminder
                          ?
                          `Reminder: ${item.reminder}`
                          :
                          "No reminder set"
                        }

                      </span>


                    </div>



                  </div>


                ))
              }



            </div>


          )

        }



      </div>





      {/* ADD MEDICINE MODAL */}


      {
        showForm && (


          <div className="medicine-overlay">


            <form
              className="medicine-modal"
              onSubmit={handleAddMedicine}
            >


              <h2>
                Add Medicine
              </h2>


              <p>
                Save medicine details and track expiry automatically.
              </p>




              <input
                type="text"
                placeholder="Medicine name"
                value={medicine.name}
                onChange={(e)=>
                  setMedicine({
                    ...medicine,
                    name:e.target.value
                  })
                }
                required
              />




              <input
                type="date"
                value={medicine.expiry}
                onChange={(e)=>
                  setMedicine({
                    ...medicine,
                    expiry:e.target.value
                  })
                }
              />




              <input
                type="text"
                placeholder="Quantity (Example: 10 tablets)"
                value={medicine.quantity}
                onChange={(e)=>
                  setMedicine({
                    ...medicine,
                    quantity:e.target.value
                  })
                }
              />




              <input
                type="time"
                value={medicine.reminder}
                onChange={(e)=>
                  setMedicine({
                    ...medicine,
                    reminder:e.target.value
                  })
                }
              />





              <div className="modal-actions">


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={()=>setShowForm(false)}
                >

                  Cancel

                </button>




                <button
                  type="submit"
                  className="save-btn"
                >

                  Save Medicine

                </button>



              </div>



            </form>


          </div>


        )
      }




    </div>
  );
}


export default HealthHub;
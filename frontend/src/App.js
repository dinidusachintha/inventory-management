
import CounterClass from './components/CounterClass';
import CounterFunction from './components/CounterFunction';
import Header from './components/Header';

import AddItem from "./components/AddItem";
import CreateItem from "./components/Itemdata";
import User from "./components/User";
import {BrowserRouter as Router,Routes, Route} from "react-router-dom"
function App() {

 // return (
 //   <div>
 //    <Header/>
 //    <AddItem/>
 //   </div>
  //);

  const handleSave = (item) => {
    console.log("Saved Item:", item);
    // You can send this data to MongoDB using an API
  };

  return (
    <Router>
    <div className="container mt-5">
      <Header/>

      <Routes>
          <Route path="/add" element={<AddItem onSave={handleSave} />} />
          <Route path="/CreateItem" element={<CreateItem/>}/>
          <Route path="/User" element={<User/>}/>
          

        </Routes>
      
    </div>
    </Router>
  )

  
  
  };

  


export default App;

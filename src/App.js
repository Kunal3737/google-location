import "./App.css";
import CityList from "./components/CityList";
import Location from "./components/Location";

function App() {
  return (
    <div className="App">
      <Location />
      <hr />
      <CityList />
    </div>
  );
}

export default App;

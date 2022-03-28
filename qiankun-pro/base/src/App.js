import { BrowserRouter as Router, Link } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/vue">vue 应用</Link>
        <br />
        <Link to="/react">react 应用</Link>
      </Router>
      {/*切换导航将子应用渲染到容器中*/}
      <div id="container"></div>
    </div>
  );
}

export default App;

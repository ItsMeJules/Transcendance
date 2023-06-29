import logo from './logo.svg';
import './App.css';
// import '../../ApiCall';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('http://localhost:3000/hello')
	.then((resp) => resp.text())
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.log("wtf");
		console.log(error);
  	})
	},[]);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

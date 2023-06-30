import logo from './logo.svg';
import {v4 as uuidv4} from 'uuid';
import './App.css';
// import { RequestURI } from './callback/api/CodeForToken';

function RequestURI() {
	let redirectURL = {
		state: uuidv4(),
		client_id: process.env.REACT_APP_CLIENT_ID,
		redirect_uri: process.env.REACT_APP_REDIRECT_URI,
		response_type: "code"
	}
	// Add scope when i know what it means
	let url = `https://api.intra.42.fr/oauth/authorize?client_id=${redirectURL.client_id}&redirect_uri=${redirectURL.redirect_uri}&response_type=${redirectURL.response_type}&state=${redirectURL.state}`;
	console.log(url);
	document.location = (url)
}

function App() {
	fetch('http://localhost:3000/hello')
	.then(resp => resp.text())
	.then(text => { console.log(text);})
	.catch(error => {
		console.log(error);
	  });
	fetch({RequestURI})

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
		<button onClick={RequestURI}>OAuth42</button>
      </header>
    </div>
  );
}

export default App;

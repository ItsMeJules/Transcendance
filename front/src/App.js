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
	let url = 'http://localhost:3000/api/callback';
	console.log(url);
	document.location = (url) // 
}

function RequestURIGoogle() {
	let redirectURL = {
		state: uuidv4(),
		client_id: process.env.REACT_APP_CLIENT_ID,
		redirect_uri: process.env.REACT_APP_REDIRECT_URI,
		response_type: "code"
	}
	// Add scope when i know what it means
	let url = 'http://localhost:3000/api/auth/google/login';
	console.log(url);
	document.location = (url) // 
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
		<button onClick={RequestURIGoogle}>OAuthGoogle</button>
      </header>
    </div>
  );
}

export default App;

import {v4 as uuidv4} from 'uuid';

function RequestURI() {
	let state = uuidv4();
	let client_id = process.env.REACT_APP_CLIENT_ID;
	let redirect_uri = process.env.REACT_APP_REDIRECT_URI;
	let response_type = "code";
	// Add scope when i know what it means
	let url = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&state=${state}`;
	return url;
}
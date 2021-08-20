import {useState} from 'react';
import './styles/Home.css';
import { withRouter } from 'react-router';

function Join(props) {
    const [value, setValue] = useState('');

    function handleJoin(e) {
        props.history.push(`/join/${value}`);
    }

    function handleChange(e) {
        setValue(e.target.value);
    }

    return (
        <div class="home">
            <h1>Enjoy your Stay</h1>
            <textarea type="text" class="name-input" onChange={handleChange} placeholder="Enter your code?..."></textarea>
            <button onClick={handleJoin}>join</button>
        </div>
    )
}

export default withRouter(Join);
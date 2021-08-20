import {useState} from 'react';
import { setName } from '../redux/slicers/nameSlicer';
import { useDispatch } from 'react-redux';
import './styles/Home.css';
import { withRouter } from 'react-router'; 

function Home(props) {
    const [value, setValue] = useState(null);
    const dispatch = useDispatch();

    function handleCreate(e) {
        e.preventDefault();
        if(!value){
            return alert('Bache esmet Chie??');
        }
        fetch('http://localhost:8000/join')
            .then(res => res.json())
            .then(data => {
                dispatch(setName(value));
                props.history.push(`/join/${data.id}?streamer=true`);
            });
    }

    function handleJoin(e) {
        if(!value){
            return alert('Bache esmet Chie??');
        }
        dispatch(setName(value));
        props.history.push('/join');
    }

    function handleChange(e) {
        setValue(e.target.value);
    }

    return (
        <div class="home">
            <h1>Shamaii For Ever</h1>
            <textarea type="text" class="name-input" onChange={handleChange} placeholder="Esmet Chie?..."></textarea>
            <button onClick={handleJoin}>join</button>
            <button onClick={handleCreate}>Create</button>
        </div>
    )
}

export default withRouter(Home);
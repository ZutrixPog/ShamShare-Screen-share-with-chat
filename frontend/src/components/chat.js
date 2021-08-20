import {useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './styles/chat.css';

export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    const [io] = useState(useSelector((state) => state.socket.value));
    const [value, setValue] = useState(null);
    const chat = useRef(null);
    const myname = useSelector((state) => state.name.value);

    useEffect(() => {
        io.on('message-received', ({name, msg}) => {
            setMessages([...messages, {name: name, msg: msg}]);
        });

        io.on('user-connected', ({name}) => {
            chat.current.innerHTML += `<span id="notif">${name} connected!</span>`
        });
    });

    function handleChange(e) {
        setValue(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const id = props.match.params.id;
        setMessages([...messages, {name: myname, msg: value}]);
        io.emit('message', {id: id, msg: value, name: myname});
        console.log(value)
    }

    return (
        <div class="chat">
            <div class="chat-title">Chat</div>
            <div class="chat-body" ref={chat}>
            { messages.map(({name, msg}) => 
                <div class={name === myname ? "bubble you" : "bubble you me"}>
                    <span style={{color: 'pink'}}>{name}: </span>{ msg }
                </div>
            )}
            </div>
            <form class="message-box" onSubmit={handleSubmit}>
                <textarea type="text" class="message-input" onChange={handleChange} placeholder="Type message..."></textarea>
                <button type="submit" class="message-submit">Send</button>
            </form>
        </div>
    );
}
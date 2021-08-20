import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { useSelector, useDispatch } from 'react-redux';
import './styles/player.css';
import { disconnect } from '../redux/slicers/socketSlicer';
import liveLogo from '../live.png';

let peer = null;

export default function Player(props) {
    const video = useRef(null);
    const [io] = useState(useSelector((state) => state.socket.value));
    const [initiate] = useState(new URLSearchParams(props.location.search).get('streamer'));
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const name = useSelector(state => state.name.value);
    const id = props.match.params.id;

    function getUserMedia() {
        return navigator.mediaDevices.getDisplayMedia({
                video: {
                  mediaSource: "screen",
                  width: { max: '1920' },
                  height: { max: '1080' },
                  frameRate: { max: '30' }
            }
        });
    } 
    
    function clearVid() {
        setVisible(true);
        video.current.removeAttribute('srcObject');
        video.current.load();
    }

    // I know i could use functions here but for whatever reason it didnt work??
    useEffect(() => {
        if (initiate){
            setVisible(true)
            peer = new Peer(id);
            peer.on('open', () => {
                io.emit('join', {id: id, peerid: id, name: name})
                getUserMedia().then(stream => {
                    setVisible(false);
                    video.current.srcObject = stream;
                    video.current.play();
                    peer.on('call', call => {
                        console.log('called')
                        call.answer(stream);
                    });
                    io.on('user-connected', ({peerid}) => {
                        peer.call(peerid, stream);
                    })
                    stream.oninactive = () => {
                        io.emit('disconnected', id);
                        clearVid();
                    }
                });
            });
        } else {
            peer = new Peer();
            peer.connect(id);
            peer.on('open', () => {
                peer.on('call', call => {
                    call.answer(new MediaStream());
                    call.on('stream', stream => {
                        video.current.srcObject = stream;
                        video.current.play();
                    });
                });
                console.log(peer._id)
                io.emit('join', {id: id, peerid: peer._id, name: name});
            });
            peer.on('error', err => {
                console.log('error')
                console.log(err);
            });
        }
        
        io.on('disconnected', () => {
            clearVid();
            console.log('disconnected')
        });

        return () => {
            dispatch(disconnect());
        };

    }, [id, io, initiate, video, dispatch, name]);
    
    return (
        <div class="player">
            <div class="title"><h3>Salam</h3> <img id="live" src={liveLogo}/></div>          
            <video ref={video} autoPlay muted/> 
            <h2 id='inform' style={{opacity: visible ? 1 : 0}} >Please reload to Start Stream!</h2> 
            <div className='code'>Your Stream Code: {id} <button id="copy" onClick={() => { navigator.clipboard.writeText(id) }}/></div>    
        </div>
    )
}
import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { useSelector, useDispatch } from 'react-redux';
import './styles/player.css';
import { disconnect } from '../redux/slicers/socketSlicer';

let peer = null;

export default function Player(props) {
    const video = useRef(null);
    const [io] = useState(useSelector((state) => state.socket.value));
    const [initiate] = useState(new URLSearchParams(props.location.search).get('streamer'));
    const dispatch = useDispatch();
    const name = useSelector(state => state.name.value);

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
        video.current.removeAttribute('srcObject');
        video.current.load();
    }
    
    useEffect(() => {
        const id = props.match.params.id;

        if (initiate){
            peer = new Peer(id);
            peer.on('open', () => {
                io.emit('join', {id: id, peerid: id, name: name})
                getUserMedia().then(stream => {
                    video.current.srcObject = stream;
                    video.current.play();
                    console.log(stream)
                    io.on('user-connected', ({peerid}) => {
                        peer.call(peerid, stream);
                    });
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
                        console.log(video.current.srcObject);
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

        console.log(`User with id ${peer._id} connected!`);
       
        return () => {
            dispatch(disconnect());
        };

    }, [props.match.params.id, io, initiate, video, dispatch, name]);
    
    return (
        <div class="player">
            <div class="title"><h3>Salam</h3> <img id="live" src="./live.png"/></div>          
            <video ref={video} autoPlay muted/>      
        </div>
    )
}
const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();

//get username and room from url
const{username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

//get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

//join chatRoom
socket.emit('joinRoom',{username,room})

//output message
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

//message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get message
    const msg = e.target.elements.msg.value;

    //emit message to server
    socket.emit('chatMessage',msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//output message to dom
const outputMessage = (message) =>{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
}
//add users to room
function outputUsers(users){
    userList.innerHTML = `${users.map(user=> `<li>${user.username}</li>`).join('')}`
}
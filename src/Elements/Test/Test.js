
import axios from 'axios';
import io from "socket.io-client";
//import Cookies from 'universal-cookie';
import { useState, useEffect, useMemo } from 'react';
import { Await, useNavigate } from "react-router-dom";
const Play = () => {



  const baseURL = `http://localhost:5000`
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();
  const [chats, setChats] = useState([])
  
  const[role,setRole] = useState('none')
    if(user.type===true)
    {
      setRole('block')
    }
  const socket = useMemo(() => (io.connect(`${baseURL}`)), []);
  //  useEffect(()=> {
  async function refresh() {
    await axios.post(`${baseURL}/posts/${user.token}`,
    )
      .then((res) => {
        (setChats(res.data))
        //  console.log(res.data)
      })
  }
  // },[])

  useEffect(() => { refresh() }, [])
  useMemo(() => {
    socket.on('msgRecived', async msg => {
      refresh()
    })
  }, [])

  var chat =
    chats.map((data) => {
      if (data.tweetedBy.email === (user.email)) {
        return (
          <>
            <li className="me">
              <div className="entete">
                <h3>{data.time}</h3>
                <h2>{data.tweetedBy.name}</h2>
                <span className="status blue"></span>
              </div>
              <div className="message" onClick={()=>reactOpt(data._id)}>
                {data.tweet}
              </div>
              <div className='reactBtn' id={`${data._id}`} style={{display:'none'}}>
                <button onClick={()=>reaction(data._id+'input')}>React</button>
                <button onClick={()=>Delete(data._id)}>Delete</button>
                <div id={data._id+'input'}  style={{display:'none'}} >
                  <input id={data._id+'inpt'} className='inpt'/><button onClick={()=>Delete(data._id)}>Post</button>
                </div>
              </div>
          </li>
          </>

        )
      }
      else {
        return (
          <>
            <li className="you" >
              <div className="entete">
                <span className="status green"></span>
                <h2>{data.tweetedBy.name}</h2>
                <h3>{data.time}</h3>
              </div>
              <div className="message"  onClick={()=>reactOpt(data._id)}>
                {data.tweet} </div>
              <div className='reactBtn' id={`${data._id}`} style={{display:'none'}}>
                <button onClick={()=>reaction(data._id+'input')}>React</button>
                <button onClick={()=>Delete(data._id)} style={{display:'none'}} >Delete</button>
                <div id={data._id+'input'}  style={{display:`${role}`}} >
                  <input id={`${data._id+'inpt'}`} className='inpt'/><button onClick={()=>Delete(data._id)}>Post</button>
                </div>
              </div>
            </li>
          </>
        )
      }
    })

  function reactOpt(id) {
   
    var x = document.getElementById(`${id}`);
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
     console.log(id)
  }


 async function Delete(id,email){

    if(role==='block'||email===user.email){
  await axios.post(`${baseURL}/tweetDelete/${user.token}`, id)
  .then((res) => {
  })
socket.emit('msgRecived', 'details')
Await(refresh())
    }
    else{
      alert('Not auth to delete the msg')
    }
  }

         function reaction(id)
       {

    var x = document.getElementById(`${id}`);
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }

  }


async function reactionPost(id)
{
const text = document.getElementById(`${id+'inpt'}`)
    const detail = {
      chatId:id,
      reaction:text
    }
    await axios.post(`${baseURL}/tweetReaction/${user.token}`,detail)
  .then((res) =>{
  })
socket.emit('msgRecived', 'details')
Await(refresh())

}
  


  // console.log(chats)
  // console.log(chat)

  async function send() {
    const tweet = document.getElementById('text').value
    if (tweet !== '') {
      const details = {
        tweetedBy: {
          name: user.name,
          user: user.user
        },
        tweet: tweet,
      }
      //  console.log(details)
      await axios.post(`${baseURL}/newPost/${user.token}`, details)
        .then((res) => {
        })
      socket.emit('msgRecived', details)

      document.getElementById('text').value = ''
      Await(refresh())
    }
    else {
      alert('Enter Some text')
    }
  }
  //  console.log(chat)
  return (
    <div id="container">
      <main>
        <header>

        </header>
        <ul id="chat">
          {chat}
        </ul>
        <div className="footers">
          <input
            id='text'
            className="input"
            placeholder="Type your massage"
            name="msg"
            type={"text"}
            required={true}
          />
          <button className="btn" onClick={send}>
            SEND
          </button>
        </div>

      </main>
    </div>




  )
}

export default Play;


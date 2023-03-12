
import axios from 'axios';
import io from "socket.io-client";
import { useState, useEffect, useMemo } from 'react';
import { Await, useNavigate } from "react-router-dom";
const Play = () => {


  const navigate = useNavigate();
  const baseURL = `https://chat-app-swl5.onrender.com`
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user) {
    console.log(user)
    window.location.href = '/signIn'
  }
  const [chats, setChats] = useState([])
  let role = 'none'

  if (user.type === true) {
    role = 'block'
  }

  
  const socket = useMemo(() => (io.connect(`${baseURL}`)), []);


  // ----------- refreshing chats function from data base---------//

  async function refresh() {
    await axios.post(`${baseURL}/posts/${user.token}`,
    )
      .then((res) => {
        (setChats(res.data))
      })
  }
  useEffect(() => { refresh() }, [])


  //----------- receving new chat notifiaction---------//
  useMemo(() => {
    socket.on('msgRecived', async msg => {
      refresh()
    })
  }, [])

//---------maping for rendering -----------//

  var chat =
    chats.map((data) => {
      if (data.tweetedBy.email === (user.email)) {
        return (
          <>
            <li className="me" >
              <div className="entete">
                <h2>{data.tweetedBy.name}</h2>
                <h3>{data.time}</h3>

                <span className="status blue"></span>
              </div>
              <div className="message" onDoubleClick={() => reactOpt(data._id)} onClick={() => showReaction(data._id)}>
                {data.tweet}
                <div className='reaction' id={`${data._id + 'show'}`} style={{ display: 'none' }}>
                  <div className='who'>
                    {data.reactions[0].reactedBy.name} {data.reactions[0].time}
                  </div>
                  <div className='what'>
                    {data.reactions[0].reaction}
                  </div>
                </div>
              </div>
              <div className='reactBtn' id={`${data._id}`} style={{ display: 'none' }}>
                <button onClick={() => reaction(data._id + 'input')}>React</button>
                <button onClick={() => Delete(data._id)}>Delete</button>
                <div id={data._id + 'input'} style={{ display: 'none' }} >
                  <input id={data._id + 'inpt'} className='inpt' /><button className='bnt' onClick={() => reactionPost(data._id)}>Post</button>
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
              <div className="message" onDoubleClick={() => reactOpt(data._id)} onClick={() => showReaction(data._id)}>
                {data.tweet}
                <div className='reaction' id={`${data._id + 'show'}`} style={{ display: 'none' }} >
                  <div className='who'>
                    {data.reactions[0].reactedBy.name} {data.reactions[0].time}
                  </div>
                  <div className='what'>
                    {data.reactions[0].reaction}
                  </div>
                </div>
              </div>
              <div className='reactBtn' id={`${data._id}`} style={{ display: 'none' }}>
                <button onClick={() => reaction(data._id + 'input')}>React</button>
                <button onClick={() => Delete(data._id)} style={{ display: `${role}` }} >Delete</button>
                <div id={data._id + 'input'} style={{ display: `none` }}>
                  <input id={`${data._id + 'inpt'}`} className='inpt' /><button className='bnt' onClick={() => reactionPost(data._id)}>Post</button>
                </div>
              </div>
            </li>
          </>
        )
      }
    })


    // ------------ showing reaction options ----------//
  
  function reactOpt(id) {
    var x = document.getElementById(`${id}`);
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
    console.log(id)
  }

  // ---------- showing reactions on tweet function ---------

  function showReaction(id) {
    var x = document.getElementById(`${id + 'show'}`);
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
    console.log(id)
  }

//  --------- deleting tweets function -------//

  async function Delete(id) {

    axios.post(`${baseURL}/tweetDelete/${user.token}`, { id: id })
      .then((res) => {
      })
      socket.emit('msgRecived', 'details')
    refresh()
  }

//--------showing reaction input box on tweets---------/

  function reaction(id) {
    var x = document.getElementById(`${id}`);
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }

  }

  // sendinf new post reaction function-------//

  async function reactionPost(id) {
    const text = document.getElementById(`${id + 'inpt'}`).value
    console.log(text)
    if (text == null || text == '' || text == 'undefine') {
      alert('enter some text')
    }
    else {
      const detail = {
        chatId: id,
        reaction: {
          reactedBy: {
            name: user.name,
            email: user.email
          },
          reaction: text
        }
      }
      await axios.post(`${baseURL}/tweetReaction/${user.token}`, detail)
        .then((res) => {
        })
      socket.emit('msgRecived', 'details')
      Await(refresh())
    }
  }



    // -------sending new post function---------//
  async function send() {
    const tweet = document.getElementById('text').value
    if (tweet !== '') {
      const details = {
        tweetedBy: {
          name: user.name,
          email: user.email
        },
        tweet: tweet,
        reactions: {
          reactedBy: {
            name: null,
            email: null
          },
          time: null,
          reaction: 'No Reactions'
        }
      }
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
//  ---------  logout function -----------
  async function logout() {
    localStorage.removeItem('user')
    navigate('/signIn')
  }


  return (
    <div id="container">
      <main>
        <header>
          <h4>{user.name}</h4>
          <button onClick={logout}>
            LogOut
          </button>
        </header>
        <ul id="chat">
          {chat}
        </ul>
        <div className="footers">
          <input
            id='text'
            className="inputs"
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


import { useCallback, useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import Video from './Video'

function App() {
  const [videos, setvideos] = useState([])
  const [input, setinput] = useState("")
  const [nextpage, setnextpage] = useState()
  const [count , setcount] = useState(0)
  

  //checking intersection and making subsequent requests accordingly
  const obs = new IntersectionObserver((entries) => {
    console.log(entries)
    if(entries[0].isIntersecting)
    {
        const getMore = async () =>{
          try{
            console.log('not visible')
            const MoreItems = await axios({
              method: 'GET',
              url: 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyDtPQMIHufVhGSbo6qW30u4pT2QlU2_VY4',
              params: { q: input, pageToken: nextpage }
            })

            console.log(MoreItems)

            setvideos([...videos, ...MoreItems.data.items.map((item) => ({
              title: item.snippet.title,
              img: item.snippet.thumbnails.default.url
            }))])
            setnextpage(MoreItems.data.nextPageToken)
          } catch(err)
          {
             console.log(err)
          }
        }
        getMore()
    }
  })


 //observing the element and keeping it updated with disconnect()
  const handleObserve = useCallback((node)=>{
    if(node)
    {
       obs.disconnect()
       obs.observe(node)
       console.log('node', node)
    }
  })

 //making the first api call after a search has been invoked
  const handlesearch = async () => {
       try{
        const res = await axios({
          method: 'GET',
          url: 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyDtPQMIHufVhGSbo6qW30u4pT2QlU2_VY4',
          params: { q: input}
         })
        //  console.log(res.data)
         setvideos(res.data.items.map(item => ({
          title: item.snippet.title,
          img: item.snippet.thumbnails.default.url
         })))
         observer.current=0
         console.log(res.data)
         setnextpage(res.data.nextPageToken)
       } catch(err){
        console.log(err)
       }
  }

console.log(videos)
console.log('observer', observer)

  return (
    <>
      <div>
        <input onChange={(e) => setinput(e.target.value)} type="text" name="" id="" />
        <button onClick={handlesearch}>search</button>
      </div>

      {
          videos.map((video, index) => {
            if(videos.length===index+1)
            {
              return <div ref={handleObserve} ><Video key={video.url} value={video}/></div>
            }
            else return <Video key={video.url} value={video}/>
          })
      }
       
    </>
  )
}

export default App

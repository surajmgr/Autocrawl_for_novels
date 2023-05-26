import axios from 'axios';
import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function ListHome() {
    const data = [
        { name: 'Faloo', url:'/home', format: 'wap.faloo.com/booklist_bid.html'},
        { name: 'Shoudashu', url:'/shoudashu', format: 'www.shoudashu.com/211/211560/'},
        { name: 'Ffxs8', url:'/ffxs8', format: 'ffxs8.com/jsls/18323/'},
        { name: 'MTL Faloo', url:'/home?mtl', format: 'wap.faloo.com/booklist_bid.html'},
        { name: 'MTL Shoudashu', url:'/shoudashu?mtl', format: 'www.shoudashu.com/211/211560/'},
        { name: 'MTL Ffxs8', url:'/ffxs8?mtl', format: 'ffxs8.com/jsls/18323/'}
    ]



    const navigate = useNavigate();
    const location = useLocation();
    const search = location.search;
    
    useEffect(()=>{
    })

    const setAuth = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/blogger/setauth${search}`);
        alert(res.data)
    }

    const getAuth = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/blogger/getauth`, {headers:{'Access-Control-Allow-Credentials':true}});
        window.location.href = res.data;
    }

    const postData = async () => {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/blogger/post`, {title: "Posts", content: "Hello", label: "Label Here!"});
        alert(res.data);
    }

  return (
    <section className="home text-[#494949] bg-[#ebebeb] min-h-[100vh]">
        <div className="max-w-[900px] mx-auto py-[20px]">
          <h1 className="text-[35px] capitalize">Supported sources</h1>
          <div className="my-5 bg-white border shadow rounded-lg p-10 min-h-[650px] leading-[1]">
            <div className="info max-w-[600px] mx-auto">
              <h2 className="pt-[35px] font-[500] text-[250%] leading-[1] text-center mb-[25px]">
                Scrape <Link to="/chapters">chapters</Link> accordingly
              </h2>
            </div>
            <div className="mt-[40px] max-w-[650px] justify-center mx-auto mb-[200px] pt-[10px] rounded-md border-2 border-[#22d2ee]">
              <div className="flex justify-between w-full py-3 px-2 border-b text-center font-bold">
                <div className="ch-index w-[10%] border-r">S.N.</div>
                <div className="ch-title w-[30%]">
                  Source of scrape
                </div>
                <div class="label w-[60%]">
                  Format of url
                </div>
              </div>
              {data.map((source, index) => (
                <div className="flex justify-between w-full py-3 px-2 border-b text-center font-bold">
                  <div className="ch-index w-[10%] border-r text-center">{index + 1}</div>
                  <Link
                    to={source.url}
                    state={source}
                    className="ch-title w-[30%] line-clamp-1 hover:text-blue-500"
                  >
                    {source.name}
                  </Link>
                  <Link to={source.url}
                    class="label w-[60%] text-blue-500 text-center line-clamp-1 hover:text-blue-400"
                  >
                    {source.format}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full bg-white shadow border-t px-[25px] items-center h-[25px] flex text-[14px] font-[400]"><Link to="/">Home</Link><span className="mx-[3px]"> ➛ </span><Link onClick={getAuth}>Get Auth</Link><span className="mx-[3px]"> ➛ </span><Link onClick={setAuth}>Set Auth</Link><span className="mx-[3px]"> ➛ </span><Link onClick={postData}>Post Data</Link></div>
      </section>
  )
}

export default ListHome
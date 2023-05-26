import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

function ChaptersByLabel() {
  const [data, setData] = useState([]);

  const location = useLocation();
  const label = location.search;
  console.log(location.search);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/store/label${label}`
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const postLabelCh = async () => {
    try {
      data.map((ch)=>{
        axios.post(`${process.env.REACT_APP_API_URL}/store/post`, {
          title: ch.title,
          content: ch.content,
          label: ch.label
        })
      })
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Data");
  console.log(data);

  return (
    <>
      {data[0] && <section className="chByLevel text-[#494949] bg-[#ebebeb]">
        <div className="max-w-[900px] mx-auto py-[20px]">
          <div onClick={postLabelCh} className="fixed top-0 right-0 p-2 font-[500] bg-blue-500 rounded text-white tracing-[2px] cursor-pointer pointer-events-none">Publish All</div>
          <h1 className="text-[35px] capitalize">All Data in the {data[0].label}</h1>
          <div className="my-5 bg-white border shadow rounded-lg p-10 h-full leading-[1]">
            <div className="info max-w-[600px] mx-auto">
              <h2 className="pt-[35px] font-[500] text-[250%] leading-[1] text-center mb-[25px]">
                {data.length} <Link to="/chapters">Chapters</Link> of {data[0].label}
              </h2>
            </div>
            <div className="my-[40px] max-w-[650px] justify-center mx-auto pt-[10px] rounded-md border-2 border-[#22d2ee]">
              <div className="flex justify-between w-full py-3 px-2 border-b text-center font-bold">
                <div className="ch-index w-[10%] border-r">S.N.</div>
                <div className="ch-title w-[30%]">Title of the Chapter</div>
                <div class="label w-[60%]">Label of the Chapter</div>
              </div>
              {data.map((ch, index) => (
                <div className="flex justify-between w-full py-3 px-2 border-b text-left font-bold">
                  <div className="ch-index w-[10%] border-r text-center">
                    {index + 1}
                  </div>
                  <Link
                    to={`/single/${ch.id}`}
                    state={ch}
                    className={
                      (ch.title.slice(0, 10) == "Chapter 1" ||
                      ch.title.slice(0, 10) == "Chapter 1:"
                        ? "text-green-500 "
                        : "") +
                      "ch-title w-[30%] line-clamp-1 pl-5 hover:text-blue-500"
                    }
                  >
                    {ch.title}
                  </Link>
                  <a
                    href={`/label?label=${ch.label}`}
                    class="label w-[60%] text-blue-500 text-center line-clamp-1 hover:text-blue-400"
                  >
                    {ch.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full bg-white shadow border-t px-[25px] items-center h-[25px] flex text-[14px] font-[400]"><Link to="/">Home</Link><span className="mx-[3px]"> ➛ </span><Link to={`/label?label=${data[0] && (data[0].label)}`}>{data[0] && data[0].label}</Link></div>
      </section>}
    </>
  );
}

export default ChaptersByLabel;

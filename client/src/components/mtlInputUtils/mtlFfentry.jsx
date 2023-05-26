import React, { useEffect, useState } from "react";
import axios from "axios";
import GPT from "../GPT/gpt";
import { Link } from "react-router-dom";

function MtlFfEntry() {
  const [entry, setEntry] = useState({
    url: "",
  });
  const [data, setData] = useState([]);
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("stable");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (status === "crawling") {
      setTimeout(() => {
        if (step === 3) {
          setStep(0);
        } else {
          setStep(step + 1);
        }
      }, 5000);
    }
  }, [status, step]);

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleChange = (e) => {
    setEntry({
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("crawling");
    axios
      .post(`${process.env.REACT_APP_API_URL}/crawl/mtlffxs8`, entry)
      .then((res) => {
        setData(res.data);
        setStatus("crawled");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const postData = async () => {
    if (data) {
      data.map((infoItem, index) => {
        if (infoItem.content != "") {
          const res = axios.post(`${process.env.REACT_APP_API_URL}/store`, {
            title: infoItem.chapterTitle,
            content: infoItem.chapterContent,
            label: label,
          });
          setStatus(`Received: ${res.data}`);
        }
      });
    }
  };

  console.log("Data");
  console.log(data);

  return (
    <>
      <section className="ffxs8 text-[#494949] min-h-[100vh] bg-[#ebebeb]">
        <div className="max-w-[900px] mx-auto py-[20px]">
          <h1 className="text-[35px] capitalize">MTL - Scraping Ffxs8 Website</h1>
          <div className="my-5 bg-white border shadow rounded-lg p-10 min-h-[650px] leading-[1]">
            <div className="info max-w-[600px] mx-auto">
              <h2 className="pt-[35px] font-[500] text-[250%] leading-[1] text-center mb-[25px]">
                Scrape ffxs8 novels with this scraping tool.
              </h2>
              <p className="text-[20px] text-[#7c7c7c] leading-[1.2] text-center mb-[20px]">
                This tool is specifically designed to extract and gather data
                from ffxs8.com. With the immense popularity of faloo novels,
                having a tool that can scrape the <a href="/chapters" target="_blank" className="text-blue-500">chapters</a> is an efficent tool.
              </p>
            </div>
            <div className="flex justify-around mt-[40px] max-w-[550px] mx-auto mb-[200px]">
              <div className="group w-full">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="url"
                    placeholder="Enter your url here..."
                    className="peer relative h-10 w-full border rounded-md bg-gray-50 pl-4 pr-20 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:border-blue-400"
                    value={entry.url}
                    onChange={handleChange}
                  />
                  <button
                    onClick={handleSubmit}
                    className="absolute right-0 h-10 w-[150px] text-[18px] rounded-r-md bg-blue-600 text-white transition-all duration-200 ease-in-out hover:bg-blue-500"
                  >
                    Scrape Novel
                  </button>
                </div>
                {status == "crawling" && (
                  <div className="status text-center text-[#f18230] mt-[10px]">
                    {step == 0 && "Scanning the website for data..."}
                    {step == 1 && "Fetchnig data from the website..."}
                    {step == 2 && "Loading data from the page..."}
                    {step == 3 &&
                      "Proceeding to the initiation of the data retrival..."}
                  </div>
                )}
                {status == "crawled" && (
                  <div className="status text-center text-[#2595fb] mt-[10px]">
                    Data crawling from the website is complete.
                  </div>
                )}
                {status == "crawled" && (
                    <>
                    <div className="relative flex items-center justify-center mt-[10px]">
                  <input
                    type="text"
                    name="label"
                    placeholder="Label here..."
                    className="peer relative h-7 w-[200px] border rounded-md bg-gray-50 pl-2 pr- outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:border-blue-400"
                    value={label}
                    onChange={handleLabelChange}
                  />
                  <button
                    onClick={postData}
                    className="-ml-[5px] z-10 h-7 w-[70px] text-[12px] rounded-r-md bg-blue-600 text-white transition-all duration-200 ease-in-out hover:bg-blue-500"
                  >
                    Post Data
                  </button>
                  <br />
                </div>
                  <div className="status text-center text-[#2595fb] mt-[10px]">
                    {data.map((chItem) => (
                      <>
                        Title: {chItem.chapterTitle}
                        <br />
                        Content: {chItem.chapterContent}
                        <br />
                        <br />
                        <br />
                        <br />
                      </>
                    ))}
                  </div>
                  </>
                )}
              </div>
            </div>
            <div className="fixed bottom-0 left-0 w-full bg-white shadow border-t px-[25px] items-center h-[25px] flex text-[14px] font-[400]"><Link to="/">Home</Link><span className="mx-[3px]"> ➛ </span><Link to="/ffxs8">Ffxs8</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MtlFfEntry;

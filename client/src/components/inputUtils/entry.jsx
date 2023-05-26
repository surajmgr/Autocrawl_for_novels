import React, { useEffect, useState } from "react";
import axios from "axios";
import GPT from "../GPT/gpt";
import { Link } from "react-router-dom";

function Entry() {
  const [entry, setEntry] = useState({
    url: "",
  });
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("stable");
  const [step, setStep] = useState(0);
  const [deta, setDeta] = useState([]);

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

  const handleChange = (e) => {
    setEntry({
      [e.target.name]: e.target.value,
    });
  };

  const produceChConst = () => {
    for (let i = 0; i < 200; i++) {
      setDeta((prev) => [
        ...prev,
        {
          title: `"Chapter ${i}"`,
          content: "",
        },
      ]);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("crawling");
    axios
      .post(`${process.env.REACT_APP_API_URL}/crawl`, entry)
      .then((res) => {
        setData(res.data);
        setStatus("crawled");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postData = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/blogger/post`);
    console.log(res);
}

console.log(data);

  return (
    <>
    {/* {deta.map((detaItem)=>(
      `{
        title: ${detaItem.title},
        content: "",
      },`
    ))} */}
      <section className="faloo text-[#494949] bg-[#ebebeb] min-h-[100vh]">
        <div className="max-w-[900px] mx-auto py-[20px]">
          <h1 className="text-[35px] capitalize">Scraping Faloo Website</h1>
          <div className="my-5 bg-white border shadow rounded-lg p-10 h-full min-h-[650px] leading-[1]">
            <div className="info max-w-[600px] mx-auto">
              <h2 className="pt-[35px] font-[500] text-[250%] leading-[1] text-center mb-[25px]">
                Scrape faloo novels with this scraping tool.
              </h2>
              <p className="text-[20px] text-[#7c7c7c] leading-[1.2] text-center mb-[20px]">
                This tool is specifically designed to extract and gather data
                from wap.faloo.com. With the immense popularity of faloo novels,
                having a tool that can scrape the{" "}
                <a href="/chapters" target="_blank" className="text-blue-500">
                  chapters
                </a>{" "}
                is an efficent tool.
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
                    <GPT chapterItems={data} />
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
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full bg-white shadow border-t px-[25px] items-center h-[25px] flex text-[14px] font-[400]"><Link to="/">Home</Link><span className="mx-[3px]"> ➛ </span><Link to="/home">Faloo</Link><span className="mx-[3px]"> ➛ </span><Link onClick={postData}>Post Data</Link></div>
      </section>
    </>
  );
}

export default Entry;

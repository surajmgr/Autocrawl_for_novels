import axios from "axios";
import React, { useEffect, useState } from "react";
import { chConst } from "../utils/chapterConst";

const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content: "",
};

let myInfo = [];

function GPT(props) {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm GPT! Ask me anything!",
      sentTime: "just now",
      sender: "GPT",
    },
  ]);
  const API_KEY = process.env.REACT_APP_GPT;

  // let string = "";
  // useEffect(() => {
  //   for (let i = 0; i < 20; i++) {
  //     string += `
  //     {
  //       title: "Chapter ${i}",
  //       content: ""
  //     },
  //     `;
  //     console.log(string);
  //   }
  // }, []);

  const [info, setInfo] = useState([]);
  const [finalInfo, setFinalInfo] = useState([]);
  const [currentInfo, setCurrentInfo] = useState("");
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  const controller = new AbortController();
  const signal = controller.signal;

  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    myInfo = chConst;
  }, []);

  const handleChange = (e) => {
    setLabel(e.target.value);
  };

  const handleSend = async (message, index) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setStatus("Proceeding request to GPT server for chapter " + (index + 1));
    setIsTyping(true);
    await processMessageToGPT(newMessages, index);
  };

  async function processMessageToGPT(chatMessages, index) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "GPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: signal,
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "GPT",
          },
        ]);
        setInfo((prev) => [
          ...prev,
          {
            title: `Chapter ${index + 1}`,
            content:
              "<p>" +
              data.choices[0].message.content.replace(
                /\n{2}/g,
                "&nbsp;</p><p>"
              ) +
              "</p>",
          },
        ]);
        setStatus("Received response from GPT for chapter " + (index + 1));
        setIndex(0);
        setIsTyping(false);
      })
      .catch((error, data) => {
        console.log(error.message);
      });
  }

  const handleSubmitMessage = async () => {
    setInfo([]);
    systemMessage.content =
      "Act as a chinese to english translator and editor. Translate all the given input text into english, proofread the translated text and output the final refined version in engaging way.";
    for (const [index, chapterItem] of props.chapterItems.entries()) {
      // console.log(chapterItem)
      const msg = chapterItem.chapterContent;
      const msgs = msg.match(/[\s\S]{1,1000}/g) || [];
      for (const msgI of msgs) {
        await handleSend(msgI, index);
      }
    }
  };

  const combineSimilar = () => {
    myInfo.map((infoItem, index) => {
      info.map((infoItem2, index2) => {
        if (infoItem.title == infoItem2.title) {
          infoItem.content += infoItem2.content;
        }
        if (index + 1 == myInfo.length) {
          setStatus("Combined Successfully");
        }
      });
    });
  };

  const postData = async () => {
    if (myInfo) {
      myInfo.map((infoItem, index) => {
        if (infoItem.content != "") {
          const res = axios.post(`${process.env.REACT_APP_API_URL}/store`, {
            title: infoItem.title,
            content: infoItem.content,
            label: label,
          });
          setStatus(`Received: ${res.data}`);
        }
      });
    }
  };

  const resetCombine = () => {
    myInfo = chConst;
    setStatus("Received reset request. ABORTED!");
  };

  const abortGPTRequest = () => {
    setStatus("Received abort request. ABORTED!");
    controller.abort();
  };

  console.log("================================");
  console.log(myInfo);
  return (
    <div>
      {status != "" && (
        <div
          onClick={abortGPTRequest}
          className="status text-center text-[#666666] font-bold mt-[10px] cursor-pointer mx-[10px]"
        >
          Abort Request
        </div>
      )}
      {status == "" && (
        <div className="flex justify-center">
          <div
            onClick={handleSubmitMessage}
            className="status text-center text-[#666666] font-bold mt-[10px] cursor-pointer mx-[10px]"
          >
            Proceed to GPT
          </div>
        </div>
      )}
      {status != "" && status.slice(0, 3) == "Pro" ? (
        <>
          <div className="status text-center text-[#f18230] mt-[10px]">
            {status}
          </div>
        </>
      ) : (
        status != "" &&
        (status.slice(0, 3) == "Rec" || status.slice(0, 3) == "Com") && (
          <>
            <div
              onClick={handleSubmitMessage}
              className="status text-center text-[#666666] font-bold mt-[10px] cursor-pointer"
            >
              Procee to GPT once again
            </div>
            <div className="status text-center text-[#38771d] mt-[10px]">
              {status}
            </div>
            <div
              className={status.slice(0, 3) != "Com" && "flex justify-center"}
            >
              {status.slice(0, 3) != "Com" ? (
                <div
                  onClick={combineSimilar}
                  className="status text-center text-[#666666] font-bold mt-[10px] cursor-pointer mx-[10px]"
                >
                  Combine All
                </div>
              ) : (
                <div className="relative flex items-center justify-center mt-[10px]">
                  <input
                    type="text"
                    name="label"
                    placeholder="Label here..."
                    className="peer relative h-7 w-[200px] border rounded-md bg-gray-50 pl-2 pr- outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:border-blue-400"
                    value={label}
                    onChange={handleChange}
                  />
                  <button
                    onClick={postData}
                    className="-ml-[5px] z-10 h-7 w-[70px] text-[12px] rounded-r-md bg-blue-600 text-white transition-all duration-200 ease-in-out hover:bg-blue-500"
                  >
                    Post Data
                  </button>
                  <br />
                </div>
              )}
              <div
                onClick={resetCombine}
                className="status text-center text-red-500 font-bold mt-[10px] cursor-pointer mx-[10px]"
              >
                Reset combine
              </div>
            </div>
          </>
        )
      )}
      <div className="status text-center text-[#2595fb] mt-[10px]">
        {myInfo &&
          myInfo.map(
            (infoItem, index) =>
              infoItem.content != "" && (
                <>
                  Title: {infoItem.title}
                  <br />
                  Content: {infoItem.content}
                  <br />
                  <br />
                  <br />
                  <br />
                </>
              )
          )}
      </div>
    </div>
  );
}

export default GPT;

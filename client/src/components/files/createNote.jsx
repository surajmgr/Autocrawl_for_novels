import React, { useContext, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import "./createNote.css";
import LargeLoading from "../loading/largeLoading";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'

function CreateNote() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quillLoading, setQuillLoading] = useState(true);
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const [openSide, setOpenSide] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [chapters, setChapters] = useState([]);
  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const cid = location.pathname.split("/")[2];

  useEffect(() => {
    fetchData();
    if (loading) {
      setTimeout(() => {
        if (!loading) {
          setQuillLoading(false);
        }
      }, 20000);
    }
  }, []);

  const fetchData = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/store/single/${cid}`
    );
    setTitle(res.data.title);
    setLabel(res.data.label);
    setContent(res.data.content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (title.length < 3) {
        alert("Title must be at least 3 characters long.");
      } else if (content.length < 100) {
        alert("Content less than 100");
      } else {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/store/update/${cid}`,
          {
            title,
            content,
            label,
          }
        );
        alert(res.data);
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      if (title.length < 3) {
        alert("Title must be at least 3 characters long.");
      } else if (content.length < 100) {
        alert("Content less than 100");
      } else {
        const resN = await axios.put(
          `${process.env.REACT_APP_API_URL}/store/update/${cid}`,
          {
            title,
            content,
            label,
          }
        );
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/blogger/post`,
          { title, content, label }
        );
        alert(res.data);
      }
    } catch (error) {
      alert(error);
    }
  };

  const fetchChapters = async () => {
    try {
      setOpenSide(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/store/label?label=${label}`
      );
      setChapters(res.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="createNote min-h-[500px]">
        <>
          {openSide && (
            <div className="fixed z-10 w-[300px] h-full bg-white border shadow">
              <svg
                onClick={() => setOpenSide(false)}
                className="absolute w-[18px] h-[18px] right-0 top-2 cursor-pointer"
                viewPort="0 0 12 12"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="1"
                  y1="11"
                  x2="11"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                />
                <line
                  x1="1"
                  y1="1"
                  x2="11"
                  y2="11"
                  stroke="black"
                  strokeWidth="2"
                />
              </svg>
              <div className="heading border-blue-500 w-full bg-gray-100 text-center p-3 font-[500]">
                Chapter List
              </div>
              <div className="chapter-list overflow-scroll h-full">
                {chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="chapter-list-item p-[10px] border-b cursor-pointer"
                  >
                    <a
                    href={`/single/${chapter.id}`} className="line-clamp-1">{chapter.title}</a>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="label flex justify-around p-3 w-full bg-gray-100 rounded-md -mt-1 font-[500]">
            {openSide ? (
              <a href={`/label?label=${label}`}>{label}</a>
            ) : (
              <Link onClick={() => fetchChapters()}>{label}</Link>
            )}
          </div>
          <div className="heading-container flex justify-between mt-[4rem]">
            <div className="title-container mx-auto w-[840px] my-[28px]">
              <div className="title-wrapper min-h-[50px] flex justify-between">
                <h1 className="title-input-container min-h-[50px] text-[28px] font-[600] w-[760px]">
                  <input
                    className="border-orange-500 px-1 py-2 rounded w-full !border-none focus:outline-none placeholder:text-[#999]"
                    placeholder="Add Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></input>
                </h1>
                <div className="status-code-container flex justify-between items-center my-auto ml-[16px]">
                  <button
                    onClick={handleSubmit}
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:text-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                  >
                    Update
                  </button>
                  <button
                  onClick={handlePublish}
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:text-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "editorContainer w-[840px] flex justify-around mx-auto h-[600px] !text-[16px] overflow-hidden"
            }
          >
            <ReactQuill
              theme="snow"
              className="!border-0 w-[840px]"
              value={content}
              onChange={handleEditorChange}
            />
          </div>
          {/* <div
            className={
              (loading ? "hidden " : "") +
              "editor-container w-[900px] flex justify-around mx-auto min-h-[550px] overflow-hidden"
            }
          >
            <Editor
              apiKey="2tud8euab7unk3ls7fzkmjr5v6jorty07irnabk7kio9mto"
              onInit={(evt, editor) => {
                editorRef.current = editor;
                setLoading(false);
              }}
              init={{
                menubar: false,
                width: 840,
                height: 570,
                placeholder: "Type / paste pre-formatted text",
                resize: false,
                branding: false,
                skin: "snow",
                icons: "thin",
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "code",
                  "codesample",
                ],
                toolbar:
                  "blocks | " +
                  "bold italic forecolor | image | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist | " +
                  "codesample code preview | outdent indent | removeformat undo redo | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                toolbar_mode: "sliding",
                images_upload_url: `${process.env.REACT_APP_API_BASE_URL}/upload`,
                images_upload_base_path: "",
                fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                content_style: `
            body {
              background: #fff;
              max-width: 840px;
            }
          `,
              }}
              value={content}
              onEditorChange={handleEditorChange}
            />
          </div> */}
          {!quillLoading && (
            <div className="mt-[100px]">
              <LargeLoading />
            </div>
          )}
        </>
      </section>
    </>
  );
}

export default CreateNote;

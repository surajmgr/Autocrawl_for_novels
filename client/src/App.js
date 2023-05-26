import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import Home from "./components/home/home";
import GPT from "./components/GPT/gpt";
import Chapters from "./components/files/chapters";
import ChaptersByLabel from "./components/files/chaptersByLabel";
import CreateNote from "./components/files/createNote";
import Shoudashu from "./components/home/shoudashu";
import ListHome from "./components/home/listHome";
import Ffxs8 from "./components/home/ffxs8";

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ListHome />
      },
      {
        path: "/home",
        element: <Home />
      },
      {
        path: "/shoudashu",
        element: <Shoudashu />
      },
      {
        path: "/ffxs8",
        element: <Ffxs8 />
      },
      {
        path: "/gpt",
        element: <GPT />
      },
      {
        path: "/chapters",
        element: <Chapters />
      },
      {
        path: "/label",
        element: <ChaptersByLabel />
      },
      {
        path: "/single/:cid",
        element: <CreateNote />
      },
    ]
  },
]);

function App() {
  return (
    <div className="App scroll-smooth bg-[#ebebeb]">
      <div className="hidden !text-[#2e9efb] !text-[#c47ae0] !text-[#fac865] !text-[#76e199] !text-[#ff627b] !text-[#4edfe2] !text-[#fd6f6f]"></div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;

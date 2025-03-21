import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Game from "./Game";

export default function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

import { createBrowserRouter } from "react-router-dom";
import { Root } from "./pages/root";
import { Home } from "./pages/home";
import { Auth } from "./pages/auth";
import { AddVehicle } from "./pages/addvehicle";
import { MyAds } from "./pages/myads";
import { MyBids } from "./pages/mybids";
import { VehicleDetail } from "./pages/vehicledetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "add-vehicle",
        element: <AddVehicle />,
      },
      {
        path: "my-ads",
        element: <MyAds />,
      },
      {
        path: "my-bids",
        element: <MyBids />,
      },
      {
        path: "vehicle/:id",
        element: <VehicleDetail />,
      },
    ],
  },
]);
